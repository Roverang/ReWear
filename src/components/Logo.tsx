import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5 group">
      <img
        src="/logo.png"
        alt="ReWear logo"
        width={36}
        height={36}
        className="rounded-full object-cover transition-transform group-hover:scale-105"
      />
      <span className="text-xl font-extrabold tracking-tight text-foreground">
        ReWear
      </span>
    </Link>
  );
}