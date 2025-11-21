import React from "react";
import { GitCommit, RefreshCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileVersionEntry } from "@/types/version";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface FileVersionTimelineProps {
  open: boolean;
  versions: FileVersionEntry[];
  loading: boolean;
  error?: string | null;
  onRefresh: () => void;
  onClose: () => void;
  onViewVersion: (version: FileVersionEntry) => void;
  selectedVersion?: FileVersionEntry | null;
  currentFilePath?: string;
}

const EmptyState = ({
  loading,
  currentFilePath,
}: {
  loading: boolean;
  currentFilePath?: string;
}) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Loading history...
      </div>
    );
  }

  if (!currentFilePath) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
        Select a file to view version history
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-center text-sm text-gray-500 dark:text-gray-400">
      No versions available yet
    </div>
  );
};

const VersionList = ({
  versions,
  onViewVersion,
  loading,
  selectedVersion,
  currentFilePath,
}: {
  versions: FileVersionEntry[];
  loading: boolean;
  selectedVersion?: FileVersionEntry | null;
  onViewVersion: (version: FileVersionEntry) => void;
  currentFilePath?: string;
}) => {
  const getAuthorName = (version: FileVersionEntry) => {
    if (!version.author) return "Unknown author";
    if (typeof version.author === "string") return version.author;
    return version.author.name || version.author.email || "Unknown author";
  };

  const getVersionDate = (version: FileVersionEntry) => {
    if (version.date) return version.date;
    if (version.author && typeof version.author !== "string") {
      return version.author.date;
    }
    return undefined;
  };

  if (!versions.length) {
    return <EmptyState loading={loading} currentFilePath={currentFilePath} />;
  }

  return (
    <ScrollArea className="h-full pr-2">
      <ul className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" />
        {versions.map((version) => {
          const isActive = selectedVersion?.sha === version.sha;
          const versionDate = getVersionDate(version);
          return (
            <li key={version.sha} className="relative pb-6 last:pb-0">
              <span
                className={`absolute left-0 top-2 flex h-3 w-3 items-center justify-center rounded-full border-2 ${isActive ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white dark:bg-gray-900"}`}
              />
              <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm transition hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {version.message || "No message"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {getAuthorName(version)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={isActive ? "default" : "secondary"}
                    onClick={() => onViewVersion(version)}
                  >
                    View
                  </Button>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span
                    className="truncate"
                    title={version.sha}
                  >{`${version.sha?.slice(0, 7) || "N/A"}`}</span>
                  {versionDate && (
                    <span>
                      {new Date(versionDate).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </ScrollArea>
  );
};

const PanelContent = ({
  versions,
  loading,
  error,
  onRefresh,
  onClose,
  onViewVersion,
  selectedVersion,
  currentFilePath,
}: FileVersionTimelineProps) => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center space-x-2">
          <GitCommit className="h-4 w-4" />
          <h2 className="text-sm font-semibold uppercase tracking-wide">
            Version History
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={loading}
            title="Refresh history"
          >
            <RefreshCcw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error ? (
        <div className="flex flex-1 items-center justify-center px-4 text-center text-sm text-red-500">
          {error}
        </div>
      ) : (
        <div className="flex-1 p-4">
          <VersionList
            versions={versions}
            loading={loading}
            onViewVersion={onViewVersion}
            selectedVersion={selectedVersion}
            currentFilePath={currentFilePath}
          />
        </div>
      )}
    </div>
  );
};

const FileVersionTimeline: React.FC<FileVersionTimelineProps> = (props) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet
        open={props.open}
        onOpenChange={(open) => !open && props.onClose()}
      >
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>Version History</SheetTitle>
          </SheetHeader>
          <div className="h-full p-4 pt-2">
            <PanelContent {...props} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside
      className={`border-l bg-background transition-all duration-300 ease-in-out ${props.open ? "w-96" : "w-0"} overflow-hidden`}
    >
      {props.open && <PanelContent {...props} />}
    </aside>
  );
};

export default FileVersionTimeline;
