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
      className="min-h-screen transition-all duration-500 bg-background"
    >
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 rounded-full transition-all duration-300 hover:scale-110 z-10 bg-muted text-accent-foreground hover:bg-muted/80 shadow-lg"
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
                  className="text-4xl font-bold text-foreground"
                >
                  ThoughtInk
                </h1>
              </div>

              <h2
                className="text-3xl lg:text-4xl font-bold leading-tight text-foreground"
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
                className="text-lg text-muted-foreground"
              >
                Connect with GitHub to unlock powerful features and keep your
                notes synchronized across all your devices.
              </p>
            </div>
          </div>

          {/* Right Side - Auth Card */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="w-full max-w-md p-8 rounded-3xl transition-all duration-500 bg-card/80 backdrop-blur-xl border border-border/50 shadow-2xl"
            >
              {/* GitHub Logo */}
              <div className="text-center mb-8">
                <div
                  className="inline-flex p-4 rounded-full mb-4 bg-primary shadow-lg"
                >
                  <Github className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3
                  className="text-2xl font-bold mb-2 text-foreground"
                >
                  Connect with GitHub
                </h3>
                <p
                  className="text-muted-foreground"
                >
                  Sign in securely to get started
                </p>
              </div>

              {/* Auth Button */}
              <button
                onClick={handleGitHubAuth}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-semibold text-primary-foreground transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:opacity-70 flex items-center justify-center space-x-3 bg-primary hover:bg-primary/90 shadow-lg"
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
                className="mt-6 p-4 rounded-xl bg-muted/30 border border-border/50"
              >
                <div className="flex items-start space-x-3">
                  <Shield
                    className="w-5 h-5 mt-0.5 text-accent-foreground"
                  />
                  <div>
                    <p
                      className="text-sm font-medium text-foreground"
                    >
                      Secure Authentication
                    </p>
                    <p
                      className="text-xs mt-1 text-muted-foreground"
                    >
                      We only request minimal permissions needed to sync your
                      notes. Your data stays private and secure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <p
                className="text-center text-xs mt-6 text-muted-foreground"
              >
                By continuing, you agree to our{" "}
                <a
                  href="#"
                  className="underline hover:no-underline text-primary"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="underline hover:no-underline text-primary"
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
