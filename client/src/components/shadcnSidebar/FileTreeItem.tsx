import {
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Folder, File } from "lucide-react"
import { FileItem } from "@/types/git-interface"
import { useStore } from "@/stores/states"
import { useEffect, useState } from "react"

interface FileTreeProp {
    item: FileItem;
    onToggleFolder: (path: string) => void;
    level?: number
}

const FileTreeItem: React.FC<FileTreeProp> = ({ item, onToggleFolder, level = 1 }) => {

    const handleFolderOrFileClick = (item: FileItem) => {
        console.log("the clikced item is %s of type %s", item.name, item.type)
        if (item.type == "dir") {
            onToggleFolder(item.path);
        } else {
            useStore.getState().setCurrentFile?.(item)
        }
    }

    useEffect(() => {
        console.log("the item list has been updated with child list")
    }, [item]);

    if (item.type === "file") {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton onClick={() => handleFolderOrFileClick(item)}>
                    <File className="h-4 w-4" />
                    <span>{item.name}</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    // It's a directory
    return (
        <Collapsible open>
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton onClick={() => handleFolderOrFileClick(item)}>
                        <Folder className="h-4 w-4" />
                        <span>{item.name}</span>
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.children && item.children.length > 0 && (
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.children.map((child) => (
                                <FileTreeItem
                                    key={child.path}
                                    item={child}
                                    onToggleFolder={onToggleFolder}
                                    level={level + 1}
                                />
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                )}
            </SidebarMenuItem>
        </Collapsible>
    );
}

export default FileTreeItem
