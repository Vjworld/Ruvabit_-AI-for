import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { caseStudiesQuery } from "@/lib/content";
import { CtaBand, PageHero } from "@/components/site/Sections";

export const Route = createFileRoute("/work/")({
  head: () => ({
    meta: [
      { title: "Work — AI Products & Automation Case Studies | RUVABIT" },
      {
        name: "description",
        content:
          "Case studies from AI products built and launched end to end: LangScribe, FYPPAL, TrendSolver, Doneche, HeyBud and more.",
      },
      { property: "og:title", content: "Work — AI Automation Case Studies | RUVABIT" },
      {
        property: "og:description",
        content:
          "Live AI products and automation builds, with the challenge, approach, stack and outcome for each.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(caseStudiesQuery),
  component: WorkPage,
});

function WorkPage() {
  const { data: caseStudies } = useSuspenseQuery(caseStudiesQuery);

  return (
    <>
      <PageHero
        eyebrow="Work"
        title="Built, launched and running — not just advised on"
        intro="Every one of these was designed, built and shipped hands-on. The same patterns power the automations we build for clients."
      />

      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((c) => (
            <Link
              key={c.id}
              to="/work/$slug"
              params={{ slug: c.slug }}
              className="surface-panel group flex flex-col rounded-xl p-7 transition-colors hover:border-primary/40"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="label-mono text-muted-foreground">{c.client}</p>
                {c.featured ? (
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-widest text-primary">
                    Featured
                  </span>
                ) : null}
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold group-hover:text-primary">
                {c.title}
              </h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {c.stack.slice(0, 4).map((s) => (
                  <span
                    key={s}
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read case study <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      <CtaBand title="Want this pace on your workflows?" />
    </>
  );
}
