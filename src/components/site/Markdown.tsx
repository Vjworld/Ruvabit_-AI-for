import { Fragment } from "react";

/**
 * Minimal, dependency-free markdown renderer for CMS article bodies.
 * Supports headings, bullet lists, ordered lists, blockquotes, bold/italic/code
 * inline marks and paragraphs — enough for editorial content.
 */
export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n{2,}/);

  return (
    <div className="space-y-5 text-muted-foreground">
      {blocks.map((block, i) => {
        const lines = block.split("\n");

        if (/^###\s/.test(block)) {
          return (
            <h3 key={i} className="font-display text-lg font-semibold text-foreground">
              {inline(block.replace(/^###\s/, ""))}
            </h3>
          );
        }
        if (/^##\s/.test(block)) {
          return (
            <h2 key={i} className="pt-3 font-display text-2xl font-bold text-foreground">
              {inline(block.replace(/^##\s/, ""))}
            </h2>
          );
        }
        if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
          return (
            <ul key={i} className="space-y-2 pl-5">
              {lines.map((l, j) => (
                <li key={j} className="list-disc">
                  {inline(l.replace(/^\s*[-*]\s+/, ""))}
                </li>
              ))}
            </ul>
          );
        }
        if (lines.every((l) => /^\s*\d+[.)]\s+/.test(l))) {
          return (
            <ol key={i} className="space-y-2 pl-5">
              {lines.map((l, j) => (
                <li key={j} className="list-decimal">
                  {inline(l.replace(/^\s*\d+[.)]\s+/, ""))}
                </li>
              ))}
            </ol>
          );
        }
        if (/^>\s?/.test(block)) {
          return (
            <blockquote key={i} className="border-l-2 border-primary pl-4 italic">
              {inline(block.replace(/^>\s?/gm, ""))}
            </blockquote>
          );
        }
        return <p key={i}>{inline(block)}</p>;
      })}
    </div>
  );
}

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (/^`[^`]+`$/.test(part)) {
      return (
        <code key={i} className="rounded bg-secondary px-1.5 py-0.5 font-mono text-sm text-foreground">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^\*[^*]+\*$/.test(part)) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
