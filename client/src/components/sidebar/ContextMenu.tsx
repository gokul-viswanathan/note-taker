import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@/stores/states';

type Props = {
    position: { x: number; y: number };
    item: any;
    onClose: () => void;
};

export function CustomContextMenu({ position, item, onClose }: Props) {
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);


    // Menu action handlers
    const createFolder = () => {
        console.log('Create Folder', item);
        // set folder creation state as true.
        useStore.getState().setIsCreateFolderOpen?.(true);
    };

    const createFile = () => {
        console.log('Create File');

    };

    const rename = () => {
        console.log('Renaming');

    };

    const handleDelete = () => {
        console.log('Delete action');

    };

    return (
        <div className="bg-blue-950">
            {/* Custom Context Menu */}
            <div
                ref={menuRef}
                className="fixed bg-blue-950 border border-gray-200 rounded-lg shadow-lg py-2 z-50 min-w-48"
                style={{
                    left: position.x,
                    top: position.y,
                }}
            >
                <button
                    onClick={createFolder}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Create Folder</span>
                </button>

                <button
                    onClick={createFile}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Create File</span>
                </button>

                <button
                    onClick={rename}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    <span>Rename File</span>
                </button>

                <hr className="my-1 border-gray-200" />

                <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center space-x-2"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span>Delete</span>
                </button>
            </div>
        </div>
    );
}

export default CustomContextMenu;
