"use client";

import { useState, useEffect } from "react";
import { generatePrompt, refinePrompt } from "./api";

// Define the type for prompt history items
interface PromptHistoryItem {
  prompt: string;
  result: string;
  timestamp: number;
  isExpanded?: boolean;
}

// Animation helper components
const FadeIn = ({ delay = 0, children }: { delay?: number; children: React.ReactNode }) => {
  return (
    <div
      className="animate-fade-in"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
};

const SlideUp = ({ delay = 0, children }: { delay?: number; children: React.ReactNode }) => {
  return (
    <div
      className="animate-slide-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
};

// Theme Toggle Component
const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Initialize theme from localStorage on client-side only
  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    if (storedTheme === 'light' || storedTheme === 'dark') {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    }
  }, []);

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        // Moon icon for dark mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
};

// Generate Button Component
const GenerateButton = ({
  onClick,
  isGenerating,
  disabled = false
}: {
  onClick: () => void;
  isGenerating: boolean;
  disabled?: boolean;
}) => {
  return (
    <button
      className="w-full px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium transition-all duration-300 hover:bg-indigo-500 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      onClick={onClick}
      disabled={disabled || isGenerating}
    >
      {isGenerating ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Generating...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate
        </>
      )}
    </button>
  );
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [isRefining, setIsRefining] = useState(false);
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [activeView, setActiveView] = useState<'input' | 'output'>('input');
  const [showHistory, setShowHistory] = useState(false);
  const [promptHistory, setPromptHistory] = useState<PromptHistoryItem[]>([]);
  const [showTips, setShowTips] = useState(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load prompt history from localStorage on initial load
  useEffect(() => {
    const savedHistory = localStorage.getItem('promptHistory');
    if (savedHistory) {
      try {
        setPromptHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing prompt history:', e);
      }
    }
  }, []);

  // Automatically switch to output view when result is generated
  useEffect(() => {
    if (result) {
      setActiveView('output');
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);

    // Hide tips after first generation
    setShowTips(false);

    try {
      const generatedPrompt = await generatePrompt(prompt);
      setResult(generatedPrompt);

      // Save to history with expanded state set to true for the newest item
      const newHistoryItem: PromptHistoryItem = {
        prompt,
        result: generatedPrompt,
        timestamp: Date.now(),
        isExpanded: true // The newest item is expanded by default
      };

      // Set older items to collapsed if they were previously expanded
      const updatedHistory = promptHistory.map(item => ({
        ...item,
        isExpanded: false
      }));

      const updatedHistoryWithNew = [newHistoryItem, ...updatedHistory].slice(0, 10); // Keep only the latest 10 items
      setPromptHistory(updatedHistoryWithNew);
      localStorage.setItem('promptHistory', JSON.stringify(updatedHistoryWithNew));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while generating the prompt');
      console.error('Error generating prompt:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    // Could add a state for prompt copied notification
  };

  const handleStartOver = () => {
    setPrompt("");
    setResult("");
    setShowFeedbackInput(false);
    setActiveView('input');
  };

  const handleRefineClick = () => {
    setShowFeedbackInput(true);
  };

  const handleRefine = async () => {
    if (!prompt.trim() || !result.trim() || !feedback.trim()) {
      setError('Please provide your query, a generated prompt, and feedback to refine');
      return;
    }

    setIsRefining(true);
    setError(null);

    try {
      const refinedPrompt = await refinePrompt(prompt, result, feedback);

      // Save the previous version to history before updating
      const newHistoryItem: PromptHistoryItem = {
        prompt,
        result,
        timestamp: Date.now(),
        isExpanded: false // Refined items start collapsed
      };

      // Set older items to collapsed
      const updatedHistory = promptHistory.map(item => ({
        ...item,
        isExpanded: false
      }));

      const updatedHistoryWithNew = [newHistoryItem, ...updatedHistory].slice(0, 10);
      setPromptHistory(updatedHistoryWithNew);
      localStorage.setItem('promptHistory', JSON.stringify(updatedHistoryWithNew));

      // Update the current result
      setResult(refinedPrompt);
      setFeedback(''); // Clear feedback after successful refinement
      setShowFeedbackInput(false); // Hide feedback input after successful refinement
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while refining the prompt');
      console.error('Error refining prompt:', err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleRestorePrompt = (historyItem: PromptHistoryItem) => {
    setPrompt(historyItem.prompt);
    setResult(historyItem.result);
    setActiveView('output');
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // New function to clear all prompt history
  const clearAllHistory = () => {
    if (window.confirm('Are you sure you want to delete all history? This cannot be undone.')) {
      setPromptHistory([]);
      localStorage.removeItem('promptHistory');
    }
  };

  // New function to toggle expansion state of a history item
  const toggleItemExpansion = (timestamp: number) => {
    const updatedHistory = promptHistory.map(item =>
      item.timestamp === timestamp
        ? { ...item, isExpanded: !item.isExpanded }
        : item
    );
    setPromptHistory(updatedHistory);
    localStorage.setItem('promptHistory', JSON.stringify(updatedHistory));
  };

  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-slate-900 overflow-hidden relative">
      {/* Theme Toggle - Positioned in top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[10%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[120px]" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center w-full px-4 sm:px-6 lg:px-9">
        {/* Header */}
        <FadeIn>
          <header className="w-full max-w-3xl flex items-center justify-center py-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 bg-clip-text text-transparent tracking-normal leading-tight py-1">
              Cre<span className="font-extrabold">AI</span>tive <span className="font-bold">Promptology</span>
            </h1>
          </header>
        </FadeIn>

        <div className="w-full max-w-3xl flex flex-col gap-8 mt-4 mb-16">
          {/* Controls Bar */}
          <div className="flex justify-between items-center">
            {/* View Toggle */}
            {result && (
              <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full flex">
                <button
                  onClick={() => setActiveView('input')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeView === 'input'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  Input
                </button>
                <button
                  onClick={() => setActiveView('output')}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${activeView === 'output'
                    ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                >
                  Result
                </button>
              </div>
            )}

            {/* History Toggle Button */}
            {promptHistory.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleHistory}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5
                    ${showHistory
                      ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {showHistory ? 'Hide History' : 'Show History'}
                </button>

                {showHistory && (
                  <button
                    onClick={clearAllHistory}
                    className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Main Content Area - Single Column Layout */}
          <div className="flex flex-col gap-6">
            {/* Input Section */}
            {(activeView === 'input' || !result) && (
              <SlideUp delay={300}>
                <section className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold">What are you trying to do?</h2>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Be specific and detailed for best results</p>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 group min-h-[250px] overflow-hidden transition-all duration-300 hover:shadow-lg">
                    <textarea
                      className="w-full h-full p-5 resize-none bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none min-h-[250px] border-none"
                      placeholder="Describe what you want the language model to do..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      style={{ boxShadow: 'none' }}
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {prompt.length} characters
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <GenerateButton
                      onClick={handleGenerate}
                      isGenerating={isGenerating}
                      disabled={!prompt.trim()}
                    />
                  </div>
                </section>
              </SlideUp>
            )}

            {/* Output Section */}
            {(activeView === 'output' && result) && (
              <SlideUp delay={300}>
                <section className="flex flex-col gap-4">
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-xl font-semibold">Result</h2>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleStartOver}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Start Over
                      </button>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 min-h-[300px] overflow-hidden transition-all duration-300 hover:shadow-lg relative">
                    <div className="w-full h-full p-5 pb-16 overflow-auto text-gray-900 dark:text-gray-100">
                      <div className="whitespace-pre-wrap animate-fade-in">{result}</div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1.5 bg-indigo-600 text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-indigo-500 hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                          onClick={handleRefineClick}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          Refine
                        </button>
                      </div>

                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1.5 bg-cyan-600 text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-cyan-500 hover:shadow-md flex items-center gap-1.5 cursor-pointer"
                          onClick={handleCopy}
                        >
                          {copied ? (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Copied!
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                              </svg>
                              Copy
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Error display */}
                  {error && (
                    <div className="mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 text-sm">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </div>
                    </div>
                  )}
                </section>
              </SlideUp>
            )}

            {/* Feedback Input Section - Only shown when Refine is clicked */}
            {showFeedbackInput && result && (
              <SlideUp delay={100}>
                <section className="w-full mt-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 animate-scale-in">
                    <div className="flex flex-col gap-3">
                      <label htmlFor="feedback" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Provide feedback to refine the prompt
                      </label>
                      <textarea
                        id="feedback"
                        className="w-full p-3 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-100 focus:outline-none min-h-[100px] resize-y"
                        placeholder="What would you like to improve or change about the generated prompt?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        style={{ boxShadow: 'none' }}
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-indigo-500 hover:shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={handleRefine}
                          disabled={isRefining || !feedback.trim()}
                        >
                          {isRefining ? (
                            <>
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Sending...
                            </>
                          ) : (
                            <>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Send
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              </SlideUp>
            )}

            {/* Prompt History Section - Updated to vertical timeline */}
            {showHistory && promptHistory.length > 0 && (
              <div className="mt-2 animate-fade-in">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Conversation History
                </h3>

                {/* Vertical Timeline */}
                <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-indigo-200 dark:before:bg-indigo-800/30">
                  {promptHistory.map((item, index) => (
                    <div key={item.timestamp} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-8 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center z-10 border-2 border-white dark:border-gray-800">
                        <div className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
                      </div>

                      {/* Card Content */}
                      <div className="pt-1">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {formatDate(item.timestamp)}
                            </span>
                            {index === 0 && (
                              <span className="text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-1.5 py-0.5 rounded-full">
                                Latest
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleItemExpansion(item.timestamp)}
                              className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                              aria-label={item.isExpanded ? "Collapse" : "Expand"}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${item.isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleRestorePrompt(item)}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1 transition-colors duration-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Restore
                            </button>
                          </div>
                        </div>

                        {/* User Input Card - Always show at least the first line */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-3">
                          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-white text-sm font-medium flex justify-between items-center">
                            <span>Your Input</span>
                          </div>
                          <div className={`px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 overflow-hidden transition-all duration-300 ${item.isExpanded ? 'max-h-[500px]' : 'line-clamp-1'}`} style={{ lineHeight: '1.5' }}>
                            {item.prompt}
                          </div>
                        </div>

                        {/* Result Card */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-3 py-2 text-white text-sm font-medium flex justify-between items-center">
                            <span>Generated Prompt</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.result);
                              }}
                              className="text-xs bg-white/20 px-1.5 py-0.5 rounded text-white hover:bg-white/30 transition-colors"
                            >
                              Copy
                            </button>
                          </div>
                          <div className={`px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 overflow-hidden transition-all duration-300 ${item.isExpanded ? 'max-h-[500px]' : 'line-clamp-2'}`} style={{ lineHeight: '1.5' }}>
                            {item.result}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips Section - Only show if showTips is true */}
            {showTips && (
              <SlideUp delay={700}>
                <section className="mt-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Prompt Engineering Tips
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">1</span>
                        </div>
                        <p>Be specific and detailed about what you want the AI model to do.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">2</span>
                        </div>
                        <p>Break complex tasks into smaller, clearer instructions.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">3</span>
                        </div>
                        <p>Provide examples of the desired output format when possible.</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">4</span>
                        </div>
                        <p>Specify the tone, style, and audience if relevant.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">5</span>
                        </div>
                        <p>Use clear and concise language to avoid ambiguity.</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">6</span>
                        </div>
                        <p>Iterate on prompts to improve results over time.</p>
                      </div>
                    </div>
                  </div>
                </section>
              </SlideUp>
            )}
          </div>

          {/* Footer */}
          <FadeIn delay={900}>
            <footer className="w-full max-w-3xl border-t border-gray-200 dark:border-gray-800 py-4 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-500">
                CreAItive • Internal Tool • {new Date().getFullYear()}
              </p>
            </footer>
          </FadeIn>
        </div>
      </div>
    </main>
  );
}
