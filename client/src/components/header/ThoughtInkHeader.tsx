"use client"
import React, { useState, useEffect } from 'react';
import {
    Menu,
    Github,
    Save,
    Upload,
    Sun,
    Moon,
    CheckCircle2,
    AlertCircle,
    Loader2
} from 'lucide-react';
import PathStyle from '@/services/pathStyle';
// Types for better TypeScript support
type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'push-ready';
type GitHubStatus = 'connected' | 'disconnected' | 'syncing';

interface ThoughtInkHeaderProps {
    currentFile?: string;
    showFileSideBar: boolean;
    showAiSideBar: boolean;
    darkMode: boolean;
    saveStatus?: SaveStatus;
    githubStatus?: GitHubStatus;
    onToggleFileSideBar: () => void;
    onToggleAiSideBar: () => void;
    onToggleTheme: () => void;
    onPushToRepo: () => void;
}

// Status indicator components
const SaveStatusIndicator: React.FC<{ status: SaveStatus }> = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case 'saved':
                return {
                    icon: CheckCircle2,
                    text: 'All changes saved',
                    className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
                };
            case 'saving':
                return {
                    icon: Loader2,
                    text: 'Saving changes...',
                    className: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
                    animate: true
                };
            case 'unsaved':
                return {
                    icon: AlertCircle,
                    text: 'Unsaved changes',
                    className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800'
                };
            case 'push-ready':
                return {
                    icon: Upload,
                    text: 'Ready to push',
                    className: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                };
            default:
                return {
                    icon: Save,
                    text: 'Unknown status',
                    className: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700'
                };
        }
    };

    const { icon: Icon, text, className, animate } = getStatusConfig();

    return (
        <div className={`flex items-center px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${className}`}>
            <Icon className={`w-4 h-4 mr-2 ${animate ? 'animate-spin' : ''}`} />
            {text}
        </div>
    );
};

// Toggle button component
const ToggleButton: React.FC<{
    icon: React.ComponentType<any>;
    isActive: boolean;
    onClick: () => void;
    tooltip?: string;
}> = ({ icon: Icon, isActive, onClick, tooltip }) => (
    <button
        onClick={onClick}
        title={tooltip}
        className={`p-2.5 rounded-lg transition-all duration-200 hover:scale-105 ${isActive
            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 shadow-md'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
    >
        <Icon className="w-5 h-5" />
    </button>
);

// Action button component
const ActionButton: React.FC<{
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
}> = ({ children, onClick, variant = 'secondary', disabled = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${variant === 'primary'
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
    >
        {children}
    </button>
);

// Main header component
const ThoughtInkHeader: React.FC<ThoughtInkHeaderProps> = ({
    currentFile = 'untitled.md',
    showFileSideBar,
    showAiSideBar,
    darkMode,
    saveStatus = 'saved',
    onToggleFileSideBar,
    onToggleAiSideBar,
    onToggleTheme,
    onPushToRepo
}) => {
    return (
        <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
            {/* Left Section - Navigation & Branding */}
            <div className="flex items-center space-x-4">
                <ToggleButton
                    icon={Menu}
                    isActive={showFileSideBar}
                    onClick={onToggleFileSideBar}
                    tooltip={`${showFileSideBar ? 'Hide' : 'Show'} file sidebar`}
                />

                <div className="flex items-center space-x-3">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">TI</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Center Section - Status Indicators */}
            <div className="hidden md:flex items-center space-x-3">
                {/* File breadcrumb */}
                <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                        <PathStyle path={currentFile} />
                    </span>
                </div>

                {/*
                <SaveStatusIndicator status={saveStatus} />
*/}
            </div>

            {/* Right Section - Actions & Toggles */}
            <div className="flex items-center space-x-3">
                {/* Action Buttons */}
                <div className="hidden sm:flex items-center space-x-2">
                    <ActionButton onClick={onPushToRepo} variant="primary">
                        <Upload className="w-4 h-4 mr-2" />
                        Push to Repo
                    </ActionButton>
                </div>

                {/* Toggle Buttons */}
                <div className="flex items-center space-x-2">
                    {/* <ToggleButton
                        icon={Bot}
                        isActive={showAiSideBar}
                        onClick={onToggleAiSideBar}
                        tooltip={`${showAiSideBar ? 'Hide' : 'Show'} AI assistant`}
                    /> */}

                    <ToggleButton
                        icon={darkMode ? Sun : Moon}
                        isActive={false}
                        onClick={onToggleTheme}
                        tooltip={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ThoughtInkHeader
