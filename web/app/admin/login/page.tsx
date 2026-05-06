"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push('/admin/rezervacije');
        router.refresh(); 
      } else {
        const data = await res.json();
        setError(data.error || 'Pogrešna lozinka');
      }
    } catch (err) {
      setError('Greška na serveru');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#151a18] px-4 font-sans relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2c423f]/30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-[380px] bg-[#1d2422] rounded-[24px] shadow-2xl p-8 relative z-10 border border-[#2c423f]">
        <div className="flex flex-col items-center mb-8">
          <img src="/bemata-logo.svg" alt="Bemata Logo" className="w-20 h-auto mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]" />
          <h2 className="text-2xl font-serif text-[#e6dfd8] tracking-tight">Bemata</h2>
          <p className="text-[#a89f91] mt-1 text-sm">Upravljanje restoranom</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3.5 bg-[#151a18] text-[#e6dfd8] rounded-xl focus:ring-2 focus:ring-[#5c7a75] border border-[#2c423f] transition-all outline-none text-center tracking-widest text-lg font-medium placeholder-[#5c7a75]/50"
              placeholder="••••••••••••••"
              required
            />
          </div>
          {error && <p className="text-[#d97762] text-xs text-center font-medium">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2c423f] hover:bg-[#3c5a56] text-[#e6dfd8] font-medium py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(44,66,63,0.3)] hover:shadow-[0_0_25px_rgba(60,90,86,0.5)] disabled:opacity-70 border border-[#3c5a56]"
          >
            {loading ? 'Prijavljivanje...' : 'Prijavi se'}
          </button>
        </form>
      </div>
    </div>
  );
}
