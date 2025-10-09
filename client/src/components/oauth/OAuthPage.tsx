import React, { useState } from "react";
import { Github, Shield, Moon, Sun, Sparkles } from "lucide-react";
import { useTheme } from "../theme/ThemeProvider";
import githubAuth from "@/services/oauth";

const GitHubAuthPage = () => {
  const { darkMode, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handleGitHubAuth = () => {
    setIsLoading(true);
    // Simulate auth process - replace with actual GitHub OAuth
    setTimeout(() => {
      // Replace with actual OAuth redirect
      githubAuth();
    }, 1000);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 ${
          darkMode
            ? "bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg shadow-gray-900/20"
            : "bg-white text-gray-600 hover:bg-gray-50 shadow-lg shadow-gray-200/50"
        }`}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 rounded-2xl ${
                    darkMode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  } shadow-lg`}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1
                  className={`text-4xl font-bold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  ThoughtInk
                </h1>
              </div>

              <h2
                className={`text-3xl lg:text-4xl font-bold leading-tight ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome to the future of{" "}
                <span
                  className={`${
                    darkMode
                      ? "bg-gradient-to-r from-purple-400 to-blue-400"
                      : "bg-gradient-to-r from-blue-600 to-purple-600"
                  } bg-clip-text text-transparent`}
                >
                  note-taking
                </span>
              </h2>

              <p
                className={`text-lg ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Connect with GitHub to unlock powerful features and keep your
                notes synchronized across all your devices.
              </p>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="flex justify-center lg:justify-end">
            <div
              className={`w-full max-w-md p-8 rounded-3xl transition-all duration-500 ${
                darkMode
                  ? "bg-gray-800/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-gray-900/20"
                  : "bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-2xl shadow-gray-900/10"
              }`}
            >
              {/* GitHub Logo */}
              <div className="text-center mb-8">
                <div
                  className={`inline-flex p-4 rounded-full mb-4 ${
                    darkMode
                      ? "bg-gradient-to-r from-gray-700 to-gray-600"
                      : "bg-gradient-to-r from-gray-800 to-gray-900"
                  } shadow-lg`}
                >
                  <Github className="w-12 h-12 text-white" />
                </div>
                <h3
                  className={`text-2xl font-bold mb-2 ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Connect with GitHub
                </h3>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Sign in securely to get started
                </p>
              </div>

              {/* Auth Button */}
              <button
                onClick={handleGitHubAuth}
                disabled={isLoading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-70 flex items-center justify-center space-x-3 ${
                  darkMode
                    ? "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 shadow-lg shadow-gray-900/30"
                    : "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 shadow-lg shadow-gray-900/25"
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    <span>Continue with GitHub</span>
                  </>
                )}
              </button>

              {/* Security Note */}
              <div
                className={`mt-6 p-4 rounded-xl ${
                  darkMode
                    ? "bg-gray-700/30 border border-gray-600/30"
                    : "bg-gray-50/70 border border-gray-200/50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Shield
                    className={`w-5 h-5 mt-0.5 ${
                      darkMode ? "text-green-400" : "text-green-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Secure Authentication
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      We only request minimal permissions needed to sync your
                      notes. Your data stays private and secure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p
                className={`text-center text-xs mt-6 ${
                  darkMode ? "text-gray-500" : "text-gray-500"
                }`}
              >
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className={`underline hover:no-underline ${
                    darkMode ? "text-purple-400" : "text-blue-600"
                  }`}
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className={`underline hover:no-underline ${
                    darkMode ? "text-purple-400" : "text-blue-600"
                  }`}
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute top-1/4 -left-20 w-72 h-72 rounded-full opacity-20 blur-3xl ${
            darkMode
              ? "bg-gradient-to-r from-purple-600 to-blue-600"
              : "bg-gradient-to-r from-blue-400 to-purple-400"
          }`}
        ></div>
        <div
          className={`absolute bottom-1/4 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl ${
            darkMode
              ? "bg-gradient-to-r from-blue-600 to-purple-600"
              : "bg-gradient-to-r from-purple-400 to-pink-400"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default GitHubAuthPage;
