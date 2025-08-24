import {
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
} from "@/components/ui/context-menu"
import { useStore } from '@/stores/states';

const ContextMenuDemo: React.FC = () => {

    const handleCreateFolder = () => {
        console.log("Create new folder clicked");
        useStore.getState().setIsCreateFolderOpen?.(true);
    };

    return (
        <ContextMenuContent className="w-52">
            <ContextMenuItem inset onClick={handleCreateFolder}>
                Create New Folder
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem inset disabled>
                Create New File
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem inset disabled>
                Delete
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
        </ContextMenuContent>
    )
}

export default ContextMenuDemo;
