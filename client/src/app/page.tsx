// import Image from "next/image";
'use client'
import QuillEditor from "../components/quill/QuillEditor"
import React, { useState } from 'react';
import SideBar from "../components/SideBar"
import AiSideBar from "@/components/aiSideBar";

const MainComponent = () => {
  const files = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("ntf~")) {
      files.push(key);
    }
  }
  // const files = Object.keys(localStorage)
  //current file - last used 
  const theGuide = 'ntf~The Guide'
  // localStorage.setItem(theGuide,)
  const [currentFile, setCurrentFile] = useState(theGuide);
  function setChoosenFile(content: string) {
    setCurrentFile(content)
  }
  // given side bar with userId, it should populate all the notes by me
  // the last used notes will be the first
  return (
    <div className="h-screen bg-stone-950">
      <div className="app flex">
        <div className="w-2/10">
          <SideBar
            initialFiles={files}
            onFileSelect={setChoosenFile}
            currentFile={currentFile}
          />
        </div>
        <div className="editor-properties">
          <QuillEditor
            currentFile={currentFile} //const props
          />
        </div>
        <div className="w-3/10">
          <AiSideBar
            currentFile={currentFile}
          />
        </div>
      </div>
    </div>
  );
};

export default MainComponent; 
