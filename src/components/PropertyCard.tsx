import React from 'react';
import type { Property } from '../data';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Props {
  property: Property;
  index: number;
}

export const PropertyCard: React.FC<Props> = ({ property, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <Link to={`/property/${property.id}`}>
        <div className="relative h-40 md:h-64 overflow-hidden">
          <img 
            src={property.image} 
            alt={property.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-bold text-blue-900 uppercase tracking-wider">
            {property.type}
          </div>
          <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 text-white font-bold text-sm md:text-xl drop-shadow-md">
            {property.price}
          </div>
        </div>
        
        <div className="p-3 md:p-6">
          <h3 className="text-sm md:text-lg font-bold text-gray-900 mb-1 md:mb-2 truncate">{property.title}</h3>
          <div className="flex items-center text-gray-500 text-[10px] md:text-sm mb-2 md:mb-4">
            <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1 text-blue-500 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
          
          <div className="flex justify-between border-t pt-3 md:pt-4 text-gray-600 text-[10px] md:text-sm gap-1">
            <div className="flex items-center gap-0.5 md:gap-1">
              <Bed className="w-3 h-3 md:w-4 md:h-4" /> <span>{property.beds}<span className="hidden xs:inline"> Bed</span></span>
            </div>
            <div className="flex items-center gap-0.5 md:gap-1">
              <Bath className="w-3 h-3 md:w-4 md:h-4" /> <span>{property.baths}<span className="hidden xs:inline"> Bath</span></span>
            </div>
            <div className="flex items-center gap-0.5 md:gap-1">
              <Square className="w-3 h-3 md:w-4 md:h-4" /> <span>{property.sqft}m²</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};