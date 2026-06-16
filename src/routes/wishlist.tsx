import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import { useMemo } from "react";
import { ItemCard } from "@/components/ItemCard";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — ReWear" },
      { name: "description", content: "Your saved items on ReWear." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { user, items, wishlist } = useApp();

  if (!user) {
    return (
      <SiteLayout>
        <section className="container-rewear py-32 text-center">
          <h1 className="text-3xl font-extrabold">Sign in to view your wishlist</h1>
          <p className="mt-3 text-muted-foreground">Save items you love and find them here later.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/login" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">Sign in</Link>
            <Link to="/signup" className="inline-flex px-6 py-3 rounded-full border border-border font-semibold text-sm hover:bg-muted">Create account</Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const wishlisted = useMemo(
    () => items.filter((i) => wishlist.includes(i.id)),
    [items, wishlist]
  );

  return (
    <SiteLayout>
      <section className="container-rewear pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Wishlist</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          {wishlisted.length === 0
            ? "Items you save will appear here."
            : `${wishlisted.length} item${wishlisted.length !== 1 ? "s" : ""} saved.`}
        </p>
      </section>

      <section className="container-rewear pb-20">
        {wishlisted.length === 0 ? (
          <div className="text-center py-24 rounded-3xl border border-dashed border-border">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-extrabold">Nothing saved yet</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              Browse the marketplace and tap the heart on any item to save it here.
            </p>
            <Link
              to="/marketplace"
              className="mt-8 inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Browse Marketplace
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlisted.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
