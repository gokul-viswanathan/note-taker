'use client';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill from 'quill';
const Delta = Quill.import('delta');
import 'quill/dist/quill.snow.css'; // Import Quill's default snow theme
import toolbarOptions from '@/services/quillToolBar'
import { useStore } from '@/stores/states'
import fetchFileContent from '@/services/getFileContent';

/* 
 * TODO: 
 * 1. data should be visibile - of current file -> working
 * 2. data should be saved on text-change as object or local localStorage
 * 3. api call to get the data on currentfile change
 * 4. chnaging the file or closing the file should make the post request to save the data
 * 5. multiple editor instance should be handled
 * */


const Editor = forwardRef((props, forwardedRef): React.JSX.Element => {

    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const currentFile = useStore((state) => state.currentFile);

    useEffect(() => {
        console.log("Current file with quill editor changed:", currentFile);
        const loadFileContent = async () => {
            if (currentFile && typeof currentFile !== 'string' && 'path' in currentFile) {
                const data = await fetchFileContent(currentFile.path);
                if (data && quillRef.current) {
                    try {
                        const content = data.content ? JSON.parse(data.content) : [];
                        quillRef.current.setContents(content);
                    } catch (error) {
                        console.error("Failed to parse file content:", error);
                        quillRef.current.setContents([]);
                    }
                }
            } else if (quillRef.current) {
                quillRef.current.setContents([]);
            }
        };
        loadFileContent();
    }, [currentFile]);

    useEffect(() => {
        if (quillRef.current || !containerRef.current) return;
        quillRef.current = new Quill(containerRef.current, { theme: 'snow', modules: { toolbar: toolbarOptions } });
        const handleTextChange = () => {
            localStorage.setItem(
                "fileContent",
                JSON.stringify(quillRef.current?.getContents().ops)
            );
        };
        quillRef.current.on("text-change", handleTextChange);

        return () => {
            quillRef.current?.off("text-change", handleTextChange);
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    //another useEffect for quill changes

    return <div ref={containerRef}></div>;
});

Editor.displayName = 'Editor';

export default Editor;
