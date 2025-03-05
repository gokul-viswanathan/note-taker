// import Image from "next/image";
'use client'
import QuillEditor from "../quill/app"
// import React, { useState } from 'react';


const MainComponent = () => {
  // const [editorContent, setEditorContent] = useState<string>('');

  // const handleEditorChange = (content: string) => {
  //   setEditorContent(content);
  // };

  return (
      <QuillEditor
        // value={editorContent}
        // onChange={handleEditorChange}
        // placeholder="Start writing your content here..."
        // className="my-custom-quill-class"
      />
  );
};

export default MainComponent; 
