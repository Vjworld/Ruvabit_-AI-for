import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, PageHero, Section } from "@/components/site/Sections";

export const Route = createFileRoute("/process")({
  head: () => ({
    meta: [
      { title: "How We Work — Our AI Automation Process | RUVABIT" },
      {
        name: "description",
        content:
          "A four-step automation process: discover and audit, design the workflow, build and integrate, then measure and hand over.",
      },
      { property: "og:title", content: "How We Work — AI Automation Process | RUVABIT" },
      {
        property: "og:description",
        content:
          "Discover, design, build, measure. A transparent automation process with documentation and handover built in.",
      },
    ],
  }),
  component: ProcessPage,
});

const steps = [
  {
    title: "Discover & audit",
    duration: "Week 1-2",
    body: "We interview the people doing the work, walk the process end to end and attach numbers to it: minutes per run, frequency, error and rework rate.",
    outputs: ["Process inventory", "Time and error cost map", "Prioritised automation backlog"],
  },
  {
    title: "Design the workflow",
    duration: "Week 2-3",
    body: "Before any build, we design the target flow: triggers, decisions, data model, exception paths and where a human must stay in the loop.",
    outputs: ["Target workflow diagram", "Data and integration map", "Success metrics agreed upfront"],
  },
  {
    title: "Build & integrate",
    duration: "Week 3-6",
    body: "We build in your tools and accounts, wire up integrations, add validation, logging and alerting, then test against real cases with your team.",
    outputs: ["Production automations", "Monitoring and alerts", "User acceptance sign-off"],
  },
  {
    title: "Measure & hand over",
    duration: "Week 6+",
    body: "We compare the metrics to the baseline, document everything and train your team so the workflow is yours to run and change.",
    outputs: ["Before/after metrics", "Runbook and documentation", "Team training session"],
  },
];

const principles = [
  {
    title: "Your accounts, your data",
    body: "Automations live in your workspace with least-privilege access and no unnecessary data retention.",
  },
  {
    title: "Human in the loop where it counts",
    body: "Anything touching money, compliance or customers keeps an explicit approval step.",
  },
  {
    title: "Observable by default",
    body: "Every workflow logs what it did, alerts on failure and exposes a simple success metric.",
  },
  {
    title: "No lock-in",
    body: "Documented, standard tooling. If we walk away, your team can still run and extend it.",
  },
];

function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A transparent path from manual mess to measured automation"
        intro="No black boxes and no six-month discovery. Four steps, clear outputs at each one, and metrics agreed before we build anything."
      />

      <Section eyebrow="The four steps" title="How an engagement runs">
        <ol className="relative space-y-6 border-l border-border pl-6">
          {steps.map((step, i) => (
            <li key={step.title} className="relative">
              <span className="absolute -left-[1.9rem] top-1 grid h-6 w-6 place-items-center rounded-full border border-primary/40 bg-background font-mono text-xs text-primary">
                {i + 1}
              </span>
              <div className="surface-panel rounded-xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{step.title}</h3>
                  <span className="font-mono text-xs text-primary">{step.duration}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{step.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {step.outputs.map((o) => (
                    <span
                      key={o}
                      className="rounded-md bg-secondary px-3 py-1 font-mono text-xs text-secondary-foreground"
                    >
                      {o}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="Principles" title="Non-negotiables in every build">
        <div className="grid gap-5 md:grid-cols-2">
          {principles.map((p) => (
            <div key={p.title} className="surface-panel rounded-xl p-6">
              <h3 className="font-display text-base font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
