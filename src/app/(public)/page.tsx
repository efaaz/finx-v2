"use client";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import QuoteSection from "@/components/landing/QuoteSection";

export default function Home() {
  return (
    <>
      <section className="">
        <HeroSection />
        <FeaturesSection />
        <QuoteSection />
      </section>
    </>
  );
}
