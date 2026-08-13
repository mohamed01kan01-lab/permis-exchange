import { ImageResponse } from "next/og";
import { routing } from "@/i18n/routing";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CONTENT_BY_LOCALE: Record<string, { name: string; tagline: string }> = {
  fr: {
    name: "Permis-Exchange",
    tagline: "Conversion de votre permis de conduire étranger en permis italien",
  },
  en: {
    name: "Permis-Exchange",
    tagline: "Converting your foreign driving licence into an Italian one",
  },
  it: {
    name: "Conversione patente straniera",
    tagline: "Conversione della tua patente di guida straniera in patente italiana",
  },
};

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const content = CONTENT_BY_LOCALE[locale] ?? CONTENT_BY_LOCALE[routing.defaultLocale];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          backgroundColor: "#0B1220",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: -120,
            right: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            backgroundColor: "#3B82F6",
            opacity: 0.25,
          }}
        />
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: -140,
            left: -140,
            width: 420,
            height: 420,
            borderRadius: "50%",
            backgroundColor: "#16A34A",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: "#3B82F6",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: "6px solid #0B1220",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#EAF2FF",
            lineHeight: 1.1,
            maxWidth: 980,
          }}
        >
          {content.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 32,
            fontWeight: 500,
            color: "#94A3B8",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          {content.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
