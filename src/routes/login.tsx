import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useApp } from "@/context/AppContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff, Leaf } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — ReWear" },
      { name: "description", content: "Sign in to your ReWear account." },
    ],
  }),
  component: LoginPage,
});

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});
type FormData = z.infer<typeof schema>;

function LoginPage() {
  const { login, user } = useApp();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  // If already logged in redirect
  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    const result = login(data.email, data.password);
    if (!result.ok) {
      setError("root", { message: result.error });
      return;
    }
    toast.success("Welcome back! 🌿");
    navigate({ to: "/dashboard" });
  }

  return (
    <SiteLayout>
      <section className="container-rewear py-16 min-h-[calc(100vh-4rem)] flex items-center">
        <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Brand panel */}
          <div className="hidden lg:block">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 text-primary text-xs font-semibold mb-6">
              <Leaf className="h-3.5 w-3.5" />
              Sustainable fashion, reimagined
            </span>
            <h1 className="text-5xl font-extrabold tracking-tight leading-tight">
              Welcome back<br />
              <span className="text-primary">to ReWear.</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
              Sign in to manage your listings, check exchange requests, and track your sustainability impact.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {[
                ["2,450+", "Items listed"],
                ["1.2t", "CO₂ saved"],
                ["3,850+", "Members"],
                ["1,320+", "Exchanges"],
              ].map(([v, l]) => (
                <div key={l} className="rounded-2xl bg-muted p-5">
                  <div className="text-2xl font-extrabold text-primary">{v}</div>
                  <div className="text-xs text-muted-foreground mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form panel */}
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-extrabold">Sign in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Sign up free
                </Link>
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                {errors.root && (
                  <div className="rounded-2xl bg-destructive/8 border border-destructive/20 px-4 py-3 text-sm text-destructive font-medium">
                    {errors.root.message}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Email address
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                    id="login-email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      {...register("password")}
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 pr-12 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                      id="login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw((p) => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 rounded-full bg-primary text-primary-foreground font-semibold py-3.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                  id="login-submit"
                >
                  {isSubmitting ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link to="/terms" className="underline hover:text-foreground">
                Terms
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
