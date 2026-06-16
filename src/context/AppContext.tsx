import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  getUsers,
  addUser,
  updateUser,
  getUserByEmail,
  getStoredItems,
  saveStoredItems,
  addStoredItem,
  updateStoredItem,
  deleteStoredItem,
  getWishlist,
  saveWishlist,
  getExchanges,
  addExchange,
  updateExchange,
  getNotifications,
  saveNotifications,
  addNotification,
  getTheme,
  saveTheme,
  generateId,
  calcSustainabilityScore,
  getInitials,
  randomAvatarColor,
  type User,
  type Exchange,
  type AppNotification,
  type StoredItem,
} from "@/lib/store";
import { seedItems } from "@/lib/mock-data";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AppContextType {
  // Auth
  user: User | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (data: RegisterData) => { ok: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Items
  items: StoredItem[];
  refreshItems: () => void;
  addItem: (item: Omit<StoredItem, "id" | "listedAt" | "exchangeCount" | "isAvailable" | "sustainabilityScore">) => StoredItem;
  editItem: (item: StoredItem) => void;
  removeItem: (id: string) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (itemId: string) => void;
  isWishlisted: (itemId: string) => boolean;

  // Exchanges
  exchanges: Exchange[];
  requestExchange: (itemId: string, itemTitle: string, ownerId: string, message: string, proposedItemId?: string) => void;
  donateItem: (itemId: string, itemTitle: string, ownerId: string) => void;
  respondExchange: (exchangeId: string, status: "accepted" | "declined") => void;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  stylePreferences?: string[];
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [items, setItems] = useState<StoredItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // ── Bootstrap ───────────────────────────────────────────────────────────────

  useEffect(() => {
    // Theme
    const savedTheme = getTheme();
    setTheme(savedTheme);
    applyTheme(savedTheme);

    // Auth
    const savedUser = getCurrentUser();
    setUser(savedUser);

    // Items — seed from mock data if first visit
    let stored = getStoredItems();
    if (stored.length === 0) {
      saveStoredItems(seedItems as StoredItem[]);
      stored = seedItems as StoredItem[];
    }
    setItems(stored);

    // Exchanges
    setExchanges(getExchanges());

    // Per-user data
    if (savedUser) {
      setWishlist(getWishlist(savedUser.id));
      setNotifications(getNotifications(savedUser.id));
    }
  }, []);

  // ── Theme ────────────────────────────────────────────────────────────────────

  function applyTheme(t: "light" | "dark") {
    if (typeof document === "undefined") return;
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      saveTheme(next);
      applyTheme(next);
      return next;
    });
  }, []);

  // ── Auth ─────────────────────────────────────────────────────────────────────

  const login = useCallback(
    (email: string, password: string): { ok: boolean; error?: string } => {
      const found = getUserByEmail(email);
      if (!found) return { ok: false, error: "No account found with that email." };
      if (found.password !== password) return { ok: false, error: "Incorrect password." };
      saveCurrentUser(found);
      setUser(found);
      setWishlist(getWishlist(found.id));
      setNotifications(getNotifications(found.id));
      setExchanges(getExchanges());
      return { ok: true };
    },
    []
  );

  const register = useCallback(
    (data: RegisterData): { ok: boolean; error?: string } => {
      if (getUserByEmail(data.email)) {
        return { ok: false, error: "An account with this email already exists." };
      }
      const newUser: User = {
        id: generateId(),
        name: data.name,
        email: data.email,
        password: data.password,
        initials: getInitials(data.name),
        avatarColor: randomAvatarColor(),
        location: "",
        bio: "",
        memberSince: new Date().toISOString().slice(0, 7),
        ecoPoints: 10,
        co2Saved: 0,
        textileSaved: 0,
        exchangeCount: 0,
        donationCount: 0,
        badges: ["Eco Starter"],
        stylePreferences: data.stylePreferences ?? [],
      };
      addUser(newUser);
      saveCurrentUser(newUser);
      setUser(newUser);
      setWishlist([]);
      setNotifications([]);

      // Welcome notification
      const welcomeNotif: AppNotification = {
        id: generateId(),
        userId: newUser.id,
        message: "Welcome to ReWear! 🌿 You've earned the Eco Starter badge.",
        type: "badge",
        read: false,
        createdAt: new Date().toISOString(),
      };
      addNotification(newUser.id, welcomeNotif);
      setNotifications([welcomeNotif]);

      return { ok: true };
    },
    []
  );

  const logout = useCallback(() => {
    clearCurrentUser();
    setUser(null);
    setWishlist([]);
    setNotifications([]);
  }, []);

  const updateProfile = useCallback(
    (data: Partial<User>) => {
      if (!user) return;
      const updated = { ...user, ...data };
      updateUser(updated);
      setUser(updated);
    },
    [user]
  );

  // ── Items ────────────────────────────────────────────────────────────────────

  const refreshItems = useCallback(() => {
    setItems(getStoredItems());
  }, []);

  const addItem = useCallback(
    (
      item: Omit<StoredItem, "id" | "listedAt" | "exchangeCount" | "isAvailable" | "sustainabilityScore">
    ): StoredItem => {
      const newItem: StoredItem = {
        ...item,
        id: generateId(),
        sustainabilityScore: calcSustainabilityScore(item.condition),
        listedAt: new Date().toISOString(),
        exchangeCount: 0,
        isAvailable: true,
      };
      addStoredItem(newItem);
      setItems(getStoredItems());

      // Award eco points to user
      if (user) {
        const updated: User = {
          ...user,
          ecoPoints: user.ecoPoints + 20,
        };
        updateUser(updated);
        setUser(updated);
      }

      return newItem;
    },
    [user]
  );

  const editItem = useCallback((item: StoredItem) => {
    updateStoredItem(item);
    setItems(getStoredItems());
  }, []);

  const removeItem = useCallback((id: string) => {
    deleteStoredItem(id);
    setItems(getStoredItems());
  }, []);

  // ── Wishlist ─────────────────────────────────────────────────────────────────

  const toggleWishlist = useCallback(
    (itemId: string) => {
      if (!user) return;
      setWishlist((prev) => {
        const next = prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId];
        saveWishlist(user.id, next);
        return next;
      });
    },
    [user]
  );

  const isWishlisted = useCallback(
    (itemId: string) => wishlist.includes(itemId),
    [wishlist]
  );

  // ── Exchanges ─────────────────────────────────────────────────────────────────

  const requestExchange = useCallback(
    (itemId: string, itemTitle: string, ownerId: string, message: string, proposedItemId?: string) => {
      if (!user) return;

      const exchange: Exchange = {
        id: generateId(),
        itemId,
        itemTitle,
        requesterId: user.id,
        requesterName: user.name,
        ownerId,
        message,
        proposedItemId,
        status: "pending",
        createdAt: new Date().toISOString(),
        type: "exchange",
      };

      addExchange(exchange);
      setExchanges(getExchanges());

      // Notify owner (if they have an account)
      const notif: AppNotification = {
        id: generateId(),
        userId: ownerId,
        message: `${user.name} wants to exchange for your "${itemTitle}"`,
        link: `/item/${itemId}`,
        type: "exchange",
        read: false,
        createdAt: new Date().toISOString(),
      };
      addNotification(ownerId, notif);

      // Update requester eco points
      const updated: User = {
        ...user,
        ecoPoints: user.ecoPoints + 10,
        co2Saved: parseFloat((user.co2Saved + 3).toFixed(1)),
        textileSaved: parseFloat((user.textileSaved + 0.5).toFixed(1)),
      };
      updateUser(updated);
      setUser(updated);
    },
    [user]
  );

  const donateItem = useCallback(
    (itemId: string, itemTitle: string, ownerId: string) => {
      if (!user) return;

      const exchange: Exchange = {
        id: generateId(),
        itemId,
        itemTitle,
        requesterId: user.id,
        requesterName: user.name,
        ownerId,
        message: "I'd like to donate this item.",
        status: "pending",
        createdAt: new Date().toISOString(),
        type: "donate",
      };

      addExchange(exchange);
      setExchanges(getExchanges());

      const notif: AppNotification = {
        id: generateId(),
        userId: ownerId,
        message: `${user.name} wants to donate your "${itemTitle}" to a good home.`,
        link: `/item/${itemId}`,
        type: "donate",
        read: false,
        createdAt: new Date().toISOString(),
      };
      addNotification(ownerId, notif);

      const updated: User = {
        ...user,
        ecoPoints: user.ecoPoints + 15,
        donationCount: user.donationCount + 1,
        co2Saved: parseFloat((user.co2Saved + 3).toFixed(1)),
        textileSaved: parseFloat((user.textileSaved + 0.5).toFixed(1)),
      };
      updateUser(updated);
      setUser(updated);
    },
    [user]
  );

  const respondExchange = useCallback(
    (exchangeId: string, status: "accepted" | "declined") => {
      updateExchange(exchangeId, status);
      setExchanges(getExchanges());

      const exchange = getExchanges().find((e) => e.id === exchangeId);
      if (exchange && user) {
        // Notify requester
        const notif: AppNotification = {
          id: generateId(),
          userId: exchange.requesterId,
          message:
            status === "accepted"
              ? `Your exchange request for "${exchange.itemTitle}" was accepted! 🎉`
              : `Your exchange request for "${exchange.itemTitle}" was declined.`,
          link: `/item/${exchange.itemId}`,
          type: "exchange",
          read: false,
          createdAt: new Date().toISOString(),
        };
        addNotification(exchange.requesterId, notif);

        if (status === "accepted") {
          const updated: User = {
            ...user,
            ecoPoints: user.ecoPoints + 25,
            exchangeCount: user.exchangeCount + 1,
            co2Saved: parseFloat((user.co2Saved + 3).toFixed(1)),
            textileSaved: parseFloat((user.textileSaved + 0.5).toFixed(1)),
          };
          updateUser(updated);
          setUser(updated);

          // Mark item as unavailable
          const item = getStoredItems().find((i) => i.id === exchange.itemId);
          if (item) {
            updateStoredItem({ ...item, isAvailable: false });
            setItems(getStoredItems());
          }
        }
      }
    },
    [user]
  );

  // ── Notifications ─────────────────────────────────────────────────────────────

  const markAllRead = useCallback(() => {
    if (!user) return;
    const updated = notifications.map((n) => ({ ...n, read: true }));
    saveNotifications(user.id, updated);
    setNotifications(updated);
  }, [user, notifications]);

  const markRead = useCallback(
    (id: string) => {
      if (!user) return;
      const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(user.id, updated);
      setNotifications(updated);
    },
    [user, notifications]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        theme,
        toggleTheme,
        items,
        refreshItems,
        addItem,
        editItem,
        removeItem,
        wishlist,
        toggleWishlist,
        isWishlisted,
        exchanges,
        requestExchange,
        donateItem,
        respondExchange,
        notifications,
        unreadCount,
        markAllRead,
        markRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
