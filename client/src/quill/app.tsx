import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill's default snow theme

interface QuillEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Write something...',
  readOnly = false,
  className = ''
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      // Configure Quill toolbar options
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ];

      // Initialize Quill
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: placeholder,
        readOnly: readOnly
      });

      console.log("the quill value", quill)

      // // Set initial value if provided
      // if (value) {
      //   quill.root.innerHTML = value;
      // }

      // // Handle content changes
      // quill.on('text-change', () => {
      //   if (onChange) {
      //     onChange(quill.root.innerHTML);
      //   }
      // });

      // Store quill instance for potential future use
      quillInstanceRef.current = quill;

      // // Cleanup function
      // return () => {
      //   quillInstanceRef.current = null;
      // };
    }
  }, []);

  // Update content if value prop changes
  // useEffect(() => {
  //   if (quillInstanceRef.current && value !== quillInstanceRef.current.root.innerHTML) {
  //     quillInstanceRef.current.root.innerHTML = value || '';
  //   }
  //   console.log("the updated quill value", value)
  // }, [value]);

  return (
    <div className={`quill-editor-container ${className}`}>
      <div ref={editorRef}></div>
    </div>
  );
};

export default QuillEditor;