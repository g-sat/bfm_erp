import { MarketingHero } from "@/components/marketing/hero";
import { MarketingBody } from "@/components/marketing/body";

export default function LandingPage() {
  return (
    <main className="overflow-x-hidden bg-[#050505]">
      <MarketingHero />
      <MarketingBody />
    </main>
  );
}
