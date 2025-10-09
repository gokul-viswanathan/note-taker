import { FileItem } from "@/types/git-interface";
import fetchFiles from "@/services/getFiles";
import updateFileItemChildren from "@/services/updateFileItemChildren";
import { useState, useEffect, useCallback } from "react";
import FileTreeItem from "@/components/shadcnSidebar/FileTreeItem";
import { ContextMenu } from "@/components/ui/context-menu";
import { ContextMenuTrigger } from "@radix-ui/react-context-menu";
import ContextMenuDemo from "@/components/sidebar/CustomContextMenu2";

interface FolderTree {
  fileStructure: FileItem[];
  expandedFolder: Set<string>;
  onToggleFolder: (path: string) => void;
}

const FolderTree: React.FC = () => {
  const [fileStructure, setFileStructure] = useState<FileItem[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(),
  );

  const fetchFolderContents = useCallback(async (folderPath: string) => {
    try {
      const currentPathData = await fetchFiles(folderPath);
      const sortedData = currentPathData.sort((a: FileItem, b: FileItem) => {
        if (a.type === "dir" && b.type !== "dir") return -1;
        if (a.type !== "dir" && b.type === "dir") return 1;
        return a.name.localeCompare(b.name);
      });

      if (folderPath === "") {
        setFileStructure(sortedData);
      } else {
        // use functional setState to avoid stale closure
        setFileStructure((prev) =>
          updateFileItemChildren(prev, folderPath, sortedData),
        );
      }
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
  }, []);

  const toggleFolder = useCallback(
    async (folderPath: string) => {
      const localExpandedFolders = new Set(expandedFolders);

      if (expandedFolders.has(folderPath)) {
        localExpandedFolders.delete(folderPath);
      } else {
        localExpandedFolders.add(folderPath);
        try {
          await fetchFolderContents(folderPath);
        } catch (error) {
          console.error("Error loading sub-folder contents:", error);
        }
      }

      setExpandedFolders(localExpandedFolders);
    },
    [expandedFolders, fetchFolderContents],
  );

  useEffect(() => {
    fetchFolderContents("");
  }, [fetchFolderContents]);

  const handleFileCreated = () => {
    fetchFolderContents("");
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        {fileStructure.map((items) => (
          <FileTreeItem
            key={items.path}
            item={items}
            onToggleFolder={toggleFolder}
            onFileCreated={handleFileCreated}
            expandedFolders={expandedFolders}
            level={1}
          />
        ))}
      </ContextMenuTrigger>
      <ContextMenuDemo />
    </ContextMenu>
  );
};

export default FolderTree;
