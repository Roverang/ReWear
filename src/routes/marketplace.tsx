import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { ItemCard } from "@/components/ItemCard";
import { useApp } from "@/context/AppContext";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

const searchParamsSchema = z.object({
  q: z.string().optional().default(""),
  category: z.string().optional().default("All"),
  condition: z.string().optional().default("All"),
  gender: z.string().optional().default("All"),
  size: z.string().optional().default("All"),
  sort: z.string().optional().default("Newest"),
  page: z.coerce.number().optional().default(1),
});

export const Route = createFileRoute("/marketplace")({
  validateSearch: (search) => searchParamsSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Marketplace — ReWear" },
      { name: "description", content: "Browse pre-loved clothing listed by the ReWear community." },
      { property: "og:title", content: "Marketplace — ReWear" },
      { property: "og:description", content: "Discover pre-loved clothing from your community." },
    ],
  }),
  component: MarketplacePage,
});

const ITEMS_PER_PAGE = 12;

const filterGroups = [
  { label: "Category", key: "category", options: ["All", "T-Shirts", "Hoodies", "Jackets", "Pants", "Shoes", "Accessories"] },
  { label: "Condition", key: "condition", options: ["All", "Like New", "Excellent", "Good", "Fair"] },
  { label: "Gender", key: "gender", options: ["All", "Women", "Men", "Unisex"] },
  { label: "Size", key: "size", options: ["All", "XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "One Size"] },
];

const sortOptions = ["Newest", "Oldest", "Eco Score ↑", "Eco Score ↓", "Points: Low", "Points: High"];

function MarketplacePage() {
  const { items } = useApp();
  const { q: urlQ, category: urlCat, condition: urlCond, gender: urlGender, sort: urlSort, page: urlPage } =
    Route.useSearch();

  const [q, setQ] = useState(urlQ);
  const [active, setActive] = useState({
    category: urlCat,
    condition: urlCond,
    gender: urlGender,
    size: "All",
  });
  const [sort, setSort] = useState(urlSort);
  const [page, setPage] = useState(urlPage);

  const navigate = Route.useNavigate();

  function applyFilters(updates: Partial<typeof active>) {
    const next = { ...active, ...updates };
    setActive(next);
    setPage(1);
    navigate({
      search: (prev) => ({
        ...prev,
        ...next,
        q,
        sort,
        page: 1,
      }),
      replace: true,
    });
  }

  function applySort(s: string) {
    setSort(s);
    navigate({ search: (prev) => ({ ...prev, sort: s }), replace: true });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate({ search: (prev) => ({ ...prev, q }), replace: true });
    setPage(1);
  }

  const filtered = useMemo(() => {
    let result = [...items];

    if (q.trim()) {
      const lower = q.toLowerCase();
      result = result.filter((i) =>
        `${i.title} ${i.brand} ${i.category}`.toLowerCase().includes(lower)
      );
    }
    if (active.category !== "All") result = result.filter((i) => i.category === active.category);
    if (active.condition !== "All") result = result.filter((i) => i.condition === active.condition);
    if (active.gender !== "All") result = result.filter((i) => i.gender === active.gender);
    if (active.size !== "All") result = result.filter((i) => i.size === active.size);

    // Sorting
    switch (sort) {
      case "Newest":
        result.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime());
        break;
      case "Oldest":
        result.sort((a, b) => new Date(a.listedAt).getTime() - new Date(b.listedAt).getTime());
        break;
      case "Eco Score ↑":
        result.sort((a, b) => b.sustainabilityScore - a.sustainabilityScore);
        break;
      case "Eco Score ↓":
        result.sort((a, b) => a.sustainabilityScore - b.sustainabilityScore);
        break;
      case "Points: Low":
        result.sort((a, b) => a.pointValue - b.pointValue);
        break;
      case "Points: High":
        result.sort((a, b) => b.pointValue - a.pointValue);
        break;
    }

    return result;
  }, [items, q, active, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const hasActiveFilters =
    active.category !== "All" || active.condition !== "All" || active.gender !== "All" || active.size !== "All" || q !== "";

  function clearFilters() {
    setQ("");
    setActive({ category: "All", condition: "All", gender: "All", size: "All" });
    setPage(1);
    navigate({ search: {}, replace: true });
  }

  return (
    <SiteLayout>
      <section className="container-rewear pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Marketplace</h1>
        <p className="mt-3 text-muted-foreground max-w-2xl">
          Every piece below is pre-loved and waiting for a second life.
        </p>
      </section>

      <section className="container-rewear pb-16">
        {/* Filter bar */}
        <div className="rounded-3xl bg-card border border-border p-4 md:p-5 mb-8">
          <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 flex-1 min-w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search items, brands…"
                className="bg-transparent outline-none w-full text-sm placeholder:text-muted-foreground"
              />
            </div>

            {filterGroups.map((g) => (
              <select
                key={g.key}
                value={active[g.key as keyof typeof active]}
                onChange={(e) => applyFilters({ [g.key]: e.target.value })}
                className="rounded-full bg-muted px-4 py-2.5 text-sm font-medium outline-none border-0 cursor-pointer"
              >
                {g.options.map((o) => (
                  <option key={o} value={o}>
                    {g.label}: {o}
                  </option>
                ))}
              </select>
            ))}

            <select
              value={sort}
              onChange={(e) => applySort(e.target.value)}
              className="rounded-full bg-primary text-primary-foreground px-4 py-2.5 text-sm font-semibold outline-none border-0 ml-auto cursor-pointer"
            >
              {sortOptions.map((o) => (
                <option key={o} value={o} className="text-foreground bg-card">
                  Sort: {o}
                </option>
              ))}
            </select>
          </form>
        </div>

        {/* Results bar */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{filtered.length}</span> item
            {filtered.length !== 1 ? "s" : ""}
            {hasActiveFilters && " matching filters"}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Items grid */}
        <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {paged.map((i) => (
            <ItemCard key={i.id} item={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 rounded-3xl border border-dashed border-border">
            <SlidersHorizontal className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">No items match those filters.</p>
            <button onClick={clearFilters} className="mt-4 text-sm text-primary font-semibold hover:underline">
              Clear all filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold transition-colors ${
                  p === currentPage
                    ? "bg-primary text-primary-foreground"
                    : "border border-border hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}