import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Stats } from "@/components/Stats";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ReWear" },
      { name: "description", content: "ReWear is a community-powered marketplace giving clothes a second life and reducing textile waste." },
      { property: "og:title", content: "About — ReWear" },
      { property: "og:description", content: "Our mission, our story, our impact." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="container-rewear pt-16 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Our mission</span>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-[1.05]">
          A wardrobe with <span className="text-primary">less waste</span>, built by a community that cares.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          The fashion industry produces more than 92 million tons of textile waste each year. ReWear exists to change that — by making it effortless to give the clothes you no longer wear a second, third, or fourth life.
        </p>
      </section>

      <Stats />

      <section className="container-rewear py-20 grid gap-12 md:grid-cols-2">
        <div className="rounded-3xl bg-card border border-border p-10">
          <h2 className="text-3xl font-extrabold">Our story</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            ReWear started with a closet full of clothes nobody wore. We wanted somewhere that wasn't fast fashion, wasn't another thrift haul, and wasn't a chore — just a calm, premium space to swap, donate, and discover. Today, thousands of people use ReWear to keep textiles in circulation.
          </p>
        </div>
        <div className="rounded-3xl bg-primary text-primary-foreground p-10">
          <h2 className="text-3xl font-extrabold">Our impact</h2>
          <p className="mt-4 text-primary-foreground/80 leading-relaxed">
            Every exchange on ReWear keeps roughly 0.5 kg of textile out of landfill and avoids ~3 kg of CO₂. Small numbers add up — that's the entire point.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-primary-foreground/10 p-5">
              <div className="text-2xl font-extrabold">1.2 t</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">CO₂ saved</div>
            </div>
            <div className="rounded-2xl bg-primary-foreground/10 p-5">
              <div className="text-2xl font-extrabold">680 kg</div>
              <div className="text-xs uppercase tracking-wider text-primary-foreground/70 mt-1">Textile saved</div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}