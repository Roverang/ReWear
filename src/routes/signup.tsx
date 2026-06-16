import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, Check, Leaf } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — ReWear" },
      { name: "description", content: "Create your free ReWear account and start exchanging pre-loved clothes." },
    ],
  }),
  component: SignupPage,
});

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must include an uppercase letter.")
    .regex(/[0-9]/, "Must include a number."),
});
type FormData = z.infer<typeof schema>;

const STYLE_TAGS = [
  "Minimalist", "Streetwear", "Vintage", "Athleisure", "Business Casual",
  "Boho", "Preppy", "Techwear", "Y2K", "Cottagecore",
];

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-destructive", "bg-yellow-500", "bg-accent", "bg-success"];
  return { score, label: labels[score] || "", color: colors[score] || "" };
}

function SignupPage() {
  const { register: registerUser, user } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState("");

  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    trigger,
    getValues,
    watch,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const watchedPw = watch("password", "");
  const strength = passwordStrength(watchedPw);

  async function handleStep1() {
    const valid = await trigger(["name", "email", "password"]);
    if (valid) setStep(2);
  }

  async function onSubmit(data: FormData) {
    const result = registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
      stylePreferences: selectedStyles,
    });
    if (!result.ok) {
      setError("root", { message: result.error });
      setStep(1);
      return;
    }
    toast.success("Welcome to ReWear! 🌿 You've earned the Eco Starter badge.");
    navigate({ to: "/dashboard" });
  }

  function toggleStyle(s: string) {
    setSelectedStyles((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  return (
    <SiteLayout>
      <section className="container-rewear py-16 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Brand panel */}
          <div className="hidden lg:block">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-6">
              <Leaf className="h-3.5 w-3.5" />
              Join the community
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Your wardrobe,<br />
              <span className="text-primary">reimagined.</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
              Create your free account and start swapping, donating, and discovering pre-loved pieces in under a minute.
            </p>
            <ul className="mt-10 space-y-3">
              {[
                "List items for free — no fees ever",
                "Exchange with a trusted community",
                "Track your CO₂ savings in real time",
                "Earn eco badges and points",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"} transition-colors`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"} transition-colors`} />
            </div>

            <div className="rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-soft)]">
              {step === 1 ? (
                <>
                  <h2 className="text-2xl font-extrabold">Create account</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Already have one?{" "}
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                      Sign in
                    </Link>
                  </p>

                  <form onSubmit={(e) => { e.preventDefault(); handleStep1(); }} className="mt-8 space-y-4">
                    {errors.root && (
                      <div className="rounded-2xl bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive font-medium">
                        {errors.root.message}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Full name
                      </label>
                      <input
                        {...register("name")}
                        placeholder="Alex Johnson"
                        className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                        id="signup-name"
                      />
                      {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Email address
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="you@example.com"
                        className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                        id="signup-email"
                      />
                      {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                        Password
                      </label>
                      <div className="relative">
                        <input
                          {...register("password")}
                          type={showPw ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 pr-12 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                          id="signup-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPw((p) => !p)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                        >
                          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {watchedPw.length > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex gap-1 flex-1">
                            {[1, 2, 3, 4].map((s) => (
                              <div
                                key={s}
                                className={`h-1 flex-1 rounded-full transition-all ${
                                  s <= strength.score ? strength.color : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{strength.label}</span>
                        </div>
                      )}
                      {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
                    </div>

                    <button
                      type="submit"
                      className="w-full mt-2 rounded-full bg-primary text-primary-foreground font-semibold py-3.5 text-sm hover:opacity-90 transition-opacity"
                      id="signup-next"
                    >
                      Continue →
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-extrabold">Your style</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select your style preferences (optional — helps with recommendations).
                  </p>

                  <div className="mt-8 flex flex-wrap gap-2">
                    {STYLE_TAGS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleStyle(s)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          selectedStyles.includes(s)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted border-transparent text-foreground hover:border-border"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3">
                    {errors.root && (
                      <div className="rounded-2xl bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                        {errors.root.message}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-primary text-primary-foreground font-semibold py-3.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                      id="signup-submit"
                    >
                      {isSubmitting ? "Creating account…" : "Create my account 🌿"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-full rounded-full border border-border py-3.5 text-sm font-semibold hover:bg-muted transition-colors"
                    >
                      ← Back
                    </button>
                  </form>
                </>
              )}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By creating an account, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground">Terms</Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
