import { useState, useEffect } from "react";
import { FileItem } from "@/types/git-interface";
import CustomContextMenu from "@/components/sidebar/ContextMenu";
import fetchFiles from "@/services/getFiles";
import FolderTree from "@/components/sidebar/FolderTree"
import { useStore } from "@/stores/states";

type FileExplorerProps = {
    onFileSelect: (fileName: string) => void;
}

// this is what node contains. but gitfileitem is type of the input message
// interface FileItem extends GitFileItem {
//     children?: FileItem[]; // For directories, contains subdirectories and files
// }

function updateFileItemChildren(
    tree: FileItem[],
    targetPath: string,
    newChildren: FileItem[]
): FileItem[] {
    return tree.map(item => {
        if (item.path === targetPath && item.type === 'dir') {
            return {
                ...item,
                children: newChildren
            };
        }

        if (item.children) {
            return {
                ...item,
                children: updateFileItemChildren(item.children, targetPath, newChildren)
            };
        }

        return item;
    });
}

const FileExplorer: React.FC<FileExplorerProps> = ({ onFileSelect }) => {
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [currentFile, setCurrentFile] = useState<string>("");
    const [fileStructure, setFileStructure] = useState<FileItem[]>([]);

    const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
    const [contextItem, setContextItem] = useState<FileItem | null>(null);

    const handleFileSelect = (fileName: string, fullPath: string) => {
        setCurrentFile(fullPath);
        // Handle file selection logic
        // onFileSelect();
    };

    const handleContextMenu = (e: React.MouseEvent, item: FileItem) => {
        e.preventDefault();
        setMenuPos({ x: e.clientX, y: e.clientY });
        setContextItem(item);
        useStore.getState().setContextMenuItem?.(item);
    };

    // Function to dynamically load folder contents
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

    useEffect(() => {
        fetchFolderContents("");
    }, []);

    return (
        <div className="file-explorer">
            <FolderTree
                items={fileStructure}
                currentFile={currentFile}
                expandedFolders={expandedFolders}
                onFileSelect={handleFileSelect}
                onToggleFolder={toggleFolder}
                onContextMenu={handleContextMenu}
            />

            {menuPos && contextItem && (
                <CustomContextMenu
                    position={menuPos}
                    item={contextItem}
                    onClose={() => {
                        console.log("onclose has been triggered");
                        setMenuPos(null);
                    }}
                />
            )}
        </div>
    );
};

export default FileExplorer;
