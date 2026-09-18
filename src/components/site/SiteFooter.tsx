import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { settingsQuery } from "@/lib/content";
import logoAsset from "@/assets/ruvabit-logo.png.asset.json";

export function SiteFooter() {
  const { data: settings } = useQuery(settingsQuery);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const s = hydrated ? (settings ?? {}) : {};


  return (
    <footer className="mt-24 border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <span className="inline-block rounded-md bg-white px-3 py-2">
            <img src={logoAsset.url} alt="RUVABIT logo" className="h-7 w-auto" />
          </span>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            AI automation consulting for startups, small companies and lean B2B enterprises.
            We design workflows that remove manual work, cut errors and shorten turnaround time.
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted-foreground">
            {s["contact_email"] ? (
              <a
                className="flex items-center gap-2 hover:text-foreground"
                href={`mailto:${s["contact_email"]}`}
              >
                <Mail className="h-4 w-4 text-primary" /> {s["contact_email"]}
              </a>
            ) : null}
            {s["contact_phone"] ? (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> {s["contact_phone"]}
              </p>
            ) : null}
            {s["contact_location"] ? (
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {s["contact_location"]}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <h3 className="label-mono text-muted-foreground">Company</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/services", label: "Services" },
              { to: "/process", label: "Process" },
              { to: "/industries", label: "Industries" },
              { to: "/work", label: "Work" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="label-mono text-muted-foreground">More</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/pricing", label: "Pricing" },
              { to: "/insights", label: "Insights" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground hover:text-foreground">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-3">
            {s["linkedin_url"] ? (
              <a
                href={s["linkedin_url"]}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="grid h-9 w-9 place-items-center rounded-md border border-border text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} RUVABIT. All rights reserved.</p>
          <p className="font-mono">ruvab.it.com</p>
        </div>
      </div>
    </footer>
  );
}
