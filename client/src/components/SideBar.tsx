/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';

type SidebarProps = {
   initialFiles: string[];
   updateFileList: (file: string) => void;
   onFileSelect: (file: string) => void;
   currentFile: string;
};

const Sidebar: React.FC<SidebarProps> = ({ initialFiles, updateFileList, onFileSelect, currentFile }) => {
   // const [files, setFiles] = useState(initialFiles);
   const [isVisible, setIsVisible] = useState(true);
   const [newFileName, setNewFileName] = useState('');
   const [isAddNewFile, setIsAddNewFile] = useState(false);

   // console.log("within sidebar -> current files ", initialFiles);

   // Add a new file
   const isAddFile = () => {
      setIsAddNewFile(!isAddNewFile)
   };

   // useEffect(() => {
   //    console.log("there is a change in file ", initialFiles)
   // }, [initialFiles])

   const saveNewFile = () => {
      if (newFileName.trim() !== '') {
         const updatedFileName = "ntf~" + newFileName.trim()
         // setFiles([...files, updatedFileName]);
         updateFileList(updatedFileName)
         setNewFileName('');
         onFileSelect(updatedFileName)
         setIsAddNewFile(!isAddNewFile)
      }
   }

   const cancelAddingFile = () => {
      setNewFileName('')
      setIsAddNewFile(!isAddNewFile)
   }

   // Delete a file
   // const deleteFile = (index: number, e: React.MouseEvent<HTMLButtonElement, MouseEvent>, file: string) => {
   //    e.stopPropagation(); // Prevent triggering the parent onClick
   //    const updatedFiles = [...files];
   //    updatedFiles.splice(index, 1);
   //    setFiles(updatedFiles);
   //    localStorage.removeItem(file)
   // };

   return (
      <>
         {/* Sidebar Component */}
         <div
            id="default-sidebar"
            className={`relative inset-y-0 left-0 h-screen transition-transform ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
            aria-label="Sidebar"
         >
            <div className="h-full px-3 py-4 overflow-y-auto">
               <div>
                  <h1 className='text-3xl'> Though Ink </h1>
               </div>
               <div className="m-4 flex">
                  <button
                     onClick={isAddFile}
                     className="p-2 bg-gray-700 text-white rounded-lg"
                  >
                     Add New File
                  </button>
               </div>
               {/* Files list */}
               <div>
                  <ul className="space-y-2 font-medium">
                     {initialFiles.map((file, index) => (
                        <li key={index}>
                           <div
                              className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white 
                              hover:bg-gray-100 dark:hover:bg-gray-700 group 
                              ${file === currentFile && "bg-[#0F4C75] text-white self-start"}`}
                           >
                              <a
                                 href="#"
                                 className="flex items-center flex-grow"
                                 onClick={(e) => {
                                    e.preventDefault();
                                    onFileSelect(file);
                                 }}
                              >
                                 <span className="ms-3">{file.split("~")[1]}</span>
                              </a>
                              <button
                                 // onClick={(e) => deleteFile(index, e, file)}
                                 className="p-1 text-[#DCD7C9] hover:text-red-700"
                                 aria-label={`Delete ${file}`}
                              >
                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                 </svg>
                              </button>
                           </div>
                        </li>
                     ))}
                     {isAddNewFile && (
                        <li>
                           <div
                              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                           >
                              <input
                                 type="text"
                                 value={newFileName}
                                 onChange={(e) => setNewFileName(e.target.value)}
                                 //   onKeyDown={handleKeyPress}
                                 placeholder="Enter file name"
                                 className="ms-3 bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 w-full"
                                 autoFocus
                              />
                              <div className="flex">
                                 <button
                                    onClick={saveNewFile}
                                    className="p-1 text-[#DCD7C9] hover:text-green-700"
                                    aria-label="Save file"
                                 >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                       <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                 </button>
                                 <button
                                    onClick={cancelAddingFile}
                                    className="p-1 text-[#DCD7C9] hover:text-red-700"
                                    aria-label="Cancel"
                                 >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                       <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                 </button>
                              </div>
                           </div>
                        </li>
                     )}
                  </ul>
               </div>
            </div>
         </div>
      </>
   );
};

export default Sidebar;
