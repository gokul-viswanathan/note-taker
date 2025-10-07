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
import { Folder, File, ChevronRight } from "lucide-react";
import { FileItem } from "@/types/git-interface";
import { useStore } from "@/stores/states";
import { useFileCreation } from "@/hooks/useFileCreation";
import CreateInputField from "@/components/ui/CreateInputField";

interface FileTreeProp {
  item: FileItem;
  onToggleFolder: (path: string) => void;
  onFileCreated?: () => void;
  expandedFolders: Set<string>;
  level?: number;
}

const FileTreeItem: React.FC<FileTreeProp> = ({
  item,
  onToggleFolder,
  onFileCreated,
  expandedFolders,
  level = 1,
}) => {
  const isCreateFileDialogBoxOpen = useStore((state) => state.isCreateFileOpen);
  const isCreateFolderDialogBoxOpen = useStore(
    (state) => state.isCreateFolderOpen,
  );
  const creationType = isCreateFileDialogBoxOpen ? "file" : "folder";
  const currentContextMenuItem = useStore((state) => state.contextMenuItem);

  const { inputValue, setInputValue, handleKeyDown, handleCancel } =
    useFileCreation({
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

  // It's a directory
  if (item.type === "dir") {
    return (
      <Collapsible open={expandedFolders.has(item.path)}>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              onClick={() => handleFolderOrFileClick(item)}
              onContextMenu={() => {
                contextMenuUpdate(item);
              }}
            >
              <ChevronRight
                className={`h-4 w-4 transition-transform ${expandedFolders.has(item.path) ? "rotate-90" : ""}`}
              />
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
                      expandedFolders={expandedFolders}
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
};
export default FileTreeItem;
