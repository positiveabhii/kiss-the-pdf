import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { CATEGORY_STYLE, getPost, posts } from "@/content/blog";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

/** 1200×630 cover for a blog post: used as the hero image and the OG/Twitter card. */
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const style = CATEGORY_STYLE[post.category];
  const titleSize = post.title.length > 70 ? 54 : post.title.length > 48 ? 62 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: `linear-gradient(135deg, ${style.from} 0%, ${style.to} 100%)`,
          color: "white",
          fontFamily: "sans-serif",
          padding: "64px 72px",
          position: "relative",
        }}
      >
        {/* Faint ruled lines, like a page */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "100% 42px",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 760, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: 999,
                border: `1px solid ${style.ink}55`,
                color: style.ink,
                fontSize: 22,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {post.category}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.08, letterSpacing: -1.5 }}>
              {post.title}
            </div>
            <div style={{ display: "flex", fontSize: 28, color: style.ink, lineHeight: 1.3 }}>{post.coverLine}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, fontWeight: 700 }}>
            <div
              style={{
                display: "flex",
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "#ef553b",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              KP
            </div>
            {siteConfig.name}
            <div style={{ display: "flex", fontSize: 20, fontWeight: 400, color: style.ink, marginLeft: 8 }}>
              Free · Open source · No upload
            </div>
          </div>
        </div>

        {/* Stylised document sheet */}
        <div style={{ display: "flex", position: "absolute", right: 72, top: 110 }}>
          <div
            style={{
              display: "flex",
              width: 250,
              height: 330,
              background: "rgba(255,255,255,0.10)",
              borderRadius: 14,
              transform: "rotate(-7deg)",
              position: "absolute",
              left: -26,
              top: 18,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 250,
              height: 330,
              background: "#fffaf7",
              borderRadius: 14,
              padding: 26,
              gap: 12,
              boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", fontSize: 40, fontWeight: 700, color: style.from }}>{style.glyph}</div>
            {[92, 100, 78, 100, 64, 88, 52].map((w, i) => (
              <div key={i} style={{ display: "flex", height: 10, width: `${w}%`, borderRadius: 5, background: i === 2 ? "#ef553b" : "#e6dbd4" }} />
            ))}
            <div
              style={{
                display: "flex",
                marginTop: "auto",
                alignSelf: "flex-end",
                padding: "6px 12px",
                borderRadius: 8,
                background: "#211d1b",
                color: "white",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              PDF
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
