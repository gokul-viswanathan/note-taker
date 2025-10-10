//@ts-nocheck
"use client";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { Op } from "quill-delta";
import "quill/dist/quill.snow.css"; // Import Quill's default snow theme
import toolbarOptions from "@/services/quillToolBar";
import { useStore } from "@/stores/states";
import fetchFileContent from "@/services/getFileContent";
import updateFileContent from "@/services/updateFileContent";

const Editor = forwardRef((_props, _forwardedRef): React.JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const currentFile = useStore((state) => state.currentFile);
  const [fileContent, setFileContent] = useState<Op[] | null>(null);
  const setCurrentFileContent = useStore(
    (state) => state.setCurrentFileContent,
  );
  const saveFile = useStore((state) => state.saveFile);
  const setSaveFile = useStore((state) => state.setSaveFile);

  useEffect(() => {
    if (quillRef.current || !containerRef.current) return;
    quillRef.current = new Quill(containerRef.current, {
      theme: "snow",
      modules: { toolbar: toolbarOptions },
    });

    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  useEffect(() => {
    const loadFileContent = async () => {
      if (
        currentFile &&
        typeof currentFile !== "string" &&
        "path" in currentFile
      ) {
        try {
          const data = await fetchFileContent(currentFile.path);

          if (data && quillRef.current) {
            // Check if content exists and is not empty
            if (!data.content || data.content.trim() === "") {
              quillRef.current.setContents([{ insert: "\n" }]);
              return;
            }

            try {
              // Try to parse the content as JSON
              const content = JSON.parse(data.content);

              // Validate that it's an array (Quill Delta format)
              if (Array.isArray(content) && content.length > 0) {
                quillRef.current.setContents(content);
              } else {
                console.warn("Content is not in valid Quill format");
                quillRef.current.setContents([{ insert: "\n" }]);
              }
            } catch (parseError) {
              console.error("Failed to parse file content:", parseError);

              // Fallback: try to use as plain text if it's a string
              try {
                quillRef.current.setText(data.content || "");
              } catch {
                quillRef.current.setContents([{ insert: "\n" }]);
              }
            }
          } else {
            // Handle missing data or quillRef
            if (!data) {
              console.warn("No data received from fetchFileContent");
            }
            if (quillRef.current) {
              quillRef.current.setContents([{ insert: "\n" }]);
            }
          }
        } catch (fetchError) {
          console.error("Failed to fetch file content:", fetchError);
          if (quillRef.current) {
            quillRef.current.setContents([{ insert: "\n" }]);
          }
        }
      } else if (quillRef.current) {
        // No valid current file, clear the editor
        quillRef.current.setContents([{ insert: "\n" }]);
      }
    };

    loadFileContent();
  }, [currentFile]);

  useEffect(() => {
    //WARNING: updating content directly to current file will cause too many rerenders
    //TODO: why not call api based on timeout - use debounce and sepeartion on content change and file change

    const handleTextChange = () => {
      if (quillRef.current) {
        const content = quillRef.current.getContents();
        const ops = content.ops || [];
        setFileContent(ops);
        if (setCurrentFileContent) {
          setCurrentFileContent(ops);
        }
      }
    };
    quillRef.current?.on("text-change", handleTextChange);

    return () => {
      quillRef.current?.off("text-change", handleTextChange);
    };
  }, [quillRef.current]);

  // if a button is clicked push the content to api
  useEffect(() => {
    if (
      saveFile &&
      currentFile &&
      typeof currentFile !== "string" &&
      "path" in currentFile
    ) {
      const saveContent = async () => {
        try {
          await updateFileContent(
            currentFile,
            useStore.getState().currentFileContent as Op[],
          );
        } catch (error) {
          console.error("Failed to save file:", error);
        } finally {
          // Reset the save flag after the operation completes
          setSaveFile?.(false);
        }
      };
      saveContent();
    }
  }, [saveFile]);

  return <div ref={containerRef}></div>;
});

Editor.displayName = "Editor";

export default Editor;
