import { useId } from "react";

type GridProps = {
  pattern?: number[][];
  size?: number;
};

type GridPatternProps = {
  width?: number;
  height?: number;
  x?: string;
  y?: string;
  squares?: number[][];
  className?: string;
};

const DEFAULT_PATTERN: number[][] = [
  [7, 1],
  [10, 3],
  [8, 5],
  [11, 2],
  [9, 6],
];

export default function FeaturesSection() {
  return (
    <>
      <div className="sm:px-8 px-6 font-heading h-full mt-8 md:mt-16 border-neutral-800">
        <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-white">
          Packed with thousands of features
        </h4>

        <p className="text-sm font-sans lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          Our platform is engineered to give you unrivaled control over your
          finances. Enjoy a seamless blend of cutting-edge technology and
          intuitive design that adapts to your financial needs.
        </p>
      </div>

      <div className="py-20 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto">
          {grid.map((feature) => (
            <div
              key={feature.title}
              className="relative bg-linear-to-b dark:from-neutral-900 from-neutral-100 dark:to-neutral-950 to-white p-6 rounded-3xl overflow-hidden"
            >
              <Grid size={20} />

              <p className="text-base font-sans font-bold text-neutral-800 dark:text-white relative z-20">
                {feature.title}
              </p>

              <p className="text-neutral-600 font-sans dark:text-neutral-400 mt-4 text-base font-normal relative z-20">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const grid = [
  {
    title: "Real-Time Expense Tracking",
    description:
      "Monitor every transaction in real time with interactive charts. Gain a clear picture of where your money is going daily, weekly, or monthly.",
  },
  {
    title: "Export & AI-Powered Reports",
    description:
      "Generate detailed financial reports with a single click. Export transactions as Excel files and get AI-driven summaries for smarter decision-making.",
  },
  {
    title: "Smart Notifications & Alerts",
    description:
      "Get instant alerts for unusual spending, bill reminders, and savings milestones. Stay on top of your finances with proactive insights and timely updates.",
  },
  {
    title: "Real-Time Multi-Currency Support",
    description:
      "Effortlessly manage transactions in multiple currencies with real-time exchange rate updates. Perfect for travelers, freelancers, and global businesses.",
  },
  {
    title: "Mobile-Optimized Dashboard",
    description:
      "Access your financial insights anytime, anywhere with our fully responsive dashboard. Enjoy a smooth, mobile-first experience that keeps you updated on the go.",
  },
  {
    title: "Detailed Spending Reports",
    description:
      "Generate in-depth, downloadable reports with just one click. These reports provide clear insights into your spending patterns, helping you make smarter financial decisions.",
  },
];

export function Grid({ pattern, size }: GridProps) {
  const p = pattern ?? DEFAULT_PATTERN;

  return (
    <div className="pointer-events-none absolute left-1/2 top-0 -ml-20 -mt-2 h-full w-full mask-[linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-linear-to-r mask-[radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
}

export function GridPattern({
  width = 20,
  height = 20,
  x = "0",
  y = "0",
  squares,
  ...props
}: GridPatternProps) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
          />
        </pattern>
      </defs>

      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />

      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([squareX, squareY], idx) => (
            <rect
              strokeWidth={0}
              key={`${squareX}-${squareY}-${idx}`}
              width={width + 1}
              height={height + 1}
              x={squareX * width}
              y={squareY * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}