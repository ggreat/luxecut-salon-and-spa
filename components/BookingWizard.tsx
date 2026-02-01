
import React, { useState, useEffect } from 'react';
import { BookingStep, SalonService, Stylist, AppointmentRequest } from '../types.ts';
import { getServices, getStylists, checkAvailability, createAppointment } from '../services/appointment.service.ts';

interface BookingWizardProps {
  onClose: () => void;
  preselectedStylistId?: string;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ onClose, preselectedStylistId }) => {
  const [step, setStep] = useState<BookingStep>(BookingStep.SERVICE);
  const [services, setServices] = useState<SalonService[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selection, setSelection] = useState({
    serviceId: '',
    stylistId: preselectedStylistId || '',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    loadServices();
    if (preselectedStylistId) {
      loadInitialStylist(preselectedStylistId);
    }
  }, [preselectedStylistId]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err: any) {
      setError(err.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const loadInitialStylist = async (id: string) => {
    try {
      const allStylists = await getStylists();
      setStylists(allStylists);
    } catch (err) {
      console.error(err);
    }
  };

  const handleServiceSelect = async (id: string) => {
    setSelection(prev => ({ ...prev, serviceId: id }));
    setLoading(true);
    try {
      if (selection.stylistId) {
        setStep(BookingStep.DATETIME);
      } else {
        const data = await getStylists(id);
        setStylists(data);
        setStep(BookingStep.STYLIST);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load stylists");
    } finally {
      setLoading(false);
    }
  };

  const handleStylistSelect = async (id: string) => {
    setSelection(prev => ({ ...prev, stylistId: id }));
    setStep(BookingStep.DATETIME);
  };

  const handleDateSelect = async (date: string) => {
    setSelection(prev => ({ ...prev, date }));
    setLoading(true);
    try {
      const slots = await checkAvailability(selection.stylistId, date);
      setTimeSlots(slots);
    } catch (err: any) {
      setError(err.message || "Failed to check availability");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: AppointmentRequest = {
        serviceId: selection.serviceId,
        stylistId: selection.stylistId,
        dateTime: `${selection.date}T${selection.time}:00`,
        customerName: selection.name,
        customerEmail: selection.email,
        customerPhone: selection.phone,
        notes: selection.notes
      };
      await createAppointment(payload);
      setStep(BookingStep.CONFIRMATION);
    } catch (err: any) {
      setError(err.message || "Failed to confirm booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#111] border border-white/10 w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0a0a0a]">
          <div>
            <h2 className="text-xl font-bold text-white font-montserrat">
              {step === BookingStep.CONFIRMATION ? 'Booking Confirmed!' : 'Book Appointment'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">Step {Object.values(BookingStep).indexOf(step) + 1} of 4</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4">{error}</div>}

          {step === BookingStep.SERVICE && (
            <div className="grid grid-cols-1 gap-4">
              <h3 className="text-white font-medium mb-2">Select a Service</h3>
              {loading ? <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-white/5 rounded-lg" />)}
              </div> : (
                services.map(s => (
                  <button key={s.id} onClick={() => handleServiceSelect(s.id)} className="flex justify-between items-center p-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#d4af37] hover:bg-[#d4af37]/5 transition-all text-left">
                    <div>
                      <h4 className="text-white font-semibold">{s.name}</h4>
                      <p className="text-gray-400 text-sm">{s.duration} min • {s.category}</p>
                    </div>
                    <span className="text-[#d4af37] font-bold font-montserrat">${s.price}</span>
                  </button>
                ))
              )}
            </div>
          )}

          {step === BookingStep.STYLIST && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <h3 className="col-span-full text-white font-medium mb-2">Choose your Specialist</h3>
              {stylists.map(s => (
                <button key={s.id} onClick={() => handleStylistSelect(s.id)} className="flex items-center gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:border-[#d4af37] transition-all text-left">
                  <img src={s.image} alt={s.name} className="w-16 h-16 rounded-full object-cover border border-white/10" />
                  <div>
                    <h4 className="text-white font-semibold">{s.name}</h4>
                    <p className="text-[#d4af37] text-xs font-medium uppercase tracking-wider">{s.role}</p>
                  </div>
                </button>
              ))}
              <button onClick={() => setStep(BookingStep.SERVICE)} className="col-span-full text-gray-400 mt-4 underline text-sm">Back to services</button>
            </div>
          )}

          {step === BookingStep.DATETIME && (
            <div className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Select Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => handleDateSelect(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-[#d4af37] outline-none"
                />
              </div>
              {selection.date && (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Available Slots</label>
                  {loading ? <div className="h-20 flex items-center justify-center"><div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent animate-spin rounded-full"></div></div> : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {timeSlots.map(time => (
                      <button 
                        key={time} 
                        onClick={() => {
                          setSelection(prev => ({ ...prev, time }));
                          setStep(BookingStep.INFO);
                        }}
                        className={`p-2 text-sm rounded-lg border border-white/10 transition-all ${selection.time === time ? 'bg-[#d4af37] border-[#d4af37] text-black font-bold' : 'bg-white/5 text-white hover:border-[#d4af37]'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  )}
                </div>
              )}
              <button onClick={() => setStep(selection.stylistId && !preselectedStylistId ? BookingStep.STYLIST : BookingStep.SERVICE)} className="text-gray-400 mt-4 underline text-sm">Change selection</button>
            </div>
          )}

          {step === BookingStep.INFO && (
            <form onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Full Name</label>
                  <input required type="text" value={selection.name} onChange={e => setSelection({...selection, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Phone Number</label>
                  <input required type="tel" value={selection.phone} onChange={e => setSelection({...selection, phone: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none" placeholder="+1 (555) 000-0000" />
                </div>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Email Address</label>
                <input required type="email" value={selection.email} onChange={e => setSelection({...selection, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-1">Special Requests (Optional)</label>
                <textarea value={selection.notes} onChange={e => setSelection({...selection, notes: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white outline-none h-24" placeholder="Any specific requirements..." />
              </div>
              <button disabled={loading} type="submit" className="w-full py-4 bg-[#d4af37] text-black font-bold rounded-xl hover:bg-[#b8962d] transition-all disabled:opacity-50">
                {loading ? 'Processing...' : 'Confirm Appointment'}
              </button>
            </form>
          )}

          {step === BookingStep.CONFIRMATION && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">You're all set!</h3>
              <p className="text-gray-400 mb-8 max-w-sm mx-auto">We've sent a confirmation email with all the details of your appointment.</p>
              <div className="bg-white/5 rounded-xl p-4 text-left max-w-sm mx-auto border border-white/10">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Date:</span>
                  <span className="text-white font-medium">{selection.date} at {selection.time}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Service:</span>
                  <span className="text-white font-medium">{services.find(s => s.id === selection.serviceId)?.name || 'Service selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Stylist:</span>
                  <span className="text-white font-medium">{stylists.find(s => s.id === selection.stylistId)?.name || 'Specialist selected'}</span>
                </div>
              </div>
              <button onClick={onClose} className="mt-8 text-[#d4af37] font-semibold hover:underline">Return to Home</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
