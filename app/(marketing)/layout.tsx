import type { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { MarketingFooter } from "@/components/marketing/footer";

export const metadata: Metadata = {
  title: "BOLDFRAME — Creative work, managed",
  description:
    "Tell us what you need. We match verified creative talent and manage delivery from brief to finish.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-white text-neutral-950 antialiased [color-scheme:light]">
      <MarketingNav />
      {children}
      <MarketingFooter />
    </div>
  );
}
