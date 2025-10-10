"use client";
import { Sun, Moon, Menu, Loader, GitBranch } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useStore } from "@/stores/states";

interface ThoughtInkHeaderProps {
  currentFile?: string;
  darkMode: boolean;
  onToggleTheme: () => void;
  onPushToRepo: () => void;
  onToggleFileSidebar: () => void;
}

// Main header component
const ThoughtInkHeader: React.FC<ThoughtInkHeaderProps> = ({
  currentFile = "untitled.md",
  darkMode,
  onToggleTheme,
  onPushToRepo,
  onToggleFileSidebar,
}) => {
  const formatPath = (path: string) => {
    if (!path) return "No file selected";
    const parts = path.split("/");
    if (parts.length <= 1) return path;
    const folder = parts.slice(0, -1).join("/");
    const file = parts[parts.length - 1];
    return `${folder}/${file}`;
  };

  const isMobile = useIsMobile();
  const isPushingNoteToGithub = useStore((state) => state.saveFile);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <Menu
          onClick={onToggleFileSidebar}
          className="p-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
        />
        {isMobile ? (
          <div className="text-lg font-semibold">T I</div>
        ) : (
          <div className="text-lg font-semibold">Thought Ink</div>
        )}
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-2 text-sm">
        {/* Path Display */}
        <div className="group relative">
          <span className="text-gray-600 dark:text-gray-400 truncate max-w-[200px] md:max-w-md inline-block">
            <span className="hidden md:inline">{formatPath(currentFile)}</span>
            <span className="md:hidden">
              {currentFile?.split("/").pop() || ""}
            </span>
          </span>
          {/* Tooltip for full path on hover */}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block bg-gray-900 dark:bg-gray-700 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
            {formatPath(currentFile)}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={onPushToRepo}
          disabled={isPushingNoteToGithub}
          className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          {isPushingNoteToGithub ? (
            <>
              <Loader className="animate-spin w-4 h-4" />
              <span>Pushing...</span>
            </>
          ) : (
            <>
              <GitBranch className="w-4 h-4" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>

      {/* Center Section 
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {formatPath(currentFile)}
        <button
          onClick={onPushToRepo}
          disabled={isPushingNoteToGithub}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          {isPushingNoteToGithub ? (
            <>
              <Loader className="animate-spin w-4 h-4" />
              <span>Pushing...</span>
            </>
          ) : (
            "Save"
          )}
        </button>
      </div> */}

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <button onClick={onToggleTheme} className="p-1">
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ThoughtInkHeader;
