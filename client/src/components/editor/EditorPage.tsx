"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/stores/states";
import AppSideBar from "@/components/shadcnSidebar/Sidebar";
import ThoughtInkHeader from "@/components/header/ThoughtInkHeader";
import { FileItem } from "@/types/git-interface";
import { useTheme } from "@/components/theme/ThemeProvider";
import { on } from "events";

const QuillEditor = dynamic(() => import("@/components/NewQuillEditor"), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

const MainComponent = () => {
  const currentFile = useStore((state) => state.currentFile);
  const [isShowSidebar, setIsShowSidebar] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const savedFile = localStorage.getItem("currentFile");
    if (savedFile) {
      try {
        const parsedFile: FileItem = JSON.parse(savedFile);
        if (parsedFile) useStore.setState({ currentFile: parsedFile });
      } catch (error) {
        console.error("Failed to parse saved file from localStorage:", error);
        localStorage.removeItem("currentFile"); // clear the corrupted data
      }
    }
  }, []);

  useEffect(() => {
    if (currentFile) {
      localStorage.setItem("currentFile", JSON.stringify(currentFile));
    } else {
      localStorage.removeItem("currentFile");
    }
  }, [currentFile]);

  function handlePushToRepo() {
    useStore.getState().setSaveFile?.(true);
  }

  function onToggleFileSidebar() {
    setIsShowSidebar((isShowSidebar) => !isShowSidebar);
  }

  return (
    <div className="h-screen flex flex-col">
      <ThoughtInkHeader
        currentFile={
          typeof currentFile === "string" ? currentFile : currentFile?.path
        }
        darkMode={darkMode}
        onToggleTheme={() => toggleTheme()}
        onPushToRepo={handlePushToRepo}
        onToggleFileSidebar={onToggleFileSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        {isShowSidebar && <AppSideBar />}
        <div className="flex-1 overflow-hidden">
          <QuillEditor />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
