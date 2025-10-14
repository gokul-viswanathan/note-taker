"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/stores/states";
import AppSideBar from "@/components/shadcnSidebar/Sidebar";
import ThoughtInkHeader from "@/components/header/ThoughtInkHeader";
import { FileItem } from "@/types/git-interface";
import { useTheme } from "@/components/theme/ThemeProvider";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import AiSideBar from "@/components/aiSideBar";

const QuillEditor = dynamic(() => import("@/components/NewQuillEditor"), {
  ssr: false,
  loading: () => <div>Loading editor...</div>,
});

const MainComponent = () => {
  const currentFile = useStore((state) => state.currentFile);
  const { darkMode, toggleTheme } = useTheme();
  const { toggleSidebar, openMobile } = useSidebar();
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);

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

  return (
    <div className="notepad-page h-screen w-full flex flex-col ">
      <ThoughtInkHeader
        currentFile={
          typeof currentFile === "string" ? currentFile : currentFile?.path
        }
        darkMode={darkMode}
        onToggleTheme={() => toggleTheme()}
        onPushToRepo={handlePushToRepo}
        onToggleFileSidebar={toggleSidebar}
        onToggleAISidebar={() => setAiSidebarOpen(!aiSidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <AppSideBar />
        <div
          className={`editor flex-1 overflow-hidden ${openMobile ? "pointer-events-none opacity-50" : ""}`}
        >
          <QuillEditor />
        </div>
        <SidebarProvider>
          <AiSideBar sidebarState={aiSidebarOpen} />
        </SidebarProvider>
      </div>
    </div>
  );
};

export default MainComponent;
