import { cn } from "./cn";

/** CSS marquee. Content is duplicated so the loop is seamless; pauses on hover. */
export function Marquee({
  children,
  vertical = false,
  duration = 40,
  reverse = false,
  className,
  trackClassName,
}: {
  children: React.ReactNode;
  vertical?: boolean;
  duration?: number;
  reverse?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  return (
    <div className={cn("group/mq overflow-hidden", className)}>
      <div
        className={cn(
          "flex group-hover/mq:[animation-play-state:paused]",
          vertical ? "w-full flex-col animate-marquee-y" : "w-max animate-marquee",
          trackClassName,
        )}
        style={{ ["--marquee-duration" as string]: `${duration}s`, animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className={cn("flex shrink-0", vertical ? "flex-col" : "")}>{children}</div>
        <div aria-hidden className={cn("flex shrink-0", vertical ? "flex-col" : "")}>
          {children}
        </div>
      </div>
    </div>
  );
}
