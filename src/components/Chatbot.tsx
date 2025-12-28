import React, { useState, useRef, useEffect, memo } from "react";
import {
  MessageSquare,
  X,
  Send,
  Minimize2,
  Maximize2,
  ExternalLink,
  RotateCcw, // Tambahkan ikon Refresh
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getSmartResponse, type ChatMessage } from "../utils/ailogic";
import { properties } from "../data";

const STORAGE_KEY = "luxe_chat_history";

const INITIAL_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Halo! Selamat datang di LuxeEstate. Ada properti impian yang sedang Anda cari?",
};

const MiniPropertyCard = memo(({ id }: { id: number }) => {
  const property = properties.find((p) => p.id === id);
  if (!property) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col w-full"
    >
      <img src={property.image} alt={property.title} className="w-full h-28 object-cover" />
      <div className="p-3">
        <h4 className="font-bold text-xs text-slate-900 truncate">{property.title}</h4>
        <p className="text-[11px] text-blue-600 font-bold mb-3">{property.price}</p>
        <Link
          to={`/property/${property.id}`}
          className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition active:scale-95"
        >
          Lihat Detail <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
});

MiniPropertyCard.displayName = "MiniPropertyCard";

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  
  // 1. Load data dari localStorage saat inisialisasi
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });

  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 2. Simpan ke localStorage setiap kali ada pesan baru
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  // 3. Fungsi untuk Reset Chat
  const handleResetChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages([INITIAL_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg } as ChatMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const result = await getSmartResponse(userMsg, newMessages);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: result.text,
        propertyIds: result.propertyIds,
      },
    ]);
    setIsLoading(false);
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`
              fixed z-50 bg-white shadow-2xl overflow-hidden flex flex-col
              inset-0 md:inset-auto md:bottom-0 md:right-10 md:w-96 
              ${isMinimized ? "md:h-14" : "md:h-[600px]"} 
              md:rounded-t-2xl md:border md:border-gray-200
            `}
          >
            {/* Header */}
            <div
              className="bg-slate-900 text-white p-4 flex justify-between items-center cursor-pointer"
              onClick={() => {
                if (window.innerWidth >= 768) setIsMinimized(!isMinimized);
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-sm">Luxe Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                {/* TOMBOL REFRESH/RESET */}
                <button
                  onClick={handleResetChat}
                  title="Reset Percakapan"
                  className="p-1.5 hover:bg-white/10 rounded-md transition-colors"
                >
                  <RotateCcw className="w-4 h-4 text-gray-300" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(!isMinimized);
                  }}
                  className="hidden md:block p-1 hover:bg-white/10 rounded"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="p-1 hover:bg-white/10 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100/50 scroll-smooth">
                  {messages.map((msg, idx) => (
                    <div
                      key={`msg-${idx}`}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                        }`}
                      >
                        {msg.content}
                        {msg.propertyIds && msg.propertyIds.length > 0 && (
                          <div className="flex flex-col gap-3 mt-4">
                            {msg.propertyIds.map((id) => (
                              <MiniPropertyCard key={`prop-${idx}-${id}`} id={id} />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-200 px-4 py-2 rounded-full rounded-bl-none animate-pulse text-xs text-gray-500 font-medium">
                        Asisten sedang mengetik...
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya harga, lokasi, atau tipe rumah..."
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600/50 text-sm"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition-all shadow-md active:scale-95 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
