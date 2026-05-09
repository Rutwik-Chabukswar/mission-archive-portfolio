import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content: "SYSTEM_ONLINE: Operational intelligence assistant active. How can I assist your mission briefing today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const shortcuts = [
    "Tell me about Rutwik",
    "Best project",
    "Why hire him",
    "Backend experience",
    "AI experience",
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const apiUrl = import.meta.env.VITE_CHAT_API_URL || "/api/chat";
      // This is a placeholder for the actual integration. 
      // In a real scenario, you'd call the user's FastAPI backend here.
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error("TRANS_ERROR: CONNECTION_FAILURE");

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response || "ERROR: ARCHIVE_DATA_UNAVAILABLE",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "CRITICAL_ERROR: Failed to establish link with RAG_PIPELINE. Please retry or check system logs.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-6 z-50 p-4 bg-mission-accent text-black shadow-[0_0_20px_rgba(0,255,65,0.3)] transition-colors ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-[350px] md:w-[400px] h-[500px] bg-mission-bg border border-mission-accent flex flex-col shadow-[0_0_50px_rgba(0,255,65,0.1)]"
          >
            {/* Header */}
            <div className="p-4 border-b border-mission-accent bg-mission-accent/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-mission-accent status-active" />
                <span className="mono text-[10px] tracking-widest font-bold">TACTICAL_ASSISTANT_V1</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-mission-accent hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/40"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`p-1.5 border ${msg.role === "assistant" ? "border-mission-accent/30 text-mission-accent" : "border-white/20 text-white"}`}>
                      {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                    </div>
                    <div className={`p-3 text-[10px] mono leading-relaxed border ${
                      msg.role === "assistant" 
                      ? "bg-mission-accent/5 border-mission-accent/20 text-mission-accent" 
                      : "bg-white/5 border-white/10 text-white"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="p-1.5 border border-mission-accent/30 text-mission-accent">
                      <Bot size={14} />
                    </div>
                    <div className="p-3 text-[10px] mono bg-mission-accent/5 border border-mission-accent/20 text-mission-accent animate-pulse">
                      PROCESSING_QUERY...
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shortcuts */}
            {messages.length === 1 && !isLoading && (
              <div className="p-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {shortcuts.map((shortcut) => (
                  <button
                    key={shortcut}
                    onClick={() => handleSend(shortcut)}
                    className="text-[8px] mono border border-mission-accent/30 px-2 py-1 hover:bg-mission-accent hover:text-black transition-all uppercase"
                  >
                    {shortcut}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-mission-accent bg-mission-ink">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="ENTER COMMAND..."
                  className="flex-1 bg-black/50 border border-mission-border p-2 focus:border-mission-accent outline-none text-[10px] mono uppercase placeholder:opacity-30"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-mission-accent text-black disabled:opacity-50 transition-opacity"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
