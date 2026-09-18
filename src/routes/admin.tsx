import { useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { KanbanSquare, FileText, LogOut, Settings, ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/ruvabit-logo.png.asset.json";
import { ThemeToggle } from "@/components/site/ThemeToggle";


export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "RUVABIT Admin" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private RUVABIT admin portal." },
    ],
  }),
  component: AdminLayout,
});

const nav: { to: string; label: string; icon: typeof KanbanSquare; exact?: boolean }[] = [
  { to: "/admin", label: "Leads", icon: KanbanSquare, exact: true },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

function AdminLayout() {
  const { loading, session, isAdmin } = useAdminAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) return <SignIn />;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="surface-panel max-w-md rounded-xl p-8 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-destructive" />
          <h1 className="mt-4 font-display text-lg font-semibold">No admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            You're signed in as {session.user.email}, but this account has no admin role.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 rounded-md border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2" aria-label="RUVABIT home">
            <span className="inline-block rounded-md bg-white px-2 py-1">
              <img src={logoAsset.url} alt="RUVABIT logo" className="h-5 w-auto" />
            </span>
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground">
              admin
            </span>
          </Link>
          <nav className="flex flex-1 flex-wrap gap-1">
            {nav.map((item) => {
              const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to as "/admin"}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <ThemeToggle />
          <button

            onClick={async () => {
              await supabase.auth.signOut();
              toast.success("Signed out");
            }}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Outlet />
      </div>
    </div>
  );
}

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  const fieldClass =
    "mt-2 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary/60 focus:ring-2 focus:ring-ring/30";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <form onSubmit={onSubmit} className="surface-panel w-full max-w-sm rounded-xl p-8">
        <h1 className="flex items-center gap-2 font-display text-xl font-bold">
          <span className="inline-block rounded-md bg-white px-2 py-1">
            <img src={logoAsset.url} alt="RUVABIT logo" className="h-5 w-auto" />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            admin
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to manage leads and content.</p>
        <label className="mt-6 block text-sm font-medium">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="mt-4 block text-sm font-medium">
          Password
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldClass}
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Sign in
        </button>
      </form>
    </div>
  );
}
