const FolderIcon = ({ isOpen }: { isOpen?: boolean }) => (
    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
        {isOpen ? (
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        ) : (
            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        )}
    </svg>
);

const FileIcon = ({ fileName }: { fileName: string }) => {
    const getFileIcon = (name: string) => {
        return (
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 2h8v2H6V5zm0 4h8v2H6V9zm0 4h4v2H6v-2z" />
            </svg>
        );
    };

    return getFileIcon(fileName);
};

const ChevronIcon = ({ isOpen }: { isOpen: boolean }) => (
    <svg
        className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
    >
        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
);

export { FolderIcon, FileIcon, ChevronIcon }
