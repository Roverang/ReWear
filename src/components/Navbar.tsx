import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Heart,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  PlusCircle,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Logo } from "./Logo";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";

const links = [
  { to: "/", label: "Home" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/categories", label: "Categories" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/about", label: "About Us" },
] as const;

export function Navbar() {
  const { user, logout, theme, toggleTheme, wishlist, unreadCount } = useApp();
  const navigate = useNavigate();
  const [searchQ, setSearchQ] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQ.trim()) {
      navigate({ to: "/marketplace", search: { q: searchQ.trim() } });
      setSearchQ("");
      setMobileOpen(false);
    }
  }

  function handleLogout() {
    logout();
    setUserMenuOpen(false);
    toast.success("Logged out successfully.");
    navigate({ to: "/" });
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container-rewear flex h-16 items-center gap-4">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="px-3 py-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                activeProps={{ className: "px-3 py-2 rounded-full text-primary bg-primary/8 font-semibold" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {/* Desktop search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 rounded-full bg-muted px-3 py-2 w-52 text-sm text-muted-foreground">
              <Search className="h-4 w-4 shrink-0" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search items, brands…"
                className="bg-transparent outline-none w-full placeholder:text-muted-foreground"
              />
            </form>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
              id="theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="hidden sm:grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold grid place-items-center">
                  {wishlist.length > 9 ? "9+" : wishlist.length}
                </span>
              )}
            </Link>

            {/* Notifications */}
            <div className="relative hidden sm:block" ref={notifRef}>
              <button
                onClick={() => setNotifOpen((p) => !p)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold grid place-items-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-72 rounded-2xl bg-card border border-border shadow-[var(--shadow-lift)] py-2 z-50">
                  <div className="px-4 py-2 flex items-center justify-between border-b border-border">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notifications</span>
                    {user && (
                      <Link to="/notifications" onClick={() => setNotifOpen(false)} className="text-xs text-primary font-semibold">
                        View all
                      </Link>
                    )}
                  </div>
                  {!user ? (
                    <p className="px-4 py-4 text-sm text-muted-foreground">Sign in to see notifications.</p>
                  ) : unreadCount === 0 ? (
                    <p className="px-4 py-4 text-sm text-muted-foreground">You're all caught up 🌿</p>
                  ) : (
                    <p className="px-4 py-4 text-sm text-muted-foreground">
                      You have <span className="font-semibold text-foreground">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 hover:bg-muted transition-colors"
                  id="user-menu-button"
                >
                  <span
                    className="grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-white"
                    style={{ background: user.avatarColor }}
                  >
                    {user.initials}
                  </span>
                  <span className="hidden md:block text-sm font-semibold text-foreground max-w-[100px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 rounded-2xl bg-card border border-border shadow-[var(--shadow-lift)] py-2 z-50">
                    <div className="px-4 py-2 border-b border-border mb-1">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                    <UserMenuItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" onClick={() => setUserMenuOpen(false)} />
                    <UserMenuItem icon={User} label="My Profile" to="/profile" onClick={() => setUserMenuOpen(false)} />
                    <UserMenuItem icon={PlusCircle} label="List an Item" to="/list-item" onClick={() => setUserMenuOpen(false)} />
                    <UserMenuItem icon={Heart} label="Wishlist" to="/wishlist" onClick={() => setUserMenuOpen(false)} />
                    <UserMenuItem icon={Bell} label="Notifications" to="/notifications" onClick={() => setUserMenuOpen(false)} badge={unreadCount} />
                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/8 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-flex px-4 py-2 rounded-full text-sm font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  id="signup-nav-btn"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((p) => !p)}
              className="lg:hidden grid h-10 w-10 place-items-center rounded-full hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile slide-in menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-background border-l border-border flex flex-col shadow-[var(--shadow-lift)]">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2 mx-4 mt-4 rounded-full bg-muted px-3 py-2.5">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Search items, brands…"
                className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
              />
            </form>

            <nav className="flex flex-col gap-1 p-4 mt-2 flex-1 overflow-y-auto scrollbar-thin">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  activeProps={{ className: "flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-primary bg-primary/8" }}
                >
                  {l.label}
                </Link>
              ))}

              <div className="border-t border-border mt-2 pt-2">
                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="ml-auto h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center px-1">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-auto h-5 min-w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center px-1">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="border-t border-border mt-2 pt-2">
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
            </nav>

            <div className="p-4 border-t border-border">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-2">
                    <span
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
                      style={{ background: user.avatarColor }}
                    >
                      {user.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/list-item"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold"
                  >
                    <PlusCircle className="h-4 w-4" />
                    List an Item
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full rounded-full border border-border py-3 text-sm font-semibold text-destructive hover:bg-destructive/8 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full rounded-full border border-border py-3 text-sm font-semibold hover:bg-muted transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-semibold hover:opacity-90 transition-opacity"
                  >
                    Sign Up — it's free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UserMenuItem({
  icon: Icon,
  label,
  to,
  onClick,
  badge,
}: {
  icon: React.ElementType;
  label: string;
  to: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
      {badge && badge > 0 ? (
        <span className="ml-auto h-5 min-w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold grid place-items-center px-1">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : null}
    </Link>
  );
}