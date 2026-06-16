import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground font-extrabold text-sm transition-transform group-hover:scale-105">
        Re
      </span>
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        ReWear
      </span>
    </Link>
  );
}