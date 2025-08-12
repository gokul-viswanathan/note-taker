// import Image from "next/image";
'use client'
import React, { useState, useEffect } from 'react';

import QuillEditor from "@/components/QuillEditor"
import SideBar from "@/components/sidebar/SideBar"
// import AiSideBar from "@/components/aiSideBar";
import ResizableSidebar from '@/components/ResizableSidebar';

import githubAuth from "@/services/oauth";
// import fetchFiles from "@/services/getFiles";
// import { FileItem } from "@/types/git-interface";


const MainComponent = () => {
    const [showFileSideBar, setShowFileSideBar] = useState(true);
    const [showAiSideBar, setShowAiSideBar] = useState(true);
    const [currentFile, setCurrentFile] = useState("");

    // useEffect(() => {
    //     const loadFiles = async () => {
    //         try {
    //             const data = await fetchFiles(username, repo, subpath, token);
    //             setFiles(data);
    //         } catch (error) {
    //             console.error("Error fetching files:", error);
    //         }
    //     };
    //
    //     loadFiles(); // Call the async function inside useEffect
    // }, [username, repo, subpath, token]);
    //

    function setChoosenFile(content: string) {
        setCurrentFile(content)
    }

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
                    <SideBar
                        onFileSelect={setChoosenFile}
                        currentFile={currentFile}
                    />
                </ResizableSidebar>)}


                {/* Editor */}
                <div className="flex-1 overflow-hidden">
                    <QuillEditor currentFile={currentFile} />
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
