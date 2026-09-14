import type { Metadata } from "next";
import { Space_Grotesk, Syne } from "next/font/google";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";
import { SmoothScroll } from "@/components/marketing/smooth-scroll";

const display = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-marketing",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "BOLDFRAME — Creative work, managed",
  description:
    "The Operating System for Creative Services. Match verified talent and manage delivery from brief to finish.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-dvh bg-[#050505] font-[family-name:var(--font-marketing)] text-white antialiased [color-scheme:dark]`}
    >
      <SmoothScroll>
        <MarketingNav />
        {children}
        <MarketingFooter />
      </SmoothScroll>
    </div>
  );
}
