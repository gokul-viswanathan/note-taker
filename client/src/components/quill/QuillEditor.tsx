import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's default snow th
import toolbarOptions from './quillToolBar'
import { apiCall } from "../typescript/AiModel"

// let startAI: boolean = false

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
	// const startAI = useRef<boolean>(false)

	//TODO object creation in separate file
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
				quillInstanceRef.current?.setContents([])
			}
			console.log("the quill editor chanes to", localStorage)
		}
	}, [currentFile])

	function triggerAI() {
		console.log("Ai button has been clicked", quillInstanceRef)
		if (quillInstanceRef.current) {
			const selectedArea = quillInstanceRef.current.getSelection()
			if (selectedArea && selectedArea?.length > 0) {
				const selectedText = quillInstanceRef.current.getText(selectedArea?.index, selectedArea?.length)
				apiCall("rewrite this string with less words - " + selectedText)
					.then(aiOutput => { console.log("the return from AI is ", aiOutput) })
			}
		}
	}

	// useEffect(() => {
	// 	if (quillInstanceRef.current) {
	// 		quillInstanceRef.current.on('selection-change', async (range) => {
	// 			if (range && range.length > 0) {
	// 				const text = quillInstanceRef.current?.getText(range.index, range.length);
	// 				console.log('User has highlighted', text);
	// 				if (startAI) {
	// 					const aiOutput = await apiCall("rewrite this string with less words - " + text)
	// 					console.log("the return from AI is ", aiOutput);
	// 					startAI = !startAI;
	// 				}
	// 			}
	// 		});
	// 	}
	// }, [quillInstanceRef]);

	return (
		<div>
			<div ref={editorRef} className={'overflow-y-auto'}></div>
			{/* <button
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-2 rounded"
				onClick={triggerAI}
			>
				AI
			</button> */}
		</div>
	);
};

export default QuillEditor;