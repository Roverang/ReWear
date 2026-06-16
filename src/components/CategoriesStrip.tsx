import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/mock-data";

export function CategoriesStrip() {
  return (
    <section className="container-rewear py-20">
      <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Popular categories</span>
          <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">Shop by category.</h2>
        </div>
        <Link to="/categories" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
      </div>
      <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((c) => (
          <Link key={c.slug} to="/marketplace" search={{ category: c.name }} className="group rounded-3xl bg-card border border-border overflow-hidden hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all">
            <div className="aspect-square overflow-hidden bg-muted">
              <img src={c.image} alt={c.name} loading="lazy" width={640} height={640} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-sm">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.count} items</div>
              </div>
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}