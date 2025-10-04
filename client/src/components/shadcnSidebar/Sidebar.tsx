import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import FolderTree from "@/components/shadcnSidebar/FolderTree";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { useStore } from "@/stores/states";

const AppSidebar: React.FC = () => {
  const handleCreateFolder = () => {
    console.log("create folder");
    useStore.getState().setContextMenuItem?.(null);
    useStore.getState().setIsCreateFolderOpen?.(true);
  };

  const handleCreateFile = () => {
    console.log("create file");
    useStore.getState().setContextMenuItem?.(null);
    useStore.getState().setIsCreateFileOpen?.(true);
  };

  return (
    <SidebarProvider>
      <Sidebar side="left">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <SidebarContent>
              <FolderTree />
            </SidebarContent>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-52">
            <ContextMenuItem inset onClick={handleCreateFolder}>
              Create New Folder
            </ContextMenuItem>
            <ContextMenuItem inset onClick={handleCreateFile}>
              Create New File
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Sidebar>
    </SidebarProvider>
  );
};

export default AppSidebar;
