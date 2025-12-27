import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { properties } from '../data';
import { PropertyCard } from '../components/PropertyCard';
import { Search, Shield, Star, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  const featuredProperties = properties.filter(p => p.isFeatured);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/properties');
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative h-[650px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80" 
            className="w-full h-full object-cover"
            alt="Hero Luxury House"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-16"
        >
          <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Temukan Hunian Mewah <br className="hidden md:block"/> Impian Anda
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light">
            Koleksi properti eksklusif di lokasi terbaik. Kami membantu Anda menemukan rumah yang bukan sekadar tempat tinggal.
          </p>
          
          <form 
            onSubmit={handleSearch}
            className="bg-white p-3 md:p-2 rounded-2xl md:rounded-full shadow-2xl max-w-2xl mx-auto flex flex-col md:flex-row items-center gap-3 md:gap-2"
          >
            <div className="relative w-full flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 md:hidden" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari lokasi, nama properti..." 
                  className="w-full pl-12 pr-4 md:px-8 py-4 rounded-xl md:rounded-full focus:outline-none text-gray-700 bg-gray-50 md:bg-transparent text-lg"
                />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl md:rounded-full flex items-center justify-center gap-2 font-bold transition-all w-full md:w-auto shadow-lg active:scale-95"
            >
              <Search className="w-5 h-5 hidden md:block" />
              <span>Cari Sekarang</span>
            </button>
          </form>
        </motion.div>
      </section>

      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-blue-600 font-bold tracking-widest uppercase text-sm">Rekomendasi</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-2">Pilihan Editor</h2>
            <p className="text-gray-500 mt-2 md:mt-4 text-base md:text-lg">Properti terbaik minggu ini yang dikurasi khusus untuk Anda.</p>
          </div>
          <Link 
            to="/properties" 
            className="group flex items-center gap-2 text-blue-600 font-bold text-base md:text-lg hover:gap-4 transition-all"
          >
            Lihat Semua Properti <span className="text-xl md:text-2xl">→</span>
          </Link>
        </div>
        
        {/* Perubahan grid-cols-2 pada mobile */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-10">
          {featuredProperties.map((prop, idx) => (
            <PropertyCard key={prop.id} property={prop} index={idx} />
          ))}
        </div>
      </section>
      
      <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div className="container mx-auto px-6 relative z-10 text-center">
            <span className="text-blue-400 font-bold tracking-widest uppercase text-sm">Keunggulan Kami</span>
            <h2 className="text-4xl font-bold mt-4 mb-16">Kenapa Memilih LuxeEstate?</h2>
            
            <div className="grid md:grid-cols-3 gap-12">
                {[
                    {
                      title: "Agen Terpercaya", 
                      desc: "Tim profesional berpengalaman lebih dari 10 tahun siap membantu legalitas dan negosiasi Anda.",
                      icon: <Shield className="w-10 h-10 text-blue-400" />
                    },
                    {
                      title: "Listing Eksklusif", 
                      desc: "Akses prioritas ke properti premium yang tidak dipasarkan secara umum di platform lain.",
                      icon: <Star className="w-10 h-10 text-blue-400" />
                    },
                    {
                      title: "Layanan Premium", 
                      desc: "Konsultasi personal 24/7 dan layanan after-sales untuk memastikan kenyamanan transaksi Anda.",
                      icon: <Headphones className="w-10 h-10 text-blue-400" />
                    }
                ].map((item, i) => (
                    <motion.div 
                      key={i} 
                      whileHover={{ y: -10 }}
                      className="bg-white/5 backdrop-blur-sm p-10 rounded-3xl border border-white/10 hover:border-blue-500/50 transition-all text-left"
                    >
                        <div className="mb-6">{item.icon}</div>
                        <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
         </div>
      </section>

      <section className="py-24 container mx-auto px-6 text-center">
        <div className="bg-blue-600 rounded-[3rem] p-12 md:p-20 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Menemukan Rumah Impian Anda?</h2>
            <p className="text-blue-10 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-90">
              Jangan tunda lagi. Hubungi konsultan kami sekarang dan dapatkan penawaran eksklusif untuk properti pilihan.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition shadow-xl">
                Jadwalkan Konsultasi
              </button>
              <Link to="/properties" className="bg-blue-700 text-white border border-blue-400 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-800 transition">
                Jelajahi Listing
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        </div>
      </section>
    </div>
  );
};