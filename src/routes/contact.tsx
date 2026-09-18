import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Clock, Loader2, Mail, MapPin } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { settingsQuery } from "@/lib/content";
import { submitLead } from "@/lib/leads.functions";
import { PageHero } from "@/components/site/Sections";

const searchSchema = z.object({
  interest: z.string().optional(),
});

export const Route = createFileRoute("/contact")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Contact RUVABIT — Book an AI Automation Discovery Call" },
      {
        name: "description",
        content:
          "Tell us about the manual work slowing your team down. Book a 30-minute discovery call with RUVABIT and get an honest automation assessment.",
      },
      { property: "og:title", content: "Contact RUVABIT — Book a Discovery Call" },
      {
        property: "og:description",
        content: "Share your workflow and team size to get a scoped automation proposal.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(settingsQuery),
  component: ContactPage,
});

const teamSizes = ["1-10", "11-50", "51-100", "101-200", "200+"];
const interests = [
  "Automation audit",
  "Workflow build",
  "AI agents",
  "Rapid MVP",
  "Agile / PMO enablement",
  "Not sure yet",
];

const expectations = [
  "A reply within one business day",
  "A 30-minute call, no slide deck",
  "One workflow mapped live with you",
  "An honest answer on whether automation pays off",
];

function ContactPage() {
  const { interest: presetInterest } = Route.useSearch();
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const send = useServerFn(submitLead);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      company: String(fd.get("company") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      team_size: String(fd.get("team_size") ?? ""),
      interest: String(fd.get("interest") ?? ""),
      message: String(fd.get("message") ?? ""),
      source_page: "/contact",
    };

    if (payload.name.trim().length < 2 || !/^\S+@\S+\.\S+$/.test(payload.email)) {
      toast.error("Please add your name and a valid email address.");
      return;
    }

    setSubmitting(true);
    try {
      const result = await send({ data: payload });
      if (result.ok) {
        setDone(true);
        form.reset();
        toast.success("Thanks — your enquiry is in. We'll reply within one business day.");
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please email us directly instead.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary/60 focus:ring-2 focus:ring-ring/30";

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us what your team keeps doing by hand"
        intro="Share a little context and you'll get a straight answer on whether automation is worth it — and what it would take."
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-[1.3fr_1fr]">
        <div className="surface-panel rounded-xl p-7 md:p-8">
          {done ? (
            <div className="py-10 text-center">
              <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
              <h2 className="mt-5 font-display text-xl font-semibold">Enquiry received</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                We'll be in touch within one business day. If it's urgent, email us directly at{" "}
                {settings["contact_email"]}.
              </p>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="mt-6 rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Send another enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium sm:col-span-1">
                Name*
                <input name="name" required autoComplete="name" className={fieldClass} />
              </label>
              <label className="text-sm font-medium sm:col-span-1">
                Work email*
                <input name="email" type="email" required autoComplete="email" className={fieldClass} />
              </label>
              <label className="text-sm font-medium sm:col-span-1">
                Company
                <input name="company" autoComplete="organization" className={fieldClass} />
              </label>
              <label className="text-sm font-medium sm:col-span-1">
                Phone
                <input name="phone" autoComplete="tel" className={fieldClass} />
              </label>
              <label className="text-sm font-medium sm:col-span-1">
                Team size
                <select name="team_size" defaultValue="" className={fieldClass}>
                  <option value="">Select</option>
                  {teamSizes.map((t) => (
                    <option key={t} value={t}>
                      {t} people
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium sm:col-span-1">
                What do you need?
                <select name="interest" defaultValue={presetInterest ?? ""} className={fieldClass}>
                  <option value="">Select</option>
                  {interests.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                  {presetInterest && !interests.includes(presetInterest) ? (
                    <option value={presetInterest}>{presetInterest}</option>
                  ) : null}
                </select>
              </label>
              <label className="text-sm font-medium sm:col-span-2">
                The manual work you'd like to remove
                <textarea
                  name="message"
                  rows={5}
                  placeholder="e.g. our ops team copies order data from email into two spreadsheets every morning"
                  className={fieldClass}
                />
              </label>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? "Sending…" : "Send enquiry"}
                </button>
                <p className="mt-3 text-xs text-muted-foreground">
                  We use your details only to reply to this enquiry.
                </p>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <div className="surface-panel rounded-xl p-6">
            <h2 className="font-display text-base font-semibold">What happens next</h2>
            <ul className="mt-4 space-y-3">
              {expectations.map((e) => (
                <li key={e} className="flex gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div className="surface-panel space-y-4 rounded-xl p-6 text-sm">
            {settings["contact_email"] ? (
              <p className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${settings["contact_email"]}`} className="hover:text-primary">
                  {settings["contact_email"]}
                </a>
              </p>
            ) : null}
            {settings["contact_location"] ? (
              <p className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                {settings["contact_location"]}
              </p>
            ) : null}
            <p className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-primary" />
              Remote-first, working across IST and overlapping hours
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
