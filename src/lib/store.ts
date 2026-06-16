/**
 * ReWear — localStorage-backed store
 * All data persistence lives here. Guards against SSR with isBrowser().
 */

export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // plaintext for mock only
  initials: string;
  avatarColor: string;
  location: string;
  bio: string;
  memberSince: string;
  ecoPoints: number;
  co2Saved: number; // kg
  textileSaved: number; // kg
  exchangeCount: number;
  donationCount: number;
  badges: string[];
  stylePreferences: string[];
}

export interface Exchange {
  id: string;
  itemId: string;
  itemTitle: string;
  requesterId: string;
  requesterName: string;
  ownerId: string;
  message: string;
  proposedItemId?: string;
  status: "pending" | "accepted" | "declined";
  createdAt: string;
  type: "exchange" | "donate";
}

export interface AppNotification {
  id: string;
  userId: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
  type: "exchange" | "badge" | "wishlist" | "system" | "donate";
}

export interface StoredItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  condition: "Like New" | "Excellent" | "Good" | "Fair";
  size: string;
  gender: "Women" | "Men" | "Unisex";
  location: string;
  sustainabilityScore: number;
  image: string;
  images: string[];
  owner: {
    id: string;
    name: string;
    initials: string;
    memberSince: string;
    exchangeCount: number;
    avatarColor: string;
  };
  description: string;
  pointValue: number;
  listedAt: string;
  exchangeCount: number;
  isAvailable: boolean;
}

const KEYS = {
  items: "rewear_items",
  users: "rewear_users",
  currentUser: "rewear_current_user",
  wishlist: "rewear_wishlist",
  exchanges: "rewear_exchanges",
  notifications: "rewear_notifications",
  theme: "rewear_theme",
} as const;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function get<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function set<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage quota exceeded — silently fail
  }
}

// ─── Items ───────────────────────────────────────────────────────────────────
export const getStoredItems = (): StoredItem[] => get<StoredItem[]>(KEYS.items, []);
export const saveStoredItems = (items: StoredItem[]): void => set(KEYS.items, items);

export function addStoredItem(item: StoredItem): void {
  const items = getStoredItems();
  items.unshift(item); // newest first
  saveStoredItems(items);
}

export function updateStoredItem(updated: StoredItem): void {
  const items = getStoredItems();
  const idx = items.findIndex((i) => i.id === updated.id);
  if (idx !== -1) {
    items[idx] = updated;
    saveStoredItems(items);
  }
}

export function deleteStoredItem(id: string): void {
  saveStoredItems(getStoredItems().filter((i) => i.id !== id));
}

// ─── Users ───────────────────────────────────────────────────────────────────
export const getUsers = (): User[] => get<User[]>(KEYS.users, []);
export const saveUsers = (users: User[]): void => set(KEYS.users, users);

export function addUser(user: User): void {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(updated: User): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === updated.id);
  if (idx !== -1) {
    users[idx] = updated;
    saveUsers(users);
  }
  // also update currentUser if it's the same
  const current = getCurrentUser();
  if (current?.id === updated.id) {
    saveCurrentUser(updated);
  }
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

// ─── Current user (session) ───────────────────────────────────────────────────
export const getCurrentUser = (): User | null => get<User | null>(KEYS.currentUser, null);
export const saveCurrentUser = (user: User | null): void => set(KEYS.currentUser, user);
export const clearCurrentUser = (): void => {
  if (isBrowser()) localStorage.removeItem(KEYS.currentUser);
};

// ─── Wishlist ─────────────────────────────────────────────────────────────────
export const getWishlist = (userId: string): string[] => {
  const all = get<Record<string, string[]>>(KEYS.wishlist, {});
  return all[userId] ?? [];
};

export const saveWishlist = (userId: string, ids: string[]): void => {
  const all = get<Record<string, string[]>>(KEYS.wishlist, {});
  all[userId] = ids;
  set(KEYS.wishlist, all);
};

// ─── Exchanges ────────────────────────────────────────────────────────────────
export const getExchanges = (): Exchange[] => get<Exchange[]>(KEYS.exchanges, []);
export const saveExchanges = (exchanges: Exchange[]): void => set(KEYS.exchanges, exchanges);

export function addExchange(exchange: Exchange): void {
  const exchanges = getExchanges();
  exchanges.unshift(exchange);
  saveExchanges(exchanges);
}

export function updateExchange(id: string, status: Exchange["status"]): void {
  const exchanges = getExchanges();
  const idx = exchanges.findIndex((e) => e.id === id);
  if (idx !== -1) {
    exchanges[idx].status = status;
    saveExchanges(exchanges);
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────
export const getNotifications = (userId: string): AppNotification[] => {
  const all = get<Record<string, AppNotification[]>>(KEYS.notifications, {});
  return all[userId] ?? [];
};

export const saveNotifications = (userId: string, notifications: AppNotification[]): void => {
  const all = get<Record<string, AppNotification[]>>(KEYS.notifications, {});
  all[userId] = notifications;
  set(KEYS.notifications, all);
};

export function addNotification(userId: string, notification: AppNotification): void {
  const notifs = getNotifications(userId);
  notifs.unshift(notification);
  saveNotifications(userId, notifs);
}

// ─── Theme ────────────────────────────────────────────────────────────────────
export const getTheme = (): "light" | "dark" => get<"light" | "dark">(KEYS.theme, "light");
export const saveTheme = (theme: "light" | "dark"): void => set(KEYS.theme, theme);

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function calcSustainabilityScore(condition: StoredItem["condition"]): number {
  const base: Record<StoredItem["condition"], number> = {
    "Like New": 92,
    Excellent: 85,
    Good: 76,
    Fair: 65,
  };
  // slight randomness ±3
  return base[condition] + Math.round((Math.random() - 0.5) * 6);
}

export function calcCo2Impact(score: number): number {
  // higher score = better sustainability = more CO₂ saved
  return parseFloat(((score / 100) * 5).toFixed(1));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export const AVATAR_COLORS = [
  "#7FA35B",
  "#3F6B37",
  "#C2A878",
  "#5AA469",
  "#A8B89C",
  "#6B8F71",
  "#8AAE6B",
  "#4A7C59",
];

export function randomAvatarColor(): string {
  return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
}
