'use client'
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '@/stores/states';
// import SideBar from "@/components/sidebar/SideBar"
import SideBar from "@/components/shadcnSidebar/Sidebar";
// import AiSideBar from "@/components/aiSideBar";
import ResizableSidebar from '@/components/ResizableSidebar';
import ThoughtInkHeader from '@/components/header/ThoughtInkHeader';
import { FileItem } from '@/types/git-interface';
import { useTheme } from '@/components/theme/ThemeProvider';

const QuillEditor = dynamic(
    () => import('@/components/NewQuillEditor'),
    {
        ssr: false,
        loading: () => <div>Loading editor...</div>
    }
);

const MainComponent = () => {
    const [showFileSideBar, setShowFileSideBar] = useState(true);
    const [showAiSideBar, setShowAiSideBar] = useState(true);
    const currentFile = useStore((state) => state.currentFile);
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
        const handleResize = () => {
            if (window.innerWidth < 768) { // md breakpoint
                setShowFileSideBar(false);
                setShowAiSideBar(false);
            } else {
                // Optionally show on larger screens, but keep user preference
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
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
        <div className="h-screen flex flex-col bg-stone-950">

            <ThoughtInkHeader
                currentFile={typeof currentFile === "string" ? currentFile : currentFile?.path}
                showFileSideBar={showFileSideBar}
                showAiSideBar={showAiSideBar}
                darkMode={darkMode}
                onToggleFileSideBar={() => setShowFileSideBar(!showFileSideBar)}
                onToggleAiSideBar={() => setShowAiSideBar(!showAiSideBar)}
                onToggleTheme={() => toggleTheme()}
                onPushToRepo={handlePushToRepo}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Left sidebar */}
                {showFileSideBar && (<ResizableSidebar side="left">
                    <SideBar />
                </ResizableSidebar>)}


                {/* Editor */}
                <div className="Editor flex-1 overflow-hidden">
                    <QuillEditor />
                </div>

                {/* Right AI sidebar */}
                {/*
                {showAiSideBar && (<ResizableSidebar side="right">
                    <AiSideBar currentFile={currentFile} />
                </ResizableSidebar>)}
                */}
            </div>

        </div>
    );
};

export default MainComponent;

