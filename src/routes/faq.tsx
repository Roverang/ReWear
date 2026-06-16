import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";


import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — ReWear" },
      { name: "description", content: "Frequently asked questions about ReWear — how exchanges work, listing items, and more." },
    ],
  }),
  component: FaqPage,
});

const FAQS = [
  {
    q: "How does ReWear work?",
    a: "ReWear is a community-powered clothing exchange platform. You list items you no longer wear, browse items others have listed, and request exchanges directly. There are no fees — just swaps, donations, and good vibes.",
  },
  {
    q: "Is it really free?",
    a: "Yes, completely free. ReWear doesn't charge listing fees, transaction fees, or subscriptions. Our goal is to make sustainable fashion accessible to everyone.",
  },
  {
    q: "How do I list an item?",
    a: 'Click \'List an Item\' in the navigation (you\'ll need to sign in first). Fill in the details — title, brand, condition, size, and a description. You can also upload a photo. The whole process takes under 2 minutes.',
  },
  {
    q: "What is a sustainability score?",
    a: "Each item gets a sustainability score (0–100) based on its condition and how much textile waste its exchange prevents. Higher scores mean the piece is in better shape and has more positive environmental impact.",
  },
  {
    q: "What are eco points?",
    a: "Eco points are earned for every action you take on ReWear — listing items (+20), requesting exchanges (+10), completing exchanges (+25), and donating (+15). Points unlock badges that display on your profile.",
  },
  {
    q: "How do exchanges work?",
    a: 'Find an item you love, click \'Request Exchange,\' and leave a message for the owner. You can propose one of your own listings as a swap. The owner reviews your request and accepts or declines. You\'ll both be notified of their decision.',
  },
  {
    q: "What if I just want to donate, not swap?",
    a: 'On any item detail page, you\'ll find a \'Donate\' button alongside the exchange request. This lets you offer to give the item to someone without expecting anything in return.',
  },
  {
    q: "How does the wishlist work?",
    a: "Tap the heart icon on any item card to save it to your wishlist. Your wishlist is accessible from your profile and the navbar. You'll need to be signed in.",
  },
  {
    q: "Can I list any clothing?",
    a: "Yes — as long as it's clean, wearable, and honestly described. Please don't list items that are heavily damaged, stained, or misrepresented. The community thrives on trust.",
  },
  {
    q: "Is my personal information safe?",
    a: "All data is stored locally in your browser's storage. We don't send your information to any external servers. Read our Privacy Policy for full details.",
  },
];

function FaqPage() {
  return (
    <SiteLayout>
      <section className="container-rewear pt-16 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Support</span>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.05]">
          Frequently asked questions.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Can't find the answer you're looking for? Reach us via the{" "}
          <a href="/contact" className="text-primary font-semibold hover:underline">
            Contact page
          </a>
          .
        </p>
      </section>

      <section className="container-rewear py-16 max-w-3xl">
        <Accordion type="single" collapsible className="space-y-3">
          {FAQS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-2xl border border-border bg-card px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-left font-semibold py-5 hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}
