"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Bot } from "lucide-react";
import { motion } from "framer-motion";

type Message = {
    id: string;
    role: "user" | "ai";
    content: string;
};

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "ai",
            content: "Hello! I'm your energy assistant. How can I help you analyze your consumption today?",
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "ai",
                content: "I can help you with that. Based on your data, your energy consumption peaks between 6 PM and 9 PM. Would you like some tips to reduce usage during these hours?",
            };
            setMessages((prev) => [...prev, aiResponse]);
        }, 1000);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
            <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col max-w-4xl mx-auto w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Energy Assistant</h2>
                            <p className="text-xs text-gray-500">Always here to help</p>
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="space-y-6">
                            {messages.map((message) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={message.id}
                                    className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <Avatar className="w-8 h-8 border border-gray-100 mt-1">
                                        {message.role === "ai" ? (
                                            <>
                                                <AvatarImage src="/bot-avatar.png" />
                                                <AvatarFallback className="bg-primary/10 text-primary"><Bot className="w-4 h-4" /></AvatarFallback>
                                            </>
                                        ) : (
                                            <>
                                                <AvatarImage src="https://github.com/shadcn.png" />
                                                <AvatarFallback><User className="w-4 h-4" /></AvatarFallback>
                                            </>
                                        )}
                                    </Avatar>
                                    <div
                                        className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${message.role === "user"
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-gray-100 text-gray-800 rounded-tl-none"
                                            }`}
                                    >
                                        {message.content}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </ScrollArea>

                    <div className="p-4 border-t border-gray-100 bg-white">
                        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-4xl mx-auto">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-gray-50 border-gray-200 focus-visible:ring-primary h-12"
                            />
                            <Button type="submit" size="icon" disabled={!inputValue.trim()} className="h-12 w-12 shrink-0 rounded-xl">
                                <Send className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
