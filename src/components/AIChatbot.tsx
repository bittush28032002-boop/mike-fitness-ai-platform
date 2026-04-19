import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { createChatSession } from '@/lib/gemini';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Welcome to Mike Johnson Fitness. I am your elite AI coach. How can I help you optimize your training and nutrition today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<any>(null);

  // Initialize chat session lazily
  const getChat = () => {
    if (!chatRef.current) {
      chatRef.current = createChatSession();
    }
    return chatRef.current;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const clearHistory = () => {
    chatRef.current = createChatSession();
    setMessages([{ role: 'ai', text: 'Intel matrix cleared. Awaiting new performance queries.' }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const chat = getChat();
      const response = await chat.sendMessage({ message: userMsg });
      
      setMessages(prev => [...prev, { role: 'ai', text: response.text || 'Protocol error. Re-query recommended.' }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection to training core unstable. Please verify network status.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] pointer-events-none">
      <div className="relative pointer-events-auto">
        {/* Trigger Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`p-4 rounded-full shadow-2xl transition-all duration-300 ${
            isOpen ? 'bg-white text-black' : 'bg-neon text-black'
          } shadow-neon/20`}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </motion.button>

        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute bottom-20 right-0 w-[calc(100vw-3rem)] md:w-[420px] h-[600px] bg-luxury-gray/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-3xl flex flex-col overflow-hidden origin-bottom-right"
            >
              {/* Header */}
              <div className="p-5 border-b border-white/5 bg-black/40 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neon to-transparent opacity-50" />
                
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-neon rounded-xl flex items-center justify-center rotate-3 transform shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                      <Bot className="w-6 h-6 text-black" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon rounded-full border-2 border-luxury-gray" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-neon">Elite Intelligence</h4>
                    <h3 className="text-sm font-bold text-white uppercase italic leading-none mt-1">Fitness Architect V3</h3>
                  </div>
                </div>

                <Button 
                  onClick={clearHistory}
                  variant="ghost" 
                  size="icon" 
                  className="text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Clear Intel History"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-grow p-6 custom-scrollbar" viewportRef={scrollRef}>
                <div className="space-y-6">
                  {messages.map((m, i) => (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, x: m.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      key={i} 
                      className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[88%] relative group ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <span className={`text-[8px] font-black uppercase tracking-widest block mb-2 opacity-30 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                          {m.role === 'user' ? 'Tactical Unit' : 'AI Command'}
                        </span>
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          m.role === 'user' 
                            ? 'bg-neon text-black font-bold rounded-tr-none shadow-lg shadow-neon/5' 
                            : 'bg-white/5 text-white/90 border border-white/5 rounded-tl-none backdrop-blur-sm'
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1.5 items-center">
                        <span className="w-1.5 h-1.5 bg-neon rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 bg-neon rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 bg-neon rounded-full animate-bounce" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="p-6 border-t border-white/5 bg-black/40">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
                  className="flex gap-3 bg-white/5 p-1 rounded-xl border border-white/5 focus-within:border-neon/50 transition-all"
                >
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter performance query..."
                    className="bg-transparent border-none text-white h-12 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-medium"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    disabled={!input.trim() || isTyping}
                    className="bg-neon text-black hover:bg-white h-12 w-12 rounded-lg flex-shrink-0 transition-transform active:scale-90"
                  >
                    <Send className="w-5 h-5 flex-shrink-0" />
                  </Button>
                </form>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black">
                    State: Operational
                  </p>
                  <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-black">
                    Security: Matrix-Encrypted
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIChatbot;
