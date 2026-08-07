import { cva } from "class-variance-authority";

export const searchContainerVariants = cva(
  "w-full transition-all flex items-center",
  {
    variants: {
      variant: {
        mobile: "relative w-full",
        desktop:
          "border border-input rounded-md overflow-hidden bg-background focus-within:ring-1 focus-within:ring-ring",
      },
    },
    defaultVariants: {
      variant: "desktop",
    },
  },
);

export const inputVariants = cva("w-full text-sm bg-transparent", {
  variants: {
    variant: {
      mobile:
        "h-10 border-input bg-background rounded-md pl-3 pr-16 focus-visible:ring-1 focus-visible:ring-ring",
      desktop:
        "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none h-10 px-4 pr-8",
    },
  },
  defaultVariants: {
    variant: "desktop",
  },
});

export const searchButtonVariants = cva(
  "cursor-pointer text-primary-foreground hover:bg-primary/90 bg-primary shrink-0 flex items-center justify-center transition-colors",
  {
    variants: {
      variant: {
        mobile: "absolute right-1 h-8 w-8 rounded-md",
        desktop: "rounded-lg h-10 w-12 border",
      },
    },
    defaultVariants: {
      variant: "desktop",
    },
  },
);
