import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const alt = "Tech Jack® / 7926";
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

export default function OpenGraphImage() {
  const logoSrc = getLogoDataUri();

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
            width: "100%",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt="Tech Jack"
            width={142}
            height={100}
            style={{ objectFit: "contain" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "22px",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#9B9891",
            }}
          >
            <span>7926</span>
            <div
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: "#BC0101",
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              fontSize: "104px",
              fontWeight: 800,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              textTransform: "uppercase",
            }}
          >
            I’M STILL BECOMING.
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "#9B9891",
              maxWidth: "820px",
              lineHeight: 1.4,
            }}
          >
            Music, identity, visuals, fragments and an ongoing creative
            evolution.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #242424",
            paddingTop: "24px",
            fontSize: "18px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#9B9891",
          }}
        >
          <span>AN ONGOING DOCUMENTATION.</span>
          <span style={{ color: "#BC0101" }}>WWW.TECHJACK.SITE</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
