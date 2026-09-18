import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clock,
  Quote,
  Sparkles,
  Workflow,
} from "lucide-react";
import {
  caseStudiesQuery,
  industriesQuery,
  servicesQuery,
  settingsQuery,
  testimonialsQuery,
} from "@/lib/content";
import { CtaBand, Section } from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RUVABIT — AI Automation Consulting for Teams Under 200" },
      {
        name: "description",
        content:
          "RUVABIT builds AI workflow automation for startups and small enterprises: less manual work, fewer errors, faster turnaround. Book a discovery call.",
      },
      { property: "og:title", content: "RUVABIT — AI Automation Consulting for Teams Under 200" },
      {
        property: "og:description",
        content:
          "AI-powered workflow automation for lean teams. Audit, build and run automations that remove manual work and cut turnaround time.",
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(servicesQuery),
      context.queryClient.ensureQueryData(caseStudiesQuery),
      context.queryClient.ensureQueryData(industriesQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
    ]);
  },
  component: Index,
});

const before = [
  "Data re-typed between tools by hand",
  "Follow-ups missed when someone is busy",
  "Status chased across chats and spreadsheets",
  "Errors found late, fixed expensively",
];

const after = [
  "Records created and synced automatically",
  "Follow-ups triggered on time, every time",
  "Live dashboards replace status chasing",
  "Validation catches issues at the source",
];

function Index() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { data: services } = useSuspenseQuery(servicesQuery);
  const { data: caseStudies } = useSuspenseQuery(caseStudiesQuery);
  const { data: industries } = useSuspenseQuery(industriesQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);

  const stats = [1, 2, 3, 4]
    .map((i) => ({
      value: settings[`stat_${i}_value`],
      label: settings[`stat_${i}_label`],
    }))
    .filter((s) => s.value);

  const featured = caseStudies.filter((c) => c.featured).slice(0, 3);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="grid-backdrop absolute inset-0 opacity-70" aria-hidden />
        <div
          className="absolute -top-40 left-1/2 h-96 w-[42rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "var(--gradient-primary)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24">
          <p className="label-mono inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            {settings["hero_eyebrow"]}
          </p>
          <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl">
            {settings["hero_headline"]}
          </h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            {settings["hero_subheadline"]}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              {settings["hero_cta_primary"] ?? "Book a discovery call"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/process"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold transition-colors hover:bg-secondary"
            >
              {settings["hero_cta_secondary"] ?? "See how it works"}
            </Link>
          </div>

          {stats.length ? (
            <dl className="mt-14 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-card p-6">
                  <dt className="font-display text-2xl font-bold text-primary">{s.value}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{s.label}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      <Section
        eyebrow="The shift"
        title="From manual handoffs to automated flow"
        intro="Most teams under 200 people lose hours to work no human should be doing. We find it, automate it, and prove the difference."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="surface-panel rounded-xl p-6">
            <p className="label-mono flex items-center gap-2 text-destructive">
              <CircleAlert className="h-4 w-4" /> Before
            </p>
            <ul className="mt-5 space-y-3">
              {before.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-panel glow-ring rounded-xl p-6">
            <p className="label-mono flex items-center gap-2 text-primary">
              <Workflow className="h-4 w-4" /> After
            </p>
            <ul className="mt-5 space-y-3">
              {after.map((a) => (
                <li key={a} className="flex gap-3 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section
        eyebrow="Services"
        title="What we do"
        intro="Start with a diagnostic, ship working automations, then keep improving them month over month."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((s) => (
            <article key={s.id} className="surface-panel group rounded-xl p-6 transition-colors hover:border-primary/40">
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-primary">{s.tagline}</p>
              <p className="mt-4 text-sm text-muted-foreground">{s.problem}</p>
              {s.timeline ? (
                <p className="mt-5 flex items-center gap-2 font-mono text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {s.timeline}
                </p>
              ) : null}
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section eyebrow="Industries" title="Context we already know">
        <div className="flex flex-wrap gap-3">
          {industries.map((i) => (
            <Link
              key={i.id}
              to="/industries"
              className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {i.title}
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Proof"
        title="Products shipped end to end"
        intro="We build what we recommend. These are live products designed, built and launched in-house."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((c) => (
            <Link
              key={c.id}
              to="/work/$slug"
              params={{ slug: c.slug }}
              className="surface-panel group flex flex-col rounded-xl p-6 transition-colors hover:border-primary/40"
            >
              <p className="label-mono text-muted-foreground">{c.client}</p>
              <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-primary">
                {c.title}
              </h3>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{c.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                Read case study <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {testimonials.length ? (
        <Section eyebrow="Signals" title="What delivery teams say">
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t.id} className="surface-panel rounded-xl p-6">
                <Quote className="h-5 w-5 text-primary" />
                <blockquote className="mt-4 text-sm text-muted-foreground">"{t.quote}"</blockquote>
                <figcaption className="mt-5 text-sm font-semibold">
                  {t.author}
                  <span className="block font-normal text-muted-foreground">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />
    </>
  );
}
