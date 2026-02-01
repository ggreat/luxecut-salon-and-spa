
import React, { useEffect, useState } from 'react';

/**
 * IntroAnimation Component
 * Handles the initial "disintegrated parts flying together" sequence.
 */
export const IntroAnimation: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'disintegrated' | 'assembled' | 'morph' | 'done'>('disintegrated');

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('assembled'), 1000);
    const timer2 = setTimeout(() => setPhase('morph'), 2500);
    const timer3 = setTimeout(() => onComplete(), 4000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Disintegrated Parts */}
        <div className={`transition-all duration-1000 ease-out transform ${phase === 'disintegrated' ? '-translate-x-40 -translate-y-40 opacity-0 rotate-45' : 'translate-0 opacity-100 rotate-0'}`}>
           <svg viewBox="0 0 100 100" className="w-16 h-16 absolute top-0 left-0 text-gold-500 fill-[#d4af37]">
             <rect x="30" y="20" width="40" height="60" rx="4" />
           </svg>
        </div>
        <div className={`transition-all duration-1000 ease-out transform delay-100 ${phase === 'disintegrated' ? 'translate-x-40 -translate-y-20 opacity-0 -rotate-12' : 'translate-0 opacity-100 rotate-0'}`}>
           <svg viewBox="0 0 100 100" className="w-12 h-12 absolute bottom-0 right-0 fill-[#d4af37]">
             <path d="M20 10 L80 10 L75 30 L25 30 Z" />
           </svg>
        </div>
        <div className={`transition-all duration-1000 ease-out transform delay-200 ${phase === 'disintegrated' ? 'translate-y-40 opacity-0 scale-50' : 'translate-0 opacity-100 scale-100'}`}>
           <svg viewBox="0 0 100 100" className="w-20 h-20 absolute top-10 right-10 fill-[#d4af37]">
             <circle cx="50" cy="50" r="10" />
           </svg>
        </div>

        {/* The Morphing Logo */}
        <div className={`absolute transition-all duration-1000 ease-in-out ${phase === 'morph' ? 'scale-150 opacity-100' : phase === 'assembled' ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="flex flex-col items-center">
            <svg className="w-24 h-24 text-[#d4af37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
            </svg>
            <h1 className={`mt-4 text-3xl font-bold tracking-widest text-[#d4af37] font-montserrat transition-all duration-700 ${phase === 'morph' ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              LUXECUT
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};
