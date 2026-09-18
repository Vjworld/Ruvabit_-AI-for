import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Award, ExternalLink, GraduationCap, Layers } from "lucide-react";
import { settingsQuery } from "@/lib/content";
import { CtaBand, PageHero, Section } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RUVABIT — Founder-Led AI Automation Consulting" },
      {
        name: "description",
        content:
          "RUVABIT is founder-led by Vaibhav Selukar: 15+ years across business analysis, Agile delivery and PMO, now building AI automation for lean teams.",
      },
      { property: "og:title", content: "About RUVABIT — Founder-Led AI Automation" },
      {
        property: "og:description",
        content:
          "Business analysis and Agile delivery experience combined with hands-on AI automation and product building.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: AboutPage,
});

const experience = [
  {
    role: "Senior Consultant — Delivery & Automation",
    org: "Conntract",
    body: "Led consulting engagements across process design, requirement definition and automation of delivery workflows.",
  },
  {
    role: "Senior Consultant — Agile Delivery",
    org: "Pragmatyc",
    body: "Ran Agile delivery and PMO practices for product teams, standardising planning, reporting and release governance.",
  },
  {
    role: "Business Analyst",
    org: "Virtual Galaxy Infotech",
    body: "BFSI-focused analysis: core banking and lending workflows, requirement traceability and UAT with regulated customers.",
  },
  {
    role: "Business Analyst",
    org: "SimpleCRM",
    body: "CRM implementations and integration design across sales, service and support processes for enterprise customers.",
  },
];

const credentials = [
  { icon: Award, label: "PMP", detail: "Project Management Professional" },
  { icon: Award, label: "PSM", detail: "Professional Scrum Master" },
  { icon: GraduationCap, label: "NPD", detail: "New Product Development, IIM Bangalore" },
  { icon: Layers, label: "15+ years", detail: "Analysis, delivery and PMO leadership" },
];

const capabilities = [
  "Workflow automation: n8n, Make, Zapier",
  "AI: OpenAI APIs, LLM agents, RAG, prompt systems",
  "Product build: React, TypeScript, Supabase",
  "Delivery: Jira, Confluence, Agile & PMO governance",
  "Analysis: BRD/FRD, process mapping, UAT",
  "Data: dashboards, reporting, integration design",
];

function AboutPage() {
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const links = [
    { label: "LinkedIn", href: settings["linkedin_url"] },
    { label: "Portfolio", href: settings["portfolio_url"] },
    { label: "Product Hunt", href: settings["producthunt_url"] },
  ].filter((l) => l.href);

  return (
    <>
      <PageHero
        eyebrow="About"
        title="Founder-led consulting, built on delivery experience"
        intro="RUVABIT is led by Vaibhav Selukar — a business analyst and Agile delivery lead who now designs, builds and ships AI automation hands-on."
      />

      <Section eyebrow="Founder" title="Vaibhav Selukar">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4 text-muted-foreground">
            <p>
              Fifteen years of turning messy business processes into systems that work — first as a
              business analyst in BFSI and CRM, then leading Agile delivery and PMO practices for
              product teams.
            </p>
            <p>
              Today that experience goes into AI automation: finding the work that shouldn't be
              manual, designing the flow around it, and building it in the tools you already pay
              for. Because the builds are hands-on rather than outsourced, scope stays honest and
              delivery stays fast.
            </p>
            <p>
              Alongside client work, RUVABIT ships its own products — LangScribe, FYPPAL,
              TrendSolver, Doneche, HeyBud and QR Generator Pro — which is where the automation and
              AI patterns get proven before they reach your workflows.
            </p>
            {links.length ? (
              <div className="flex flex-wrap gap-3 pt-2">
                {links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    {l.label} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className="grid gap-px self-start overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-1">
            {credentials.map((c) => (
              <div key={c.label} className="flex items-start gap-3 bg-card p-5">
                <c.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="font-display text-sm font-semibold">{c.label}</p>
                  <p className="text-sm text-muted-foreground">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section eyebrow="Track record" title="Where the experience comes from">
        <ol className="space-y-4">
          {experience.map((e) => (
            <li key={e.org} className="surface-panel rounded-xl p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-display text-base font-semibold">{e.role}</h3>
                <span className="font-mono text-xs text-primary">{e.org}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{e.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Capabilities" title="The working toolkit">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c) => (
            <div key={c} className="rounded-lg border border-border bg-card px-4 py-3 text-sm">
              {c}
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">
          Curious how this maps to your stack?{" "}
          <Link to="/contact" className="font-semibold text-primary">
            Start a conversation
          </Link>
          .
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
