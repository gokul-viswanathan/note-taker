import React, { useEffect, useRef } from 'react';
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
		if (currentFile) {
			const currentFileValues = localStorage.getItem(currentFile);
			if (currentFileValues) {
				quillInstanceRef.current?.setContents(JSON.parse(currentFileValues))
			} else {
				quillInstanceRef.current?.setContents([]);
				localStorage.setItem(currentFile, JSON.stringify(quillInstanceRef.current?.setContents([])));
			}
		}
	}, [currentFile])

	useEffect(() => {
		if (!quillInstanceRef.current) return;
		const quill = quillInstanceRef.current;
		const handleTextChange = () => {
			localStorage.setItem(currentFile, JSON.stringify(quill.getContents().ops));
			console.log(JSON.stringify(quill.getContents().ops))
		};
		quill.on('text-change', handleTextChange);

		return () => {
			quill.off('text-change', handleTextChange);
		};
	}, [quillInstanceRef.current, currentFile]);

	return (
		<div ref={editorRef}></div>
	);
};

export default QuillEditor;