import React from 'react';

const aiSideBar = () => {


    return (
        <>
         {/* Sidebar Component */}
         <div
            id="default-sidebar"
            className={`relative inset-y-0 left-0 h-screen transition-transform`}
            aria-label="Sidebar"
         >
            <div className="h-full px-3 py-4 overflow-y-auto inset-ring bg-gray-50 dark:bg-gray-800">
               {/* Add file form */}
               <div className="mb-4 flex">
               </div>
            </div>
         </div>
      </>
    )
}

export default aiSideBar