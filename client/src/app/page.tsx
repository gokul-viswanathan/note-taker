"use client"
import React, { useState, useEffect } from 'react';
import { Moon, Sun, Github, FileText, GitBranch, Shield, Zap, Clock, Brain, Sparkles, ArrowRight, Star } from 'lucide-react';

const ThoughtInkLanding = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [isVisible, setIsVisible] = useState({});

    useEffect(() => {
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const features = [
        {
            icon: <Github className="w-8 h-8" />,
            title: "GitHub-Powered Storage",
            description: "Your notes live in your own GitHub repository. Complete data ownership and security.",
            highlight: true
        },
        {
            icon: <GitBranch className="w-8 h-8" />,
            title: "Version Control Magic",
            description: "Every change tracked. Never lose a brilliant thought or accidental edit.",
            highlight: true
        },
        {
            icon: <FileText className="w-8 h-8" />,
            title: "Rich Note Features",
            description: "Text, bullets, numbers, links - all the essentials for capturing your ideas.",
            highlight: false
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Your Data, Your Rules",
            description: "No vendor lock-in. Your notes are stored in standard markdown in your repo.",
            highlight: false
        }
    ];

    const upcomingFeatures = [
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Time Travel Through Notes",
            description: "Browse and restore any version of your notes with a beautiful timeline interface."
        },
        {
            icon: <Brain className="w-6 h-6" />,
            title: "AI Integration",
            description: "Connect any LLM to enhance your notes with smart suggestions and insights."
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-all duration-500">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-50 border-b border-gray-200/50 dark:border-slate-700/50">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">TI</span>
                        </div>
                        <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Thought Ink
                        </span>
                    </div>

                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 hover:scale-105"
                    >
                        {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-24 pb-16 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left space-y-8">
                            <div className="space-y-4">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Version controlled note-taking
                                </div>
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                                    Your thoughts,
                                    <span className="block bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        Git-powered
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                                    Take notes with the security of GitHub storage and the power of version control.
                                    Every thought tracked, every edit remembered, every idea safe.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center">
                                    Start Writing
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </button>
                                <button className="px-8 py-4 border-2 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 flex items-center justify-center">
                                    <Github className="w-5 h-5 mr-2" />
                                    Connect GitHub
                                </button>
                            </div>
                        </div>

                        {/* Hero Animation */}
                        <div className="relative">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center space-x-2 mb-4">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">my-notes.md</div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="text-purple-600 dark:text-purple-400"># Project Ideas</div>
                                    <div className="text-gray-700 dark:text-gray-300">- Build a note-taking app</div>
                                    <div className="text-gray-700 dark:text-gray-300">- Integrate with GitHub ✨</div>
                                    <div className="text-gray-700 dark:text-gray-300">- Add version control</div>
                                    <div className="text-green-600 dark:text-green-400 animate-pulse">+ Adding new idea...</div>
                                </div>
                            </div>

                            {/* Floating Git Icons */}
                            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center animate-bounce">
                                <GitBranch className="w-4 h-4 text-white" />
                            </div>
                            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center" style={{ animation: 'bounce 2s infinite 1s' }}>
                                <Github className="w-4 h-4 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 px-4 sm:px-6 bg-white/50 dark:bg-slate-800/50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            Why developers ❤️ Thought Ink
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Combining the best of note-taking with the power of Git. Your thoughts deserve the same care as your code.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`group p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 ${feature.highlight
                                    ? 'bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 shadow-lg'
                                    : 'bg-white dark:bg-slate-800 shadow-md'
                                    } hover:shadow-xl`}
                            >
                                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-4 ${feature.highlight
                                    ? 'bg-gradient-to-br from-purple-500 to-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300'
                                    } group-hover:scale-110 transition-transform duration-200`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Current Status */}
                    <div className="mt-12 p-6 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl">
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                            <span className="text-green-700 dark:text-green-300 font-semibold">Currently Available</span>
                        </div>
                        <p className="text-center text-green-700 dark:text-green-300">
                            ✨ GitHub sync is live! Connect your repository and start taking version-controlled notes today.
                        </p>
                    </div>
                </div>
            </section>

            {/* Upcoming Features */}
            <section className="py-16 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
                            <Star className="w-4 h-4 mr-2" />
                            Coming Soon
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            The future of note-taking
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            We're building features that will revolutionize how you interact with your thoughts.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {upcomingFeatures.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-blue-200 dark:border-blue-800"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4 text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                                <div className="mt-4 text-sm text-blue-600 dark:text-blue-400 font-medium">
                                    Next Release 🚀
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 sm:px-6 bg-gradient-to-r from-purple-600 to-blue-600">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to version control your thoughts?
                    </h2>
                    <p className="text-xl mb-8 text-purple-100">
                        Join developers who are already taking smarter, safer notes with GitHub integration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg">
                            Get Started Free
                        </button>
                        <button className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-200 flex items-center justify-center">
                            <Github className="w-5 h-5 mr-2" />
                            View on GitHub
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 sm:px-6 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-xs">TI</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">Thought Ink</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                        Built with 💜 for developers who think in Git
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ThoughtInkLanding;
