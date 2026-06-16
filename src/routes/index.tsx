import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { HowItWorks } from "@/components/HowItWorks";
import { CategoriesStrip } from "@/components/CategoriesStrip";
import { ItemCard } from "@/components/ItemCard";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReWear — Reuse. Restyle. Repeat." },
      { name: "description", content: "A sustainable fashion marketplace to list, discover, exchange, and donate pre-loved clothing." },
      { property: "og:title", content: "ReWear — Reuse. Restyle. Repeat." },
      { property: "og:description", content: "Give clothes a second life and build a more sustainable wardrobe." },
    ],
  }),
  component: Index,
});

function Index() {
  const { items, user } = useApp();
  const featured = items.filter((i) => i.isAvailable).slice(0, 8);

  return (
    <SiteLayout>
      <Hero />
      <Stats />
      <CategoriesStrip />
      <HowItWorks />

      {/* Fresh listings */}
      <section className="container-rewear py-20">
        <div className="flex items-end justify-between mb-10 gap-4 flex-wrap">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Fresh listings</span>
            <h2 className="mt-3 text-4xl md:text-5xl font-extrabold tracking-tight">Just in from the community.</h2>
          </div>
          <Link to="/marketplace" className="text-sm font-semibold text-primary hover:underline">
            Browse all →
          </Link>
        </div>
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="container-rewear py-20">
        <div className="rounded-[2.5rem] bg-primary text-primary-foreground px-8 md:px-16 py-16 md:py-20 grid md:grid-cols-[1.3fr_1fr] gap-10 items-center overflow-hidden relative">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Ready to give your wardrobe a second story?
            </h2>
            <p className="mt-4 text-primary-foreground/80 max-w-lg">
              Join the ReWear community in under a minute. List your first item, discover something new, and start measuring your impact.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link
                    to="/list-item"
                    className="inline-flex px-6 py-3.5 rounded-full bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition"
                  >
                    List an item
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex px-6 py-3.5 rounded-full border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition"
                  >
                    My dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex px-6 py-3.5 rounded-full bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition"
                  >
                    Get started — it's free
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="inline-flex px-6 py-3.5 rounded-full border border-primary-foreground/30 text-primary-foreground font-semibold text-sm hover:bg-primary-foreground/10 transition"
                  >
                    See how it works
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-4 text-primary-foreground">
            {[["2,450+","Items"],["1.2t","CO₂ saved"],["3,850+","Members"],["1,320+","Exchanges"]].map(([v,l]) => (
              <div key={l} className="rounded-2xl bg-primary-foreground/8 p-5">
                <div className="text-3xl font-extrabold">{v}</div>
                <div className="text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
