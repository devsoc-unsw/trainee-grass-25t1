import { Tooltip } from "@/components/ui/Tooltip";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef, ComponentRef } from "react";

export type NavbarButtonProps = {
  tooltipText?: string;
} & ComponentPropsWithoutRef<"button">;

const GameButton = forwardRef<ComponentRef<"button">, NavbarButtonProps>(
  ({ tooltipText, ...props }, ref) => {
    return tooltipText ? (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger asChild>
            <button
              ref={ref}
              className="bg-background flex gap-2 border-4 border-foreground drop-shadow-[4px_4px_0_#000] hover:drop-shadow-[0_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 p-2 h-14 items-center justify-center cursor-pointer outline-none"
              {...props}
            >
              {props.children}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" sideOffset={8}>
            <p className="bg-background py-1 px-2 rounded-sm max-w-[96px] text-ellipsis relative after:w-4 after:h-4 after:absolute after:bg-background after:-top-1 after:left-1/2 after:-translate-x-1/2 after:rotate-45 after:-z-10">
              {tooltipText}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ) : (
      <button
        ref={ref}
        className="bg-background flex gap-2 border-4 border-foreground drop-shadow-[4px_4px_0_#000] hover:drop-shadow-[0_0_0_#000] hover:translate-x-1 hover:translate-y-1 transition-all duration-150 p-2 cursor-pointer outline-none"
        {...props}
      >
        {props.children}
      </button>
    );
  }
);

GameButton.displayName = "GameButton";
export default GameButton;
