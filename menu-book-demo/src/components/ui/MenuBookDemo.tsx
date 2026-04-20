import { MenuBook } from './MenuBook';

export function MenuBookDemo() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #1f1d1b 0%, #181715 35%, #111010 100%)',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <header style={{ textAlign: 'center', padding: '28px 16px 0' }}>
        <p style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: '8px' }}>
          Bemata · Restoran
        </p>
        <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 'clamp(1.5rem, 3.5vw, 2.2rem)', fontWeight: 400, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.03em', margin: 0 }}>
          Naš Meni
        </h1>
        <div style={{ width: '40px', height: '1px', background: 'linear-gradient(90deg, transparent, #c4a24e, transparent)', margin: '10px auto 0', opacity: 0.35 }} />
      </header>

      <MenuBook />
    </div>
  );
}
