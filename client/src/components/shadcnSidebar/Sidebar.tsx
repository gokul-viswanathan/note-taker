import {
    Sidebar,
    SidebarContent,
    SidebarProvider,
} from "@/components/ui/sidebar";
import FolderTree from "@/components/shadcnSidebar/FolderTree";

const AppSidebar: React.FC = () => {

    return (
        <SidebarProvider>
            <Sidebar side="left">
                <SidebarContent>
                    <FolderTree />
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    )
}

export default AppSidebar;
