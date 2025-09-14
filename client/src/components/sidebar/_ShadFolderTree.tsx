import { FolderIcon, ChevronIcon, FileIcon, RightIcon, CancelIcon } from "@/components/sidebar/Icons"
import { useStore } from "@/stores/states";
import { useState } from "react";
import { createNewFolder } from "@/services/createNewFile";
import { GitFileItem } from "@/types/git-interface";
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { ChevronRight, Folder, File } from "lucide-react"

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
        <SidebarMenu>
            {items.map((item) => (
                <SidebarMenuItem key={item.path}>
                    {item.type === "dir" ? (
                        <>
                            <SidebarMenuButton
                                className="flex items-center gap-2 text-sm cursor-pointer"
                                onClick={() => onToggleFolder(item.name, item.path)}
                                onContextMenu={() => handleContextMenu?.(item)}
                            >
                                <ChevronRight
                                    className={`h-4 w-4 transition-transform ${expandedFolders.has(item.path) ? "rotate-90" : ""
                                        }`}
                                />
                                <Folder className="h-4 w-4" />
                                <span className="font-medium">{item.name}</span>
                            </SidebarMenuButton>

                            {expandedFolders.has(item.path) && item.children && (
                                <div className="ml-4">
                                    <FolderTree
                                        items={item.children}
                                        expandedFolders={expandedFolders}
                                        onToggleFolder={onToggleFolder}
                                        handleContextMenu={handleContextMenu}
                                        depth={depth + 1}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <SidebarMenuButton
                            className={`flex items-center gap-2 text-sm truncate cursor-pointer ${item.path === currentFile
                                ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                            onContextMenu={() => handleContextMenu?.(item)}
                        >
                            <File className="h-4 w-4" />
                            <span className="flex-1 truncate">{item.name}</span>
                        </SidebarMenuButton>
                    )}
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    )
}

export default FolderTree;
