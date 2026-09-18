import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Mail, Phone, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  component: AdminLeads,
});

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  team_size: string | null;
  interest: string | null;
  message: string | null;
  stage: string;
  source_page: string | null;
  created_at: string;
};

const stages = ["new", "contacted", "qualified", "proposal", "won", "lost"] as const;

function AdminLeads() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const leadsQ = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Lead[];
    },
  });

  const updateStage = useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: string }) => {
      const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Stage updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeLead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lead deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "leads"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const leads = leadsQ.data ?? [];
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: leads.length };
    for (const s of stages) map[s] = leads.filter((l) => l.stage === s).length;
    return map;
  }, [leads]);

  const visible = filter === "all" ? leads : leads.filter((l) => l.stage === filter);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enquiries captured from the website contact form.
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(["all", ...stages] as string[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                filter === s
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {s} ({counts[s] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {leadsQ.isLoading ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : visible.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">No leads in this stage yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {visible.map((lead) => (
            <article key={lead.id} className="surface-panel rounded-xl p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <button
                  className="text-left"
                  onClick={() => setOpenId(openId === lead.id ? null : lead.id)}
                >
                  <h2 className="font-display text-base font-semibold">
                    {lead.name}
                    {lead.company ? (
                      <span className="text-muted-foreground"> · {lead.company}</span>
                    ) : null}
                  </h2>
                  <p className="mt-1 flex flex-wrap gap-3 font-mono text-xs text-muted-foreground">
                    <span>{new Date(lead.created_at).toLocaleString("en-GB")}</span>
                    {lead.interest ? <span>{lead.interest}</span> : null}
                    {lead.team_size ? <span>{lead.team_size} people</span> : null}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <select
                    value={lead.stage}
                    onChange={(e) => updateStage.mutate({ id: lead.id, stage: e.target.value })}
                    className="rounded-md border border-input bg-background px-2.5 py-1.5 text-xs"
                  >
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (confirm(`Delete lead from ${lead.name}?`)) removeLead.mutate(lead.id);
                    }}
                    className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label="Delete lead"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {openId === lead.id ? (
                <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <a href={`mailto:${lead.email}`} className="hover:text-primary">
                      {lead.email}
                    </a>
                  </p>
                  {lead.phone ? (
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      {lead.phone}
                    </p>
                  ) : null}
                  {lead.message ? (
                    <p className="whitespace-pre-line text-muted-foreground">{lead.message}</p>
                  ) : null}
                  {lead.source_page ? (
                    <p className="font-mono text-xs text-muted-foreground">
                      Source: {lead.source_page}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
