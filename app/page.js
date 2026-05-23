import CtaSection from "./components/components/CtaSection/CtaSection";
import Features from "./components/components/Features/Features";
import Hero from "./components/components/Hero/Hero";
import SearchPreview from "./components/components/SearchPreview/SearchPreview";
import Stats from "./components/components/Stats/Stats";
import Testimonials from "./components/components/Testimonials/Testimonials";
import Universities from "./components/components/Universities/Universities";

export default function HomePage() {
  return (
    <>
      <main>
        <Hero />
        <Stats />
        <SearchPreview />
        <Features />
        <Universities />
        <Testimonials />
        <CtaSection />
      </main>
    </>
  );
}
