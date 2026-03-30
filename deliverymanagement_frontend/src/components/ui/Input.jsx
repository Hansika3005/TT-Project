import { forwardRef } from "react";
import { cn } from "../../utils/cn";

const Input = forwardRef(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full gap-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-border/40 bg-background/50 px-3 py-2 text-sm ring-offset-background",
            "placeholder:text-muted-foreground/50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary/50",
            "disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
            error && "border-destructive/50 focus-visible:ring-destructive/30",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-[11px] font-semibold text-destructive mt-1 uppercase tracking-wider">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
