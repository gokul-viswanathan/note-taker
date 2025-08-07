export interface GitFileItem {
    name: string;
    path: string;
    sha?: string;
    type: "file" | "dir"; // "dir" if folders are also possible
    url?: string;
}
