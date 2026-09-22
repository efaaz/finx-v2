import React from "react";
import { LampContainer } from "../ui/lamp";
import { motion } from "motion/react";

function QuoteSection() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-linear-to-br from-slate-300 to-slate-500 bg-clip-text px-1 py-4 text-center text-4xl font-medium tracking-tight text-transparent md:px-12 md:text-7xl"
      >
        Do not save what is left after spending, but spend what is left after
        saving.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{
          delay: 0.8,
          duration: 0.5,
        }}
        className="mt-9 text-right text-xl text-slate-500"
      >
        — Warren Buffett
      </motion.p>
    </LampContainer>
  );
}

export default QuoteSection;