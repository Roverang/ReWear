import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 2450, suffix: "+", label: "Items Listed" },
  { value: 1320, suffix: "+", label: "Exchanges Completed" },
  { value: 3850, suffix: "+", label: "Happy Users" },
  { value: 1.2, suffix: " Tons", label: "CO₂ Saved", decimals: 1 },
];

function useCountUp(target: number, decimals = 0, duration = 1400) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setVal(target * eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);
  return { ref, val: decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString() };
}

function StatCard({ s }: { s: (typeof stats)[number] }) {
  const { ref, val } = useCountUp(s.value, s.decimals ?? 0);
  return (
    <div ref={ref} className="rounded-3xl bg-card border border-border p-8 hover:shadow-[var(--shadow-lift)] transition-shadow">
      <div className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
        {val}{s.suffix}
      </div>
      <div className="mt-2 text-sm text-muted-foreground font-medium">{s.label}</div>
    </div>
  );
}

export function Stats() {
  return (
    <section className="container-rewear py-16">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.label} s={s} />)}
      </div>
    </section>
  );
}