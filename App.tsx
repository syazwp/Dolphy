import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getChatResponse } from './services/geminiService';
import type { Message } from './types';
import ChatMessage from './components/ChatMessage';

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
    </svg>
);


const App: React.FC = () => {
    const [knowledgeBase, setKnowledgeBase] = useState<string>('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchKnowledgeBase = async () => {
            try {
                const response = await fetch('/kb.txt');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const text = await response.text();
                setKnowledgeBase(text);
            } catch (err) {
                console.error("Failed to load knowledge base:", err);
                setKnowledgeBase("Oops! We couldn't load the default story. You can write your own here!");
            }
        };
        fetchKnowledgeBase();
    }, []);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    
    useEffect(() => {
        setMessages([
            { role: 'model', text: "Hi! I'm Doplhy. Add some text to the Knowledge Base on the left, then ask me a question about it!" }
        ]);
    }, []);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userInput.trim() || isLoading) return;
        
        if (!knowledgeBase.trim()) {
            setError("Please provide some text in the 'Knowledge Base' box first!");
            setTimeout(() => setError(null), 3000);
            return;
        }
        setError(null);

        const newUserMessage: Message = { role: 'user', text: userInput };
        setMessages(prev => [...prev, newUserMessage]);
        const currentInput = userInput;
        setUserInput('');
        setIsLoading(true);

        try {
            const responseText = await getChatResponse(knowledgeBase, currentInput);
            const modelMessage: Message = { role: 'model', text: responseText };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err) {
            const errorMessage: Message = { role: 'model', text: "Sorry, I had a little trouble thinking. Can you try asking again?" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [userInput, isLoading, knowledgeBase]);

    return (
        <div className="flex flex-col h-screen font-sans antialiased text-gray-800 p-4 md:p-6 lg:p-8">
            <header className="text-center mb-6">
                <h1 className="text-4xl md:text-5xl font-bold text-sky-700">Introduction to AI</h1>
                <p className="text-md md:text-lg text-slate-600 mt-2">Let's make your own chat bot!</p>
            </header>
            
            <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Knowledge Base Panel */}
                <div className="flex flex-col bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-slate-700 mb-3">
                        <span role="img" aria-label="book">📚</span> Knowledge Base
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">Type a story, facts, or any text here. Then, ask me questions about it in the chat!</p>
                    <textarea
                        value={knowledgeBase}
                        onChange={(e) => setKnowledgeBase(e.target.value)}
                        placeholder="Loading story..."
                        className="w-full flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-200 resize-none text-sm bg-white"
                    />
                </div>

                {/* Chat Panel */}
                <div className="flex flex-col bg-white rounded-2xl shadow-lg">
                    <div className="p-6 border-b border-slate-200">
                         <h2 className="text-2xl font-bold text-slate-700">
                             <span role="img" aria-label="speech bubble">💬</span> Chat with Doplhy
                         </h2>
                    </div>
                    
                    <div ref={chatContainerRef} className="flex-grow p-6 overflow-y-auto bg-slate-50 min-h-[300px]">
                        {messages.map((msg, index) => (
                            <ChatMessage key={index} message={msg} />
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-3 my-4 justify-start">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center animate-pulse">
                                  {/* Robot Icon Placeholder */}
                                  <div className="h-8 w-8 text-slate-400 rounded-md bg-slate-300"></div>
                                </div>
                                <div className="max-w-md rounded-2xl px-4 py-3 shadow bg-white text-gray-800 rounded-tl-none">
                                    <p className="text-sm text-slate-500 italic">Doplhy is thinking...</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-slate-200 bg-white rounded-b-2xl">
                        {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Ask a question about the story..."
                                className="flex-grow p-3 border border-slate-300 rounded-full focus:ring-2 focus:ring-sky-400 focus:border-sky-400 transition duration-200 text-sm bg-white"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                className="w-12 h-12 flex-shrink-0 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-transform duration-200 active:scale-95 disabled:bg-slate-300 disabled:cursor-not-allowed"
                                disabled={isLoading || !userInput.trim()}
                            >
                                <SendIcon className="w-6 h-6"/>
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;