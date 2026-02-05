"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Mic, Volume2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

export default function AIChat() {
    const { t, language } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const initialized = useRef(false);

    const toggleListening = () => {
        if (isListening) {
            setIsListening(false);
            return;
        }

        if (!('webkitSpeechRecognition' in window)) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(prev => prev + (prev ? ' ' : '') + transcript);
            setIsListening(false);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    const speakMessage = (text: string) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            // Map simple lang codes to full BCP 47 tags
            const langMap: Record<string, string> = {
                'en': 'en-US',
                'ta': 'ta-IN',
                'hi': 'hi-IN'
            };
            utterance.lang = langMap[language] || 'en-US';

            window.speechSynthesis.speak(utterance);
        }
    };

    // Initialize/Update welcome message when language changes, but only if it's the first message or empty
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([{ role: 'bot', content: t('chat.initialMessage') }]);
        }
    }, [language, t]); // Re-run when language changes to update welcome message context if needed

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, newMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: newMsg.content, language })
            });
            const data = await response.json();

            const botMsg: Message = { role: 'bot', content: data.response || t('chat.error') };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', content: t('chat.error') }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
                    <Sparkles className="text-blue-500" /> {t('chat.title')}
                </h1>
                <p className="text-muted-foreground">{t('chat.subtitle')}</p>
            </div>

            <div className="flex-1 bg-card border border-border rounded-2xl shadow-sm flex flex-col overflow-hidden">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`
                max-w-[80%] rounded-2xl p-4 flex gap-3
                ${msg.role === 'user'
                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                    : 'bg-secondary text-secondary-foreground rounded-tl-none'}
              `}>
                                <div className="mt-1">
                                    {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                    <div className="leading-relaxed whitespace-pre-wrap break-words">
                                        {msg.content}
                                    </div>
                                    <button
                                        onClick={() => speakMessage(msg.content)}
                                        className="self-start mt-1 p-1 rounded-full hover:bg-black/10 transition-colors"
                                        title="Read aloud"
                                    >
                                        <Volume2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-secondary text-secondary-foreground rounded-2xl rounded-tl-none p-4 flex gap-2 items-center">
                                <Bot size={18} />
                                <span className="animate-pulse">{t('chat.thinking')}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-card/50 backdrop-blur">
                    <div className="flex gap-2">
                        <button
                            onClick={toggleListening}
                            className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'}`}
                            title={isListening ? "Stop listening" : "Start listening"}
                        >
                            <Mic size={20} />
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder={isListening ? "Listening..." : t('chat.inputPlaceholder')}
                            className="flex-1 bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl transition-all disabled:opacity-50"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
