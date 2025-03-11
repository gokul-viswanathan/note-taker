// import Image from "next/image";
'use client'
import QuillEditor from "../components/quill/QuillEditor"
import React, { useState } from 'react';
import SideBar from "../components/SideBar"

interface allDocs {
  fileId: string,
  fileContent: JSON,
  lastUpdated: Date
}

const MainComponent = () => {

  //maintain states of the current user
  //TODO get files for given user and show them
  //pass list of files
  const [files, setFiles] = useState<string[]>(['file1', 'file2']); // Initial files (notes)
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
        <SideBar files={files} onFileSelect={setChoosenFile} />
      </div>
      <div className="h-screen w-4/5">
        <QuillEditor
          currentFile={currentFile} //const props
          // onTextChange={notesTextChange} // a method props
          className="my-custom-quill-class"
        />
      </div>
    </div>

  );
};

export default MainComponent; 
