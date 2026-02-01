
import React, { useEffect } from 'react';
import { Stylist } from '../types.ts';

interface StylistProfileProps {
  stylist: Stylist;
  onClose: () => void;
  onBook: (stylistId: string) => void;
}

export const StylistProfile: React.FC<StylistProfileProps> = ({ stylist, onClose, onBook }) => {
  useEffect(() => {
    // Lock body scroll when profile is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-y-auto animate-fade-in flex flex-col">
      {/* Top Floating Navigation */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl p-6 flex justify-between items-center border-b border-white/5 px-8 md:px-12">
        <button 
          onClick={onClose}
          className="flex items-center gap-3 text-gray-400 hover:text-white transition-all group"
        >
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#d4af37] group-hover:text-[#d4af37] transition-all">
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span className="text-[10px] tracking-[0.3em] font-bold uppercase">Back to Artists</span>
        </button>
        <button 
          onClick={() => onBook(stylist.id)}
          className="px-8 py-3 bg-[#d4af37] text-black font-bold text-[10px] tracking-[0.2em] rounded-full hover:bg-white transition-all shadow-xl shadow-[#d4af37]/10"
        >
          BOOK WITH {stylist.name.split(' ')[0].toUpperCase()}
        </button>
      </div>

      <div className="container mx-auto px-6 md:px-12 py-16 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          
          {/* Hero Sidebar */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-10 animate-fade-in-up">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl relative group">
              <img 
                src={stylist.image} 
                alt={stylist.name} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-10 left-10">
                 <p className="text-[#d4af37] font-bold tracking-[0.3em] text-xs uppercase mb-2">{stylist.role}</p>
                 <h1 className="text-5xl font-bold font-montserrat text-white">{stylist.name}</h1>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold tracking-[0.3em] text-gray-500 uppercase">Expert Specialties</h3>
              <div className="flex flex-wrap gap-3">
                {stylist.specialties.map((spec, i) => (
                  <span key={i} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300 font-medium">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Content */}
          <div className="lg:col-span-7 space-y-24 pb-32">
            
            {/* Bio Section */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] uppercase mb-10">The Artisan Journey</h3>
              <p className="text-2xl md:text-3xl text-gray-400 leading-snug font-light italic">
                "{stylist.bio}"
              </p>
            </section>

            {/* Portfolio Grid */}
            <section className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-[10px] font-bold tracking-[0.3em] text-[#d4af37] uppercase">Curated Portfolio</h3>
                <span className="text-gray-600 text-[10px] font-bold tracking-widest uppercase">{stylist.portfolio.length} Masterpieces</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stylist.portfolio.map((item, i) => (
                  <div key={i} className="group relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 bg-white/5">
                    <img 
                      src={item} 
                      alt={`${stylist.name} Portfolio Piece ${i+1}`} 
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                       <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-[#d4af37]/20 to-black rounded-[3rem] p-16 text-center border border-[#d4af37]/20 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <h2 className="text-4xl font-bold font-montserrat mb-6">Experience {stylist.name.split(' ')[0]}'s touch.</h2>
              <p className="text-gray-400 mb-12 max-w-md mx-auto leading-relaxed">Appointments are limited for our Master Stylists. Secure your transformation today.</p>
              <button 
                onClick={() => onBook(stylist.id)}
                className="px-16 py-6 bg-[#d4af37] text-black font-bold tracking-[0.2em] uppercase text-xs rounded-full hover:bg-white hover:scale-105 transition-all shadow-2xl"
              >
                Book This Artist Now
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
