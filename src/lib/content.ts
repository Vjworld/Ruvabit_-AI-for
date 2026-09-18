import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Service = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  problem: string | null;
  deliverables: string[];
  timeline: string | null;
  tools: string[];
  icon: string | null;
  sort_order: number;
  published: boolean;
};

export type Industry = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  use_cases: string[];
  icon: string | null;
  sort_order: number;
  published: boolean;
};

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  summary: string | null;
  challenge: string | null;
  approach: string | null;
  outcome: string | null;
  stack: string[];
  metrics: { label: string; value: string }[];
  external_url: string | null;
  cover_url: string | null;
  featured: boolean;
  sort_order: number;
  published: boolean;
};

export type PricingTier = {
  id: string;
  slug: string;
  name: string;
  best_for: string | null;
  description: string | null;
  inclusions: string[];
  duration: string | null;
  highlighted: boolean;
  sort_order: number;
  published: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  tags: string[];
  seo_title: string | null;
  seo_description: string | null;
  read_minutes: number | null;
  published: boolean;
  published_at: string | null;
};

export type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  quote: string;
  sort_order: number;
  published: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  published: boolean;
};

export type SiteSettings = Record<string, string>;

type PublishedTable =
  | "services"
  | "industries"
  | "case_studies"
  | "pricing_tiers"
  | "testimonials"
  | "faqs";

async function listOrdered<T>(table: PublishedTable): Promise<T[]> {
  const { data, error } = await supabase
    .from(table)
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as T[];
}

export const servicesQuery = queryOptions({
  queryKey: ["services"],
  queryFn: () => listOrdered<Service>("services"),
});

export const industriesQuery = queryOptions({
  queryKey: ["industries"],
  queryFn: () => listOrdered<Industry>("industries"),
});

export const caseStudiesQuery = queryOptions({
  queryKey: ["case_studies"],
  queryFn: () => listOrdered<CaseStudy>("case_studies"),
});

export const pricingQuery = queryOptions({
  queryKey: ["pricing_tiers"],
  queryFn: () => listOrdered<PricingTier>("pricing_tiers"),
});

export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: () => listOrdered<Testimonial>("testimonials"),
});

export const faqsQuery = queryOptions({
  queryKey: ["faqs"],
  queryFn: () => listOrdered<Faq>("faqs"),
});

export const postsQuery = queryOptions({
  queryKey: ["posts"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Post[];
  },
});

export const postQuery = (slug: string) =>
  queryOptions({
    queryKey: ["post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as Post | null;
    },
  });

export const caseStudyQuery = (slug: string) =>
  queryOptions({
    queryKey: ["case_study", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("case_studies")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as CaseStudy | null;
    },
  });

export const settingsQuery = queryOptions({
  queryKey: ["site_settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error) throw error;
    const out: SiteSettings = {};
    for (const row of data ?? []) out[row.key as string] = (row.value as string) ?? "";
    return out;
  },
});
