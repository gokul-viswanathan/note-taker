import { SidebarMenu } from "../ui/sidebar";
import { FileItem } from "@/types/git-interface";
import fetchFiles from "@/services/getFiles";
import updateFileItemChildren from "@/services/updateFileItemChildren";
import { useState, useEffect } from "react";
import FileTreeItem from "@/components/shadcnSidebar/FileTreeItem";

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

  const fetchFolderContents = async (folderPath: string) => {
    try {
      const currentPathData = await fetchFiles(folderPath);
      if (folderPath == "") {
        setFileStructure(currentPathData);
      } else {
        let localFileStructure = fileStructure;
        localFileStructure = updateFileItemChildren(
          localFileStructure,
          folderPath,
          currentPathData,
        );
        setFileStructure(localFileStructure);
      }
    } catch (error) {
      console.error("Error fetching folder contents:", error);
    }
  };

  const toggleFolder = async (folderPath: string) => {
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
  };

  useEffect(() => {
    fetchFolderContents("");
  }, []);

  return (
    <SidebarMenu>
      {fileStructure.map((items) => (
        <FileTreeItem
          key={items.path}
          item={items}
          onToggleFolder={toggleFolder}
          level={1}
        />
      ))}
    </SidebarMenu>
  );
};

export default FolderTree;
