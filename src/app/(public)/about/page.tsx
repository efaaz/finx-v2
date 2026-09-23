import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RiDoubleQuotesL, RiDoubleQuotesR } from "react-icons/ri";

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
      </div>
    </>
  );
}

export default page;
