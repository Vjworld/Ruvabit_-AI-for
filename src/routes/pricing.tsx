import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { faqsQuery, pricingQuery } from "@/lib/content";
import { CtaBand, PageHero, Section } from "@/components/site/Sections";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Engagement Models & Pricing | RUVABIT" },
      {
        name: "description",
        content:
          "Flexible AI automation engagements: diagnostic sprint, build sprint and fractional AI operator retainer. Pricing on request, scoped to outcomes.",
      },
      { property: "og:title", content: "Engagement Models & Pricing | RUVABIT" },
      {
        property: "og:description",
        content:
          "Pick a diagnostic, a build sprint or an ongoing retainer. Pricing is scoped per engagement — request a quote.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(pricingQuery),
      context.queryClient.ensureQueryData(faqsQuery),
    ]);
  },
  component: PricingPage,
});

function PricingPage() {
  const { data: tiers } = useSuspenseQuery(pricingQuery);
  const { data: faqs } = useSuspenseQuery(faqsQuery);

  return (
    <>
      <PageHero
        eyebrow="Engagements"
        title="Priced per outcome, not per seat"
        intro="Every team's stack and process is different, so we scope and quote per engagement. Here are the three shapes an engagement usually takes."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => (
            <article
              key={tier.id}
              className={cn(
                "surface-panel flex flex-col rounded-xl p-7",
                tier.highlighted && "glow-ring border-primary/40",
              )}
            >
              {tier.highlighted ? (
                <span className="label-mono self-start rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
                  Most popular
                </span>
              ) : null}
              <h2 className="mt-4 font-display text-xl font-semibold">{tier.name}</h2>
              {tier.best_for ? (
                <p className="mt-2 text-sm text-primary">Best for {tier.best_for}</p>
              ) : null}
              {tier.description ? (
                <p className="mt-4 text-sm text-muted-foreground">{tier.description}</p>
              ) : null}
              {tier.duration ? (
                <p className="mt-4 font-mono text-xs text-muted-foreground">{tier.duration}</p>
              ) : null}
              <ul className="mt-6 flex-1 space-y-2">
                {tier.inclusions.map((i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {i}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                search={{ interest: tier.name }}
                className={cn(
                  "mt-7 inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors",
                  tier.highlighted
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border hover:bg-secondary",
                )}
              >
                Request pricing <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </Section>

      {faqs.length ? (
        <Section eyebrow="FAQ" title="Common questions">
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
            {faqs.map((f) => (
              <details key={f.id} className="group bg-card p-6">
                <summary className="cursor-pointer list-none font-display text-base font-semibold marker:hidden">
                  {f.question}
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand title="Want a number for your scope?" body="Share the workflow and team size and you'll get a fixed quote, not an hourly meter." />
    </>
  );
}
