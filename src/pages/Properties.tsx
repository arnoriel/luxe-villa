import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { properties } from '../data';
import { PropertyCard } from '../components/PropertyCard';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const Properties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const query = searchParams.get('search') || '';

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesType = filter === 'Semua' || p.type === filter;
      const matchesSearch = p.title.toLowerCase().includes(query.toLowerCase()) || 
                           p.location.toLowerCase().includes(query.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [filter, query]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, query]);

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProperties.slice(indexOfFirstItem, indexOfLastItem);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams({ search: e.target.value });
  };

  return (
    <div className="pt-24 pb-20 min-h-screen container mx-auto px-4 md:px-6">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Cari Properti</h1>
        
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Cari lagi di sini..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto w-full no-scrollbar">
            {['Semua', 'Rumah', 'Apartemen', 'Villa'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-6 py-2 rounded-full transition-all border whitespace-nowrap ${
                  filter === type 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-lg' 
                  : 'bg-white text-slate-600 border-gray-200 hover:border-blue-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {query && (
          <p className="mt-4 text-gray-500">
            Menampilkan hasil untuk: <span className="font-bold text-slate-900">"{query}"</span>
          </p>
        )}
      </div>

      {/* Perubahan grid-cols-2 pada mobile */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
        {currentItems.map((prop, idx) => (
          <PropertyCard key={prop.id} property={prop} index={idx} />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400">Wah, properti yang kamu cari belum ada nih.</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft />
          </button>
          
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-lg font-bold transition ${
                  currentPage === i + 1 
                  ? 'bg-blue-600 text-white' 
                  : 'text-slate-600 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};