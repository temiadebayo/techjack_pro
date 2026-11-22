import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};
export const contentType = "image/png";

export default function Icon() {
  const filePath = join(process.cwd(), "public", "brand", "tech-jack-logo.png");
  const logoSrc = `data:image/png;base64,${readFileSync(filePath).toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#080808",
          padding: "6px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="Tech Jack"
          width={52}
          height={37}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size }
  );
}
