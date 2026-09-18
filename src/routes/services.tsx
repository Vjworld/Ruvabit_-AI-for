import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Check, Clock } from "lucide-react";
import { servicesQuery } from "@/lib/content";
import { CtaBand, PageHero } from "@/components/site/Sections";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "AI Automation Services — Audit, Build & Run | RUVABIT" },
      {
        name: "description",
        content:
          "Automation audits, workflow builds, AI agents, rapid MVPs and Agile/PMO enablement for teams of 0-200 people.",
      },
      { property: "og:title", content: "AI Automation Services | RUVABIT" },
      {
        property: "og:description",
        content:
          "Automation audits, workflow builds, AI agents and fractional AI operator retainers for lean teams.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(servicesQuery),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useSuspenseQuery(servicesQuery);

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Automation that pays for itself, not a pile of tooling"
        intro="Every engagement is scoped around a measurable outcome: hours removed, errors avoided, turnaround time cut. Here is what we deliver."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {services.map((s, index) => (
            <article key={s.id} className="surface-panel rounded-xl p-7">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-xl font-semibold">{s.title}</h2>
              </div>
              <p className="mt-2 text-sm text-primary">{s.tagline}</p>

              {s.problem ? (
                <div className="mt-6">
                  <p className="label-mono text-muted-foreground">The problem</p>
                  <p className="mt-2 text-sm text-muted-foreground">{s.problem}</p>
                </div>
              ) : null}

              {s.deliverables.length ? (
                <div className="mt-6">
                  <p className="label-mono text-muted-foreground">What you get</p>
                  <ul className="mt-3 space-y-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex gap-3 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-border pt-5">
                {s.timeline ? (
                  <span className="inline-flex items-center gap-2 rounded-md bg-secondary px-3 py-1 font-mono text-xs">
                    <Clock className="h-3.5 w-3.5 text-primary" /> {s.timeline}
                  </span>
                ) : null}
                {s.tools.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      <CtaBand title="Not sure which one you need?" body="Start with a discovery call. We'll tell you which engagement fits, or that you don't need us yet." />
    </>
  );
}
