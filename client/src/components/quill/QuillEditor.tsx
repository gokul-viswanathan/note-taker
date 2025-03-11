import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's default snow th
import toolbarOptions from './quillToolBar'

interface QuillEditorProps {
	currentFile?: string;
	onTextChange?: (content: string) => void;
	className?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
	currentFile = '',
	// onTextChange,
	className = ''
}) => {
	const editorRef = useRef<HTMLDivElement>(null); //pointer to HTML element
	const quillInstanceRef = useRef<Quill | null>(null); //quill instance holder
	const prevWorkingFile = useRef<string>(null);

	useEffect(() => {
		if (editorRef.current && !quillInstanceRef.current) {
		  quillInstanceRef.current = new Quill(editorRef.current, {
			theme: 'snow',
			modules: {
			  toolbar: toolbarOptions
			},
		  });
		}

	  }, []);

	useEffect(() => {
		if (prevWorkingFile.current !== null) {
			localStorage.setItem(prevWorkingFile.current, JSON.stringify(quillInstanceRef.current?.getContents().ops));
		}
		prevWorkingFile.current = currentFile
		// quillInstanceRef.current?.setContents([])
		if (currentFile) {
			const currentFileValues = localStorage.getItem(currentFile);
			if (currentFileValues) {
				quillInstanceRef.current?.setContents(JSON.parse(currentFileValues))
			} else {
				quillInstanceRef.current?.setContents([])
			}
			console.log("the quill editor chanes to", localStorage)
		}
	}, [currentFile])

// useEffect(() => {
// 	if (quillInstanceRef.current) {
// 		quillInstanceRef.current.on('text-change', () => {
// 			localStorage.setItem(currentFile, JSON.stringify(quillInstanceRef.current?.getContents().ops));
// 		});
// 		console.log(currentFile)
// 	}
// }, [quillInstanceRef.current]);

return (
	<div ref={editorRef} className={className}></div>
);
};

export default QuillEditor;