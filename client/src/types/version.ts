export interface FileVersionAuthor {
  name?: string;
  email?: string;
  date?: string;
}

export interface FileVersionEntry {
  sha: string;
  message: string;
  author?: string | FileVersionAuthor;
  date?: string;
}

export type VersionPreviewMode = "history" | "diff" | null;

export interface DiffSegment {
  type: "added" | "removed" | "unchanged";
  value: string;
}
