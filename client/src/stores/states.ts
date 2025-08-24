import { create } from 'zustand';
import { FileItem, FileItemWithContent } from "@/types/git-interface";

interface BearState {
    currentFile?: FileItemWithContent | string;
    setCurrentFile?: (file: FileItemWithContent) => void;
    isCreateFolderOpen?: boolean;
    setIsCreateFolderOpen?: (isOpen: boolean) => void;
    isContextMenuOpen?: boolean;
    setIsContextMenuOpen?: (isOpen: boolean) => void;
    contextMenuItem?: any;
    setContextMenuItem?: (item: FileItem) => void;
}

export const useStore = create<BearState>((set) => ({
    //curent file state
    currentFile: "",
    setCurrentFile: (file: FileItemWithContent) => set({ currentFile: file }),

    //create folder modal state
    isCreateFolderOpen: false,
    setIsCreateFolderOpen: (isOpen: boolean) => set({ isCreateFolderOpen: isOpen }),

    //contextmenu state 
    isContextMenuOpen: false,
    setIsContextMenuOpen: (isOpen: boolean) => set({ isContextMenuOpen: isOpen }),
    contextMenuItem: null,
    setContextMenuItem: (item: FileItem) => set({ contextMenuItem: item }),
}));
