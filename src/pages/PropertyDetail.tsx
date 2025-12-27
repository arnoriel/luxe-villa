import { useParams, Link } from 'react-router-dom';
import { properties } from '../data';
import { Bed, Bath, Square, MapPin, Phone, CheckCircle } from 'lucide-react';

export const PropertyDetail = () => {
  const { id } = useParams();
  const property = properties.find(p => p.id === Number(id));

  if (!property) return <div className="pt-32 text-center">Properti tidak ditemukan.</div>;

  return (
    <div className="pt-24 pb-20 container mx-auto px-6">
      <Link to="/properties" className="text-gray-500 hover:text-blue-600 mb-6 inline-block">← Kembali ke Listing</Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px]">
            <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
          </div>

          <div>
            <div className="flex justify-between items-start">
              <div>
                 <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-bold mb-3 inline-block">
                    {property.type}
                 </span>
                 <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{property.title}</h1>
                 <div className="flex items-center text-gray-500 text-lg">
                    <MapPin className="w-5 h-5 mr-2 text-blue-600" /> {property.location}
                 </div>
              </div>
              <div className="text-right hidden md:block">
                 <div className="text-3xl font-bold text-blue-600">{property.price}</div>
              </div>
            </div>

            {/* Mobile Price */}
            <div className="text-3xl font-bold text-blue-600 mt-4 md:hidden">{property.price}</div>
          </div>

          <div className="flex gap-6 border-y py-6">
             <div className="flex items-center gap-2"><Bed className="w-6 h-6 text-gray-400" /> <span className="font-bold">{property.beds}</span> Beds</div>
             <div className="flex items-center gap-2"><Bath className="w-6 h-6 text-gray-400" /> <span className="font-bold">{property.baths}</span> Baths</div>
             <div className="flex items-center gap-2"><Square className="w-6 h-6 text-gray-400" /> <span className="font-bold">{property.sqft}</span> m²</div>
          </div>

          <div>
             <h2 className="text-xl font-bold mb-4">Deskripsi</h2>
             <p className="text-gray-600 leading-relaxed">{property.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Fasilitas</h2>
            <div className="grid grid-cols-2 gap-3">
                {['Kolam Renang', 'Gym', 'Keamanan 24 Jam', 'Taman', 'Parkir Luas', 'Smart Home'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500" /> {f}
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Sidebar Agent */}
        <div className="lg:col-span-1">
           <div className="bg-white p-6 rounded-2xl shadow-lg border sticky top-28">
              <h3 className="text-xl font-bold mb-6">Hubungi Agen</h3>
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80" alt="Agent" />
                 </div>
                 <div>
                    <div className="font-bold text-lg">Budi Santoso</div>
                    <div className="text-gray-500 text-sm">Senior Property Agent</div>
                 </div>
              </div>
              
              <form className="space-y-4">
                 <input type="text" placeholder="Nama Anda" className="w-full border p-3 rounded-lg focus:outline-blue-500" />
                 <input type="email" placeholder="Email" className="w-full border p-3 rounded-lg focus:outline-blue-500" />
                 <textarea placeholder="Pesan (Saya tertarik dengan properti ini...)" rows={4} className="w-full border p-3 rounded-lg focus:outline-blue-500"></textarea>
                 <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Kirim Pesan WhatsApp
                 </button>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};