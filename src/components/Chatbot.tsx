import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles, Terminal } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
  techWiki?: string;
  suggestions?: string[];
  isStreaming?: boolean;
}

function TypewriterText({ 
  content, 
  isStreaming, 
  onComplete 
}: { 
  content: string; 
  isStreaming?: boolean; 
  onComplete?: () => void 
}) {
  const [displayed, setDisplayed] = useState(isStreaming ? "" : content);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayed(content);
      return;
    }

    let i = 0;
    const timer = setInterval(() => {
      i += 3; // Fast typing speed
      setDisplayed(content.slice(0, i));
      if (i >= content.length) {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, 10);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {displayed}
      {isStreaming && displayed.length < content.length && (
        <span className="inline-block w-1.5 h-3 ml-1 bg-mission-accent align-baseline animate-pulse shadow-[0_0_5px_rgba(0,255,65,0.8)]" />
      )}
    </>
  );
}

function SourceCollapsible({ sources }: { sources: string[] }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Deduplicate and clean sources
  const uniqueSources = Array.from(new Set(sources))
    .map(s => s.trim().replace(/\n+/g, ' '))
    .filter(s => s.length > 10);

  if (!uniqueSources || uniqueSources.length === 0) return null;

  return (
    <div className="mt-4 border-t border-mission-accent/20 pt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-mission-accent/70 hover:text-mission-accent hover:bg-mission-accent/10 px-2 py-1.5 -ml-2 rounded-sm transition-all font-mono"
      >
        <span>{isOpen ? '[-]' : '[+]'}</span> VIEW_ARCHIVE_SOURCES
      </button>
      
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-3 space-y-2 overflow-hidden"
        >
          {uniqueSources.slice(0, 5).map((source, idx) => {
            const snippet = source.length > 120 ? source.slice(0, 120) + "..." : source;
            return (
              <div key={idx} className="p-3 bg-black/50 border border-mission-accent/10 rounded-sm relative overflow-hidden group hover:border-mission-accent/30 transition-colors">
                <div className="absolute top-0 left-0 w-1 h-full bg-mission-accent/20 group-hover:bg-mission-accent/50 transition-colors" />
                <div className="flex items-center gap-2 mb-1.5 opacity-60">
                  <span className="mono text-[8px] text-mission-accent">FRAG_{String(idx + 1).padStart(2, '0')}</span>
                  <span className="text-[7px] text-white/30 uppercase tracking-widest font-mono">ENCRYPTED_ARCHIVE</span>
                </div>
                <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                  "{snippet}"
                </p>
              </div>
            );
          })}
          {uniqueSources.length > 5 && (
            <div className="text-[9px] text-center text-white/40 font-mono tracking-widest pt-2 pb-1">
              + {uniqueSources.length - 5} ADDITIONAL FRAGMENTS OMITTED
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

function TechWikiCollapsible({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  if (!content) return null;

  return (
    <div className="mt-4 border-t border-mission-accent/20 pt-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-mission-accent/70 hover:text-mission-accent hover:bg-mission-accent/10 px-2 py-1.5 -ml-2 rounded-sm transition-all font-mono"
      >
        <span>{isOpen ? '[-]' : '[+]'}</span> OPEN_TECH_WIKI
      </button>
      
      {isOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-3 space-y-2 overflow-hidden"
        >
          <div className="p-3 bg-black/50 border border-mission-accent/20 rounded-sm relative overflow-hidden group hover:border-mission-accent/40 transition-colors">
            <div className="absolute top-0 left-0 w-1 h-full bg-mission-accent/30 group-hover:bg-mission-accent/60 transition-colors" />
            <div className="flex items-center gap-2 mb-2 opacity-70">
              <span className="mono text-[8px] text-mission-accent">TECH_FILE</span>
              <span className="text-[7px] text-white/40 uppercase tracking-widest font-mono">SYSTEM_DOCUMENTATION</span>
            </div>
            <p className="text-[12px] text-white/80 font-sans leading-relaxed whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = sessionStorage.getItem("mission-archive-chat");
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      }
    } catch (e) {
      console.warn("sessionStorage access blocked (likely iOS Safari Private Mode)");
    }
    return [
      {
        id: "initial",
        role: "assistant",
        content: "CONNECTION_ESTABLISHED: I am the AI Intelligence Terminal. I have complete access to Rutwik's classified portfolio, projects, and work experience. What would you like to know?",
        timestamp: new Date(),
      },
    ];
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("mission-archive-chat", JSON.stringify(messages));
    } catch (e) {
      // Ignore Safari private mode quota errors
    }
  }, [messages]);

  useEffect(() => {
    const handleOpenChatbot = () => setIsOpen(true);
    window.addEventListener('open-chatbot', handleOpenChatbot);
    return () => window.removeEventListener('open-chatbot', handleOpenChatbot);
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const shortcuts = [
    "Tell me about Rutwik",
    "What is his strongest project?",
    "Why should I hire him?",
    "Explain QuickHeal experience",
    "Explain AI experience",
    "Explain backend experience",
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
      // Mobile iPhone Safari strictly blocks mixed content (HTTP over HTTPS).
      // We ensure the fallback is the secure production backend, not localhost.
      let baseUrl = import.meta.env.VITE_CHAT_API_URL || "https://mission-archive-backend.onrender.com";
      baseUrl = baseUrl.replace(/\/$/, ""); // Strip trailing slash
      const apiUrl = baseUrl.endsWith("/chat") ? baseUrl : `${baseUrl}/chat`;

      const controller = new AbortController();
      // Increase timeout to 30 seconds to allow Render cold start
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      let response;
      let fetchError;
      
      // Retry loop to handle premature iOS Safari connection drops during Render cold starts
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: text }),
            signal: controller.signal
          });
          fetchError = null; // Success!
          break; // Exit retry loop
        } catch (e: any) {
          fetchError = e;
          if (e.name === 'AbortError') {
            break; // Don't retry if we manually timed out after 30s
          }
          // If it's a network error (OFFLINE drop), wait 2s and retry
          console.warn(`Fetch attempt ${attempt} failed, retrying...`, e);
          if (attempt < 3) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }
      
      clearTimeout(timeoutId);

      if (fetchError) {
        console.error("Fetch request finally failed:", fetchError);
        if (fetchError.name === 'AbortError') {
          throw new Error("TIMEOUT");
        }
        throw new Error(`OFFLINE: ${fetchError.message}`);
      }

      if (!response.ok) {
        if (response.status === 502 || response.status === 503 || response.status === 504) {
          throw new Error("UNAVAILABLE");
        }
        if (response.status >= 500) {
          throw new Error("SERVER_ERROR");
        }
        throw new Error("API_ERROR");
      }

      const data = await response.json();
      
      if (!data || !data.answer || data.answer.trim() === "") {
        throw new Error("EMPTY_RESPONSE");
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        techWiki: data.tech_wiki,
        suggestions: data.suggestions,
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      let fallbackContent = "Unable to retrieve intelligence.";
      
      console.error("Chatbot API Failure Details:", error);
      
      if (error.message === "TIMEOUT") {
        fallbackContent = "Archive connection timeout. Unable to retrieve intelligence in time.";
      } else if (error.message.startsWith("OFFLINE")) {
        const details = error.message.toLowerCase();
        if (details.includes("cors")) {
          fallbackContent = "Archive access denied. Cross-Origin Request Blocked.";
        } else if (details.includes("failed to fetch") || details.includes("network error")) {
          fallbackContent = "Network connection issue. The intelligence server appears to be unreachable.";
        } else {
          fallbackContent = "Archive connection interrupted. Please verify your network stability.";
        }
      } else if (error.message === "UNAVAILABLE") {
        fallbackContent = "Backend temporarily unavailable. The intelligence servers are rebooting.";
      } else if (error.message === "SERVER_ERROR") {
        fallbackContent = "Archive server error. Intelligence retrieval failed internally.";
      } else if (error.message === "API_ERROR") {
        fallbackContent = "Archive connection interrupted. Invalid response data detected.";
      } else if (error.message === "EMPTY_RESPONSE") {
        fallbackContent = "Archive accessed, but no relevant intelligence was found.";
      }
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: fallbackContent,
        timestamp: new Date(),
        isStreaming: true,
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
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-4 md:bottom-24 md:right-6 z-[150] flex items-center gap-3 px-4 py-3 bg-mission-ink/90 border border-mission-accent/30 text-mission-accent shadow-[0_0_20px_rgba(0,255,65,0.15)] backdrop-blur-md transition-all hover:border-mission-accent hover:shadow-[0_0_30px_rgba(0,255,65,0.3)] ${
          isOpen ? "hidden" : "flex"
        }`}
      >
        <div className="relative">
          <Terminal size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-mission-accent rounded-full animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.8)]" />
        </div>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="mono text-[9px] font-bold tracking-widest leading-none mb-0.5">INTELLIGENCE_TERMINAL</span>
          <span className="mono text-[7px] opacity-50 tracking-widest leading-none">SYSTEM_READY</span>
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 left-0 right-0 z-[150] w-full h-[85dvh] md:w-[480px] lg:w-[500px] md:h-[600px] md:bottom-24 md:right-6 md:left-auto md:max-h-[85dvh] bg-mission-ink/95 backdrop-blur-xl border-t md:border border-mission-accent/30 flex flex-col shadow-[0_-10px_50px_rgba(0,0,0,0.8),md:0_10px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,255,65,0.1)] rounded-t-2xl md:rounded-sm overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-mission-accent/20 bg-linear-to-r from-mission-accent/10 to-transparent flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center w-8 h-8 bg-mission-accent/10 border border-mission-accent/30 text-mission-accent">
                  <Terminal size={16} />
                  <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-mission-accent rounded-full animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="mono text-[10px] tracking-widest font-bold text-mission-accent">AI_INTELLIGENCE_TERMINAL</span>
                  <span className="mono text-[7px] tracking-widest text-mission-accent/50">AWAITING_INPUT</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-mission-accent/50 hover:text-mission-accent transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 custom-scrollbar bg-black/40 shadow-[inset_0_0_30px_rgba(0,255,65,0.02)]"
            >
              {messages.map((msg, index) => {
                const isLast = index === messages.length - 1;
                return (
                <div
                  key={msg.id}
                  className={`flex flex-col w-full ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-2.5 mb-2 opacity-50">
                    {msg.role === "assistant" ? <Bot size={11} className="text-mission-accent" /> : <User size={11} className="text-white" />}
                    <span className={`mono text-[9px] tracking-[0.2em] uppercase ${msg.role === "assistant" ? "text-mission-accent" : "text-white"}`}>
                      {msg.role === "assistant" ? "AI_SYSTEM" : "USER_CMD"}
                    </span>
                  </div>
                  <div className={`p-5 max-w-[88%] rounded-sm border ${
                    msg.role === "assistant" 
                    ? msg.id === "initial"
                      ? "bg-mission-accent/10 border-mission-accent/40 text-mission-accent shadow-[0_0_15px_rgba(0,255,65,0.1)]"
                      : "bg-mission-accent/5 border-mission-accent/20 text-white/90" 
                    : "bg-white/5 border-white/10 text-white"
                  }`}>
                    <div className="font-sans text-[14px] leading-[1.75] whitespace-pre-wrap">
                      {msg.role === "assistant" ? (
                        <TypewriterText 
                          content={msg.content} 
                          isStreaming={msg.isStreaming} 
                          onComplete={() => {
                            setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isStreaming: false } : m));
                          }} 
                        />
                      ) : (
                        msg.content
                      )}
                    </div>
                    {msg.role === "assistant" && !msg.isStreaming && msg.sources && msg.sources.length > 0 && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <SourceCollapsible sources={msg.sources} />
                      </motion.div>
                    )}
                    {msg.role === "assistant" && !msg.isStreaming && msg.techWiki && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <TechWikiCollapsible content={msg.techWiki} />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Suggested Prompts below the AI response */}
                  {msg.role === "assistant" && !msg.isStreaming && isLast && !isLoading && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-[20px] flex flex-col sm:flex-row flex-wrap gap-[12px] self-start w-full"
                    >
                      <div className="w-full text-[10px] text-[#00ff66]/50 font-mono uppercase tracking-widest mb-1">Suggested_Queries:</div>
                      {(msg.suggestions && msg.suggestions.length > 0 ? msg.suggestions : shortcuts).map((shortcut) => (
                        <button
                          key={shortcut}
                          onClick={() => handleSend(shortcut)}
                          className="bg-black/80 border border-[#00ff66] text-[#00ff66] rounded-[20px] py-[8px] px-[16px] transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_0_12px_#00ff66] font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-left sm:text-center"
                        >
                          {shortcut}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )})}
              {isLoading && (
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center gap-2 mb-1.5 opacity-50 text-mission-accent">
                    <Bot size={10} />
                    <span className="mono text-[8px] tracking-[0.2em] uppercase">AI_SYSTEM</span>
                  </div>
                  <div className="p-4 border bg-mission-accent/5 border-mission-accent/20 text-mission-accent">
                    <div className="flex items-center gap-3">
                      <Loader2 size={14} className="animate-spin opacity-70" />
                      <span className="mono text-[9px] tracking-widest uppercase">Waking intelligence servers...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 pb-[max(env(safe-area-inset-bottom),1rem)] md:p-4 border-t border-mission-accent/20 bg-mission-ink shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                className="flex items-center gap-2 md:gap-3 bg-black/60 border border-mission-accent/20 p-1 focus-within:border-mission-accent/60 transition-colors"
              >
                <span className="pl-3 text-mission-accent/50 mono text-xs">{'>'}</span>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter command or interrogate archive..."
                  className="flex-1 bg-transparent p-2 outline-none font-sans text-[13px] text-white/90 placeholder:text-white/30 placeholder:font-mono placeholder:text-[10px] placeholder:uppercase placeholder:tracking-widest"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 mr-1 bg-mission-accent/10 text-mission-accent hover:bg-mission-accent hover:text-black disabled:opacity-30 disabled:hover:bg-mission-accent/10 disabled:hover:text-mission-accent transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
