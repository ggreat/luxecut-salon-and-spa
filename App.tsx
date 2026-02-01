
import React, { useState, useEffect } from 'react';
import { IntroAnimation } from './components/IntroAnimation.tsx';
import { BookingWizard } from './components/BookingWizard.tsx';
import { StylistProfile } from './components/StylistProfile.tsx';
import { Stylist } from './types.ts';
import { getStylists } from './services/appointment.service.ts';

type AppView = 'home' | 'team';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [showBooking, setShowBooking] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [preselectedStylistId, setPreselectedStylistId] = useState<string | undefined>(undefined);
  const [selectedStylist, setSelectedStylist] = useState<Stylist | null>(null);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [isStylistsLoading, setIsStylistsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    fetchStylists();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchStylists = async () => {
    try {
      setIsStylistsLoading(true);
      const data = await getStylists();
      setStylists(data);
    } catch (err) {
      console.error("Failed to load stylists", err);
    } finally {
      setIsStylistsLoading(false);
    }
  };

  const handleBookNow = (stylistId?: string) => {
    setPreselectedStylistId(stylistId);
    setShowBooking(true);
    setIsMobileMenuOpen(false);
  };

  const handleCloseBooking = () => {
    setShowBooking(false);
    setPreselectedStylistId(undefined);
  };

  const navigateTo = (view: AppView) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (showIntro) {
    return <IntroAnimation onComplete={() => setShowIntro(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#d4af37] selection:text-black">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || currentView !== 'home' ? 'bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
             <svg className="w-8 h-8 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
            </svg>
            <span className="text-xl font-bold font-montserrat tracking-[0.2em] text-[#d4af37]">LUXECUT</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest text-gray-300">
            <button onClick={() => navigateTo('home')} className={`${currentView === 'home' ? 'text-[#d4af37]' : 'hover:text-[#d4af37]'} transition-colors uppercase`}>Services</button>
            <button onClick={() => navigateTo('team')} className={`${currentView === 'team' ? 'text-[#d4af37]' : 'hover:text-[#d4af37]'} transition-colors uppercase`}>Team</button>
            <button 
              onClick={() => handleBookNow()}
              className="px-6 py-2.5 bg-[#d4af37] text-black hover:bg-white transition-all rounded-full font-bold"
            >
              BOOK NOW
            </button>
          </div>

          <button className="md:hidden text-[#d4af37]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[45] bg-[#0a0a0a] flex flex-col items-center justify-center gap-8 text-2xl font-montserrat font-bold tracking-widest animate-fade-in">
          <button onClick={() => navigateTo('home')} className="hover:text-[#d4af37]">SERVICES</button>
          <button onClick={() => navigateTo('team')} className="hover:text-[#d4af37]">TEAM</button>
          <button 
            onClick={() => handleBookNow()}
            className="px-8 py-4 bg-[#d4af37] text-black rounded-full text-lg"
          >
            BOOK NOW
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="animate-fade-in">
        {currentView === 'home' ? (
          <>
            {/* Hero Section */}
            <header className="relative h-[100vh] flex items-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1512690135503-4f014e015d91?q=80&w=1920" 
                  alt="Salon Hero" 
                  className="w-full h-full object-cover opacity-40 scale-105"
                  style={{ animation: 'slow-zoom 20s linear infinite alternate' }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0a0a]"></div>
              </div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl">
                  <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase mb-6 block animate-fade-in-up">Elite Men's Salon</span>
                  <h1 className="text-6xl md:text-9xl font-bold font-montserrat leading-[0.9] mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    LUXURY <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#fff]">REDEFINED.</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-xl leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    Bespoke grooming for the modern individual. Our master stylists blend classic techniques with avant-garde aesthetics in the heart of Addis Ababa.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <button onClick={() => handleBookNow()} className="px-12 py-5 bg-[#d4af37] text-black font-bold tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-[#d4af37]/20">BOOK YOUR SESSION</button>
                    <button onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); }} className="px-12 py-5 border border-white/20 text-white font-bold tracking-widest rounded-full hover:bg-white hover:text-black transition-all text-center">EXPLORE SERVICES</button>
                  </div>
                </div>
              </div>
            </header>

            {/* Services Preview Section */}
            <section id="services" className="py-32 bg-[#0d0d0d]">
              <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20">
                  <div className="mb-8 md:mb-0">
                    <span className="text-[#d4af37] font-bold tracking-[0.2em] uppercase text-sm mb-4 block">Our Specialties</span>
                    <h2 className="text-4xl md:text-6xl font-bold font-montserrat">Curated Menu</h2>
                  </div>
                  <p className="text-gray-400 max-w-md leading-relaxed">Each service is a tailored ritual designed to enhance your unique features and reflect your sophisticated style.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { name: 'Precision Cut', price: '85+', img: 'https://images.unsplash.com/photo-1599351431247-f509403c74bc?q=80&w=800' },
                    { name: 'Artistic Color', price: '180+', img: 'https://images.unsplash.com/photo-1620331713515-7767746f361c?q=80&w=800' },
                    { name: 'Spa Rituals', price: '65+', img: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800' },
                    { name: 'Royal Grooming', price: '55+', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800' }
                  ].map((s, idx) => (
                    <div key={idx} className="group relative overflow-hidden rounded-3xl aspect-[3/4] cursor-pointer" onClick={() => handleBookNow()}>
                      <img src={s.img} alt={s.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 p-8 w-full">
                        <h3 className="text-2xl font-bold font-montserrat mb-2 group-hover:text-[#d4af37] transition-colors">{s.name}</h3>
                        <p className="text-[#d4af37] font-semibold tracking-widest text-sm">{s.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-20 text-center">
                  <button onClick={() => navigateTo('team')} className="text-[#d4af37] font-bold tracking-[0.3em] uppercase text-sm hover:underline">Meet the artists who make it happen →</button>
                </div>
              </div>
            </section>
          </>
        ) : (
          /* Dedicated TEAM PAGE */
          <section className="pt-40 pb-32 bg-[#0a0a0a] min-h-screen">
            <div className="container mx-auto px-6">
              <div className="text-center mb-24 animate-fade-in-up">
                <span className="text-[#d4af37] font-bold tracking-[0.4em] uppercase mb-6 block">The Visionaries</span>
                <h1 className="text-6xl md:text-8xl font-bold font-montserrat mb-10">Our Master Team</h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                  Our team is composed of award-winning stylists, visionary colorists, and grooming experts dedicated to the art of luxury.
                </p>
                <div className="w-24 h-1 bg-[#d4af37] mx-auto mt-12"></div>
              </div>

              {isStylistsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="aspect-[4/5] bg-white/5 rounded-[3rem] animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
                  {stylists.map((stylist, idx) => (
                    <div 
                      key={stylist.id} 
                      className="group cursor-pointer text-center animate-fade-in-up"
                      style={{ animationDelay: `${0.1 * idx}s` }}
                      onClick={() => setSelectedStylist(stylist)}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] mb-10 border border-white/10 transition-all duration-700 group-hover:border-[#d4af37]/40 group-hover:shadow-3xl group-hover:shadow-[#d4af37]/5">
                        <img 
                          src={stylist.image} 
                          alt={stylist.name} 
                          className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-end p-12 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0">
                          <span className="px-10 py-4 bg-[#d4af37] text-black font-bold tracking-[0.2em] rounded-full text-[10px] uppercase shadow-2xl">View Portfolio</span>
                        </div>
                      </div>
                      <h3 className="text-4xl font-bold font-montserrat mb-3 group-hover:text-[#d4af37] transition-colors">{stylist.name}</h3>
                      <p className="text-gray-500 font-bold tracking-[0.3em] uppercase text-xs">{stylist.role}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Stylist Profile Overlay */}
      {selectedStylist && (
        <StylistProfile 
          stylist={selectedStylist} 
          onClose={() => setSelectedStylist(null)}
          onBook={(id) => {
            setSelectedStylist(null);
            handleBookNow(id);
          }}
        />
      )}

      {/* Booking Wizard */}
      {showBooking && <BookingWizard onClose={handleCloseBooking} preselectedStylistId={preselectedStylistId} />}

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-white/5 pt-32 pb-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 mb-24">
            <div>
               <div className="flex items-center gap-2 mb-8">
                <svg className="w-8 h-8 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                </svg>
                <span className="text-2xl font-bold font-montserrat tracking-[0.2em] text-[#d4af37]">LUXECUT</span>
              </div>
              <p className="text-gray-500 leading-loose text-sm">Crafting excellence through precision and passion in Addis Ababa since 2012.</p>
            </div>
            <div>
              <h4 className="font-montserrat font-bold mb-8 tracking-[0.2em] text-xs uppercase text-white">Navigation</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Services</button></li>
                <li><button onClick={() => navigateTo('team')} className="hover:text-white transition-colors">Our Team</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-bold mb-8 tracking-[0.2em] text-xs uppercase text-white">Hours</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-medium">
                <li className="flex justify-between"><span>Weekdays</span> <span className="text-white">9am - 8pm</span></li>
                <li className="flex justify-between"><span>Weekends</span> <span className="text-white">10am - 6pm</span></li>
              </ul>
            </div>
            <div>
              <h4 className="font-montserrat font-bold mb-8 tracking-[0.2em] text-xs uppercase text-white">Contact</h4>
              <p className="text-[#d4af37] font-bold text-lg mb-2">+251 920 435 458</p>
              <p className="text-[#d4af37] font-bold text-lg mb-4">+251 979 114 648</p>
              <p className="text-gray-300 text-sm mb-4">gebrehiwotreda@gmail.com</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest font-bold">Addis Ababa, Ethiopia</p>
            </div>
          </div>
          <div className="pt-16 border-t border-white/5 text-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} LUXECUT INTERNATIONAL. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slow-zoom {
          from { transform: scale(1); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default App;
