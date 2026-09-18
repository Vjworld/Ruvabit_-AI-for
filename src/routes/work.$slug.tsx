import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { caseStudyQuery } from "@/lib/content";
import { CtaBand } from "@/components/site/Sections";

export const Route = createFileRoute("/work/$slug")({
  loader: async ({ context, params }) => {
    const study = await context.queryClient.ensureQueryData(caseStudyQuery(params.slug));
    if (!study) throw notFound();
    return { title: study.title, summary: study.summary ?? "" };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Case study unavailable | RUVABIT" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} — Case Study | RUVABIT`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.summary },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.summary },
      ],
    };
  },
  component: CaseStudyPage,
});

function CaseStudyPage() {
  const { slug } = Route.useParams();
  const { data: study } = useSuspenseQuery(caseStudyQuery(slug));
  if (!study) return null;

  const blocks = [
    { label: "Challenge", body: study.challenge },
    { label: "Approach", body: study.approach },
    { label: "Outcome", body: study.outcome },
  ].filter((b) => b.body);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-backdrop absolute inset-0 opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20">
          <Link
            to="/work"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All work
          </Link>
          <p className="label-mono mt-8 text-primary">{study.client}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
            {study.title}
          </h1>
          {study.summary ? (
            <p className="mt-5 text-base text-muted-foreground md:text-lg">{study.summary}</p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-2">
            {study.stack.map((s) => (
              <span
                key={s}
                className="rounded-md border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
              >
                {s}
              </span>
            ))}
          </div>
          {study.external_url ? (
            <a
              href={study.external_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-7 inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Visit the product <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-20">
        {study.metrics.length ? (
          <dl className="mb-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
            {study.metrics.map((m) => (
              <div key={m.label} className="bg-card p-6">
                <dt className="font-display text-2xl font-bold text-primary">{m.value}</dt>
                <dd className="mt-2 text-sm text-muted-foreground">{m.label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="space-y-10">
          {blocks.map((b) => (
            <section key={b.label}>
              <h2 className="label-mono text-primary">{b.label}</h2>
              <p className="mt-3 whitespace-pre-line text-muted-foreground">{b.body}</p>
            </section>
          ))}
        </div>
      </div>

      <CtaBand title="Want a build like this?" />
    </>
  );
}
