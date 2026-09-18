import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

const groups: { label: string; keys: string[] }[] = [
  {
    label: "Hero",
    keys: [
      "hero_eyebrow",
      "hero_headline",
      "hero_subheadline",
      "hero_cta_primary",
      "hero_cta_secondary",
    ],
  },
  { label: "Founder", keys: ["founder_name", "founder_title"] },
  { label: "Contact", keys: ["contact_email", "contact_phone", "contact_location"] },
  { label: "Links", keys: ["linkedin_url", "portfolio_url", "producthunt_url"] },
  {
    label: "Stats",
    keys: [
      "stat_1_value",
      "stat_1_label",
      "stat_2_value",
      "stat_2_label",
      "stat_3_value",
      "stat_3_label",
      "stat_4_value",
      "stat_4_label",
    ],
  },
];

function AdminSettings() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string>>({});

  const settingsQ = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) throw error;
      const out: Record<string, string> = {};
      for (const row of data ?? []) out[row.key as string] = (row.value as string) ?? "";
      return out;
    },
  });

  useEffect(() => {
    if (settingsQ.data) setDraft(settingsQ.data);
  }, [settingsQ.data]);

  const save = useMutation({
    mutationFn: async () => {
      const rows = Object.entries(draft).map(([key, value]) => ({ key, value }));
      const { error } = await supabase.from("site_settings").upsert(rows, { onConflict: "key" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["admin", "site_settings"] });
      queryClient.invalidateQueries({ queryKey: ["site_settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (settingsQ.isLoading) return <Loader2 className="h-5 w-5 animate-spin text-primary" />;

  const fieldClass =
    "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring/30";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Site settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Copy shown across the public website.
          </p>
        </div>
        <button
          onClick={() => save.mutate()}
          disabled={save.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {save.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save changes
        </button>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <section key={group.label} className="surface-panel rounded-xl p-6">
            <h2 className="font-display text-base font-semibold">{group.label}</h2>
            <div className="mt-4 space-y-4">
              {group.keys.map((key) => (
                <label key={key} className="block text-sm font-medium">
                  <span className="font-mono text-xs text-muted-foreground">{key}</span>
                  {key.includes("headline") || key.includes("label") || key.includes("location") ? (
                    <textarea
                      rows={2}
                      value={draft[key] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className={fieldClass}
                    />
                  ) : (
                    <input
                      value={draft[key] ?? ""}
                      onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
                      className={fieldClass}
                    />
                  )}
                </label>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
