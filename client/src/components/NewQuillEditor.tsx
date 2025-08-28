'use client';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill from 'quill';
import { Op } from 'quill-delta';
const Delta = Quill.import('delta');
import 'quill/dist/quill.snow.css'; // Import Quill's default snow theme
import toolbarOptions from '@/services/quillToolBar'
import { useStore } from '@/stores/states'
import fetchFileContent from '@/services/getFileContent';
import updateFileContent from '@/services/updateFileContent'
/* 
 * TODO: 
 * 1. data should be visibile - of current file -> working
 * 2. data should be saved on text-change as object or local localStorage - working
 * 3. api call to get the data on currentfile change - working
 * 4. chnaging the file or closing the file should make the post request to save the data - not implemented
 * 5. multiple editor instance should be handled - completed
 * */


const Editor = forwardRef((props, forwardedRef): React.JSX.Element => {

    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const currentFile = useStore((state) => state.currentFile);
    const [fileContent, setFileContent] = useState<Op[] | null>(null);
    const setCurrentFileContent = useStore((state) => state.setCurrentFileContent);
    const saveFile = useStore((state) => state.saveFile);
    const setSaveFile = useStore((state) => state.setSaveFile);

    useEffect(() => {
        if (quillRef.current || !containerRef.current) return;
        quillRef.current = new Quill(containerRef.current, { theme: 'snow', modules: { toolbar: toolbarOptions } });

        return () => {
            if (containerRef.current) containerRef.current.innerHTML = '';
        };
    }, []);

    useEffect(() => {
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

    //another useEffect for quill changes
    useEffect(() => {
        //WARNING: updating content directly to current file will cause too many rerenders
        //TODO: why not call api based on timeout - use debounce and sepeartion on content change and file change

        const handleTextChange = () => {
            if (quillRef.current) {
                const content = quillRef.current.getContents();
                setFileContent(content.ops || []);
                setCurrentFileContent && setCurrentFileContent(content.ops || []);
            }
        };
        quillRef.current?.on("text-change", handleTextChange);

        return () => {
            quillRef.current?.off("text-change", handleTextChange);
        };

    }, [quillRef.current]);

    // if a button is clicked push the content to api
    useEffect(() => {
        if (saveFile && currentFile && typeof currentFile !== 'string' && 'path' in currentFile) {
            const saveContent = async () => {
                await updateFileContent(currentFile, useStore.getState().currentFileContent)
            }
            saveContent()
        }

    }, [saveFile]);

    useEffect(() => {
        console.log("Content updated in zustand:", useStore.getState().currentFileContent);
    }, [fileContent]);

    return <div ref={containerRef}></div>;
});

Editor.displayName = 'Editor';

export default Editor;
