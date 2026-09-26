import Link from "next/link";
import { ArrowUpRight, Code2, ExternalLink, Layers3 } from "lucide-react";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

function page() {
  return (
    <>
      <div className="max-w-6xl mt-28 mx-auto text-neutral-300 p-4 md:p-8">
        <h1 className=" md:text-5xl font-bold text-3xl mb-4">About Us</h1>
        <RiDoubleQuotesL className="md:text-6xl text-2xl " />
        <div className="md:px-12 px-6">
          <p className="text-xl text-muted md:text-2xl">
            FinX was born out of a personal need. As someone who has always been
            meticulous about money, I spent years tracking every expense and
            income using Microsoft Excel. But managing finances this way was a
            constant hassle time-consuming and frustrating. I explored countless
            finance management tools, yet none fully met my expectations. So, I
            decided to take control and build something better.
          </p>
          <br />
          <p className="text-xl text-muted md:text-2xl">
            As a software Engineer, we build software for simplifying life's
            complexities, and I was thinking if I could create a tool that
            brought clarity and control to finances, others who care about
            managing their money could benefited too. FinX isn’t just a personal
            project. It’s a passion project crafted for anyone eager to take
            charge of their financial future. My vision was to design a platform
            that’s feature-rich, intuitive, and adaptable, with plans to
            integrate AI to make it evolve alongside your needs.
          </p>
          <br />
          <p className="text-xl text-muted md:text-2xl">
            Creating FinX was no small feat. I built it from the ground up
            handling the frontend, backend, and database entirely on my own.
            It’s been a challenging journey, with extensive research to ensure
            the best possible user experience. Today, FinX is more than just a
            tool for me, It’s a platform designed to give everyone effortless
            control over their financial life.
          </p>
          <br />
          <p className="text-xl text-muted md:text-2xl">
            Our roadmap is brigning with exciting features, and I’d love for you
            to join us on this journey. Sign up for our newsletter to stay
            updated on new releases and help shape the future of FinX.
          </p>
        </div>
        <div className="flex justify-end">
          <RiDoubleQuotesR className="md:text-6xl text-2xl  flex justify-end" />
        </div>
        <div className="flex justify-end pr-4 items-center md:mt-2 mb-1">
          <Avatar className="border-2 rounded-full border-blue-700">
            <AvatarImage src="https://res.cloudinary.com/dxu0mzb32/image/upload/c_pad,b_gen_fill,ar_1:1/v1745498789/IMG_3570_k7dxds.jpg" />
            <AvatarFallback>Efaz</AvatarFallback>
          </Avatar>
          <div className="ml-4">
            <a
              href="https://linkedin.com/in/wasifur-rahman-efaz"
              className="md:text-lg text-base font-bold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wasifur Rahman Efaz
            </a>
            <p className="md:text-sm text-xs text-neutral-400">
              Founder & Developer of FinX
            </p>
          </div>
        </div>

        <section className="relative overflow-hidden mt-8 space-y-4 rounded-3xl border border-white/8 bg-card/30">
          {/* Decorative background */}

          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

          <div className="relative p-6 md:p-8 lg:p-10">
            <div className="mb-8 max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1 text-xs font-medium text-violet-300">
                <Code2 className="h-3.5 w-3.5" />
                Behind FinX
              </div>

              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Curious about what powers FinX?
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-foreground md:text-base">
                Explore the engineering behind the platform or get to know the
                developer who designed and built it from the ground up.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Project card */}

              <div className="group rounded-2xl border border-white/[0.07] bg-black/40 p-5 transition duration-300 hover:border-violet-500/30 hover:bg-black/60 md:p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/20 bg-violet-500/10 text-violet-400">
                  <Layers3 className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold">How FinX is built</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Explore the architecture, technology, features, and
                  engineering decisions behind FinX.
                </p>

                <Button className="mt-6 flex bg-violet-600 hover:bg-violet-500">
                  <Link
                    href="https://portfolio-seven-pi-h7lz302cb5.vercel.app/work/FinX"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Explore FinX
                  </Link>
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Engineer card */}

              <div className="group rounded-2xl border border-white/[0.07] bg-black/40 p-5 transition duration-300 hover:border-cyan-500/30 hover:bg-black/60 md:p-6">
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-cyan-400">
                  <ExternalLink className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-semibold">Meet the engineer</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Learn more about Wasifur Rahman Efaz, the engineer and
                  developer behind FinX.
                </p>

                <Button
                  variant="outline"
                  className="mt-6 border-white/10 flex bg-transparent hover:bg-white/5"
                >
                  <a
                    href="https://linkedin.com/in/wasifur-rahman-efaz"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View LinkedIn
                  </a>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default page;
