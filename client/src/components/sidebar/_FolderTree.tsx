import { FolderIcon, ChevronIcon, FileIcon, RightIcon, CancelIcon } from "@/components/sidebar/Icons"
import { useStore } from "@/stores/states";
import { useState } from "react";
import { createNewFolder } from "@/services/createNewFile";
import { GitFileItem } from "@/types/git-interface";
import { Input } from "@/components/ui/input"

interface FileItem {
    name: string;
    type: "file" | "dir";
    path: string; // Full path to the item
    children?: FileItem[]; // For directories, contains subdirectories and files
}

interface FolderTreeProps {
    items: FileItem[];
    expandedFolders: Set<string>;
    onToggleFolder: (folderName: string, folderPath: string) => void;
    handleContextMenu?: (item: FileItem) => void;
    depth?: number; // Track nesting depth for styling
}

const FolderTree: React.FC<FolderTreeProps> = ({
    items,
    expandedFolders,
    onToggleFolder,
    handleContextMenu,
    depth = 0
}) => {
    const isCreateFolderOpen = useStore((state) => state.isCreateFolderOpen);
    const setIsCreateFolderOpen = useStore((state) => state.setIsCreateFolderOpen);
    const currentCreateFodlerPath = useStore((state) => state.contextMenuItem?.path);
    const [newName, setNewName] = useState("");
    const currentFile = useStore((state) => state.currentFile);

    const handleFileSelect = (selectedFile: GitFileItem) => {
        console.log("Selected file:", selectedFile);
        useStore.getState().setCurrentFile?.(selectedFile);
    }

    const handleCreateFolder = () => {
        const pathToCreateNewFolder = useStore.getState().contextMenuItem?.path || "";
        const pathOfNewFolder = pathToCreateNewFolder + "/" + newName + "/"; // Assuming new files are markdown files
        createNewFolder(pathOfNewFolder);
        setNewName("");
        setIsCreateFolderOpen?.(false);
    };

    const handleCancel = () => {
        setNewName("");
        setIsCreateFolderOpen?.(false);
    };

    return (
        <div style={{ marginLeft: depth > 0 ? `${depth * 0.5}rem` : '0' }}>
            {items.map((item, index) => (
                <div key={`${item.path}-${index}`}>
                    {item.type === "dir" ? (
                        <>
                            {/* Folder Header */}
                            <div
                                className="flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                                onClick={() => onToggleFolder(item.name, item.path)}
                                onContextMenu={() => {
                                    handleContextMenu?.(item);
                                }}
                            >
                                <ChevronIcon isOpen={expandedFolders.has(item.path)} />
                                <FolderIcon isOpen={expandedFolders.has(item.path)} />
                                <span className="font-medium">{item.name}</span>
                            </div>

                            {isCreateFolderOpen && item.path === currentCreateFodlerPath && (
                                <div className="flex items-center p-2 pl-8">
                                    <Input
                                        className="flex-1 text-sm"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleCreateFolder()
                                            if (e.key === "Escape") handleCancel()
                                        }}
                                        placeholder="New folder name"
                                    />
                                </div>
                            )}

                            {/* Recursive Folder Contents */}
                            {expandedFolders.has(item.path) && item.children && (
                                <FolderTree
                                    items={item.children}
                                    expandedFolders={expandedFolders}
                                    onToggleFolder={onToggleFolder}
                                    handleContextMenu={handleContextMenu}
                                    depth={depth + 1}
                                />
                            )}
                        </>
                    ) : (
                        /* File Item */
                        <div
                            className={`flex items-center p-2 text-sm rounded-md cursor-pointer group
                ${item.path === currentFile
                                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            onClick={() => handleFileSelect(item)}
                            onContextMenu={() => {
                                handleContextMenu?.(item);
                            }}
                        >
                            <FileIcon fileName={item.name} />
                            <span className="flex-1 truncate">{item.name}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default FolderTree;
