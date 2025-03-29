import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's default snow th
import 'quill/dist/quill.bubble.css';
import toolbarOptions from './quillToolBar'

interface QuillEditorProps {
	currentFile?: string;
	onTextChange?: (content: string) => void;
	className?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
	currentFile = '',
}) => {
	const editorRef = useRef<HTMLDivElement>(null); //pointer to HTML element
	const [quillInstance, setQuillInstance] = useState<Quill | null>(null);

	useEffect(() => {
		// Dynamically import Quill to ensure it's only loaded in browser
		import('quill').then((QuillModule) => {
			const Quill = QuillModule.default;
			if (editorRef.current) {
				setQuillInstance(new Quill(editorRef.current, {
					theme: 'snow',
					modules: {
						toolbar: toolbarOptions
					}
				})) 
			}
		})
	}, []);

	useEffect(() => {
		if (currentFile) {
			const currentFileValues = localStorage.getItem(currentFile);
			if (currentFileValues) {
				quillInstance?.setContents(JSON.parse(currentFileValues))
			} else {
				quillInstance?.setContents([]);
				//creating a file in storage
				localStorage.setItem(currentFile, JSON.stringify(quillInstance?.setContents([])));
			}
		}
	}, [currentFile, quillInstance])

	useEffect(() => {
		const handleTextChange = () => {
			localStorage.setItem(currentFile, JSON.stringify(quillInstance?.getContents().ops));
		};
		quillInstance?.on('text-change', handleTextChange);

		return () => {
			quillInstance?.off('text-change', handleTextChange);
		};
	}, [quillInstance, currentFile]);

	return (
		<div ref={editorRef}></div>
	);
};

export default QuillEditor;