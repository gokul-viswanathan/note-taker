import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { deleteFileOrFolder } from "@/services/deleteFileOrFolder";
import { useStore } from "@/stores/states";

const ContextMenuDemo: React.FC = () => {
  const contextMenuItem = useStore((state) => state.contextMenuItem);

  const handleCreateFolder = () => {
    useStore.getState().setIsCreateFolderOpen?.(true);
  };

  const handleCreateFile = () => {
    useStore.getState().setIsCreateFileOpen?.(true);
  };

  const handleDelete = async () => {
    if (contextMenuItem) {
      try {
        await deleteFileOrFolder(contextMenuItem);
        // setIsDeleteDialogOpen?.(false);
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
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
