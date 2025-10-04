import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { useStore } from "@/stores/states";

const ContextMenuDemo: React.FC = () => {
  const contextMenuItem = useStore.getState().contextMenuItem;
  const handleCreateFolder = () => {
    console.log("Create new folder clicked");
    useStore.getState().setIsCreateFolderOpen?.(true);
  };

  const handleCreateFile = () => {
    console.log("Create new file clicked");
    // Implement create file logic here
    useStore.getState().setIsCreateFileOpen?.(true);
  };

  const handleDelete = () => {
    console.log("Delete clicked");
    // Implement delete logic here
    useStore.getState().setIsDeleteDialogOpen?.(true);
  };

  if (contextMenuItem?.type == "file") {
    return (
      <ContextMenuContent className="w-52">
        <ContextMenuItem inset onClick={handleDelete}>
          Delete
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    );
  }
  return (
    <ContextMenuContent className="w-52">
      <ContextMenuItem inset onClick={handleCreateFolder}>
        Create New Folder
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset onClick={handleCreateFile}>
        Create New File
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem inset onClick={handleDelete}>
        Delete
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
    </ContextMenuContent>
  );
};

export default ContextMenuDemo;
