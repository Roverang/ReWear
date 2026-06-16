import { Heart, MapPin, Leaf } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import type { StoredItem } from "@/lib/store";

export function ItemCard({ item }: { item: StoredItem }) {
  const { isWishlisted, toggleWishlist, user } = useApp();
  const wishlisted = isWishlisted(item.id);

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) {
      toast.error("Sign in to save items to your wishlist.");
      return;
    }
    toggleWishlist(item.id);
    toast.success(wishlisted ? "Removed from wishlist." : "Saved to wishlist! ❤️");
  }

  return (
    <Link
      to="/item/$id"
      params={{ id: item.id }}
      className="group rounded-3xl bg-card border border-border overflow-hidden hover:shadow-[var(--shadow-lift)] hover:-translate-y-1 transition-all flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          width={640}
          height={800}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur transition-colors ${
            wishlisted
              ? "bg-primary/90 text-primary-foreground"
              : "bg-card/90 text-foreground hover:bg-card"
          }`}
          aria-label={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`h-4 w-4 ${wishlisted ? "fill-current" : ""}`} />
        </button>
        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-card/90 backdrop-blur text-[11px] font-semibold text-primary">
          <Leaf className="h-3 w-3" />
          {item.sustainabilityScore}
        </span>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 rounded-full bg-card border border-border text-xs font-semibold">
              Exchanged
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">
          <span>{item.brand}</span>
          <span>{item.condition}</span>
        </div>
        <h3 className="font-extrabold text-sm leading-snug line-clamp-2 min-h-10">{item.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-2">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {item.location}
          </span>
          <span className="font-semibold text-foreground">Size {item.size}</span>
        </div>
        <div className="flex items-center gap-2 pt-3 border-t border-border mt-1">
          <span
            className="grid h-7 w-7 place-items-center rounded-full text-[10px] font-bold text-white shrink-0"
            style={{ background: item.owner.avatarColor }}
          >
            {item.owner.initials}
          </span>
          <span className="text-xs text-muted-foreground truncate">{item.owner.name}</span>
          <span className="ml-auto text-[10px] font-semibold text-primary bg-primary/8 rounded-full px-2 py-0.5">
            {item.pointValue} pts
          </span>
        </div>
      </div>
    </Link>
  );
}