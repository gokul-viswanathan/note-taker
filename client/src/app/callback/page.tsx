// src/pages/Callback.tsx

"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Github, CheckCircle, XCircle, AlertCircle, Loader2, ArrowRight, Home } from "lucide-react";
import getBaseUrl from "@/utils/baseURL";
import { useTheme } from "@/components/theme/ThemeProvider";

const Callback = () => {
    const [status, setStatus] = useState<string>("Authorizing with GitHub...");
    const [statusType, setStatusType] = useState<'loading' | 'success' | 'error'>('loading');
    const { darkMode, toggleTheme } = useTheme();
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (error) {
            setStatus(`Authorization failed: ${error.replace('_', ' ')}`);
            setStatusType('error');
            return;
        }

        if (!code) {
            setStatus("Missing authorization code from GitHub.");
            setStatusType('error');
            return;
        }

        // Update status to show we're processing
        setStatus("Exchanging code for access token...");

        const backendURL = getBaseUrl();
        fetch(`${backendURL}/v1/oauth/callback`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json();
                    setStatus("Authorization successful! Setting up your account...");
                    setStatusType('success');

                    // Store the actual response data instead of res.body
                    localStorage.setItem("github_auth", JSON.stringify(data));

                    // Show success message briefly before redirect
                    setTimeout(() => {
                        setStatus("Redirecting to your notepad...");
                        setTimeout(() => {
                            router.push("/notepad");
                        }, 1000);
                    }, 1500);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    setStatus(errorData.message || "Error completing authorization. Please try again.");
                    setStatusType('error');
                }
            })
            .catch(() => {
                setStatus("Network error. Please check your connection and try again.");
                setStatusType('error');
            });
    }, []);

    const getStatusIcon = () => {
        switch (statusType) {
            case 'loading':
                return <Loader2 className="w-12 h-12 animate-spin text-blue-500" />;
            case 'success':
                return <CheckCircle className="w-12 h-12 text-green-500" />;
            case 'error':
                return <XCircle className="w-12 h-12 text-red-500" />;
            default:
                return <AlertCircle className="w-12 h-12 text-yellow-500" />;
        }
    };

    const getStatusColor = () => {
        switch (statusType) {
            case 'loading':
                return darkMode ? 'text-blue-400' : 'text-blue-600';
            case 'success':
                return darkMode ? 'text-green-400' : 'text-green-600';
            case 'error':
                return darkMode ? 'text-red-400' : 'text-red-600';
            default:
                return darkMode ? 'text-yellow-400' : 'text-yellow-600';
        }
    };

    const handleRetry = () => {
        router.push('/notepad'); // or wherever your auth page is
    };

    const handleGoHome = () => {
        router.push('/'); // or your landing page
    };

    return (
        <div className={`min-h-screen transition-all duration-500 ${darkMode
            ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
            : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
            }`}>
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className={`max-w-md w-full p-8 rounded-3xl transition-all duration-500 ${darkMode
                    ? 'bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-gray-900/20'
                    : 'bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-gray-900/10'
                    }`}>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex p-4 rounded-full mb-4 ${darkMode
                            ? 'bg-gradient-to-r from-gray-700 to-gray-600'
                            : 'bg-gradient-to-r from-gray-800 to-gray-900'
                            } shadow-lg`}>
                            <Github className="w-8 h-8 text-white" />
                        </div>
                        <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                            GitHub Authentication
                        </h1>
                    </div>

                    {/* Status Section */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            {getStatusIcon()}
                        </div>

                        <p className={`text-lg font-medium mb-2 ${getStatusColor()}`}>
                            {statusType === 'loading' && 'Processing...'}
                            {statusType === 'success' && 'Success!'}
                            {statusType === 'error' && 'Something went wrong'}
                        </p>

                        <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                            {status}
                        </p>
                    </div>

                    {/* Progress Steps (only show during loading) */}
                    {statusType === 'loading' && (
                        <div className={`mb-8 p-4 rounded-xl ${darkMode
                            ? 'bg-gray-700/30 border border-gray-600/30'
                            : 'bg-gray-50/70 border border-gray-200/50'
                            }`}>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Received authorization code
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Loader2 className="w-2 h-2 animate-spin text-blue-500" />
                                    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        Verifying with GitHub...
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {statusType === 'success' && (
                        <div className={`mb-6 p-4 rounded-xl ${darkMode
                            ? 'bg-green-900/20 border border-green-800/30'
                            : 'bg-green-50/70 border border-green-200/50'
                            }`}>
                            <div className="flex items-center space-x-3">
                                <ArrowRight className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                                <div>
                                    <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                                        You're all set!
                                    </p>
                                    <p className={`text-xs mt-1 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                                        Taking you to your notepad in a moment...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Actions */}
                    {statusType === 'error' && (
                        <div className="space-y-3">
                            <button
                                onClick={handleRetry}
                                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center space-x-2 ${darkMode
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/30'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-900/25'
                                    }`}
                            >
                                <Github className="w-4 h-4" />
                                <span>Try Again</span>
                            </button>

                            <button
                                onClick={handleGoHome}
                                className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${darkMode
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                            >
                                <Home className="w-4 h-4" />
                                <span>Go Home</span>
                            </button>
                        </div>
                    )}

                    {/* Loading indicator for success state */}
                    {statusType === 'success' && status.includes('Redirecting') && (
                        <div className="text-center">
                            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full ${darkMode
                                ? 'bg-gray-700/50 text-gray-300'
                                : 'bg-gray-100/70 text-gray-600'
                                }`}>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Redirecting...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-1/4 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl ${darkMode
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-gradient-to-r from-blue-400 to-purple-400'
                    }`}></div>
                <div className={`absolute bottom-1/4 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl ${darkMode
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                    : 'bg-gradient-to-r from-purple-400 to-pink-400'
                    }`}></div>
            </div>
        </div>
    );
};

export default Callback;
