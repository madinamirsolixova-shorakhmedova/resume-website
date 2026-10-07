import { Font } from "@react-pdf/renderer";

let isFontRegistered = false;

export function registerFonts(): void {
  if (isFontRegistered) return;

  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    Font.register({
      family: "Roboto",
      fonts: [
        { src: `${origin}/fonts/Roboto-Regular.ttf`, fontWeight: "normal" },
        { src: `${origin}/fonts/Roboto-Medium.ttf`, fontWeight: 500 },
        { src: `${origin}/fonts/Roboto-Bold.ttf`, fontWeight: "bold" },
        { src: `${origin}/fonts/Roboto-Italic.ttf`, fontStyle: "italic" },
      ],
    });

    isFontRegistered = true;
  } catch (e) {
    console.error("Font registration error", e);
  }
}
