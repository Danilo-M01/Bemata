'use client';

import { useState, useEffect } from 'react';

interface Reservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  tableId: string;
  note?: string;
  diet?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export default function DashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'today' | 'future'>('pending');
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/reservations');
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
    const interval = setInterval(fetchReservations, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteReservation = async (id: string) => {
    if (!window.confirm('Da li ste sigurni da želite da trajno obrišete ovu rezervaciju iz baze?')) return;
    try {
      const res = await fetch(`/api/reservations?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchReservations();
      } else {
        alert('Greška pri brisanju rezervacije.');
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingReservation) return;

    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
      id: editingReservation.id,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      guests: formData.get('guests') as string,
      tableId: (formData.get('tableId') as string) || null,
      diet: (formData.get('diet') as string) || null,
      note: (formData.get('note') as string) || null,
    };

    try {
      const res = await fetch('/api/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setEditingReservation(null);
        fetchReservations();
      } else {
        const errData = await res.json();
        alert(errData.error || 'Greška pri izmeni rezervacije.');
      }
    } catch (error) {
      console.error('Error updating reservation:', error);
      alert('Greška na serveru.');
    }
  };

  const today = new Date().toISOString().split('T')[0];
  
  const pendingReservations = [...reservations]
    .filter(r => r.status === 'pending')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const todayReservations = reservations.filter(r => r.date === today && r.status === 'confirmed');
  const futureReservations = reservations.filter(r => r.date > today && r.status === 'confirmed').sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-800 font-sans">
      {/* Top Nav */}
      <nav className="bg-[#f4f2ee] border-b border-stone-200/60 sticky top-0 z-30 backdrop-blur-md bg-[#f4f2ee]/80">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <img src="/bemata-logo.svg" alt="Bemata" className="h-8 w-auto" />
              <h1 className="text-xl font-serif text-stone-900 tracking-tight flex items-baseline gap-2">
                Bemata <span className="text-stone-400 font-sans text-xs font-semibold tracking-wider uppercase">Portal</span>
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={fetchReservations}
                className="text-stone-500 hover:text-stone-900 transition p-2 rounded-full hover:bg-stone-100"
                title="Osveži"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              <button 
                onClick={() => {
                  document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                  window.location.href = '/admin/login';
                }}
                className="text-sm font-medium text-stone-500 hover:text-stone-900 transition"
              >
                Odjava
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Layout */}
      <main className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="mb-10">
          <h2 className="text-3xl font-serif text-stone-900 mb-2">Upravljanje Rezervacijama</h2>
          <p className="text-stone-500 text-sm italic">Pregled po prioritetima: novi zahtevi, današnji plan i buduće posete.</p>
        </div>

        {/* Mobile Stats (only visible on mobile/tablet) */}
        <div className="grid grid-cols-3 gap-3 mb-6 xl:hidden">
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-stone-100/70 text-center">
            <span className="text-stone-400 text-[9px] font-bold uppercase tracking-wider block">Čekanje</span>
            <span className="text-xl font-serif font-black text-stone-900 block mt-0.5">{pendingReservations.length}</span>
          </div>
          <div className="bg-stone-900 p-3.5 rounded-2xl shadow-sm text-center text-white relative overflow-hidden">
            <span className="text-stone-400 text-[9px] font-bold uppercase tracking-wider block">Danas</span>
            <span className="text-xl font-serif font-black text-white block mt-0.5">{todayReservations.length}</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-stone-100/70 text-center">
            <span className="text-stone-400 text-[9px] font-bold uppercase tracking-wider block">Buduće</span>
            <span className="text-xl font-serif font-black text-stone-900 block mt-0.5">{futureReservations.length}</span>
          </div>
        </div>

        {/* Desktop Stats (hidden on mobile, visible on desktop) */}
        <div className="hidden xl:grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-center">
            <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Nove na čekanju</span>
            <div className="flex items-end gap-3 mt-3">
              <span className="text-4xl font-serif text-stone-900">{pendingReservations.length}</span>
              <span className="text-amber-500 text-sm font-bold mb-1 uppercase tracking-tighter">Zahteva akciju</span>
            </div>
          </div>
          
          <div className="bg-stone-900 p-6 rounded-3xl shadow-lg flex flex-col justify-center text-white relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-stone-800 rounded-full opacity-50 blur-2xl"></div>
            <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider relative z-10">Danas ({today})</span>
            <div className="flex items-end gap-3 mt-3 relative z-10">
              <span className="text-4xl font-serif text-white">{todayReservations.length}</span>
              <span className="text-stone-400 text-sm mb-1 uppercase tracking-tighter">Potvrđeno</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex flex-col justify-center">
            <span className="text-stone-500 text-xs font-semibold uppercase tracking-wider">Ukupno Budućih</span>
            <div className="flex items-end gap-3 mt-3">
              <span className="text-4xl font-serif text-stone-900">{futureReservations.length}</span>
              <span className="text-stone-400 text-sm mb-1 uppercase tracking-tighter">Planirano</span>
            </div>
          </div>
        </div>

        {/* Mobile Tabs Navigation */}
        <div className="flex xl:hidden gap-2 mb-6 bg-stone-200/40 p-1.5 rounded-[20px] border border-stone-200/50">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-2xl transition-all ${
              activeTab === 'pending'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Čekanje ({pendingReservations.length})
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-2xl transition-all ${
              activeTab === 'today'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Danas ({todayReservations.length})
          </button>
          <button
            onClick={() => setActiveTab('future')}
            className={`flex-1 py-3 text-xs font-black uppercase tracking-wider rounded-2xl transition-all ${
              activeTab === 'future'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Buduće ({futureReservations.length})
          </button>
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* COLUMN 1: PENDING */}
          <section className={`flex flex-col h-full min-h-[500px] ${activeTab === 'pending' ? 'flex' : 'hidden xl:flex'}`}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse"></span>
                1. NOVE REZERVACIJE
              </h3>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-amber-100">Čekanje</span>
            </div>
            <div className="space-y-4 bg-amber-50/30 p-4 rounded-[32px] border border-amber-100/50 flex-1">
              {loading ? <LoadingSkeleton /> : pendingReservations.length === 0 ? <EmptyState msg="Sve rezervacije su obrađene." /> : (
                pendingReservations.map(res => (
                  <ReservationCard 
                    key={res.id} 
                    res={res} 
                    onUpdate={updateStatus} 
                    onEdit={setEditingReservation}
                    onDelete={deleteReservation}
                  />
                ))
              )}
            </div>
          </section>

          {/* COLUMN 2: TODAY */}
          <section className={`flex flex-col h-full min-h-[500px] ${activeTab === 'today' ? 'flex' : 'hidden xl:flex'}`}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                2. DANAS
              </h3>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Plan</span>
            </div>
            <div className="space-y-4 bg-emerald-50/20 p-4 rounded-[32px] border border-emerald-100/50 flex-1">
              {loading ? <LoadingSkeleton /> : todayReservations.length === 0 ? <EmptyState msg="Nema rezervacija za danas." /> : (
                todayReservations.map(res => (
                  <ReservationCard 
                    key={res.id} 
                    res={res} 
                    onUpdate={updateStatus} 
                    onEdit={setEditingReservation}
                    onDelete={deleteReservation}
                  />
                ))
              )}
            </div>
          </section>

          {/* COLUMN 3: FUTURE */}
          <section className={`flex flex-col h-full min-h-[500px] ${activeTab === 'future' ? 'flex' : 'hidden xl:flex'}`}>
            <div className="flex items-center justify-between mb-4 px-2">
              <h3 className="text-lg font-serif text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-stone-400 rounded-full"></span>
                3. BUDUĆE
              </h3>
              <span className="text-[10px] font-black text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full uppercase tracking-widest border border-stone-200">Naredni dani</span>
            </div>
            <div className="space-y-4 bg-stone-100/30 p-4 rounded-[32px] border border-stone-200/50 flex-1">
              {loading ? <LoadingSkeleton /> : futureReservations.length === 0 ? <EmptyState msg="Nema budućih rezervacija." /> : (
                futureReservations.map(res => (
                  <ReservationCard 
                    key={res.id} 
                    res={res} 
                    onUpdate={updateStatus} 
                    onEdit={setEditingReservation}
                    onDelete={deleteReservation}
                  />
                ))
              )}
            </div>
          </section>

        </div>
      </main>

      {/* Edit Modal */}
      {editingReservation && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-serif text-stone-900">Izmeni Rezervaciju</h3>
              <button 
                onClick={() => setEditingReservation(null)}
                className="text-stone-400 hover:text-stone-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Ime gosta</label>
                <input 
                  type="text" 
                  required 
                  defaultValue={editingReservation.name} 
                  name="name" 
                  className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Telefon</label>
                <input 
                  type="text" 
                  required 
                  defaultValue={editingReservation.phone} 
                  name="phone" 
                  className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Datum</label>
                  <input 
                    type="date" 
                    required 
                    defaultValue={editingReservation.date} 
                    name="date" 
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Vreme</label>
                  <input 
                    type="time" 
                    required 
                    defaultValue={editingReservation.time} 
                    name="time" 
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Broj Gostiju</label>
                  <input 
                    type="number" 
                    required 
                    defaultValue={editingReservation.guests} 
                    name="guests" 
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Sto (ID)</label>
                  <input 
                    type="text" 
                    defaultValue={editingReservation.tableId || ''} 
                    name="tableId" 
                    placeholder="Sto (Opciono)" 
                    className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Ishrana / Dijeta</label>
                <select 
                  defaultValue={editingReservation.diet || ''} 
                  name="diet" 
                  className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium"
                >
                  <option value="">Sve (Nema specifične dijete)</option>
                  <option value="Vegetarijanac">Vegetarijanac 🥦</option>
                  <option value="Vegan">Vegan 🌱</option>
                  <option value="Bez Glutena">Bez Glutena 🌾</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Napomena</label>
                <textarea 
                  defaultValue={editingReservation.note || ''} 
                  name="note" 
                  rows={3} 
                  className="w-full px-4 py-3 bg-stone-50 rounded-2xl border border-stone-200/60 focus:border-stone-400 focus:outline-none text-stone-800 text-sm font-medium resize-none" 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 bg-stone-950 hover:bg-stone-900 text-white text-xs font-bold uppercase tracking-wider rounded-2xl transition"
                >
                  Sačuvaj Izmene
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingReservation(null)}
                  className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-bold uppercase tracking-wider rounded-2xl transition"
                >
                  Otkaži
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[1,2,3].map(i => (
        <div key={i} className="h-40 bg-white/50 rounded-3xl border border-stone-100"></div>
      ))}
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-40 text-center">
      <p className="text-stone-400 text-sm font-serif italic">{msg}</p>
    </div>
  );
}

interface ReservationCardProps {
  res: Reservation;
  onUpdate: (id: string, s: string) => void;
  onEdit: (res: Reservation) => void;
  onDelete: (id: string) => void;
}

function ReservationCard({ res, onUpdate, onEdit, onDelete }: ReservationCardProps) {
  const isToday = res.date === new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-white p-5 sm:p-6 rounded-[28px] border border-stone-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden group ${res.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
      
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="min-w-0 flex-1">
          <h4 className="font-bold text-stone-900 text-base sm:text-lg leading-tight truncate">{res.name}</h4>
          <p className="text-xs text-stone-500 font-medium mt-1 truncate">{res.phone}</p>
        </div>
        <div className="bg-stone-50 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-2xl border border-stone-100 text-center min-w-[50px] sm:min-w-[55px] flex-shrink-0">
          <div className="text-[8px] sm:text-[9px] text-stone-400 uppercase font-black tracking-tighter">STO</div>
          <div className="text-sm sm:text-base font-serif font-bold text-stone-900">{res.tableId || '?'}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-600 bg-stone-50/80 px-2.5 py-2 rounded-xl border border-stone-100/50">
          <svg className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-bold truncate">{res.time}h</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-stone-600 bg-stone-50/80 px-2.5 py-2 rounded-xl border border-stone-100/50">
          <svg className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="font-bold truncate">{res.guests} os.</span>
        </div>
      </div>

      {res.diet && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-tighter">
            🥗 {res.diet}
          </span>
        </div>
      )}

      {!isToday && res.status !== 'pending' && (
        <div className="mb-3 text-[10px] sm:text-[11px] font-black text-emerald-600 bg-emerald-50 w-full text-center py-2 rounded-xl uppercase tracking-widest border border-emerald-100/50">
          Datum: {res.date}
        </div>
      )}

      {res.note && (
        <div className="mb-4 text-[11px] text-stone-500 italic border-l-2 border-stone-200 pl-3 line-clamp-3 leading-relaxed">
          "{res.note}"
        </div>
      )}

      {/* Main Action Buttons */}
      {res.status === 'pending' && (
        <div className="flex gap-2 mb-3">
          <button 
            onClick={() => onUpdate(res.id, 'confirmed')}
            className="flex-1 py-2.5 sm:py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/10 active:scale-95"
          >
            POTVRDI
          </button>
          <button 
            onClick={() => onUpdate(res.id, 'cancelled')}
            className="px-3 sm:px-4 py-2.5 sm:py-3 bg-white border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
          >
            OTKAŽI
          </button>
        </div>
      )}

      {res.status !== 'pending' && (
        <div className="flex justify-between items-center border-t border-stone-50 pt-3 mb-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${res.status === 'confirmed' ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-widest ${res.status === 'confirmed' ? 'text-emerald-700' : 'text-stone-400'}`}>
              {res.status === 'confirmed' ? 'Potvrđeno' : 'Otkazano'}
            </span>
          </div>
          {res.status === 'confirmed' && (
             <button 
                onClick={() => onUpdate(res.id, 'cancelled')}
                className="text-[9px] sm:text-[10px] text-stone-300 hover:text-red-400 transition font-black uppercase tracking-tighter"
              >
                Otkaži naknadno
              </button>
          )}
        </div>
      )}

      {/* Edit & Delete Action Row */}
      <div className="flex justify-end gap-1.5 pt-2 border-t border-stone-100/60">
        <button
          onClick={() => onEdit(res)}
          className="text-stone-400 hover:text-stone-700 p-2 sm:p-1.5 rounded-xl hover:bg-stone-50 transition"
          title="Izmeni rezervaciju"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        </button>
        <button
          onClick={() => onDelete(res.id)}
          className="text-stone-400 hover:text-red-600 p-2 sm:p-1.5 rounded-xl hover:bg-red-50 transition"
          title="Trajno obriši rezervaciju"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </div>
  );
}
