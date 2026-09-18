import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/content";
import { CtaBand, PageHero } from "@/components/site/Sections";

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Insights — AI Automation Notes for Lean Teams | RUVABIT" },
      {
        name: "description",
        content:
          "Practical notes on AI workflow automation, agent design, tooling choices and running automation programmes in small teams.",
      },
      { property: "og:title", content: "Insights — AI Automation Notes | RUVABIT" },
      {
        property: "og:description",
        content: "Field notes on automation, AI agents and delivery for teams under 200 people.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: InsightsPage,
});

function InsightsPage() {
  const { data: posts } = useSuspenseQuery(postsQuery);

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Field notes from building automations"
        intro="What actually works when you automate with a small team, a real budget and no appetite for science projects."
      />

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20">
        {posts.length === 0 ? (
          <p className="text-muted-foreground">First articles are on the way. Check back soon.</p>
        ) : (
          <div className="divide-y divide-border">
            {posts.map((p) => (
              <article key={p.id} className="py-8 first:pt-0">
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
                  {p.published_at ? (
                    <time dateTime={p.published_at}>
                      {new Date(p.published_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  ) : null}
                  {p.read_minutes ? <span>{p.read_minutes} min read</span> : null}
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-md bg-secondary px-2 py-0.5">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold">
                  <Link
                    to="/insights/$slug"
                    params={{ slug: p.slug }}
                    className="transition-colors hover:text-primary"
                  >
                    {p.title}
                  </Link>
                </h2>
                {p.excerpt ? (
                  <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>

      <CtaBand />
    </>
  );
}
