import { Leaf, PackageOpen, Search, Repeat } from "lucide-react";

const steps = [
  { icon: PackageOpen, title: "List", desc: "List your pre-loved clothes in minutes." },
  { icon: Search, title: "Discover", desc: "Find clothes from your local community." },
  { icon: Repeat, title: "Exchange", desc: "Swap, gift, or donate with care." },
  { icon: Leaf, title: "Impact", desc: "Reduce textile waste, together." },
];

export function HowItWorks() {
  return (
    <section className="container-rewear py-20">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">How it works</span>
        <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">Four steps to a greener wardrobe.</h2>
        <p className="mt-4 text-muted-foreground">Simple by design. Built around the idea that clothes deserve more than one lifetime.</p>
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4 relative">
        {steps.map((s, i) => (
          <div key={s.title} className="relative">
            <div className="rounded-3xl bg-card border border-border p-7 h-full hover:-translate-y-1 hover:shadow-[var(--shadow-lift)] transition-all">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/8 text-primary">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="mt-5 flex items-center gap-3">
                <span className="text-xs font-bold text-accent">0{i + 1}</span>
                <h3 className="text-xl font-extrabold">{s.title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 text-border" aria-hidden>
                <svg width="32" height="8" viewBox="0 0 32 8" fill="none"><path d="M0 4h30M26 1l4 3-4 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3"/></svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}