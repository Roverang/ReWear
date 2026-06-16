import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — ReWear" },
      { name: "description", content: "ReWear's terms of service." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteLayout>
      <section className="container-rewear pt-16 pb-8">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Legal</span>
        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">Last updated: June 2026</p>
      </section>

      <section className="container-rewear pb-20 grid lg:grid-cols-[1fr_3fr] gap-12">
        {/* Sidebar nav */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-1">
            {[
              "Agreement",
              "Use of service",
              "User accounts",
              "Listings",
              "Exchanges",
              "Prohibited conduct",
              "Disclaimer",
              "Contact",
            ].map((s) => (
              <a
                key={s}
                href={`#terms-${s.toLowerCase().replace(/ /g, "-")}`}
                className="block px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-10">
          <TermsSection id="terms-agreement" title="1. Agreement to terms">
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using ReWear ("the Service"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not use the Service.
            </p>
          </TermsSection>

          <TermsSection id="terms-use-of-service" title="2. Use of service">
            <p className="text-muted-foreground leading-relaxed">
              ReWear is a free-to-use platform for exchanging and donating pre-loved clothing within a 
              community. The Service is provided for personal, non-commercial use only. You must be 
              at least 13 years old to use ReWear.
            </p>
          </TermsSection>

          <TermsSection id="terms-user-accounts" title="3. User accounts">
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and 
              for all activities under your account. Provide accurate information when creating an account. 
              You may delete your account at any time by clearing your browser storage.
            </p>
          </TermsSection>

          <TermsSection id="terms-listings" title="4. Listings">
            <p className="text-muted-foreground leading-relaxed">
              When you list an item on ReWear, you confirm that:
            </p>
            <ul className="mt-3 space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>You own the item or have the right to list it.</li>
              <li>The item is accurately described and photographed.</li>
              <li>The item is clean and in the condition stated.</li>
              <li>You will honour exchange agreements you accept in good faith.</li>
            </ul>
          </TermsSection>

          <TermsSection id="terms-exchanges" title="5. Exchanges and donations">
            <p className="text-muted-foreground leading-relaxed">
              ReWear facilitates connections between users but is not a party to any exchange or donation 
              agreement. We are not responsible for the quality, safety, or legality of items exchanged. 
              Disputes between users should be resolved directly between the parties involved.
            </p>
          </TermsSection>

          <TermsSection id="terms-prohibited-conduct" title="6. Prohibited conduct">
            <p className="text-muted-foreground leading-relaxed">You agree not to:</p>
            <ul className="mt-3 space-y-2 text-muted-foreground text-sm list-disc list-inside">
              <li>List counterfeit, stolen, or prohibited items.</li>
              <li>Misrepresent items in listings.</li>
              <li>Use the Service for commercial resale without disclosure.</li>
              <li>Harass or abuse other community members.</li>
              <li>Attempt to circumvent any security measures.</li>
            </ul>
          </TermsSection>

          <TermsSection id="terms-disclaimer" title="7. Disclaimer">
            <p className="text-muted-foreground leading-relaxed">
              ReWear is provided "as is" without warranties of any kind. We do not guarantee the 
              availability, accuracy, or completeness of the Service. We are not liable for any 
              losses or damages arising from your use of the Service or exchanges facilitated through it.
            </p>
          </TermsSection>

          <TermsSection id="terms-contact" title="8. Contact">
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms?{" "}
              <a href="/contact" className="text-primary font-semibold hover:underline">
                Contact us
              </a>{" "}
              or email{" "}
              <a href="mailto:legal@rewear.eco" className="text-primary font-semibold hover:underline">
                legal@rewear.eco
              </a>
              .
            </p>
          </TermsSection>
        </div>
      </section>
    </SiteLayout>
  );
}

function TermsSection({
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
