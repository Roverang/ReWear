import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-rack.jpg";

export function Hero() {
  return (
    <section className="container-rewear pt-12 pb-20 md:pt-20 md:pb-28">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-6">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Sustainable fashion, reimagined
          </span>
          <h1 className="text-[clamp(2.5rem,6vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight text-foreground">
            Give Clothes<br />
            <span className="text-primary">A Second Life.</span><br />
            Build A Sustainable<br />Future.
          </h1>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            ReWear connects people to list, discover, exchange, and donate pre-loved clothes — reducing textile waste, one wardrobe at a time.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/marketplace" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-all hover:shadow-[var(--shadow-lift)]">
              Explore Marketplace
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="/marketplace" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-card border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors">
              List an Item
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-2">
              {["#7FA35B","#3F6B37","#C2A878","#5AA469","#A8B89C"].map((c, i) => (
                <div key={i} className="h-9 w-9 rounded-full border-2 border-background ring-1 ring-border" style={{ background: c }} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Join thousands</span> of people making a difference.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-muted shadow-[var(--shadow-lift)]">
            <img
              src={heroImg}
              alt="Curated rack of pre-loved clothing including a knit sweater, olive hoodie, denim jacket, and canvas tote"
              width={1024}
              height={1280}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-4 md:-left-8 max-w-[260px] bg-card rounded-2xl px-5 py-4 shadow-[var(--shadow-lift)] border border-border flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </span>
            <p className="text-sm font-medium text-foreground leading-snug">
              Small choices today, a greener tomorrow.
            </p>
          </div>
          <div className="hidden md:flex absolute -top-4 -right-4 bg-card rounded-2xl px-4 py-3 shadow-[var(--shadow-soft)] border border-border items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-semibold text-foreground">12 new items today</span>
          </div>
        </div>
      </div>
    </section>
  );
}