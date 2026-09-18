import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="grid-backdrop absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <p className="label-mono text-primary">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {intro ? <p className="mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">{intro}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function Section({
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-20", className)}>
      {eyebrow || title ? (
        <div className="max-w-2xl">
          {eyebrow ? <p className="label-mono text-primary">{eyebrow}</p> : null}
          {title ? <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2> : null}
          {intro ? <p className="mt-4 text-muted-foreground">{intro}</p> : null}
        </div>
      ) : null}
      <div className={eyebrow || title ? "mt-10" : undefined}>{children}</div>
    </section>
  );
}

export function CtaBand({
  title = "Ready to remove the manual work?",
  body = "Book a 30-minute discovery call. We'll map one workflow live and tell you honestly whether automation is worth it.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
      <div className="surface-panel glow-ring relative overflow-hidden rounded-xl p-8 md:p-12">
        <div className="grid-backdrop absolute inset-0 opacity-40" aria-hidden />
        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
            <p className="mt-3 text-muted-foreground">{body}</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book a discovery call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
