import react from "react";
import { FileItem } from "@/types/git-interface";
import CustomContextMenu from "@/components/sidebar/ContextMenu";
import ContextMenuDemo from "@/components/sidebar/CustomContextMenu2";
import fetchFiles from "@/services/getFiles";
// import FolderTree from "@/components/sidebar/FolderTree";
import FolderTree from "@/components/sidebar/NewFolderTree";
// import FolderTree from "@/components/sidebar/ShadFolderTree";
import { useStore } from "@/stores/states";
import updateFileItemChildren from "@/services/updateFileItemChildren";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";

const FileExplorer: React.FC = () => {
    const [expandedFolders, setExpandedFolders] = react.useState<Set<string>>(new Set());
    const [fileStructure, setFileStructure] = react.useState<FileItem[]>([]);

    const handleContextMenu = (item: FileItem) => {
        useStore.getState().setContextMenuItem?.(item);
    };

    const fetchFolderContents = async (folderPath: string) => {
        try {
            const currentPathData = await fetchFiles(folderPath);
            //the file structure needs to be done here
            if (folderPath == "") {
                setFileStructure(currentPathData);
            } else {
                let localFileStructure = fileStructure;
                localFileStructure = updateFileItemChildren(localFileStructure, folderPath, currentPathData)
                setFileStructure(localFileStructure)
            }
        } catch (error) {
            console.error("Error fetching folder contents:", error);
        }
    };

    const toggleFolder = async (folderName: string, folderPath: string) => {
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

    react.useEffect(() => {
        fetchFolderContents("");
    }, []);

    return (

        < FolderTree
            items={fileStructure}
            expandedFolders={expandedFolders}
            handleContextMenu={handleContextMenu}
            onToggleFolder={toggleFolder}
            isRootLevel={true} // Enable root level operations
        />

    );
};

export default FileExplorer;

