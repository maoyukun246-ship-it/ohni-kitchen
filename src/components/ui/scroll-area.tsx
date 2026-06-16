import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import {
  type ComponentPropsWithoutRef,
  type ElementRef,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

const ScrollArea = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, onWheel, ...props }, ref) => {
  const rootRef = useRef<ElementRef<typeof ScrollAreaPrimitive.Root>>(null);

  useImperativeHandle(ref, () => rootRef.current as ElementRef<typeof ScrollAreaPrimitive.Root>);

  return (
    <ScrollAreaPrimitive.Root
      ref={rootRef}
      className={cn("relative overflow-hidden", className)}
      onWheel={(event) => {
        onWheel?.(event);
        if (event.defaultPrevented || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) {
          return;
        }

        const viewport = rootRef.current?.querySelector<HTMLElement>("[data-radix-scroll-area-viewport]");
        if (!viewport) {
          return;
        }

        viewport.scrollTop += event.deltaY;
        event.preventDefault();
      }}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
});
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = forwardRef<
  ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none rounded-full bg-white/25 p-1 transition-colors",
      orientation === "vertical" && "h-full w-3 border-l border-l-transparent",
      orientation === "horizontal" && "h-3 flex-col border-t border-t-transparent",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-[#c98752]/55" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
