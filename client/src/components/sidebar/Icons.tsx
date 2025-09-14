import { Folder, FolderOpen, File, ChevronRight, Check, X } from 'lucide-react';

// FolderIcon: Switches between Folder and FolderOpen based on isOpen prop
const FolderIcon = ({ isOpen }: { isOpen?: boolean }) => (
    isOpen ? (
        <FolderOpen className="w-4 h-4 mr-2" color="currentColor" />
    ) : (
        <Folder className="w-4 h-4 mr-2" color="currentColor" />
    )
);

// FileIcon: Returns a generic File icon (customizable based on fileName if needed)
const FileIcon = ({ fileName }: { fileName: string }) => {
    const getFileIcon = (name: string) => {
        // You can extend this logic to return different Lucide icons based on fileName
        // For example, FileText for .txt, FileCode for .js/.ts, etc.
        return <File className="w-4 h-4 mr-2 text-gray-400" color="currentColor" />;
    };
    return getFileIcon(fileName);
};

// ChevronIcon: Rotates based on isOpen prop
const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <ChevronRight
        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        color="currentColor"
    />
);

// RightIcon: Maps to Lucide's Check icon (closest match for a "right" action)
const RightIcon = () => (
    <Check size={30} color="currentColor" strokeWidth={1.5} />
);

// CancelIcon: Maps to Lucide's X icon
const CancelIcon = () => (
    <X size={30} color="currentColor" strokeWidth={1.5} />
);

export { FolderIcon, FileIcon, ChevronIcon, RightIcon, CancelIcon };

