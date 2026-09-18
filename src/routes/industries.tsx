import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import { industriesQuery } from "@/lib/content";
import { CtaBand, PageHero } from "@/components/site/Sections";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Automate — BFSI, SaaS, EdTech & More | RUVABIT" },
      {
        name: "description",
        content:
          "AI automation for BFSI and fintech, SaaS startups, EdTech, wellness tech and professional services, grounded in 15+ years of delivery experience.",
      },
      { property: "og:title", content: "Industries We Automate | RUVABIT" },
      {
        property: "og:description",
        content:
          "Automation use cases for BFSI, SaaS, EdTech, wellness tech and professional services teams.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(industriesQuery),
  component: IndustriesPage,
});

function IndustriesPage() {
  const { data: industries } = useSuspenseQuery(industriesQuery);

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Automation shaped by the domain it runs in"
        intro="Fifteen years across BFSI, SaaS, EdTech and wellness tech means less time explaining your context and more time removing work from it."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          {industries.map((industry) => (
            <article key={industry.id} className="surface-panel rounded-xl p-7">
              <h2 className="font-display text-xl font-semibold">{industry.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{industry.summary}</p>
              {industry.use_cases.length ? (
                <>
                  <p className="label-mono mt-6 text-muted-foreground">Typical automations</p>
                  <ul className="mt-3 space-y-2">
                    {industry.use_cases.map((u) => (
                      <li key={u} className="flex gap-3 text-sm">
                        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <CtaBand
        title="Your industry not listed?"
        body="If the work is repetitive, rule-based or document-heavy, it is probably automatable. Let's check on a call."
      />
    </>
  );
}
