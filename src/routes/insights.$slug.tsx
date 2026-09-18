import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { postQuery } from "@/lib/content";
import { CtaBand } from "@/components/site/Sections";
import { Markdown } from "@/components/site/Markdown";

export const Route = createFileRoute("/insights/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return {
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article unavailable | RUVABIT" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.title} | RUVABIT`;
    return {
      meta: [
        { title },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postQuery(slug));
  if (!post) return null;

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 md:py-20">
        <Link
          to="/insights"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All insights
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
          {post.published_at ? (
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          ) : null}
          {post.read_minutes ? <span>{post.read_minutes} min read</span> : null}
          {post.tags.map((t) => (
            <span key={t} className="rounded-md bg-secondary px-2 py-0.5">
              {t}
            </span>
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p> : null}
        <div className="mt-10">
          <Markdown source={post.body ?? ""} />
        </div>
      </article>

      <CtaBand />
    </>
  );
}
