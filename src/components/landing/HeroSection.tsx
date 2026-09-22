import { TextGenerateEffect } from "../ui/text-generate-effect";
import { Spotlight } from "../ui/spotlight";
import Link from "next/dist/client/link";
import { cn } from "@/lib/utils";

function HeroSection() {
  const words: string = `Say goodbye to financial chaos! Our nextgen finance tracker lets you monitor spending, boost savings, and stay in control all in a sleek, modern dashboard. Smart insights, effortless tracking, stress less live more!`;
  return (
    <>
      <div className="h-180 overflow-hidden w-full relative flex items-center justify-center">
        <div
          className={cn(
            "pointer-events-none absolute inset-0 bg-size-[40px_40px] select-none"
          )}
        />
        <Spotlight />
        <div className="max-w-5xl z-10 mx-auto p-4">
          <h1 className="text-3xl font-heading text-center md:text-5xl font-bold relative z-20 bg-clip-text text-white bg-linear-to-b from-neutral-100 to-neutral-300 py-4">
            The road to freedom starts from here
          </h1>
          <div className="text-center mt-2">
            <TextGenerateEffect
              className="text-sm md:text-lg text-white/70"
              duration={2}
              filter={false}
              words={words}
            />
          </div>
          <div className="justify-center flex mt-5">
            <div>
              <Link href="/signup">
                <button className="relative inline-flex h-12 overflow-hidden rounded-full p-px focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                  <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-6 py-2 text-sm font-medium text-white backdrop-blur-3xl">
                    Sign up for free
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default HeroSection;
