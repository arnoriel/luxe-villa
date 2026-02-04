import React, { useState, useRef, useEffect, memo } from "react";
import {
  MessageSquare,
  X,
  Send,
  ExternalLink,
  RotateCcw,
  CreditCard,
  Lock,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { getSmartResponse, type ChatMessage } from "../utils/ailogic";
import { properties } from "../data";

const STORAGE_KEY = "luxe_chat_history";
const CUSTOMER_STORAGE_KEY = "luxe_customers";

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
      className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col w-full mt-2"
    >
      <img src={property.image} alt={property.title} className="w-full h-28 object-cover" />
      <div className="p-3">
        <h4 className="font-bold text-xs text-slate-900 truncate">{property.title}</h4>
        <p className="text-[11px] text-blue-600 font-bold mb-3">{property.price}</p>
        <Link
          to={`/property/${property.id}`}
          className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Lihat Detail <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
});

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [INITIAL_MESSAGE];
  });
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // LOGIKA TRANSAKSI STATE
  const [transaction, setTransaction] = useState<{
    step: 'none' | 'ask_name' | 'ask_type' | 'payment';
    userName?: string;
    propertyId?: number;
    buyType?: string;
  }>({ step: 'none' });

  // STATE UNTUK FORM KARTU
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  // Formatter Nomor Kartu (Spasi setiap 4 angka)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(" ") || val;
    setCardNumber(formatted);
  };

  const saveCustomerData = (status: 'pending' | 'paid') => {
    const existing = JSON.parse(localStorage.getItem(CUSTOMER_STORAGE_KEY) || '[]');
    const newCustomer = {
      id: Date.now(),
      name: transaction.userName,
      buy_type: transaction.buyType,
      payment_status: status,
      property_id: transaction.propertyId,
      date: new Date().toLocaleString(),
    };

    const filtered = existing.filter((c: any) => c.name !== transaction.userName || c.property_id !== transaction.propertyId);
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify([...filtered, newCustomer]));
    window.dispatchEvent(new Event('storage'));
  };

  const handleResetChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages([INITIAL_MESSAGE]);
    setTransaction({ step: 'none' });
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    if (transaction.step === 'ask_name') {
      setTransaction(prev => ({ ...prev, userName: userMsg, step: 'ask_type' }));
      setMessages(prev => [...prev, { role: "assistant", content: `Senang berkenalan dengan Anda, ${userMsg}. Apakah Anda ingin Membeli atau Menyewa properti tersebut?` }]);
      return;
    }

    if (transaction.step === 'ask_type') {
      const type = userMsg.toLowerCase().includes('sewa') ? 'Sewa' : 'Beli';
      setTransaction(prev => ({ ...prev, buyType: type, step: 'payment' }));
      saveCustomerData('pending');

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: `Baik, silakan klik tombol di bawah untuk menyelesaikan pembayaran simulasi.` 
      }]);
      return;
    }

    setIsLoading(true);
    const result = await getSmartResponse(userMsg, messages);

    if (result.intent === 'buy' && result.propertyIds.length > 0) {
      setTransaction({ step: 'ask_name', propertyId: result.propertyIds[0] });
      setMessages(prev => [...prev, { role: "assistant", content: "Pilihan yang sangat bagus! Untuk memproses lebih lanjut, boleh saya tahu nama Anda?" }]);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.text, propertyIds: result.propertyIds },
      ]);
    }
    setIsLoading(false);
  };

  const handleProcessPayment = () => {
    if (cardNumber.length < 19) {
      alert("Silakan masukkan nomor kartu yang valid (16 angka)");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      saveCustomerData('paid');
      setIsProcessing(false);
      setShowPaymentModal(false);
      setTransaction({ step: 'none' });
      setCardNumber(""); setExpiry(""); setCvv("");
      setMessages(prev => [...prev, { role: "assistant", content: "✅ Pembayaran Berhasil! Tim kami akan segera menghubungi Anda melalui WhatsApp untuk proses verifikasi dokumen. Terima kasih!" }]);
    }, 2500);
  };

  const selectedProperty = properties.find(p => p.id === transaction.propertyId);

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
          {/* Tooltip Label */}
         {/* Tooltip Label */}
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 flex items-center relative"
          >
            <p className="text-[11px] md:text-sm font-bold text-slate-700 whitespace-nowrap">
              Butuh Bantuan? Tanyakan disini
            </p>
            {/* Segitiga Tooltip */}
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gray-100"></div>
          </motion.div>

          {/* Chat Button */}
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white p-4 rounded-full shadow-2xl relative"
          >
            <MessageSquare className="w-6 h-6" />
            {/* Notif Dot */}
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
          </motion.button>
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className={`fixed z-50 bg-white shadow-2xl flex flex-col inset-0 md:inset-auto md:bottom-0 md:right-10 md:w-96 ${isMinimized ? "md:h-14" : "md:h-[600px]"} md:rounded-t-2xl md:border`}
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center cursor-pointer" onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="font-bold text-sm">Luxe Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleResetChat} className="p-1.5 hover:bg-white/10 rounded-md"><RotateCcw className="w-4 h-4" /></button>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded"><X className="w-5 h-5" /></button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] p-3 rounded-2xl text-[13px] ${msg.role === "user" ? "bg-blue-600 text-white shadow-md" : "bg-white border shadow-sm text-slate-700"}`}>
                        {msg.content}
                        {msg.propertyIds?.map(id => <MiniPropertyCard key={id} id={id} />)}
                      </div>
                    </div>
                  ))}
                  
                  {transaction.step === 'payment' && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-2">
                      <button 
                        onClick={() => setShowPaymentModal(true)}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 text-xs shadow-lg hover:brightness-110 transition active:scale-95"
                      >
                        <CreditCard size={18} /> Checkout Sekarang
                      </button>
                    </motion.div>
                  )}

                  {isLoading && <div className="flex gap-1 p-2"><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div></div>}
                </div>

                <form onSubmit={handleSubmit} className="p-3 bg-white border-t flex gap-2">
                  <input
                    type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder="Tanya sesuatu..."
                    className="flex-1 px-5 py-3 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                  />
                  <button type="submit" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md active:scale-90"><Send className="w-4 h-4" /></button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* SECURE PAYMENT MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] max-w-md w-full overflow-hidden shadow-2xl"
            >
              <div className="bg-slate-50 px-8 py-6 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Secure Checkout</h2>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                    <Lock size={10} className="text-green-500" /> Encrypted Transaction
                  </p>
                </div>
                <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} /></button>
              </div>

              <div className="p-8">
                {/* Visual Credit Card - Realtime Update */}
                <div className="w-full h-48 bg-gradient-to-br from-indigo-600 to-purple-800 rounded-2xl p-6 text-white mb-8 shadow-xl relative overflow-hidden transition-all duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                  <div className="flex justify-between items-start mb-10">
                    <div className="w-12 h-8 bg-yellow-400/90 rounded-md shadow-inner"></div>
                    <div className="italic font-black text-xl opacity-90">VISA</div>
                  </div>
                  <div className="text-xl tracking-[0.2em] font-mono mb-6 min-h-[1.5rem]">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] uppercase opacity-60 mb-1 tracking-widest">Card Holder</p>
                      <p className="text-sm font-bold tracking-wide uppercase truncate max-w-[150px]">{transaction.userName || 'GUEST USER'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase opacity-60 mb-1 tracking-widest">Expires</p>
                      <p className="text-sm font-bold">{expiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl mb-6 border border-blue-100">
                  <img src={selectedProperty?.image} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 overflow-hidden">
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Properti {transaction.buyType}</p>
                    <p className="text-sm font-bold text-slate-800 truncate">{selectedProperty?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{selectedProperty?.price}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Card Number</label>
                    <div className="relative mt-1">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="4522 8890 1234 1098"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Expiry Date</label>
                      <div className="relative mt-1">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="text" placeholder="MM/YY" maxLength={5}
                          value={expiry} onChange={(e) => setExpiry(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">CVV</label>
                      <div className="relative mt-1">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                          type="password" placeholder="•••" maxLength={3}
                          value={cvv} onChange={(e) => setCvv(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleProcessPayment}
                  disabled={isProcessing}
                  className="w-full mt-8 py-5 bg-slate-900 text-white rounded-[1.5rem] font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Processing...</>
                  ) : (
                    <>Confirm Payment {selectedProperty?.price}</>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
