import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import { useMemo } from "react";
import { ArrowRight, Leaf, Package, Repeat, Trophy, PlusCircle, Heart } from "lucide-react";
import { ItemCard } from "@/components/ItemCard";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ReWear" },
      { name: "description", content: "Your ReWear dashboard — listings, exchanges, and eco impact." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { user, items, exchanges, notifications } = useApp();

  if (!user) {
    return (
      <SiteLayout>
        <section className="container-rewear py-32 text-center">
          <h1 className="text-3xl font-extrabold">Sign in to view your dashboard</h1>
          <p className="mt-3 text-muted-foreground">Your activity, listings, and eco impact all in one place.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">Sign in</Link>
            <Link to="/signup" className="inline-flex px-6 py-3 rounded-full border border-border font-semibold text-sm hover:bg-muted">Create account</Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const myListings = useMemo(() => items.filter((i) => i.owner.id === user.id), [items, user.id]);
  const pendingReceived = useMemo(
    () => exchanges.filter((e) => e.ownerId === user.id && e.status === "pending"),
    [exchanges, user.id]
  );
  const recentActivity = useMemo(
    () => notifications.slice(0, 5),
    [notifications]
  );

  // Suggested items (not mine)
  const suggestedItems = useMemo(
    () => items.filter((i) => i.owner.id !== user.id && i.isAvailable).slice(0, 4),
    [items, user.id]
  );

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <SiteLayout>
      <section className="container-rewear pt-10 pb-20">
        {/* Welcome banner */}
        <div className="rounded-3xl bg-primary text-primary-foreground px-8 py-10 md:py-12 flex flex-col md:flex-row md:items-center gap-6 md:gap-12 mb-10">
          <div className="flex items-center gap-5">
            <span
              className="grid h-16 w-16 shrink-0 place-items-center rounded-full text-xl font-extrabold bg-primary-foreground/10"
            >
              {user.initials}
            </span>
            <div>
              <p className="text-primary-foreground/70 text-sm">{greeting},</p>
              <h1 className="text-3xl font-extrabold">{user.name.split(" ")[0]} 👋</h1>
              <p className="text-primary-foreground/70 text-sm mt-1">
                {user.ecoPoints} eco points · {user.co2Saved.toFixed(1)} kg CO₂ saved
              </p>
            </div>
          </div>
          <div className="md:ml-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Listings", value: myListings.length, icon: Package },
              { label: "Exchanges", value: user.exchangeCount, icon: Repeat },
              { label: "Donations", value: user.donationCount, icon: Heart },
              { label: "Eco pts", value: user.ecoPoints, icon: Leaf },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-primary-foreground/10 p-4 text-center">
                <s.icon className="h-5 w-5 mx-auto mb-1 text-primary-foreground/70" />
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-primary-foreground/70">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          {/* Main column */}
          <div className="space-y-8">
            {/* Quick actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <QuickAction icon={PlusCircle} label="List an Item" to="/list-item" primary />
              <QuickAction icon={Package} label="My Listings" to="/profile" />
              <QuickAction icon={Repeat} label="Exchanges" to="/profile" />
            </div>

            {/* Pending exchanges */}
            {pendingReceived.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-extrabold">Pending requests</h2>
                  <Link to="/profile" className="text-sm text-primary font-semibold hover:underline">View all →</Link>
                </div>
                <div className="space-y-3">
                  {pendingReceived.slice(0, 3).map((ex) => (
                    <div key={ex.id} className="rounded-2xl bg-card border border-border p-4 flex items-center gap-4">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
                        <Repeat className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold line-clamp-1">
                          <span className="text-primary">{ex.requesterName}</span> wants to exchange for "{ex.itemTitle}"
                        </p>
                        <p className="text-xs text-muted-foreground">{ex.type === "donate" ? "Donation" : "Exchange"} request</p>
                      </div>
                      <Link
                        to="/profile"
                        className="shrink-0 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90"
                      >
                        Review
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested items */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold">Discover</h2>
                <Link to="/marketplace" className="text-sm text-primary font-semibold hover:underline">Browse all →</Link>
              </div>
              {suggestedItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No items available right now.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestedItems.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Eco impact */}
            <div className="rounded-3xl bg-card border border-border p-6">
              <h3 className="font-extrabold mb-4 flex items-center gap-2">
                <Leaf className="h-4 w-4 text-primary" />
                Your eco impact
              </h3>
              <div className="space-y-3">
                <ImpactRow label="CO₂ saved" value={`${user.co2Saved.toFixed(1)} kg`} />
                <ImpactRow label="Textile saved" value={`${user.textileSaved.toFixed(1)} kg`} />
                <ImpactRow label="Badges earned" value={`${user.badges.length}`} />
              </div>
              <Link to="/profile" className="mt-4 text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                View full impact <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Recent notifications */}
            <div className="rounded-3xl bg-card border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold">Activity</h3>
                <Link to="/notifications" className="text-xs text-primary font-semibold hover:underline">View all</Link>
              </div>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((n) => (
                    <div key={n.id} className={`text-sm rounded-xl p-3 ${!n.read ? "bg-primary/5" : "bg-muted/40"}`}>
                      <p className="line-clamp-2 text-xs leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function QuickAction({
  icon: Icon,
  label,
  to,
  primary,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
  primary?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-2 p-5 rounded-2xl border font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] ${
        primary
          ? "border-primary bg-primary text-primary-foreground hover:opacity-90"
          : "border-border bg-card text-foreground hover:border-primary/30"
      }`}
    >
      <Icon className="h-6 w-6" />
      {label}
    </Link>
  );
}

function ImpactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
