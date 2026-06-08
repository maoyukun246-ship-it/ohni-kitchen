import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[24px] text-sm font-black transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#ffcf82]/70 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#f0a24a] text-white shadow-[0_12px_28px_rgba(180,83,28,.28),inset_0_2px_0_rgba(255,255,255,.38)] hover:bg-[#e8953e]",
        glass:
          "border border-white/55 bg-white/45 text-[#8c522f] shadow-[inset_0_1px_0_rgba(255,255,255,.75),0_12px_24px_rgba(116,65,30,.13)] hover:bg-white/65",
      },
      size: {
        default: "h-12 px-5 py-3",
        lg: "h-14 px-7 text-lg",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
