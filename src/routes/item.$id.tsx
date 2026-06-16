import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import {
  Flag, Heart, Leaf, MapPin, Repeat, Share2, ShieldCheck, X, Check,
  ChevronRight, Package
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { ItemCard } from "@/components/ItemCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/item/$id")({
  loader: ({ params }) => {
    // Items are loaded from context (localStorage) in the component
    return { id: params.id };
  },
  head: ({ loaderData }) => ({
    meta: [{ title: "Item — ReWear" }],
  }),
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-rewear py-32 text-center">
        <h1 className="text-3xl font-extrabold">Item not found</h1>
        <p className="mt-3 text-muted-foreground">This listing may have been exchanged or removed.</p>
        <Link to="/marketplace" className="mt-6 inline-flex px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
          Back to marketplace
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: () => (
    <SiteLayout>
      <div className="container-rewear py-32 text-center">
        <h1 className="text-3xl font-extrabold">Something went wrong</h1>
        <Link to="/marketplace" className="mt-6 inline-flex px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
          Back to marketplace
        </Link>
      </div>
    </SiteLayout>
  ),
  component: ItemPage,
});

function ItemPage() {
  const { id } = Route.useLoaderData();
  const { items, user, isWishlisted, toggleWishlist, requestExchange, donateItem } = useApp();
  const navigate = useNavigate();

  const item = items.find((i) => i.id === id);

  const [activeImg, setActiveImg] = useState(0);
  const [exchangeOpen, setExchangeOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [exchangeMsg, setExchangeMsg] = useState("");
  const [exchangeDone, setExchangeDone] = useState(false);
  const [donateDone, setDonateDone] = useState(false);

  if (!item) {
    return (
      <SiteLayout>
        <div className="container-rewear py-32 text-center">
          <h1 className="text-3xl font-extrabold">Item not found</h1>
          <p className="mt-3 text-muted-foreground">This listing may have been exchanged or removed.</p>
          <Link to="/marketplace" className="mt-6 inline-flex px-5 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            Back to marketplace
          </Link>
        </div>
      </SiteLayout>
    );
  }

  const wishlisted = isWishlisted(item.id);
  const images = item.images.length > 0 ? item.images : [item.image, item.image, item.image, item.image];

  // Suggested items
  const suggested = useMemo(
    () => items.filter((i) => i.id !== item.id && i.category === item.category && i.isAvailable).slice(0, 4),
    [items, item.id, item.category]
  );

  function handleWishlist() {
    if (!user) {
      toast.error("Sign in to save items to your wishlist.");
      return;
    }
    toggleWishlist(item.id);
    toast.success(wishlisted ? "Removed from wishlist." : "Saved to wishlist! ❤️");
  }

  function handleShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard!");
    });
  }

  function handleExchangeSubmit() {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    requestExchange(item.id, item.title, item.owner.id, exchangeMsg || "I'd love to exchange for this item!");
    setExchangeDone(true);
    toast.success("Exchange request sent! 🌿 +10 eco points");
  }

  function handleDonateSubmit() {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    donateItem(item.id, item.title, item.owner.id);
    setDonateDone(true);
    toast.success("Donation request sent! 🎁");
  }

  return (
    <SiteLayout>
      <section className="container-rewear pt-10 pb-20">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6 flex items-center gap-1">
          <Link to="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/marketplace" search={{ category: item.category }} className="hover:text-foreground transition-colors">
            {item.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-foreground font-medium truncate max-w-[200px]">{item.title}</span>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          {/* Images */}
          <div className="grid gap-4">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
              <img
                src={images[activeImg]}
                alt={item.title}
                className="h-full w-full object-cover"
                width={1024}
                height={1280}
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`aspect-square rounded-2xl overflow-hidden bg-muted border-2 transition-all ${
                    i === activeImg ? "border-primary" : "border-border hover:border-primary/40"
                  }`}
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              <span>{item.brand}</span>
              <span>·</span>
              <span>{item.category}</span>
            </div>
            <h1 className="mt-3 text-3xl md:text-4xl font-extrabold tracking-tight">{item.title}</h1>

            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/8 text-primary text-xs font-semibold">
                <Leaf className="h-3 w-3" />
                Eco score {item.sustainabilityScore}
              </span>
              <span className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-semibold">
                {item.condition}
              </span>
              <span className="px-3 py-1 rounded-full bg-muted text-foreground text-xs font-semibold">
                Size {item.size}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-foreground text-xs font-semibold">
                <MapPin className="h-3 w-3" />
                {item.location}
              </span>
              <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                {item.pointValue} pts
              </span>
            </div>

            {/* Owner */}
            <div className="mt-6 flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
              <span
                className="grid h-11 w-11 place-items-center rounded-full text-sm font-bold text-white shrink-0"
                style={{ background: item.owner.avatarColor }}
              >
                {item.owner.initials}
              </span>
              <div className="flex-1">
                <div className="font-extrabold text-sm">{item.owner.name}</div>
                <div className="text-xs text-muted-foreground">
                  Member since {new Date(item.owner.memberSince + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  · {item.owner.exchangeCount} exchanges
                </div>
              </div>
              <ShieldCheck className="h-5 w-5 text-success shrink-0" />
            </div>

            {/* Description */}
            <p className="mt-6 text-muted-foreground leading-relaxed">{item.description}</p>

            {/* Unavailable overlay */}
            {!item.isAvailable && (
              <div className="mt-6 rounded-2xl bg-muted border border-border p-4 text-center">
                <Package className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                <p className="font-semibold text-sm">This item has been exchanged</p>
                <p className="text-xs text-muted-foreground mt-1">Browse similar items below.</p>
              </div>
            )}

            {/* CTA buttons */}
            {item.isAvailable && (
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => {
                    if (!user) { navigate({ to: "/login" }); return; }
                    setExchangeOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                  id="request-exchange-btn"
                >
                  <Repeat className="h-4 w-4" />
                  Request Exchange
                </button>
                <button
                  onClick={() => {
                    if (!user) { navigate({ to: "/login" }); return; }
                    setDonateOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-card border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
                  id="donate-btn"
                >
                  Donate
                </button>
              </div>
            )}

            <div className="mt-3 flex items-center gap-1 text-sm flex-wrap">
              <button
                onClick={handleWishlist}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-muted transition-colors ${wishlisted ? "text-primary" : ""}`}
              >
                <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
                {wishlisted ? "Saved" : "Save"}
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-muted transition-colors"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
              <button
                onClick={() => setReportOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
              >
                <Flag className="h-4 w-4" />
                Report
              </button>
            </div>

            {/* Sustainability box */}
            <div className="mt-8 rounded-2xl bg-primary/5 border border-primary/10 p-5">
              <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
                <Leaf className="h-4 w-4" />
                Sustainability impact
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Choosing this piece keeps ~0.5 kg of textile out of landfill and avoids about{" "}
                {((item.sustainabilityScore / 100) * 5).toFixed(1)} kg of CO₂ emissions.
              </p>
            </div>
          </div>
        </div>

        {/* Similar items */}
        {suggested.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">More like this</span>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight">Similar items.</h2>
              </div>
              <Link to="/marketplace" search={{ category: item.category }} className="text-sm font-semibold text-primary hover:underline">
                Browse all {item.category} →
              </Link>
            </div>
            <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
              {suggested.map((i) => (
                <ItemCard key={i.id} item={i} />
              ))}
            </div>
          </section>
        )}
      </section>

      {/* Exchange modal */}
      <Dialog open={exchangeOpen} onOpenChange={setExchangeOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Request exchange</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Send a message to <strong>{item.owner.name}</strong> about "<strong>{item.title}</strong>".
            </DialogDescription>
          </DialogHeader>
          {exchangeDone ? (
            <div className="py-8 text-center">
              <div className="grid h-16 w-16 mx-auto place-items-center rounded-full bg-primary/10 text-primary mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-extrabold">Request sent! 🌿</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                You earned +10 eco points. {item.owner.name} will be notified.
              </p>
              <button onClick={() => { setExchangeOpen(false); setExchangeDone(false); }} className="mt-6 inline-flex px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Your message
                </label>
                <textarea
                  value={exchangeMsg}
                  onChange={(e) => setExchangeMsg(e.target.value)}
                  rows={4}
                  placeholder="Hi! I love this piece and would like to exchange. I have a similar item I could offer…"
                  className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setExchangeOpen(false)}
                  className="flex-1 rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExchangeSubmit}
                  className="flex-1 rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Send request
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Donate modal */}
      <Dialog open={donateOpen} onOpenChange={setDonateOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Donate this item</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Request to donate "<strong>{item.title}</strong>" to someone who will love it.
            </DialogDescription>
          </DialogHeader>
          {donateDone ? (
            <div className="py-8 text-center">
              <div className="text-5xl mb-4">🎁</div>
              <h3 className="text-xl font-extrabold">Donation requested!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.owner.name} will be notified. You earned +15 eco points.
              </p>
              <button onClick={() => { setDonateOpen(false); setDonateDone(false); }} className="mt-6 inline-flex px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90">
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4">
                <p className="text-sm text-muted-foreground">
                  This keeps ~0.5 kg of textile out of landfill and saves ~3 kg of CO₂.
                  You'll earn <strong className="text-foreground">+15 eco points</strong>.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setDonateOpen(false)}
                  className="flex-1 rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonateSubmit}
                  className="flex-1 rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Confirm donation
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Report modal */}
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent className="sm:max-w-sm rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold">Report this listing</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Help us keep ReWear a safe and honest community.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {["Inaccurate description", "Prohibited item", "Suspicious activity", "Other"].map((reason) => (
              <button
                key={reason}
                onClick={() => {
                  toast.success("Report submitted. Thank you for keeping the community safe.");
                  setReportOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-2xl border border-border hover:bg-muted text-sm font-medium transition-colors"
              >
                {reason}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </SiteLayout>
  );
}