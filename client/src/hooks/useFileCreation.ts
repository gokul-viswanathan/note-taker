import { useState } from "react";
import { useStore } from "@/stores/states";
import { createNewFolder } from "@/services/createNewFolder";
import updateFileContent from "@/services/updateFileContent";
import { FileItem } from "@/types/git-interface";

interface UseFileCreationProps {
  creationType: "file" | "folder";
  parentPath: string;
  onSuccess?: () => void;
}

export const useFileCreation = ({
  creationType,
  parentPath,
  onSuccess,
}: UseFileCreationProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleCreateFolder = async () => {
    const pathOfNewFolder = parentPath + "/" + inputValue + "/";
    try {
      await createNewFolder(pathOfNewFolder);
      handleCancel();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create folder:", error);
    }
  };

  const handleCreateFile = async () => {
    const pathOfNewFile = parentPath + "/" + inputValue;
    try {
      const newFile: FileItem = {
        name: inputValue,
        path: pathOfNewFile,
        type: "file",
      };
      await updateFileContent(newFile, null);
      useStore.getState().setCurrentFile?.(newFile);
      handleCancel();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create file:", error);
    }
  };

  const handleSave = async () => {
    if (!inputValue.trim()) return;
    try {
      if (creationType === "file") {
        await handleCreateFile();
      } else if (creationType === "folder") {
        await handleCreateFolder();
      }
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  const handleCancel = () => {
    useStore.getState().setIsCreateFileOpen?.(false);
    useStore.getState().setIsCreateFolderOpen?.(false);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return {
    inputValue,
    setInputValue,
    handleKeyDown,
    handleCancel,
    handleSave,
  };
};

