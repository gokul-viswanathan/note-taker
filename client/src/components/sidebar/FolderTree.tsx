import { FolderIcon, ChevronIcon, FileIcon, RightIcon, CancelIcon } from "@/components/sidebar/Icons"
import { useStore } from "@/stores/states";
import { useState } from "react";
import { createNewFolder } from "@/services/createNewFile";

interface FileItem {
    name: string;
    type: "file" | "dir";
    path: string; // Full path to the item
    children?: FileItem[]; // For directories, contains subdirectories and files
}

interface FolderTreeProps {
    items: FileItem[];
    currentFile: string;
    expandedFolders: Set<string>;
    onFileSelect: (fileName: string, fullPath: string) => void;
    onToggleFolder: (folderName: string, folderPath: string) => void;
    onContextMenu: (e: React.MouseEvent, item: FileItem) => void;
    depth?: number; // Track nesting depth for styling
}

const FolderTree: React.FC<FolderTreeProps> = ({
    items,
    currentFile,
    expandedFolders,
    onFileSelect,
    onToggleFolder,
    onContextMenu,
    depth = 0
}) => {
    const indentClass = `ml-${depth * 6}`; // Adjust indentation based on depth
    const isCreateFolderOpen = useStore((state) => state.isCreateFolderOpen);
    const setIsCreateFolderOpen = useStore((state) => state.setIsCreateFolderOpen);
    const [newName, setNewName] = useState("");

    const handleCreateFolder = () => {
        console.log("Creating new folder:", newName);
        // call api to create folder or file
        // After creation, update state variable and reset state.
        // need path to update exact path.
        const pathToCreateNewFolder = useStore.getState().contextMenuItem?.path || "";
        const pathOfNewFolder = pathToCreateNewFolder + "/" + newName + "/"; // Assuming new files are markdown files
        createNewFolder(pathOfNewFolder);
        setNewName("");
        setIsCreateFolderOpen?.(false);
        //setcurrent file to new file
    };

    const handleCancel = () => {
        setNewName("");
        setIsCreateFolderOpen?.(false);
    };

    return (
        <div className={depth > 0 ? indentClass : ""}>
            {items.map((item, index) => (
                <div key={`${item.path}-${index}`}>
                    {item.type === "dir" ? (
                        <>
                            {/* Folder Header */}
                            <div
                                className="flex items-center p-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                                onClick={() => onToggleFolder(item.name, item.path)}
                                onContextMenu={(e) => onContextMenu(e, item)}
                            >
                                <ChevronIcon isOpen={expandedFolders.has(item.path)} />
                                <FolderIcon isOpen={expandedFolders.has(item.path)} />
                                <span className="font-medium">{item.name}</span>
                            </div>

                            {isCreateFolderOpen && (
                                <div className="flex items-center p-2 pl-8">
                                    <input
                                        className="flex-1 rounded border px-1 text-sm"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        autoFocus
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleCreateFolder();
                                            if (e.key === "Escape") handleCancel();
                                        }}
                                        placeholder="New folder name"
                                    />
                                </div>
                            )}

                            {/* Recursive Folder Contents */}
                            {expandedFolders.has(item.path) && item.children && (
                                <FolderTree
                                    items={item.children}
                                    currentFile={currentFile}
                                    expandedFolders={expandedFolders}
                                    onFileSelect={onFileSelect}
                                    onToggleFolder={onToggleFolder}
                                    onContextMenu={onContextMenu}
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
                            onClick={() => onFileSelect(item.name, item.path)}
                            onContextMenu={(e) => onContextMenu(e, item)}
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
