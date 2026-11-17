import Link from "next/link";

import { readingMinutes, type BlogPost } from "@/content/blog";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });

export function PostCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--kp-border)] bg-white transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-[var(--kp-border-hover)] hover:shadow-[var(--kp-shadow-md)] motion-reduce:hover:translate-y-0"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- generated static cover */}
      <img
        src={`/blog/${post.slug}/cover.png`}
        alt=""
        width={1200}
        height={630}
        loading={priority ? "eager" : "lazy"}
        className="aspect-[1200/630] w-full object-cover"
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--kp-accent)]">{post.category}</p>
        <h3 className="font-serif text-xl leading-snug text-slate-900 group-hover:text-[var(--kp-accent-hover)]">{post.title}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">{post.description}</p>
        <p className="mt-auto pt-2 text-xs text-slate-500">
          {formatDate(post.updated ?? post.published)} · {readingMinutes(post)} min read
        </p>
      </div>
    </Link>
  );
}

export { formatDate };
