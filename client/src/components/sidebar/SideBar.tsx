import FolderSection from "@/components/sidebar/FileExplorer";
import { ContextMenu, ContextMenuTrigger } from "@/components/ui/context-menu";
import ContextMenuDemo from "@/components/sidebar/CustomContextMenu2";

const Sidebar: React.FC = () => {
    return (
        <>
            <div
                id="default-sidebar"
                className={`relative inset-y-0 left-0 w-full h-screen bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Thought Ink</h1>
                    </div>
                    <ContextMenu>
                        <ContextMenuTrigger className="file-explorer">

                            <FolderSection />
                        </ContextMenuTrigger>

                        <ContextMenuDemo />

                    </ContextMenu>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
