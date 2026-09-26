import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { features } from "@/content/featuresContent";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[48px_48px]" />

        {/* Top glow */}
        <div className="absolute left-1/2 top-0 h-125 w-200 -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        {/* Side glows */}
        <div className="absolute -left-50 top-125 h-100 w-100 rounded-full bg-violet-500/5 blur-[120px]" />

        <div className="absolute -right-50 top-200 h-100 w-100 rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-20 pt-24 sm:px-8 lg:px-12 lg:pt-32">
        <div className="mx-auto max-w-3xl text-center">
          {/* Eyebrow */}
          <div className="mb-6 inline-flex items-center rounded-full border border-border/70 bg-background/60 px-4 py-2 text-xs font-medium tracking-wide text-muted-foreground backdrop-blur">
            <span className="mr-2 size-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            BUILT FOR EVERYDAY FINANCE
          </div>

          <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Everything you need to
            <span className="block bg-linear-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              understand your money.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            FinX helps you record your financial activity, organize your
            spending, and turn everyday financial data into something you can
            actually understand.
          </p>
        </div>

        {/* Small stats */}
        <div className="mx-auto mt-12 flex max-w-xl flex-wrap items-center justify-center gap-3">
          <div className="rounded-full border border-border/70 bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
            Simple record keeping
          </div>

          <div className="rounded-full border border-border/70 bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
            Financial insights
          </div>

          <div className="rounded-full border border-border/70 bg-card/50 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
            Built for personal use
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-border/70 bg-card/70 py-0 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_70px_-30px_rgba(168,85,247,0.35)]"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute -right-20 -top-20 size-40 rounded-full bg-primary/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

                <div className="p-6">
                  {/* Icon + index */}
                  <div className="flex items-start justify-between">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-background/70 text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10">
                      <Icon className="size-5" />
                    </div>

                    <span className="font-mono text-xs text-muted-foreground/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="mt-6">
                    <h2 className="font-heading text-xl font-semibold tracking-tight">
                      {feature.title}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Screenshot */}
                <div className="px-3 pb-3">
                  <div className="relative overflow-hidden rounded-xl border border-border/60 bg-background shadow-2xl">
                    {/* Browser-like top bar */}
                    <div className="flex h-8 items-center gap-1.5 border-b border-border/60 bg-card/80 px-3">
                      <span className="size-1.5 rounded-full bg-muted-foreground/30" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/20" />
                      <span className="size-1.5 rounded-full bg-muted-foreground/10" />
                    </div>

                    <div className="relative aspect-16/10 overflow-hidden">
                      <Image
                        src={feature.screenshot}
                        alt={`${feature.title} screenshot`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.025]"
                      />

                      {/* Screenshot gradient */}
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-background/30 via-transparent to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Bottom interaction */}
                <div className="flex items-center justify-between px-6 pb-6 pt-3">
                  <span className="text-xs text-muted-foreground">
                    FinX feature
                  </span>

                  <div className="flex size-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/10 group-hover:text-primary">
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative mx-auto max-w-5xl px-6 pb-28 sm:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/60 px-6 py-16 text-center backdrop-blur-md sm:px-12">
          {/* CTA glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />

          <div className="relative">
            <p className="text-sm font-medium text-primary">
              START BUILDING BETTER FINANCIAL HABITS
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl font-heading text-3xl font-semibold tracking-tight sm:text-4xl">
              Your financial data should tell you more than just a number.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              FinX is built to make recording money simple and understanding
              your financial habits easier.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" className="flex justify-center">
                <Link href="/signup">
                  Get Started
                </Link>
                <ArrowRight className=" size-4" />
              </Button>

              <Button size="lg" variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
