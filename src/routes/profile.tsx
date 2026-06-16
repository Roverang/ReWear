import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import { useMemo } from "react";

import { ItemCard } from "@/components/ItemCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Leaf, ShieldCheck, Star, Award, BadgeCheck, Trophy, Package,
  Repeat, Heart, Trash2, Check, X, Clock
} from "lucide-react";
import { toast } from "sonner";
import type { StoredItem, Exchange } from "@/lib/store";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — ReWear" },
      { name: "description", content: "Manage your ReWear listings, exchanges, and eco impact." },
    ],
  }),
  component: ProfilePage,
});

const ALL_BADGES = [
  { icon: Leaf, name: "Eco Starter", desc: "List your first item", key: "Eco Starter" },
  { icon: BadgeCheck, name: "Green Contributor", desc: "Complete 5 exchanges", key: "Green Contributor" },
  { icon: Award, name: "Reuse Champion", desc: "Donate 10 pieces", key: "Reuse Champion" },
  { icon: Trophy, name: "Sustainability Hero", desc: "Save 50 kg of CO₂", key: "Sustainability Hero" },
  { icon: Star, name: "Community Star", desc: "List 10 items", key: "Community Star" },
  { icon: ShieldCheck, name: "Trusted Swapper", desc: "10 accepted exchanges", key: "Trusted Swapper" },
];

function ProfilePage() {
  const { user, items, exchanges, removeItem, respondExchange } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <SiteLayout>
        <section className="container-rewear py-32 text-center">
          <h1 className="text-3xl font-extrabold">Sign in to view your profile</h1>
          <p className="mt-3 text-muted-foreground">You need to be signed in to access your profile.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm">Sign in</Link>
            <Link to="/signup" className="inline-flex px-6 py-3 rounded-full border border-border font-semibold text-sm hover:bg-muted">Create account</Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const myListings = useMemo(
    () => items.filter((i) => i.owner.id === user.id),
    [items, user.id]
  );

  const sentRequests = useMemo(
    () => exchanges.filter((e) => e.requesterId === user.id),
    [exchanges, user.id]
  );

  const receivedRequests = useMemo(
    () => exchanges.filter((e) => e.ownerId === user.id),
    [exchanges, user.id]
  );

  function handleDelete(item: StoredItem) {
    if (confirm(`Remove "${item.title}" from your listings?`)) {
      removeItem(item.id);
      toast.success("Listing removed.");
    }
  }

  function handleRespond(id: string, status: "accepted" | "declined") {
    respondExchange(id, status);
    toast.success(status === "accepted" ? "Exchange accepted! 🎉" : "Exchange declined.");
  }

  const co2Display = user.co2Saved.toFixed(1);
  const progressToNextBadge = Math.min(100, (user.ecoPoints / 200) * 100);

  return (
    <SiteLayout>
      {/* Profile header */}
      <section className="container-rewear pt-10 pb-4">
        <div className="rounded-3xl bg-card border border-border p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <span
            className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-2xl font-extrabold text-white shadow-[var(--shadow-soft)]"
            style={{ background: user.avatarColor }}
          >
            {user.initials}
          </span>
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-extrabold tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Member since {new Date(user.memberSince + "-01").toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              {user.location && <> · {user.location}</>}
            </p>
            {user.bio && <p className="mt-2 text-sm text-muted-foreground max-w-md">{user.bio}</p>}
          </div>
          <div className="grid grid-cols-3 gap-4 text-center shrink-0">
            <StatPill label="Listings" value={myListings.length} />
            <StatPill label="Exchanges" value={user.exchangeCount} />
            <StatPill label="Eco pts" value={user.ecoPoints} accent />
          </div>
        </div>
      </section>

      <section className="container-rewear pb-20">
        <Tabs defaultValue="listings">
          <TabsList className="mb-8 bg-muted rounded-full p-1 inline-flex gap-1">
            <TabsTrigger value="listings" className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-[var(--shadow-soft)]">
              My Listings ({myListings.length})
            </TabsTrigger>
            <TabsTrigger value="exchanges" className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-[var(--shadow-soft)]">
              Exchanges ({sentRequests.length + receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="ecopoints" className="rounded-full px-4 py-2 text-sm font-semibold data-[state=active]:bg-card data-[state=active]:shadow-[var(--shadow-soft)]">
              Eco Impact
            </TabsTrigger>
          </TabsList>

          {/* My Listings */}
          <TabsContent value="listings">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">{myListings.length} item{myListings.length !== 1 ? "s" : ""} listed</p>
              <Link
                to="/list-item"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                + List another
              </Link>
            </div>
            {myListings.length === 0 ? (
              <div className="text-center py-20 rounded-3xl border border-dashed border-border">
                <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold">No listings yet</p>
                <p className="text-sm text-muted-foreground mt-1">List your first item and start making an impact.</p>
                <Link to="/list-item" className="mt-6 inline-flex px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  List an item
                </Link>
              </div>
            ) : (
              <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {myListings.map((item) => (
                  <div key={item.id} className="relative">
                    <ItemCard item={item} />
                    <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDelete(item)}
                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-full bg-destructive/90 text-destructive-foreground text-xs font-semibold hover:bg-destructive transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Exchanges */}
          <TabsContent value="exchanges">
            <div className="space-y-8">
              {/* Received */}
              <div>
                <h2 className="text-lg font-extrabold mb-4">Received requests ({receivedRequests.length})</h2>
                {receivedRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No exchange requests received yet.</p>
                ) : (
                  <div className="space-y-3">
                    {receivedRequests.map((ex) => (
                      <ExchangeCard
                        key={ex.id}
                        exchange={ex}
                        isOwner
                        onAccept={() => handleRespond(ex.id, "accepted")}
                        onDecline={() => handleRespond(ex.id, "declined")}
                      />
                    ))}
                  </div>
                )}
              </div>
              {/* Sent */}
              <div>
                <h2 className="text-lg font-extrabold mb-4">Sent requests ({sentRequests.length})</h2>
                {sentRequests.length === 0 ? (
                  <p className="text-sm text-muted-foreground">You haven't requested any exchanges yet.</p>
                ) : (
                  <div className="space-y-3">
                    {sentRequests.map((ex) => (
                      <ExchangeCard key={ex.id} exchange={ex} isOwner={false} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Eco Impact */}
          <TabsContent value="ecopoints">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Impact stats */}
              <div className="rounded-3xl bg-card border border-border p-8">
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Your impact
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5">
                    <div className="text-2xl font-extrabold text-primary">{co2Display} kg</div>
                    <div className="text-xs text-muted-foreground mt-1">CO₂ saved</div>
                  </div>
                  <div className="rounded-2xl bg-primary/5 border border-primary/10 p-5">
                    <div className="text-2xl font-extrabold text-primary">{user.textileSaved.toFixed(1)} kg</div>
                    <div className="text-xs text-muted-foreground mt-1">Textile saved</div>
                  </div>
                  <div className="rounded-2xl bg-accent/5 border border-accent/10 p-5">
                    <div className="text-2xl font-extrabold text-accent">{user.ecoPoints}</div>
                    <div className="text-xs text-muted-foreground mt-1">Eco points</div>
                  </div>
                  <div className="rounded-2xl bg-accent/5 border border-accent/10 p-5">
                    <div className="text-2xl font-extrabold text-accent">{user.donationCount}</div>
                    <div className="text-xs text-muted-foreground mt-1">Donations</div>
                  </div>
                </div>
                {/* Points progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-muted-foreground">Progress to next level</span>
                    <span className="text-primary">{user.ecoPoints} / 200 pts</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${progressToNextBadge}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="rounded-3xl bg-card border border-border p-8">
                <h2 className="text-xl font-extrabold mb-6 flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Badges
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {ALL_BADGES.map((b) => {
                    const earned = user.badges.includes(b.key);
                    return (
                      <div
                        key={b.key}
                        className={`rounded-2xl border p-4 transition-all ${
                          earned
                            ? "border-primary/20 bg-primary/5"
                            : "border-border bg-muted/50 opacity-50"
                        }`}
                      >
                        <div
                          className={`grid h-10 w-10 place-items-center rounded-xl mb-3 ${
                            earned ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <b.icon className="h-5 w-5" />
                        </div>
                        <p className="text-xs font-extrabold">{b.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{b.desc}</p>
                        {earned && (
                          <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-primary">
                            <Check className="h-3 w-3" /> Earned
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </SiteLayout>
  );
}

function StatPill({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-muted px-4 py-3">
      <div className={`text-2xl font-extrabold ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ExchangeCard({
  exchange,
  isOwner,
  onAccept,
  onDecline,
}: {
  exchange: Exchange;
  isOwner: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    declined: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  const statusIcons: Record<string, React.ElementType> = {
    pending: Clock,
    accepted: Check,
    declined: X,
  };
  const StatusIcon = statusIcons[exchange.status] ?? Clock;

  return (
    <div className="rounded-2xl bg-card border border-border p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusColors[exchange.status]}`}>
            <StatusIcon className="h-3 w-3" />
            {exchange.status.charAt(0).toUpperCase() + exchange.status.slice(1)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {exchange.type === "donate" ? "Donation request" : "Exchange request"}
          </span>
        </div>
        <p className="mt-2 font-semibold text-sm">
          {isOwner ? exchange.requesterName : "Your request"} for{" "}
          <Link to="/item/$id" params={{ id: exchange.itemId }} className="text-primary hover:underline">
            {exchange.itemTitle}
          </Link>
        </p>
        {exchange.message && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">"{exchange.message}"</p>
        )}
        <p className="mt-1 text-[11px] text-muted-foreground">
          {new Date(exchange.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
      {isOwner && exchange.status === "pending" && (
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onAccept}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            <Check className="h-3.5 w-3.5" /> Accept
          </button>
          <button
            onClick={onDecline}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-border text-xs font-semibold hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" /> Decline
          </button>
        </div>
      )}
    </div>
  );
}
