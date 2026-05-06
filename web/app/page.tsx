import Link from "next/link";
import { ReservationAmbience } from "@/components/reservation-ambience";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5] px-6 py-16 text-stone-800">
      <div className="mx-auto max-w-3xl">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
          Bemata · Next.js + shadcn/ui
        </p>
        <h1 className="mb-3 font-serif text-3xl font-semibold tracking-tight text-stone-900">
          Rotacija slika (ImagePlayer)
        </h1>
        <p className="mb-10 max-w-xl text-sm leading-relaxed text-stone-600">
          Komponenta je u{" "}
          <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-xs">
            components/ui/image-player.tsx
          </code>
          . Ispod je isti blok kao sekcija rezervacije na statičkom sajtu; slike su u{" "}
          <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-xs">
            public/images
          </code>
          .
        </p>

        <section aria-label="Ambijent">
          <ReservationAmbience />
        </section>

        <nav className="mt-12 flex flex-wrap gap-4 text-sm">
          <Link
            href="/demo"
            className="rounded-full border border-stone-300 bg-white px-4 py-2 font-medium text-stone-700 shadow-sm transition hover:border-stone-400"
          >
            Demo (Unsplash, 200ms)
          </Link>
          <a
            href="https://nextjs.org/docs"
            className="rounded-full px-4 py-2 text-stone-500 underline-offset-4 hover:text-stone-800 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Next.js docs
          </a>
        </nav>

        <p className="mt-10 text-xs text-stone-400">
          Statički landing ostaje u korenu projekta (
          <code className="text-stone-500">index.html</code>). Ovaj app pokrećeš sa{" "}
          <code className="text-stone-500">cd web && npm run dev</code>.
        </p>
      </div>
    </div>
  );
}
