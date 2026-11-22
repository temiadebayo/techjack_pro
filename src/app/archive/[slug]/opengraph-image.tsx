import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";
import { getReleaseBySlug } from "@/lib/cms/queries";

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

function getLogoDataUri(): string {
  const filePath = join(process.cwd(), "public", "brand", "tech-jack-logo.png");
  const buffer = readFileSync(filePath);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

export default async function ReleaseOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const release = await getReleaseBySlug(slug);
  const logoSrc = getLogoDataUri();

  const title = release?.title ?? "THE ARCHIVE";
  const credit = release?.artistCredit ?? "TECH JACK®";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080808",
          color: "#F0EEE9",
          padding: "64px",
          border: "1px solid #242424",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Tech Jack"
              width={114}
              height={80}
              style={{ objectFit: "contain" }}
            />
            <span
              style={{
                fontSize: "20px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "#9B9891",
              }}
            >
              FROM THE ARCHIVE / 7926
            </span>
          </div>
          <span
            style={{
              backgroundColor: "#BC0101",
              color: "#F0EEE9",
              padding: "8px 16px",
              fontSize: "18px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {release?.releaseStatus ?? "ARCHIVE"}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "112px",
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "28px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#BC0101",
            }}
          >
            {credit}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #242424",
            paddingTop: "24px",
            fontSize: "18px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9B9891",
          }}
        >
          <span>THE ARCHIVE</span>
          <span>WWW.TECHJACK.SITE</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
