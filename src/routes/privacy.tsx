import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — ReWear" },
      { name: "description", content: "ReWear's privacy policy — how we handle your data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <SiteLayout>
      <section className="container-rewear pt-16 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Legal</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">Last updated: June 2026</p>
      </section>

      <section className="container-rewear pb-20 grid lg:grid-cols-[1fr_3fr] gap-12">
        {/* Sidebar nav */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {[
              "Overview",
              "Data we collect",
              "How we use it",
              "Local storage",
              "Third parties",
              "Your rights",
              "Contact us",
            ].map((s) => (
              <a
                key={s}
                href={`#${s.toLowerCase().replace(/ /g, "-")}`}
                className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="prose max-w-none space-y-10">
          <PolicySection id="overview" title="Overview">
            <p className="text-muted-foreground leading-relaxed">
              ReWear is a client-side sustainable fashion marketplace. We take your privacy seriously. 
              This policy explains what data we collect, how we use it, and what choices you have. 
              The short version: we collect very little, store it locally on your device, and never sell it.
            </p>
          </PolicySection>

          <PolicySection id="data-we-collect" title="Data we collect">
            <p className="text-muted-foreground leading-relaxed">
              When you create an account, we collect your name and email address. When you list an item, 
              we collect the details you provide (title, description, photos, etc.). We do not collect 
              payment information, phone numbers, or government identification.
            </p>
            <ul className="mt-4 space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>Account information (name, email)</li>
              <li>Item listings you create</li>
              <li>Exchange and donation requests you make</li>
              <li>Wishlist items you save</li>
              <li>Theme preference (light/dark)</li>
            </ul>
          </PolicySection>

          <PolicySection id="how-we-use-it" title="How we use it">
            <p className="text-muted-foreground leading-relaxed">
              We use your data solely to operate ReWear — to display your listings, process exchange 
              requests, calculate your sustainability impact, and personalise your experience. 
              We do not use your data for advertising or sell it to third parties.
            </p>
          </PolicySection>

          <PolicySection id="local-storage" title="Local storage">
            <p className="text-muted-foreground leading-relaxed">
              All ReWear data — your account, listings, wishlists, and exchanges — is stored locally 
              in your browser's <code className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">localStorage</code>. 
              This means data never leaves your device. Clearing your browser storage will delete all 
              your ReWear data. Different browsers and devices have separate storage, so data is not 
              synced across them.
            </p>
          </PolicySection>

          <PolicySection id="third-parties" title="Third parties">
            <p className="text-muted-foreground leading-relaxed">
              ReWear uses Google Fonts (Inter) to serve typography. This means your browser makes a 
              request to Google's servers when you visit the site. We do not use analytics tools, 
              advertising networks, or tracking pixels. We do not embed third-party social widgets 
              that track you.
            </p>
          </PolicySection>

          <PolicySection id="your-rights" title="Your rights">
            <p className="text-muted-foreground leading-relaxed">
              You can delete your account and all associated data at any time by clearing your browser's 
              localStorage for this site. Since we don't store data on servers, there's nothing for us 
              to delete on our end. You can also export your listings by copying them from the profile page.
            </p>
          </PolicySection>

          <PolicySection id="contact-us" title="Contact us">
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this privacy policy, reach us at{" "}
              <a href="/contact" className="text-primary font-semibold hover:underline">
                our contact page
              </a>{" "}
              or email{" "}
              <a href="mailto:privacy@rewear.eco" className="text-primary font-semibold hover:underline">
                privacy@rewear.eco
              </a>
              .
            </p>
          </PolicySection>
        </div>
      </section>
    </SiteLayout>
  );
}

function PolicySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="scroll-mt-24">
      <h2 className="text-xl font-extrabold mb-4">{title}</h2>
      <div className="rounded-2xl bg-card border border-border p-6">{children}</div>
    </div>
  );
}
