import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import { Bell, CheckCheck } from "lucide-react";

import type { AppNotification } from "@/lib/store";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — ReWear" },
      { name: "description", content: "Your ReWear notifications." },
    ],
  }),
  component: NotificationsPage,
});

const TYPE_ICONS: Record<AppNotification["type"], string> = {
  exchange: "🔄",
  badge: "🏅",
  wishlist: "❤️",
  system: "📣",
  donate: "🎁",
};

function NotificationsPage() {
  const { user, notifications, markAllRead, markRead, unreadCount } = useApp();

  if (!user) {
    return (
      <SiteLayout>
        <section className="container-rewear py-32 text-center">
          <h1 className="text-3xl font-extrabold">Sign in to see notifications</h1>
          <p className="mt-3 text-muted-foreground">Stay updated on exchanges, donations, and badges.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">Sign in</Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  // Group by date
  const grouped = notifications.reduce<Record<string, AppNotification[]>>((acc, n) => {
    const date = new Date(n.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(n);
    return acc;
  }, {});

  return (
    <SiteLayout>
      <section className="container-rewear pt-12 pb-8">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-2 text-muted-foreground">
                <span className="font-semibold text-foreground">{unreadCount}</span> unread
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-semibold hover:bg-muted/80 transition-colors"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </button>
          )}
        </div>
      </section>

      <section className="container-rewear pb-20 max-w-2xl mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-border">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-extrabold">All caught up 🌿</h2>
            <p className="text-sm text-muted-foreground mt-2">
              You'll see exchange requests, badge updates, and more here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([date, notifs]) => (
              <div key={date}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">{date}</h2>
                <div className="space-y-2">
                  {notifs.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => !n.read && markRead(n.id)}
                      className={`flex items-start gap-4 rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-[var(--shadow-soft)] ${
                        !n.read
                          ? "border-primary/20 bg-primary/5"
                          : "border-border bg-card"
                      }`}
                    >
                      <span className="text-2xl shrink-0 mt-0.5">{TYPE_ICONS[n.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed">{n.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {new Date(n.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
