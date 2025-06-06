// import Image from "next/image";
'use client'
import QuillEditor from "../components/quill/QuillEditor"
import React, { useState, useEffect } from 'react';
import SideBar from "@/components/SideBar"
import AiSideBar from "@/components/aiSideBar";
import ResizableSidebar from '@/components/ResizableSidebar';

const MainComponent = () => {
  const [files, setFiles] = useState<string[]>([]);
  const theGuide = 'ntf~The Guide'
  const [showFileSideBar, setShowFileSideBar] = useState(true);
  const [showAiSideBar, setShowAiSideBar] = useState(true);

  useEffect(() => {
    const theGuideValue = [{ "insert": "Welcome to Though Ink!" }, { "attributes": { "header": 1 }, "insert": "\n" }, { "insert": "Thanks for trying out my note-taking app with AI assistance! I built this as a fun learning project to create a smart note-taking tool that keeps your data right in your browser.\n\nWhat You Can Do Now" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "Take notes that save automatically in your browser" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "Ask the AI assistant questions about your notes for instant clarification" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "\nGood to Know" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "insert": "All data is stored locally in your browser - no servers or accounts needed!" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "This means your notes will disappear if you clear your browser cache or data" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "This is an early version to gather your feedback on what works best" }, { "attributes": { "list": "bullet" }, "insert": "\n" }, { "insert": "\nComing Soon" }, { "attributes": { "header": 2 }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "Smarter AI Features" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "AI that reads your notes and offers helpful suggestions" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "Better Storage Options" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Git integration for version control and backup" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "UI Improvements Based on Your Feedback" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Collapsible sidebar" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "insert": "Adjustable sidebar width" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "insert": "Dark/light mode" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "insert": "Folder organization" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "Enhanced Content" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Image support in notes" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "Collaboration Tools" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Share notes with others" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "insert": "Real-time collaborative editing" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "attributes": { "bold": true }, "insert": "Connected AI Conversations" }, { "attributes": { "list": "ordered" }, "insert": "\n" }, { "insert": "Save AI answers directly in your notes for future reference" }, { "attributes": { "indent": 1, "list": "bullet" }, "insert": "\n" }, { "insert": "\nI'd love to hear what features would make this most useful for you! - " }, { "attributes": { "link": "mailto:kvgokul97@gmail.com" }, "insert": "Email" }, { "insert": "\n" }];
    localStorage.setItem(theGuide, JSON.stringify(theGuideValue))

    const loadedFiles: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith("ntf~")) {
        loadedFiles.push(key);
      }
    }
    setFiles(loadedFiles);
  }, [])

  const [currentFile, setCurrentFile] = useState(theGuide);
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
        <button onClick={() => setShowAiSideBar(prev => !prev)}>
          {showAiSideBar ? 'Hide' : 'Show'} AI
        </button>
      </div>

      <div className="flex">
        {/* Left sidebar */}
        {showFileSideBar && (<ResizableSidebar side="left">
          <SideBar
            initialFiles={files}
            updateFileList={setFiles}
            onFileSelect={setChoosenFile}
            currentFile={currentFile}
          />
        </ResizableSidebar>)}


        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <QuillEditor currentFile={currentFile} />
        </div>

        {/* Right AI sidebar */}
        {showAiSideBar && (<ResizableSidebar side="right">
          <AiSideBar currentFile={currentFile} />
        </ResizableSidebar>)}
      </div>

    </div>
  );
};

export default MainComponent; 
