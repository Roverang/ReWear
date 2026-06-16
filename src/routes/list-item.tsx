import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef } from "react";
import { Camera, ChevronRight, ChevronLeft, Leaf, Upload, X } from "lucide-react";
import { toast } from "sonner";



export const Route = createFileRoute("/list-item")({
  head: () => ({
    meta: [
      { title: "List an Item — ReWear" },
      { name: "description", content: "List your pre-loved clothing on ReWear and give it a second life." },
    ],
  }),
  component: ListItemPage,
});

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(80),
  brand: z.string().min(1, "Brand is required."),
  category: z.enum(["T-Shirts", "Hoodies", "Jackets", "Pants", "Shoes", "Accessories"]),
  condition: z.enum(["Like New", "Excellent", "Good", "Fair"]),
  size: z.string().min(1, "Size is required."),
  gender: z.enum(["Women", "Men", "Unisex"]),
  location: z.string().min(2, "Location is required."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(500),
  pointValue: z.coerce.number().min(10).max(500),
});
type FormData = z.infer<typeof schema>;

const CONDITIONS = ["Like New", "Excellent", "Good", "Fair"] as const;
const CATEGORIES = ["T-Shirts", "Hoodies", "Jackets", "Pants", "Shoes", "Accessories"] as const;
const GENDERS = ["Women", "Men", "Unisex"] as const;
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "28", "30", "32", "34", "36", "38", "40", "6", "7", "8", "9", "10", "11", "12"];

function ListItemPage() {
  const { user, addItem } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <SiteLayout>
        <section className="container-rewear py-32 text-center">
          <h1 className="text-3xl font-extrabold">Sign in to list an item</h1>
          <p className="mt-3 text-muted-foreground">You need to be signed in to list clothing on ReWear.</p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link to="/login" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90">
              Sign in
            </Link>
            <Link to="/signup" className="inline-flex px-6 py-3 rounded-full border border-border font-semibold text-sm hover:bg-muted">
              Create account
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { pointValue: 60, gender: "Unisex" },
  });

  async function handleNext() {
    const fields: (keyof FormData)[] =
      step === 1
        ? ["title", "brand", "category", "condition", "size", "gender"]
        : ["location", "description", "pointValue"];
    const valid = await trigger(fields);
    if (valid) setStep((prev) => (prev < 3 ? ((prev + 1) as 1 | 2 | 3) : prev));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image must be under 3 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function onSubmit(data: FormData) {
    const newItem = addItem({
      title: data.title,
      brand: data.brand,
      category: data.category,
      condition: data.condition,
      size: data.size,
      gender: data.gender,
      location: data.location,
      description: data.description,
      pointValue: data.pointValue,
      image: imagePreview ?? "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
      images: imagePreview ? [imagePreview] : [],
      owner: {
        id: user.id,
        name: user.name,
        initials: user.initials,
        memberSince: user.memberSince,
        exchangeCount: user.exchangeCount,
        avatarColor: user.avatarColor,
      },
    });

    toast.success("Item listed successfully! +20 eco points 🌿");
    navigate({ to: "/item/$id", params: { id: newItem.id } });
  }

  const watchedCategory = watch("category");
  const watchedCondition = watch("condition");

  const steps = [
    { n: 1, label: "Details" },
    { n: 2, label: "Description" },
    { n: 3, label: "Photo" },
  ];

  return (
    <SiteLayout>
      <section className="container-rewear py-12">
        <div className="max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">New listing</span>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight">List your item.</h1>
          <p className="mt-2 text-muted-foreground">Give a pre-loved piece a second life in under 2 minutes.</p>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mt-8 mb-10">
            {steps.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold transition-all ${
                      step >= s.n
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s.n ? "✓" : s.n}
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded-full transition-all ${step > s.n ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-soft)]">
              {/* Step 1: Details */}
              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-extrabold mb-6">Item details</h2>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Item title *</label>
                      <input
                        {...register("title")}
                        placeholder="e.g. Cream Cable Knit Sweater"
                        className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                      />
                      {errors.title && <p className="mt-1 text-xs text-destructive">{errors.title.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Brand *</label>
                      <input
                        {...register("brand")}
                        placeholder="e.g. Everlane, Uniqlo"
                        className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                      />
                      {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Category *</label>
                      <select
                        {...register("category")}
                        className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors"
                      >
                        <option value="">Select category</option>
                        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      {errors.category && <p className="mt-1 text-xs text-destructive">{errors.category.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Condition *</label>
                    <div className="grid grid-cols-4 gap-2">
                      {CONDITIONS.map((c) => (
                        <label
                          key={c}
                          className={`relative flex flex-col items-center gap-1 rounded-2xl border p-3 cursor-pointer transition-all ${
                            watchedCondition === c
                              ? "border-primary bg-primary/8 text-primary"
                              : "border-border bg-muted hover:border-primary/40"
                          }`}
                        >
                          <input type="radio" {...register("condition")} value={c} className="sr-only" />
                          <span className="text-xs font-semibold text-center">{c}</span>
                        </label>
                      ))}
                    </div>
                    {errors.condition && <p className="mt-1 text-xs text-destructive">{errors.condition.message}</p>}
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Size *</label>
                      <select
                        {...register("size")}
                        className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors"
                      >
                        <option value="">Select size</option>
                        {SIZES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      {errors.size && <p className="mt-1 text-xs text-destructive">{errors.size.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Gender *</label>
                      <div className="flex gap-2">
                        {GENDERS.map((g) => (
                          <label
                            key={g}
                            className={`flex-1 flex items-center justify-center rounded-2xl border p-3 cursor-pointer transition-all text-sm font-medium ${
                              watch("gender") === g
                                ? "border-primary bg-primary/8 text-primary"
                                : "border-border bg-muted hover:border-primary/40"
                            }`}
                          >
                            <input type="radio" {...register("gender")} value={g} className="sr-only" />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Description */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-xl font-extrabold mb-6">Description & details</h2>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Location *</label>
                    <input
                      {...register("location")}
                      placeholder="e.g. Brooklyn, NY"
                      className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                    />
                    {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Description * <span className="normal-case font-normal">(min 20 characters)</span>
                    </label>
                    <textarea
                      {...register("description")}
                      rows={5}
                      placeholder="Describe the item — condition, how often worn, any details, what you'd love to swap for…"
                      className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground resize-none"
                    />
                    {errors.description && <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Point value <span className="normal-case font-normal">(10–500 — how much your item is worth)</span>
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        {...register("pointValue")}
                        type="range"
                        min={10}
                        max={500}
                        step={5}
                        className="flex-1 accent-primary"
                      />
                      <span className="text-lg font-extrabold text-primary w-16 text-right">
                        {watch("pointValue")} pts
                      </span>
                    </div>
                  </div>

                  {/* Sustainability preview */}
                  <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4 flex items-center gap-3">
                    <Leaf className="h-5 w-5 text-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      By listing this item you're keeping ~0.5 kg of textile out of landfill and saving ~3 kg of CO₂. You'll earn <strong className="text-foreground">+20 eco points</strong>.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Photo */}
              {step === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-extrabold mb-6">Add a photo</h2>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative rounded-3xl border-2 border-dashed cursor-pointer transition-all ${
                      imagePreview ? "border-primary/30" : "border-border hover:border-primary/50"
                    } flex flex-col items-center justify-center min-h-64 overflow-hidden`}
                  >
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="Preview" className="w-full h-72 object-cover" />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                          className="absolute top-3 right-3 grid h-8 w-8 place-items-center rounded-full bg-card/90 hover:bg-card transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-3 p-8 text-center">
                        <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/8 text-primary">
                          <Camera className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">Click to upload a photo</p>
                          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 3 MB</p>
                        </div>
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium">
                          <Upload className="h-4 w-4" />
                          Choose file
                        </span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    No photo? We'll use a placeholder. You can always update it later.
                  </p>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev > 1 ? ((prev - 1) as 1 | 2 | 3) : prev))}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-border font-semibold text-sm hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  Continue <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  id="list-item-submit"
                >
                  <Leaf className="h-4 w-4" />
                  {isSubmitting ? "Publishing…" : "Publish listing"}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
