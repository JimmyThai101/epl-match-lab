import { ImageResponse } from "next/og";
import { DEFAULT_SHARE, firstParam, type ShareCard, type ShareSearch } from "@/lib/share";
import { shareCardFromSearch } from "@/lib/share-data";

export const revalidate = 1800;

const SIZE = { width: 1200, height: 630 };

function card(model: ShareCard) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#F1F5F9",
        padding: 48,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FFFFFF",
          borderRadius: 32,
          padding: 56,
          border: "1px solid #E2E8F0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "#047857",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {model.eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: model.headline.length > 28 ? 56 : 68,
              lineHeight: 1.1,
              fontWeight: 700,
              color: "#0F172A",
            }}
          >
            {model.headline}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", gap: 16, height: 18 }}>
            <div style={{ flex: 1, background: model.homeKit, borderRadius: 999 }} />
            <div style={{ flex: 1, background: model.awayKit, borderRadius: 999 }} />
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 26,
              color: "#475569",
              lineHeight: 1.4,
            }}
          >
            {model.kicker}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search: ShareSearch = {
    a: firstParam(url.searchParams.get("a") ?? undefined),
    b: firstParam(url.searchParams.get("b") ?? undefined),
    tab: firstParam(url.searchParams.get("tab") ?? undefined),
    player: firstParam(url.searchParams.get("player") ?? undefined),
    pid: firstParam(url.searchParams.get("pid") ?? undefined),
    vs: firstParam(url.searchParams.get("vs") ?? undefined),
  };
  const hasQuery = [...url.searchParams.keys()].length > 0;
  const model = hasQuery ? await shareCardFromSearch(search) : DEFAULT_SHARE;

  return new ImageResponse(card(model), SIZE);
}
