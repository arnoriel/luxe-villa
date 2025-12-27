
export const Footer = () => (
  <footer className="bg-slate-900 text-white py-12">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-xl font-bold mb-4">LuxeEstate</h3>
        <p className="text-slate-400 text-sm">Mitra terpercaya Anda dalam menemukan hunian impian dengan kualitas terbaik.</p>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Perusahaan</h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li>Tentang Kami</li>
          <li>Karir</li>
          <li>Hubungi Kami</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Dukungan</h4>
        <ul className="space-y-2 text-slate-400 text-sm">
          <li>Pusat Bantuan</li>
          <li>Syarat & Ketentuan</li>
          <li>Kebijakan Privasi</li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-4">Newsletter</h4>
        <input type="email" placeholder="Email Anda" className="w-full px-4 py-2 rounded bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-blue-500" />
      </div>
    </div>
    <div className="text-center mt-12 text-slate-600 text-xs">
      &copy; 2024 LuxeEstate Property. All rights reserved.
    </div>
  </footer>
);