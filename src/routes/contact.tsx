import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — ReWear" },
      { name: "description", content: "Get in touch with the ReWear team." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().min(2, "Name is required."),
  email: z.string().email("Enter a valid email."),
  subject: z.string().min(3, "Subject is required."),
  message: z.string().min(20, "Message must be at least 20 characters."),
});
type FormData = z.infer<typeof schema>;

function ContactPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800));
    console.log("Contact form:", data);
    toast.success("Message sent! We'll get back to you within 2 business days. 🌿");
    reset();
  }

  return (
    <SiteLayout>
      <section className="container-rewear pt-16 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Support</span>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.05]">
          Get in touch.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
          Have a question, feedback, or something to report? We'd love to hear from you.
        </p>
      </section>

      <section className="container-rewear py-16 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        {/* Info column */}
        <div>
          <div className="space-y-6">
            <InfoCard icon={Mail} title="Email us" detail="hello@rewear.eco" />
            <InfoCard icon={MapPin} title="Based in" detail="Earth 🌍 (remote-first)" />
            <InfoCard icon={MessageSquare} title="Response time" detail="Within 2 business days" />
          </div>
          <div className="mt-10 rounded-3xl bg-primary text-primary-foreground p-8">
            <h3 className="text-xl font-extrabold">Quick links</h3>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
              {[
                ["FAQ", "/faq"],
                ["Privacy Policy", "/privacy"],
                ["Terms of Service", "/terms"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="hover:text-primary-foreground transition-colors underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="rounded-3xl bg-card border border-border p-8 shadow-[var(--shadow-soft)]">
          <h2 className="text-2xl font-extrabold mb-8">Send a message</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Your name *
                </label>
                <input
                  {...register("name")}
                  placeholder="Alex Johnson"
                  className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                />
                {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Email *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Subject *
              </label>
              <input
                {...register("subject")}
                placeholder="What's this about?"
                className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground"
              />
              {errors.subject && <p className="mt-1 text-xs text-destructive">{errors.subject.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Message *
              </label>
              <textarea
                {...register("message")}
                rows={6}
                placeholder="Tell us what's on your mind…"
                className="w-full rounded-2xl bg-muted border border-transparent px-4 py-3 text-sm outline-none focus:border-primary focus:bg-background transition-colors placeholder:text-muted-foreground resize-none"
              />
              {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-primary text-primary-foreground font-semibold py-3.5 text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
              id="contact-submit"
            >
              {isSubmitting ? "Sending…" : "Send message"}
            </button>
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}

function InfoCard({
  icon: Icon,
  title,
  detail,
}: {
  icon: React.ElementType;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-card border border-border p-5">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/8 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{detail}</p>
      </div>
    </div>
  );
}
