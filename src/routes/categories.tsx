import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { categories } from "@/lib/mock-data";
import { ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — ReWear" },
      { name: "description", content: "Browse clothing categories on ReWear — t-shirts, hoodies, jackets, pants, shoes, and accessories." },
      { property: "og:title", content: "Categories — ReWear" },
      { property: "og:description", content: "Find pre-loved pieces by category on ReWear." },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  return (
    <SiteLayout>
      <section className="container-rewear pt-12 pb-16">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Browse</span>
        <h1 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">All categories.</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          From everyday basics to statement outerwear — explore everything currently listed by the community.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/marketplace"
              search={{ category: c.name }}
              className="group rounded-3xl bg-card border border-border overflow-hidden hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all"
            >
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  width={640}
                  height={480}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground">{c.count} items available</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}