import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
} from "@/components/ui/sidebar";
import FolderTree from "@/components/shadcnSidebar/FolderTree";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import ContextMenuDemo from "@/components/sidebar/CustomContextMenu2";

const AppSidebar: React.FC = () => {

    return (
        <SidebarProvider>
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <Sidebar side="left">
                        <SidebarContent>
                            <FolderTree />
                        </SidebarContent>
                    </Sidebar>
                </ContextMenuTrigger>
                <ContextMenuDemo />
            </ContextMenu>
        </SidebarProvider>
    )
}

export default AppSidebar;
