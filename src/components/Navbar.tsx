import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-primary">
          <Home className="w-8 h-8 text-blue-600" />
          <span>Luxe<span className="text-blue-600">Estate</span></span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-600 transition">Beranda</Link>
          <Link to="/properties" className="hover:text-blue-600 transition">Properti</Link>
          <Link to="/agents" className="hover:text-blue-600 transition">Agen</Link>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition">
            Hubungi Kami
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t"
          >
            <div className="flex flex-col p-6 space-y-4 font-medium">
              <Link to="/" onClick={() => setIsOpen(false)}>Beranda</Link>
              <Link to="/properties" onClick={() => setIsOpen(false)}>Properti</Link>
              <Link to="/agents" onClick={() => setIsOpen(false)}>Agen</Link>
              <button className="bg-blue-600 text-white py-2 rounded-lg">Hubungi Kami</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};