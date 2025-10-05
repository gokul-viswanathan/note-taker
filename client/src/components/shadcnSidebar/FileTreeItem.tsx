import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Folder, File } from "lucide-react";
import { FileItem } from "@/types/git-interface";
import { useStore } from "@/stores/states";
import { useFileCreation } from "@/hooks/useFileCreation";
import CreateInputField from "@/components/ui/CreateInputField";

interface FileTreeProp {
  item: FileItem;
  onToggleFolder: (path: string) => void;
  onFileCreated?: () => void;
  level?: number;
}

const FileTreeItem: React.FC<FileTreeProp> = ({
  item,
  onToggleFolder,
  onFileCreated,
  level = 1,
}) => {
  const isCreateFileDialogBoxOpen = useStore((state) => state.isCreateFileOpen);
  const isCreateFolderDialogBoxOpen = useStore(
    (state) => state.isCreateFolderOpen,
  );
  const creationType = isCreateFileDialogBoxOpen ? "file" : "folder";
  const currentContextMenuItem = useStore((state) => state.contextMenuItem);

  const { inputValue, setInputValue, handleKeyDown, handleCancel } = useFileCreation({
    creationType,
    parentPath: currentContextMenuItem?.path || "",
    onSuccess: onFileCreated,
  });

  const handleFolderOrFileClick = (item: FileItem) => {
    if (item.type == "dir") {
      onToggleFolder(item.path);
    } else {
      useStore.getState().setCurrentFile?.(item);
    }
  };

  const contextMenuUpdate = (item: FileItem) => {
    useStore.getState().setContextMenuItem?.(item);
  };

  const showContextMenuSubItem = () => {
    return (
      (item.children && item.children.length > 0) ||
      isCreateFileDialogBoxOpen ||
      isCreateFolderDialogBoxOpen
    );
  };

  const showInputBox = () => {
    return (
      (isCreateFolderDialogBoxOpen || isCreateFileDialogBoxOpen) &&
      item.path === currentContextMenuItem?.path
    );
  };

  const showChildItems = () => {
    return item.children && item.children?.length > 0;
  };

  if (item.type === "file") {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={() => handleFolderOrFileClick(item)}
          onContextMenu={() => {
            contextMenuUpdate(item);
          }}
        >
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
          <SidebarMenuButton
            onClick={() => handleFolderOrFileClick(item)}
            onContextMenu={() => {
              contextMenuUpdate(item);
            }}
          >
            <Folder className="h-4 w-4" />
            <span>{item.name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        {showContextMenuSubItem() && (
          <CollapsibleContent>
            <SidebarMenuSub>
              {/* sidebarmenu item as the input field under the folder. handle root as well */}
              {showInputBox() && (
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
              {showChildItems() &&
                item.children?.map((child) => (
                  <FileTreeItem
                    key={child.path}
                    item={child}
                    onToggleFolder={onToggleFolder}
                    onFileCreated={onFileCreated}
                    level={level + 1}
                  />
                ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        )}
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default FileTreeItem;
