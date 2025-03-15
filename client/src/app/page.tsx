// import Image from "next/image";
'use client'
import QuillEditor from "../components/quill/QuillEditor"
import React, { useState } from 'react';
import SideBar from "../components/SideBar"
import AiSideBar from "@/components/aiSideBar";


// interface allDocs {
//   fileId: string,
//   fileContent: JSON,
//   lastUpdated: Date
// }

const MainComponent = () => {

  const files = Object.keys(localStorage)
  //current file - last used 
  const [currentFile, setCurrentFile] = useState('file1');

  function setChoosenFile(content: string) {
    setCurrentFile(content)
  }

  // given side bar with userId, it should populate all the notes by me
  // the last used notes will be the first
  return (
    <div className="app flex">
      <div className="w-1/5">
        <SideBar
          initialFiles={files}
          onFileSelect={setChoosenFile}
        />
      </div>
      <div className="w-3/5 h-full">
        <QuillEditor
          currentFile={currentFile} //const props
          // onTextChange={notesTextChange} // a method props
          className="my-custom-quill-class"
        />
      </div>
      <div className="w-1/5">
        <AiSideBar />
      </div>
    </div>

  );
};

export default MainComponent; 
