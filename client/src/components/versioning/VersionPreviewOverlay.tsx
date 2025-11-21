import React from "react";
import { Button } from "@/components/ui/button";
import {
  FileVersionEntry,
  DiffSegment,
  VersionPreviewMode,
} from "@/types/version";

interface VersionPreviewOverlayProps {
  visible: boolean;
  mode: VersionPreviewMode;
  version?: FileVersionEntry | null;
  content: string;
  isLoading: boolean;
  onClose: () => void;
  onShowDiff: () => void;
  onExitDiff: () => void;
  diffSegments: DiffSegment[];
  canShowDiff: boolean;
}

const DiffList = ({ segments }: { segments: DiffSegment[] }) => {
  if (!segments.length) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Nothing to compare yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto rounded-md border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <ul className="divide-y divide-gray-100 text-sm font-mono dark:divide-gray-800">
        {segments.map((segment, index) => (
          <li
            key={`${segment.type}-${index}`}
            className={`whitespace-pre-wrap px-3 py-1 ${
              segment.type === "added"
                ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                : segment.type === "removed"
                  ? "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  : "text-gray-800 dark:text-gray-100"
            }`}
          >
            <span className="mr-2 text-xs opacity-70">
              {segment.type === "added"
                ? "+"
                : segment.type === "removed"
                  ? "-"
                  : " "}
            </span>
            {segment.value || " "}
          </li>
        ))}
      </ul>
    </div>
  );
};

const getAuthorName = (version?: FileVersionEntry | null) => {
  if (!version?.author) return "Unknown author";
  if (typeof version.author === "string") return version.author;
  return version.author.name || version.author.email || "Unknown author";
};

const getVersionDate = (version?: FileVersionEntry | null) => {
  if (!version) return undefined;
  if (version.date) return version.date;
  if (version.author && typeof version.author !== "string") {
    return version.author.date;
  }
  return undefined;
};

const VersionPreviewOverlay: React.FC<VersionPreviewOverlayProps> = ({
  visible,
  mode,
  version,
  content,
  isLoading,
  onClose,
  onShowDiff,
  onExitDiff,
  diffSegments,
  canShowDiff,
}) => {
  if (!visible) return null;

  const versionDate = getVersionDate(version);

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-white/95 backdrop-blur dark:bg-gray-900/95">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
          <p className="text-lg font-semibold">
            {mode === "diff" ? "Diff View" : "Version Preview"}
          </p>
          {version && (
            <div className="text-xs text-gray-600 dark:text-gray-300">
              <p>{version.message}</p>
              <p className="flex space-x-2 truncate">
                <span>{getAuthorName(version)}</span>
                <span>•</span>
                <span>{version.sha?.slice(0, 7)}</span>
                {versionDate && (
                  <>
                    <span>•</span>
                    <span>
                      {new Date(versionDate).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
        <div className="space-x-2">
          {mode === "diff" ? (
            <Button variant="secondary" onClick={onExitDiff}>
              Exit Diff
            </Button>
          ) : (
            <Button onClick={onShowDiff} disabled={!canShowDiff}>
              View Diff
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
            Loading version...
          </div>
        ) : mode === "diff" ? (
          <DiffList segments={diffSegments} />
        ) : (
          <div className="flex-1 overflow-auto rounded-md border border-gray-200 bg-white p-4 font-mono text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200">
            {content ? (
              <pre className="whitespace-pre-wrap">{content}</pre>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No content available for this version
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionPreviewOverlay;
