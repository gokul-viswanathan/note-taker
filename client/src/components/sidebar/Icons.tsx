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


const RightIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        viewBox="0 0 24 24"
    >
        <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M21.86 5.392c.428 1.104-.171 1.86-1.33 2.606c-.935.6-2.126 1.252-3.388 2.365c-1.238 1.091-2.445 2.406-3.518 3.7a55 55 0 0 0-2.62 3.437c-.414.591-.993 1.473-.993 1.473A2.25 2.25 0 0 1 8.082 20a2.24 2.24 0 0 1-1.9-1.075c-.999-1.677-1.769-2.34-2.123-2.577C3.112 15.71 2 15.618 2 14.134C2 12.955 2.995 12 4.222 12c.867.032 1.672.373 2.386.853c.456.306.939.712 1.441 1.245a58 58 0 0 1 2.098-2.693c1.157-1.395 2.523-2.892 3.988-4.184c1.44-1.27 3.105-2.459 4.87-3.087c1.15-.41 2.429.153 2.856 1.258"
            color="currentColor"
        />
    </svg>
);

const CancelIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        viewBox="0 0 24 24"
    >
        <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            d="M18 6L6 18M6 6l12 12"
            color="currentColor"
        />
    </svg>
);

export { FolderIcon, FileIcon, ChevronIcon, RightIcon, CancelIcon };
