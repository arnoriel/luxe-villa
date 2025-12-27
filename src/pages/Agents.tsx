import { agents } from '../data';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Phone } from 'lucide-react';

export const Agents = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold text-slate-900 mb-6"
          >
            Bertemu Dengan Agen Profesional Kami
          </motion.h1>
          <p className="text-gray-600 text-base md:text-lg">
            Tim ahli kami siap membantu Anda menavigasi pasar properti dengan pengetahuan lokal dan dedikasi penuh.
          </p>
        </div>

        {/* Perubahan grid-cols-2 pada mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          {agents.map((agent, idx) => (
            <motion.div 
              key={agent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="relative h-40 md:h-72 overflow-hidden">
                <img 
                  src={agent.image} 
                  alt={agent.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 md:pb-6 gap-2 md:gap-4">
                  <button className="bg-white p-2 md:p-3 rounded-full text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <Phone className="w-4 h-4 md:w-5 h-5" />
                  </button>
                  <button className="bg-white p-2 md:p-3 rounded-full text-green-600 hover:bg-green-600 hover:text-white transition">
                    <MessageSquare className="w-4 h-4 md:w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-3 md:p-6 text-center">
                <h3 className="text-sm md:text-xl font-bold text-slate-900 mb-0.5 md:mb-1 truncate">{agent.name}</h3>
                <p className="text-blue-600 font-medium text-[10px] md:text-sm mb-2 md:mb-4">{agent.role}</p>
                
                <div className="flex items-center justify-center gap-1 mb-2 md:mb-4">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-slate-900 text-xs md:text-base">{agent.rating}</span>
                  <span className="text-gray-400 text-[10px] md:text-sm">({agent.propertiesCount})</span>
                </div>

                <div className="bg-gray-50 rounded-lg md:rounded-xl p-2 md:p-3">
                  <p className="text-[8px] md:text-xs text-gray-500 uppercase tracking-wider mb-0.5 md:mb-1">Spesialisasi</p>
                  <p className="text-[10px] md:text-sm font-semibold text-slate-700 truncate">{agent.specialization}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};