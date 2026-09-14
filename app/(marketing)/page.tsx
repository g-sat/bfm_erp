import { MarketingHero } from "@/components/marketing/hero";
import { MarketingStats } from "@/components/marketing/stats";
import { MarketingProblem } from "@/components/marketing/problem";
import { MarketingServices } from "@/components/marketing/services";

export default function LandingPage() {
  return (
    <main>
      <MarketingHero />
      <MarketingStats />
      <MarketingProblem />
      <MarketingServices />
    </main>
  );
}
