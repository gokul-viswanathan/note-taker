import { create } from 'zustand';
import { FileItem } from "@/types/git-interface";

interface BearState {
    currentFile?: FileItem | string;
    setCurrentFile?: (file: FileItem) => void;
    currentFileContent?: any;
    setCurrentFileContent?: (content: any) => void;
    saveFile?: boolean;
    setSaveFile?: (save: boolean) => void;
    isCreateFolderOpen?: boolean;
    setIsCreateFolderOpen?: (isOpen: boolean) => void;
    isCreateFileOpen?: boolean;
    setIsCreateFileOpen?: (isOpen: boolean) => void;
    isDeleteDialogOpen?: boolean;
    setIsDeleteDialogOpen?: (isOpen: boolean) => void;
    isContextMenuOpen?: boolean;
    setIsContextMenuOpen?: (isOpen: boolean) => void;
    contextMenuItem?: FileItem | null;
    setContextMenuItem?: (item: FileItem) => void;
}

export const useStore = create<BearState>((set) => ({
    //curent file state
    currentFile: "",
    setCurrentFile: (file: FileItem) => set({ currentFile: file }),
    //current file content state
    currentFileContent: null,
    setCurrentFileContent: (content: any) => set({ currentFileContent: content }),
    //save file state
    saveFile: false,
    setSaveFile: (value?: boolean) =>
        set(state => ({ saveFile: value ?? !state.saveFile })),
    //create folder modal state
    isCreateFolderOpen: false,
    setIsCreateFolderOpen: (isOpen: boolean) => set({ isCreateFolderOpen: isOpen }),
    //create file modal state
    isCreateFileOpen: false,
    setIsCreateFileOpen: (isOpen: boolean) => set({ isCreateFileOpen: isOpen }),
    //delete dialog state
    isDeleteDialogOpen: false,
    setIsDeleteDialogOpen: (isOpen: boolean) => set({ isDeleteDialogOpen: isOpen }),
    //contextmenu state 
    isContextMenuOpen: false,
    setIsContextMenuOpen: (isOpen: boolean) => set({ isContextMenuOpen: isOpen }),
    contextMenuItem: null,
    setContextMenuItem: (item: FileItem) => set({ contextMenuItem: item }),
}));
