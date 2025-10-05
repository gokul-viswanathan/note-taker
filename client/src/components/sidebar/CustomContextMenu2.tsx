import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu";
import { deleteFileOrFolder } from "@/services/deleteFileOrFolder";
import { useStore } from "@/stores/states";
import { useEffect } from "react";

const ContextMenuDemo: React.FC = () => {
  const contextMenuItem = useStore((state) => state.contextMenuItem);

  const handleCreateFolder = () => {
    console.log("Create new folder clicked", contextMenuItem);
    useStore.getState().setIsCreateFolderOpen?.(true);
  };

  const handleCreateFile = () => {
    console.log("Create new file clicked", contextMenuItem);
    useStore.getState().setIsCreateFileOpen?.(true);
  };

  const handleDelete = async () => {
    console.log("Delete clicked", contextMenuItem);
    if (contextMenuItem) {
      try {
        console.log("the context menu item is ", contextMenuItem);
        await deleteFileOrFolder(contextMenuItem);
        // setIsDeleteDialogOpen?.(false);
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  useEffect(() => {
    console.log("context menu item in state ", contextMenuItem);
  }, [contextMenuItem]);

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
