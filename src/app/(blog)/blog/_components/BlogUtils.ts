import type { CSSProperties } from "react";

// ─── TipTap JSON heading extractor ───────────────────────────────────────────

type TipTapNode = {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TipTapNode[];
  text?: string;
};

function textFromNodes(nodes: TipTapNode[]): string {
  return nodes
    .map((n) => (n.type === "text" ? (n.text ?? "") : textFromNodes(n.content ?? [])))
    .join("");
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

export function extractHeadings(content: unknown): Heading[] {
  const headings: Heading[] = [];
  const idCount: Record<string, number> = {};

  function walk(node: TipTapNode) {
    if (node.type === "heading" && typeof node.attrs?.level === "number") {
      const text = textFromNodes(node.content ?? []);
      const base = slugifyHeading(text) || `heading-${headings.length + 1}`;
      idCount[base] = (idCount[base] ?? 0) + 1;
      const id = idCount[base] > 1 ? `${base}-${idCount[base]}` : base;
      headings.push({ level: node.attrs.level as number, text, id });
    }
    node.content?.forEach(walk);
  }

  if (content && typeof content === "object") walk(content as TipTapNode);
  return headings;
}

// Inject id="..." into <h1>–<h6> tags in rendered HTML
export function injectHeadingIds(html: string, headings: Heading[]): string {
  let i = 0;
  return html.replace(/<h([1-6])(\s[^>]*)?>/g, (_match, level: string, rest: string) => {
    const h = headings[i];
    if (h && h.level === parseInt(level, 10)) {
      i++;
      return `<h${level}${rest ?? ""} id="${h.id}">`;
    }
    return `<h${level}${rest ?? ""}>`;
  });
}

// ─── Read-time estimator ──────────────────────────────────────────────────────

export function readTime(content: unknown): number {
  if (!content) return 1;
  const text = JSON.stringify(content).replace(/<[^>]+>/g, "").replace(/\s+/g, " ");
  return Math.max(1, Math.ceil(text.split(" ").length / 200));
}

// ─── Date formatter ───────────────────────────────────────────────────────────

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// ─── Deterministic gradient from string ──────────────────────────────────────

export function getPostGradient(str: string): CSSProperties {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return {
    background: `linear-gradient(135deg, hsl(${hue}deg 28% 11%) 0%, hsl(${(hue + 50) % 360}deg 18% 6%) 100%)`,
  };
}
