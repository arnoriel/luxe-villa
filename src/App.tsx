import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Properties } from './pages/Properties';
import { Agents } from './pages/Agents';
import { PropertyDetail } from './pages/PropertyDetail';
import { Dashboard } from './pages/Dashboard';

// 1. Component Wrapper untuk konten utama
const AppContent = () => {
  const location = useLocation();
  
  // Logic: Cek apakah path saat ini adalah '/dashboard'
  const isDashboardPage = location.pathname === '/dashboard';

  // Helper scroll to top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 2. Hanya tampilkan Navbar jika BUKAN halaman dashboard */}
      {!isDashboardPage && <Navbar />}
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>

      {/* 3. Hanya tampilkan Footer jika BUKAN halaman dashboard */}
      {!isDashboardPage && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;