import React, { useState } from 'react';

//TODO decorate the side bar
const Sidebar = ({ initialFiles, onFileSelect }) => {
   // State for files and sidebar visibility
   // const initialFiles = ['file1', 'file2']
   const [files, setFiles] = useState(initialFiles);
   const [isVisible, setIsVisible] = useState(true);
   const [newFileName, setNewFileName] = useState('');
   const [isAddNewFile, setIsAddNewFile] = useState(false);

   // Toggle sidebar visibility
   // const toggleSidebar = () => {
   //    setIsVisible(!isVisible);
   // };

   // Add a new file
   const isAddFile = () => {
      console.log("button clicekd")
      setIsAddNewFile(!isAddNewFile)
   };

   const saveNewFile = () => {
       if (newFileName.trim() !== '') {
         setFiles([...files, newFileName.trim()]);
         setNewFileName('');
      }
      setIsAddNewFile(!isAddNewFile)
   }

   const cancelAddingFile = () => {
      setNewFileName('')
      setIsAddNewFile(!isAddNewFile)
   }

   // Delete a file
   const deleteFile = (index, e, file) => {
      e.stopPropagation(); // Prevent triggering the parent onClick
      const updatedFiles = [...files];
      updatedFiles.splice(index, 1);
      setFiles(updatedFiles);
      localStorage.removeItem(file)
   };

   return (
      <>
         {/* Sidebar Component */}
         <div
            id="default-sidebar"
            className={`relative inset-y-0 left-0 h-screen transition-transform ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
            aria-label="Sidebar"
         >
            <div className="h-full px-3 py-4 overflow-y-auto inset-ring bg-gray-50 dark:bg-gray-800">
               <div className="m-4 flex">
                  <h1>Note Taker</h1>
               </div>
               {/* Add file form */}
               <div className="m-4 flex">
                  <button
                     onClick={isAddFile}
                     className="p-2 bg-blue-600 text-white rounded-lg"
                  >
                     Add New File
                  </button>
               </div>

               {/* Files list */}
               <ul className="space-y-2 font-medium">
                  {files.map((file, index) => (
                     <li key={index}>
                        <div
                           className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                        >
                           <a
                              href="#"
                              className="flex items-center flex-grow"
                              onClick={(e) => {
                                 e.preventDefault();
                                 onFileSelect(file);
                              }}
                           >
                              <span className="ms-3">{file}</span>
                           </a>
                           <button
                              onClick={(e) => deleteFile(index, e, file)}
                              className="p-1 text-red-500 hover:text-red-700"
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
                                 className="p-1 text-green-500 hover:text-green-700"
                                 aria-label="Save file"
                              >
                                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                 </svg>
                              </button>
                              <button
                                  onClick={cancelAddingFile}
                                 className="p-1 text-red-500 hover:text-red-700"
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
      </>
   );
};

export default Sidebar;




// ${isVisible ? 'translate-x-0' : '-translate-x-full'}


{/* <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-30 p-2 bg-gray-800 text-white rounded-md"
            aria-label={isVisible ? "Hide Sidebar" : "Show Sidebar"}
         >
            {isVisible ? '←' : '→'}
         </button> */}
// <aside id="default-sidebar" className="fixed top-0 left-0 z-20 w-50 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
//    <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
//       <ul className="space-y-2 font-medium">
//          {files.map((file, index) =>
//             <li key={index}>
//                <a
//                   href="#"
//                   className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
//                   onClick={(e) => {
//                      e.preventDefault(); // Prevent the default behavior of the link (like scrolling to the top)
//                      onFileSelect(file); // Call the parent's method when the link is clicked
//                   }}
//                >
//                   <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
//                      <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
//                      <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
//                   </svg>
//                   <span className="ms-3">{file}</span>
//                </a>
//             </li>
//          )}
//       </ul>
//    </div>
// </aside>