'use client'
import React, { useState, useEffect } from 'react';

import QuillEditor from "@/components/QuillEditor"
import SideBar from "@/components/sidebar/SideBar"
// import AiSideBar from "@/components/aiSideBar";
import ResizableSidebar from '@/components/ResizableSidebar';
import githubAuth from "@/services/oauth";
import { useStore } from '@/stores/states';
import { FileItem } from '@/types/git-interface';


const MainComponent = () => {
    const [showFileSideBar, setShowFileSideBar] = useState(true);
    const [showAiSideBar, setShowAiSideBar] = useState(true);
    const currentFile = useStore((state) => state.currentFile);

    useEffect(() => {
        const savedFile = localStorage.getItem("currentFile");
        if (savedFile) {
            try {
                const parsedFile: FileItem = JSON.parse(savedFile);
                if (parsedFile) useStore.setState({ currentFile: parsedFile });
            } catch (error) {
                console.error("Failed to parse saved file from localStorage:", error);
                // Optionally clear the corrupted data
                localStorage.removeItem("currentFile");
            }
        }
    }, []);

    useEffect(() => {
        if (currentFile) {
            localStorage.setItem("currentFile", JSON.stringify(currentFile));
        } else {
            // Remove from localStorage if currentFile is null/undefined
            localStorage.removeItem("currentFile");
        }
    }, [currentFile]);

    return (
        <div className="h-screen bg-stone-950">

            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 text-white">
                <button onClick={() => setShowFileSideBar(prev => !prev)}>
                    {showFileSideBar ? 'Hide' : 'Show'} Notes
                </button>
                <h1 className="text-lg font-bold">Though Ink</h1>
                <button onClick={() => githubAuth()}>
                    Github Auth
                </button>
                <button onClick={() => setShowAiSideBar(prev => !prev)}>
                    {showAiSideBar ? 'Hide' : 'Show'} AI
                </button>
            </div>

            <div className="flex">
                {/* Left sidebar */}
                {showFileSideBar && (<ResizableSidebar side="left">
                    <SideBar />
                </ResizableSidebar>)}


                {/* Editor */}
                <div className="flex-1 overflow-hidden">
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
