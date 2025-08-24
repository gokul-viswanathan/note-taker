'use client';
import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill from 'quill';
const Delta = Quill.import('delta');
import 'quill/dist/quill.snow.css'; // Import Quill's default snow theme
import toolbarOptions from '@/services/quillToolBar'

/* 
 * TODO: 
 * 1. data should be visibile
 * 2. data should be saved on text-change as object or local localStorage
 * 3. api call to get the data on currentfile change
 * 4. chnaging the file or closing the file should make the post request to save the data
 * 5. multiple editor instance should be handled
 * */


const Editor = forwardRef((props, forwardedRef): React.JSX.Element => {

    const containerRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);
    const defaultValue = new Delta()
        .insert('Hello')
        .insert('\n', { header: 1 })
        .insert('Some ')
        .insert('initial', { bold: true })
        .insert(' ')
        .insert('content', { underline: true })
        .insert('\n');

    useEffect(() => {

        if (quillRef.current || !containerRef.current) return;
        quillRef.current = new Quill(containerRef.current, { theme: 'snow', modules: { toolbar: toolbarOptions } });
        if (defaultValue) {
            quillRef.current.setContents(defaultValue);
        }
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

    return <div ref={containerRef}></div>;
});

Editor.displayName = 'Editor';

export default Editor;
