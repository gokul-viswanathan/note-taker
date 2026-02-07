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
      <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
        Nothing to compare yet
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto rounded-md border border-border bg-card">
      <ul className="divide-y divide-border text-sm font-mono">
        {segments.map((segment, index) => (
          <li
            key={`${segment.type}-${index}`}
            className={`whitespace-pre-wrap px-3 py-1 ${
              segment.type === "added"
                ? "bg-accent/10 text-accent-foreground"
                : segment.type === "removed"
                  ? "bg-destructive/10 text-destructive"
                  : "text-foreground"
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
    <div className="absolute inset-0 z-20 flex flex-col bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <p className="text-lg font-semibold">
            {mode === "diff" ? "Diff View" : "Version Preview"}
          </p>
          {version && (
            <div className="text-xs text-muted-foreground">
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
          <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
            Loading version...
          </div>
        ) : mode === "diff" ? (
          <DiffList segments={diffSegments} />
        ) : (
          <div className="flex-1 overflow-auto rounded-md border border-border bg-card p-4 font-mono text-sm text-foreground">
            {content ? (
              <pre className="whitespace-pre-wrap">{content}</pre>
            ) : (
              <p className="text-center text-muted-foreground">
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
