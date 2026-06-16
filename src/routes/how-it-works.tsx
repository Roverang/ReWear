import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { HowItWorks } from "@/components/HowItWorks";
import { Award, BadgeCheck, Leaf, Trophy } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works — ReWear" },
      { name: "description", content: "Learn how ReWear helps you list, discover, exchange, and donate clothing while reducing waste." },
      { property: "og:title", content: "How It Works — ReWear" },
      { property: "og:description", content: "A simple, four-step path to a greener wardrobe." },
    ],
  }),
  component: HowPage,
});

const badges = [
  { icon: Leaf, name: "Eco Starter", desc: "List your first item" },
  { icon: BadgeCheck, name: "Green Contributor", desc: "Complete 5 exchanges" },
  { icon: Award, name: "Reuse Champion", desc: "Donate 10 pieces" },
  { icon: Trophy, name: "Sustainability Hero", desc: "Save 50kg of CO₂" },
];

function HowPage() {
  return (
    <SiteLayout>
      <section className="container-rewear pt-12">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">How it works</span>
        <h1 className="mt-3 text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.05]">The simplest way to swap, share, and shop sustainably.</h1>
      </section>
      <HowItWorks />
      <section className="container-rewear py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Earn Eco Points along the way.</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl">Every action you take on ReWear contributes to your sustainability profile. Unlock badges as you go.</p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {badges.map((b) => (
            <div key={b.name} className="rounded-3xl bg-card border border-border p-6 hover:shadow-[var(--shadow-lift)] transition-shadow">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent/15 text-accent">
                <b.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-extrabold">{b.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}