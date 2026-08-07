import { cva } from "class-variance-authority";

// Container luar berfungsi sebagai bingkai input tunggal
export const searchContainerVariants = cva(
  "relative w-full flex items-center bg-background border border-input rounded-xl transition-all focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent overflow-hidden",
  {
    variants: {
      variant: {
        mobile: "h-10",
        desktop: "h-10 sm:h-11",
      },
    },
    defaultVariants: {
      variant: "desktop",
    },
  },
);

// Input transparan tanpa border individual, dengan padding kanan aman
export const inputVariants = cva(
  "w-full h-full bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm font-sans placeholder:text-muted-foreground/70 pl-3.5 pr-20 sm:pr-24",
  {
    variants: {
      variant: {
        mobile: "text-xs sm:text-sm",
        desktop: "text-sm",
      },
    },
    defaultVariants: {
      variant: "desktop",
    },
  },
);

// Tombol pencarian melayang di dalam sisi kanan input
export const searchButtonVariants = cva(
  "cursor-pointer text-primary-foreground hover:bg-primary/90 bg-primary shrink-0 flex items-center justify-center transition-all duration-200 active:scale-95 shadow-sm rounded-lg",
  {
    variants: {
      variant: {
        mobile: "h-7 w-7",
        desktop: "h-7 w-7 sm:h-8 sm:w-9",
      },
    },
    defaultVariants: {
      variant: "desktop",
    },
  },
);
