export interface GitFileItem {
    name: string;
    path: string;
    sha?: string;
    type: "file" | "dir"; // "dir" if folders are also possible
    url?: string;
}

export interface FileItem extends GitFileItem {
    children?: FileItem[]; // For directories, contains subdirectories and files
}

