"use client";
import React from "react";
import { Sun, Moon, HamburgerIcon } from "lucide-react";
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

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <HamburgerIcon
          onClick={onToggleFileSidebar}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        />
        <div className="text-lg font-semibold">ThoughtInk</div>
      </div>

      {/* Center Section */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {formatPath(currentFile)}
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onPushToRepo}
          className="px-3 py-1 bg-blue-500 text-white rounded"
        >
          Push
        </button>
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
