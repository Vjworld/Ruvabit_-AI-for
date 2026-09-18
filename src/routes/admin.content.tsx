import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/content")({
  component: AdminContent,
});

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  tags: string[];
  read_minutes: number | null;
  published: boolean;
  published_at: string | null;
};

type Toggleable = {
  id: string;
  title: string;
  published: boolean;
  sort_order: number;
};

const fieldClass =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring/30";

function AdminContent() {
  const [tab, setTab] = useState<"posts" | "sections">("posts");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Content</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Publish articles and control which site sections are visible.
      </p>

      <div className="mt-6 flex gap-1">
        {(["posts", "sections"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors",
              tab === t
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-6">{tab === "posts" ? <PostsManager /> : <SectionsManager />}</div>
    </div>
  );
}

function PostsManager() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Partial<Post> | null>(null);

  const postsQ = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false });
      if (error) throw error;
      return (data ?? []) as Post[];
    },
  });

  const savePost = useMutation({
    mutationFn: async (draft: Partial<Post>) => {
      const payload = {
        slug: (draft.slug ?? "").trim(),
        title: (draft.title ?? "").trim(),
        excerpt: draft.excerpt ?? null,
        body: draft.body ?? null,
        tags: draft.tags ?? [],
        read_minutes: draft.read_minutes ?? null,
        published: draft.published ?? false,
        published_at: draft.published ? (draft.published_at ?? new Date().toISOString()) : null,
      };
      if (!payload.slug || !payload.title) throw new Error("Title and slug are required");
      if (draft.id) {
        const { error } = await supabase.from("posts").update(payload).eq("id", draft.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("posts").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Article saved");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Article deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (postsQ.isLoading) {
    return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div>
        <button
          onClick={() => setEditing({ published: false, tags: [] })}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> New article
        </button>
        <div className="mt-4 space-y-2">
          {(postsQ.data ?? []).map((p) => (
            <div
              key={p.id}
              className={cn(
                "surface-panel flex items-start justify-between gap-3 rounded-lg p-4",
                editing?.id === p.id && "border-primary/40",
              )}
            >
              <button className="text-left" onClick={() => setEditing(p)}>
                <p className="text-sm font-semibold">{p.title}</p>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  /{p.slug} · {p.published ? "published" : "draft"}
                </p>
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${p.title}"?`)) removePost.mutate(p.id);
                }}
                className="rounded-md border border-border p-2 text-muted-foreground transition-colors hover:text-destructive"
                aria-label="Delete article"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {(postsQ.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No articles yet.</p>
          ) : null}
        </div>
      </div>

      {editing ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            savePost.mutate(editing);
          }}
          className="surface-panel h-fit rounded-xl p-6"
        >
          <h2 className="font-display text-lg font-semibold">
            {editing.id ? "Edit article" : "New article"}
          </h2>
          <label className="mt-5 block text-sm font-medium">
            Title
            <input
              value={editing.title ?? ""}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Slug
            <input
              value={editing.slug ?? ""}
              onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Excerpt
            <textarea
              rows={2}
              value={editing.excerpt ?? ""}
              onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
              className={fieldClass}
            />
          </label>
          <label className="mt-4 block text-sm font-medium">
            Body (markdown)
            <textarea
              rows={12}
              value={editing.body ?? ""}
              onChange={(e) => setEditing({ ...editing, body: e.target.value })}
              className={cn(fieldClass, "font-mono text-xs")}
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-medium">
              Tags (comma separated)
              <input
                value={(editing.tags ?? []).join(", ")}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                className={fieldClass}
              />
            </label>
            <label className="block text-sm font-medium">
              Read minutes
              <input
                type="number"
                min={1}
                value={editing.read_minutes ?? ""}
                onChange={(e) =>
                  setEditing({
                    ...editing,
                    read_minutes: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className={fieldClass}
              />
            </label>
          </div>
          <label className="mt-5 flex items-center gap-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={Boolean(editing.published)}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
              className="h-4 w-4"
            />
            Published
          </label>
          <div className="mt-6 flex gap-2">
            <button
              type="submit"
              disabled={savePost.isPending}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {savePost.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-muted-foreground">
          Select an article to edit, or create a new one.
        </p>
      )}
    </div>
  );
}

const sectionTables = [
  { table: "services", label: "Services" },
  { table: "industries", label: "Industries" },
  { table: "case_studies", label: "Case studies" },
  { table: "pricing_tiers", label: "Pricing tiers" },
] as const;

function SectionsManager() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sectionTables.map((s) => (
        <ToggleList key={s.table} table={s.table} label={s.label} />
      ))}
      <TestimonialList />
      <FaqList />
    </div>
  );
}

function ToggleList({
  table,
  label,
}: {
  table: "services" | "industries" | "case_studies" | "pricing_tiers";
  label: string;
}) {
  const queryClient = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table as "services")
        .select("id, title, published, sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as Toggleable[];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase
        .from(table as "services")
        .update({ published })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", table] });
      queryClient.invalidateQueries({ queryKey: [table] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="surface-panel rounded-xl p-6">
      <h2 className="font-display text-base font-semibold">{label}</h2>
      <ul className="mt-4 space-y-2">
        {(q.data ?? []).map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
            <span className={row.published ? "" : "text-muted-foreground line-through"}>
              {row.title}
            </span>
            <button
              onClick={() => toggle.mutate({ id: row.id, published: !row.published })}
              className="rounded-md border border-border px-3 py-1 font-mono text-xs transition-colors hover:bg-secondary"
            >
              {row.published ? "hide" : "show"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TestimonialList() {
  const queryClient = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("id, author, quote, published, sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as { id: string; author: string; published: boolean }[];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("testimonials").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="surface-panel rounded-xl p-6">
      <h2 className="font-display text-base font-semibold">Testimonials</h2>
      <ul className="mt-4 space-y-2">
        {(q.data ?? []).map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
            <span className={row.published ? "" : "text-muted-foreground line-through"}>
              {row.author}
            </span>
            <button
              onClick={() => toggle.mutate({ id: row.id, published: !row.published })}
              className="rounded-md border border-border px-3 py-1 font-mono text-xs transition-colors hover:bg-secondary"
            >
              {row.published ? "hide" : "show"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FaqList() {
  const queryClient = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, published, sort_order")
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as { id: string; question: string; published: boolean }[];
    },
  });

  const toggle = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("faqs").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="surface-panel rounded-xl p-6">
      <h2 className="font-display text-base font-semibold">FAQs</h2>
      <ul className="mt-4 space-y-2">
        {(q.data ?? []).map((row) => (
          <li key={row.id} className="flex items-center justify-between gap-3 text-sm">
            <span className={row.published ? "" : "text-muted-foreground line-through"}>
              {row.question}
            </span>
            <button
              onClick={() => toggle.mutate({ id: row.id, published: !row.published })}
              className="rounded-md border border-border px-3 py-1 font-mono text-xs transition-colors hover:bg-secondary"
            >
              {row.published ? "hide" : "show"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
