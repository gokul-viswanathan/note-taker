import react from "react";
import { FileItem } from "@/types/git-interface";
import fetchFiles from "@/services/getFiles";
import FolderTree from "@/components/sidebar/NewFolderTree";
import { useStore } from "@/stores/states";
import updateFileItemChildren from "@/services/updateFileItemChildren";

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
        fileStructure && fileStructure.length > 0 ? (
            <FolderTree
                items={fileStructure}
                expandedFolders={expandedFolders}
                handleContextMenu={handleContextMenu}
                onToggleFolder={toggleFolder}
                isRootLevel={true}
            />
        ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
                <p className="text-lg font-medium mb-2">No files or folders yet</p>
                <p className="text-sm">Right-click to create a new folder or file</p>
            </div>
        )
    );
};

export default FileExplorer;

