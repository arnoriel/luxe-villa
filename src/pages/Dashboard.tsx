import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { properties, agents } from '../data'; // Import data dari file data.ts
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Home,
  MoreVertical,
  Plus,
  ShoppingBag,
  Trash2,
  ShieldCheck,
  MapPin,
  Star
} from 'lucide-react';

// --- Tipe Data ---
type SectionType = 'dashboard' | 'properties' | 'agents' | 'customers';

const AUTH_KEY = "luxe_admin_logged_in";

export const Dashboard = () => {
  // --- State untuk Auth & Navigasi ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionType>('dashboard');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // --- State untuk Login Form ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // --- State untuk Data Customer (Chatbot) ---
  const [customers, setCustomers] = useState<any[]>([]);

  // 1. Logika Persistence Login (Cek LocalStorage saat aplikasi dibuka)
  useEffect(() => {
    const loggedInStatus = localStorage.getItem(AUTH_KEY);
    if (loggedInStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // 2. Mengambil data customer dari localStorage
  useEffect(() => {
    const loadCustomers = () => {
      const savedData = localStorage.getItem('luxe_customers');
      if (savedData) {
        setCustomers(JSON.parse(savedData));
      }
    };
    loadCustomers();
    window.addEventListener('storage', loadCustomers);
    return () => window.removeEventListener('storage', loadCustomers);
  }, [activeSection]);

  // --- HELPER: Mencari Nama Properti Berdasarkan ID ---
  const getPropertyInfo = (id: number) => {
    const found = properties.find((p) => p.id === id);
    return found ? found.title : `Properti #${id}`;
  };

  // --- Handler Login ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'username1' && password === 'pass1234') {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, 'true');
      setError('');
    } else {
      setError('Username atau password salah!');
    }
  };

  // --- Handler Logout ---
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar dari panel admin?")) {
      setIsAuthenticated(false);
      localStorage.removeItem(AUTH_KEY);
      setUsername('');
      setPassword('');
      setActiveSection('dashboard');
    }
  };

  // --- Handler Hapus Data Customer ---
  const clearCustomerData = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data transaksi chatbot?")) {
      localStorage.removeItem('luxe_customers');
      setCustomers([]);
    }
  };

  // --------------------------------------------------------------------------
  // VIEW: LOGIN PAGE
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-white/20 relative z-10"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">LuxeEstate</h1>
            <p className="text-gray-500 mt-2 font-medium">Administrator CMS Panel</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="admin_luxe"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-500 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
            
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-xs text-center font-bold border border-red-100">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              Sign In to Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // VIEW: DASHBOARD CONTENT
  // --------------------------------------------------------------------------
  
  const SidebarItem = ({ id, icon: Icon, label }: { id: SectionType, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveSection(id);
        if (window.innerWidth < 768) setSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeSection === id 
        ? 'bg-blue-600 text-white shadow-blue-500/30 shadow-lg font-bold' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR */}
      <aside 
        className={`fixed md:relative z-30 h-full w-64 bg-slate-900 text-white transition-all duration-300 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">L</div>
            <span className="font-bold text-xl tracking-tight">LuxeCMS</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Menu Utama</p>
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarItem id="properties" icon={Building2} label="Properti" />
          <SidebarItem id="customers" icon={ShoppingBag} label="Leads/Customers" />
          <SidebarItem id="agents" icon={Users} label="Agen & Staff" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut size={20} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden md:block capitalize">
              {activeSection.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-900">Admin Utama</p>
              <p className="text-xs text-green-500 font-medium">Online Status</p>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        {/* DYNAMIC CONTENT SECTION */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50/50">
          <AnimatePresence mode="wait">
            
            {/* SECTION: DASHBOARD OVERVIEW */}
            {activeSection === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard title="Total Properti" value={properties.length.toString()} icon={Home} trend="+12%" color="blue" />
                  <StatCard title="Total Leads Chat" value={customers.length.toString()} icon={ShoppingBag} trend="+100%" color="purple" />
                  <StatCard title="Total Pendapatan (Est)" value="Rp 45.2M" icon={DollarSign} trend="+24%" color="green" />
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                  <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={20} /> Properti Terbaru
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase font-bold">
                          <th className="pb-4 pl-2">Nama</th>
                          <th className="pb-4">Lokasi</th>
                          <th className="pb-4">Harga</th>
                          <th className="pb-4 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {properties.slice(0, 5).map((prop) => (
                          <tr key={prop.id} className="hover:bg-gray-50/80 transition">
                            <td className="py-5 pl-2 font-bold text-slate-800">{prop.title}</td>
                            <td className="py-5 text-gray-500">{prop.location}</td>
                            <td className="py-5 text-blue-600 font-black">{prop.price}</td>
                            <td className="py-5 text-center">
                              <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Aktif</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SECTION: CUSTOMERS / LEADS */}
            {activeSection === 'customers' && (
              <motion.div
                key="customers"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-white">
                  <div>
                    <h3 className="text-xl font-black">Data Transaksi & Leads</h3>
                    <p className="text-gray-400 text-sm mt-1">Data yang masuk secara otomatis melalui Chatbot Luxe Estate.</p>
                  </div>
                  <button 
                    onClick={clearCustomerData}
                    className="flex items-center gap-2 text-red-500 text-xs font-bold hover:bg-red-50 px-4 py-2.5 rounded-xl transition"
                  >
                    <Trash2 size={16} /> Kosongkan Semua Data
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Nama Pelanggan</th>
                        <th className="px-8 py-5">Properti Yang Diminati</th>
                        <th className="px-8 py-5">Tipe Transaksi</th>
                        <th className="px-8 py-5">Status Pembayaran</th>
                        <th className="px-8 py-5">Tanggal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {customers.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center">
                            <div className="flex flex-col items-center opacity-30">
                              <ShoppingBag size={48} className="mb-2" />
                              <p className="font-bold">Belum ada data masuk dari chatbot.</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        customers.map((c) => (
                          <tr key={c.id} className="hover:bg-blue-50/30 transition group">
                            <td className="px-8 py-6 font-bold text-slate-800">{c.name}</td>
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-blue-600 group-hover:underline cursor-pointer">
                                  {getPropertyInfo(c.property_id)}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">ID: #{c.property_id}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 capitalize">
                                {c.buy_type}
                              </span>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                c.payment_status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                              }`}>
                                {c.payment_status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-xs text-gray-400 font-medium">{c.date}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* SECTION: PROPERTIES */}
            {activeSection === 'properties' && (
              <motion.div
                key="properties"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" placeholder="Cari unit properti..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20" />
                  </div>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/20">
                    <Plus size={20} /> Tambah Properti Baru
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
                      <tr>
                        <th className="px-8 py-5">Info Properti</th>
                        <th className="px-8 py-5">Kategori</th>
                        <th className="px-8 py-5">Harga Jual</th>
                        <th className="px-8 py-5">Spesifikasi</th>
                        <th className="px-8 py-5 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {properties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-gray-50 transition">
                          <td className="px-8 py-5 flex items-center gap-4">
                            <img src={prop.image} alt="" className="w-16 h-12 object-cover rounded-xl shadow-sm" />
                            <div>
                                <p className="font-bold text-slate-800">{prop.title}</p>
                                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium">
                                  <MapPin size={10} /> {prop.location}
                                </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-[10px] font-black uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded border border-gray-100">{prop.type}</span>
                          </td>
                          <td className="px-8 py-5 font-black text-blue-600">{prop.price}</td>
                          <td className="px-8 py-5 text-xs text-slate-500 font-medium">
                            {prop.beds} Bed • {prop.baths} Bath • {prop.sqft}m²
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-300 transition">
                              <MoreVertical size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* SECTION: AGENTS */}
            {activeSection === 'agents' && (
              <motion.div
                key="agents"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {agents.map((agent) => (
                  <div key={agent.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">
                      <MoreVertical size={16} className="text-gray-400" />
                    </div>
                    <img src={agent.image} alt={agent.name} className="w-20 h-20 rounded-2xl object-cover mb-4 shadow-md border-2 border-white" />
                    <h3 className="font-black text-slate-900 leading-tight">{agent.name}</h3>
                    <p className="text-blue-600 text-[11px] font-black uppercase tracking-tighter mb-4">{agent.role}</p>
                    
                    <div className="space-y-2 border-t pt-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-medium">Rating</span>
                        <span className="font-bold flex items-center gap-1 text-orange-500"><Star size={12} fill="currentColor" /> {agent.rating}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-400 font-medium">Total Listing</span>
                        <span className="font-bold text-slate-800">{agent.propertiesCount} Properti</span>
                      </div>
                    </div>
                  </div>
                ))}
                <button className="border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center p-8 text-gray-300 hover:border-blue-500 hover:bg-blue-50/50 hover:text-blue-500 transition group gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                    <Plus size={24} />
                  </div>
                  <span className="font-black text-sm uppercase tracking-widest">Tambah Agen</span>
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- Helper Component: Stat Card ---
const StatCard = ({ title, value, icon: Icon, trend, color }: any) => {
  const colorClasses: any = { 
    blue: "bg-blue-50 text-blue-600", 
    purple: "bg-purple-50 text-purple-600", 
    green: "bg-emerald-50 text-emerald-600" 
  };
  
  return (
    <div className="bg-white p-7 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
        <div className="flex items-center gap-1 mt-2 text-[10px] font-bold text-emerald-500 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
          <TrendingUp size={10} /> <span>{trend}</span>
        </div>
      </div>
      <div className={`p-5 rounded-2xl transition-transform group-hover:scale-110 duration-300 ${colorClasses[color]}`}>
        <Icon size={28} />
      </div>
    </div>
  );
};