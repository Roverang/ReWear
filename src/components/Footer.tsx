import { Link } from "@tanstack/react-router";
import { Github, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-rewear py-16 grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <h2 className="text-4xl font-extrabold leading-tight">
            Reuse.<br />Restyle.<br />Repeat.
          </h2>
          <p className="mt-4 text-sm text-primary-foreground/70 max-w-sm">
            A community-powered marketplace for pre-loved fashion. Built for a wardrobe with less waste.
          </p>
        </div>
        <FooterCol
          title="Explore"
          links={[
            ["Marketplace", "/marketplace"],
            ["Categories", "/categories"],
            ["How It Works", "/how-it-works"],
            ["About", "/about"],
          ]}
        />
        <FooterCol
          title="Support"
          links={[
            ["FAQ", "/faq"],
            ["Contact Us", "/contact"],
            ["Privacy Policy", "/privacy"],
            ["Terms of Service", "/terms"],
          ]}
        />
        <div>
          <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-primary-foreground/80">
            Follow
          </h4>
          <div className="flex gap-3">
            {[Instagram, Linkedin, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="mt-8">
            <Link
              to="/list-item"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground text-primary font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              List an item →
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-rewear py-6 text-xs text-primary-foreground/60 flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} ReWear. All rights reserved.</span>
          <span>Made with care for the planet. 🌿</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-primary-foreground/80">
        {title}
      </h4>
      <ul className="space-y-2.5 text-sm text-primary-foreground/75">
        {links.map(([label, to]) => (
          <li key={label}>
            <Link to={to} className="hover:text-primary-foreground transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}