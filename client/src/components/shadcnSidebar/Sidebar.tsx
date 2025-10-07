import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarWrapper,
} from "@/components/ui/sidebar";
import FolderTree from "@/components/shadcnSidebar/FolderTree";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from "@/components/ui/context-menu";
import { useStore } from "@/stores/states";
import { useFileCreation } from "@/hooks/useFileCreation";
import CreateInputField from "@/components/ui/CreateInputField";

const AppSidebar: React.FC = () => {
  const isCreateFileOpen = useStore((state) => state.isCreateFileOpen);
  const isCreateFolderOpen = useStore((state) => state.isCreateFolderOpen);
  const currentContextMenuItem = useStore((state) => state.contextMenuItem);
  const creationType = isCreateFileOpen ? "file" : "folder";

  const { inputValue, setInputValue, handleKeyDown, handleCancel } =
    useFileCreation({
      creationType,
      parentPath: "",
      onSuccess: () => {
        // Refresh folder tree if needed
      },
    });

  const handleCreateFolder = () => {
    useStore.getState().setIsCreateFolderOpen?.(true);
  };

  const handleCreateFile = () => {
    useStore.getState().setIsCreateFileOpen?.(true);
  };

  return (
    <SidebarProvider>
      <SidebarWrapper className="relative h-full min-h-auto">
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <SidebarContent>
              <SidebarMenu>
                <FolderTree />
                {(isCreateFileOpen || isCreateFolderOpen) &&
                  !currentContextMenuItem && (
                    <SidebarMenuItem>
                      <CreateInputField
                        inputValue={inputValue}
                        setInputValue={setInputValue}
                        creationType={creationType}
                        onKeyDown={handleKeyDown}
                        onCancel={handleCancel}
                      />
                    </SidebarMenuItem>
                  )}
              </SidebarMenu>
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
      </SidebarWrapper>
    </SidebarProvider>
  );
};

export default AppSidebar;
