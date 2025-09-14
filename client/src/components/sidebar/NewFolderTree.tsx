import { FolderIcon, ChevronIcon, FileIcon, RightIcon, CancelIcon } from "@/components/sidebar/Icons"
import { useStore } from "@/stores/states";
import { useEffect, useState } from "react";
import { createNewFolder } from "@/services/createNewFolder";
import { GitFileItem, FileItem } from "@/types/git-interface";
import { Input } from "@/components/ui/input"
import updateFileContent from "@/services/updateFileContent";
import { deleteFileOrFolder } from "@/services/deleteFileOrFolder"

interface FolderTreeProps {
    items: FileItem[];
    expandedFolders: Set<string>;
    onToggleFolder: (folderName: string, folderPath: string) => void;
    handleContextMenu?: (item: FileItem) => void;
    depth?: number; // Track nesting depth for styling
    isRootLevel?: boolean; // Track if this is the root level
}

const FolderTree: React.FC<FolderTreeProps> = ({
    items,
    expandedFolders,
    onToggleFolder,
    handleContextMenu,
    depth = 0,
    isRootLevel = false
}) => {
    const isCreateFolderOpen = useStore((state) => state.isCreateFolderOpen);
    const isCreateFileOpen = useStore((state) => state.isCreateFileOpen);
    const isDeleteDialogOpen = useStore((state) => state.isDeleteDialogOpen);
    const setIsCreateFolderOpen = useStore((state) => state.setIsCreateFolderOpen);
    const setIsCreateFileOpen = useStore((state) => state.setIsCreateFileOpen);
    const setIsDeleteDialogOpen = useStore((state) => state.setIsDeleteDialogOpen);
    const contextMenuItem = useStore((state) => state.contextMenuItem);
    const currentCreateFolderPath = contextMenuItem?.path;
    const currentFile = useStore((state) => state.currentFile);

    const [newName, setNewName] = useState("");
    const [creationType, setCreationType] = useState<"file" | "folder">("folder");

    const handleFileSelect = (selectedFile: GitFileItem) => {
        useStore.getState().setCurrentFile?.(selectedFile);
    }

    const handleCreateFolder = async () => {
        const pathToCreateNewFolder = contextMenuItem?.path || "";
        const pathOfNewFolder = pathToCreateNewFolder + "/" + newName + "/";
        console.log("path to creating new folder ", pathOfNewFolder)
        try {
            await createNewFolder(pathOfNewFolder);
            setNewName("");
            //TODO: path should also be updated.
            setIsCreateFolderOpen?.(false);
        } catch (error) {
            console.error("Failed to create folder:", error);
        }
    };

    const handleCreateFile = async () => {
        const pathToCreateNewFile = contextMenuItem?.path || "";
        const pathOfNewFile = pathToCreateNewFile + "/" + newName; // add json to it
        console.log("path to creating new file ", pathOfNewFile)
        try {
            //TODO: 3) find way to refresh folder structure
            const newFile: FileItem = {
                name: newName,
                path: pathOfNewFile,
                type: "file",
            }
            await updateFileContent(newFile, null)
            useStore.getState().setCurrentFile?.(newFile)
            setNewName("");
            setIsCreateFileOpen?.(false);
        } catch (error) {
            console.error("Failed to create file:", error);
        }
    };

    const handleDelete = async () => {
        if (contextMenuItem) {
            try {
                console.log("the context menu item is ", contextMenuItem)
                await deleteFileOrFolder(contextMenuItem);
                setIsDeleteDialogOpen?.(false);
            } catch (error) {
                console.error("Failed to delete item:", error);
            }
        }
    };

    const handleCancel = () => {
        setNewName("");
        setIsCreateFolderOpen?.(false);
        setIsCreateFileOpen?.(false);
        setCreationType("folder");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            if (isCreateFolderOpen) {
                handleCreateFolder();
            } else if (isCreateFileOpen) {
                handleCreateFile();
            }
        }
        if (e.key === "Escape") {
            handleCancel();
        }
    };

    useEffect(() => {
        console.log("Creation mode changed within newfoldertree:", { isCreateFolderOpen, isCreateFileOpen });
    }, [isCreateFolderOpen, isCreateFileOpen]);

    return (
        <div style={{ marginLeft: depth > 0 ? `${depth * 0.5}rem` : '0' }}>
            {/* Root level creation input - shows at the beginning for root level */}
            {isRootLevel &&
                (isCreateFolderOpen || isCreateFileOpen) &&
                !(contextMenuItem?.path?.includes("/")) &&
                (contextMenuItem?.type != "dir") && (
                    <div className="flex items-center p-2 mb-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        {isCreateFolderOpen ? (
                            <FolderIcon isOpen={false} />
                        ) : (
                            <FileIcon fileName={newName || "new-file"} />
                        )}
                        <Input
                            className="flex-1 text-sm"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            autoFocus
                            onKeyDown={handleKeyDown}
                            placeholder={isCreateFolderOpen ? "New folder name" : "New file name"}
                        />
                        <div className="flex items-center ml-2 gap-1">
                            <button
                                onClick={isCreateFolderOpen ? handleCreateFolder : handleCreateFile}
                                className="text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                                disabled={!newName.trim()}
                            >
                                <RightIcon />
                            </button>

                            <button
                                onClick={handleCancel}
                                className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                            >
                                <CancelIcon />
                            </button>

                        </div>
                    </div>
                )}

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

                            {/* Inline creation for folders */}
                            {(isCreateFolderOpen || isCreateFileOpen) && item.path === currentCreateFolderPath && (
                                <div className="flex items-center p-2 pl-8 bg-gray-50 dark:bg-gray-800 rounded-md ml-4">
                                    {isCreateFolderOpen ? (
                                        <FolderIcon isOpen={false} />
                                    ) : (
                                        <FileIcon fileName={newName || "new-file"} />
                                    )}
                                    <Input
                                        className="flex-1 text-sm"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        autoFocus
                                        onKeyDown={handleKeyDown}
                                        placeholder={isCreateFolderOpen ? "New folder name" : "New file name"}
                                    />

                                    <div className="flex items-center ml-2 gap-1">
                                        <button
                                            onClick={isCreateFolderOpen ? handleCreateFolder : handleCreateFile}
                                            className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded"
                                            disabled={!newName.trim()}
                                        >
                                            <RightIcon />
                                        </button>
                                        <button
                                            onClick={handleCancel}
                                            className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                                        >
                                            <CancelIcon />
                                        </button>
                                    </div>

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
                                    isRootLevel={false}
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

            {/* Delete Confirmation Dialog */}
            {isDeleteDialogOpen && contextMenuItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            Delete {contextMenuItem.type === "dir" ? "Folder" : "File"}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Are you sure you want to delete "{contextMenuItem.name}"?
                            {contextMenuItem.type === "dir" && " This will also delete all contents inside."}
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsDeleteDialogOpen?.(false)}
                                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FolderTree;
