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

  const today = new Date().toISOString().split('T')[0];
  
  const pendingReservations = reservations.filter(r => r.status === 'pending');
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
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

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          
          {/* COLUMN 1: PENDING */}
          <section className="flex flex-col h-full min-h-[500px]">
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
                  <ReservationCard key={res.id} res={res} onUpdate={updateStatus} />
                ))
              )}
            </div>
          </section>

          {/* COLUMN 2: TODAY */}
          <section className="flex flex-col h-full min-h-[500px]">
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
                  <ReservationCard key={res.id} res={res} onUpdate={updateStatus} />
                ))
              )}
            </div>
          </section>

          {/* COLUMN 3: FUTURE */}
          <section className="flex flex-col h-full min-h-[500px]">
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
                  <ReservationCard key={res.id} res={res} onUpdate={updateStatus} />
                ))
              )}
            </div>
          </section>

        </div>
      </main>
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

function ReservationCard({ res, onUpdate }: { res: Reservation, onUpdate: (id: string, s: string) => void }) {
  const isToday = res.date === new Date().toISOString().split('T')[0];

  return (
    <div className={`bg-white p-6 rounded-[28px] border border-stone-100 shadow-sm transition-all hover:shadow-md relative overflow-hidden group ${res.status === 'cancelled' ? 'opacity-40 grayscale' : ''}`}>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-bold text-stone-900 text-lg leading-tight">{res.name}</h4>
          <p className="text-xs text-stone-500 font-medium mt-1">{res.phone}</p>
        </div>
        <div className="bg-stone-50 px-3 py-2 rounded-2xl border border-stone-100 text-center min-w-[55px]">
          <div className="text-[9px] text-stone-400 uppercase font-black tracking-tighter">STO</div>
          <div className="text-base font-serif font-bold text-stone-900">{res.tableId || '?'}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50/80 px-3 py-2 rounded-xl border border-stone-100/50">
          <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-bold">{res.time}h</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50/80 px-3 py-2 rounded-xl border border-stone-100/50">
          <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <span className="font-bold">{res.guests} os.</span>
        </div>
      </div>

      {res.diet && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase tracking-tighter">
            🥗 {res.diet}
          </span>
        </div>
      )}

      {!isToday && res.status !== 'pending' && (
        <div className="mb-4 text-[11px] font-black text-emerald-600 bg-emerald-50 w-full text-center py-2 rounded-xl uppercase tracking-widest border border-emerald-100/50">
          Datum: {res.date}
        </div>
      )}

      {res.note && (
        <div className="mb-5 text-[11px] text-stone-500 italic border-l-2 border-stone-200 pl-3 line-clamp-3 leading-relaxed">
          "{res.note}"
        </div>
      )}

      {res.status === 'pending' ? (
        <div className="flex gap-2">
          <button 
            onClick={() => onUpdate(res.id, 'confirmed')}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-600/10 active:scale-95"
          >
            POTVRDI
          </button>
          <button 
            onClick={() => onUpdate(res.id, 'cancelled')}
            className="px-4 py-3 bg-white border border-stone-200 text-stone-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 text-[11px] font-black uppercase tracking-widest rounded-2xl transition-all active:scale-95"
          >
            OTKAŽI
          </button>
        </div>
      ) : (
        <div className="flex justify-between items-center border-t border-stone-50 pt-4">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${res.status === 'confirmed' ? 'bg-emerald-500' : 'bg-stone-400'}`}></span>
            <span className={`text-[10px] font-black uppercase tracking-widest ${res.status === 'confirmed' ? 'text-emerald-700' : 'text-stone-400'}`}>
              {res.status === 'confirmed' ? 'Potvrđeno' : 'Otkazano'}
            </span>
          </div>
          {res.status === 'confirmed' && (
             <button 
                onClick={() => onUpdate(res.id, 'cancelled')}
                className="text-[10px] text-stone-300 hover:text-red-400 transition font-black uppercase tracking-tighter"
              >
                Otkaži naknadno
              </button>
          )}
        </div>
      )}
    </div>
  );
}
