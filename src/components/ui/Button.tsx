import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "./cn";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline" | "dark" | "light";
  size?: "md" | "sm";
  className?: string;
  external?: boolean;
};

/**
 * Pill button. On hover the label slides left and a white arrow disc
 * rolls in from the right edge, matching the reference interaction.
 */
export function Button({ href, children, variant = "primary", size = "md", className, external }: Props) {
  const cls = cn(
    "group/btn relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-[99px] font-medium transition-[background-color,color,box-shadow] duration-300",
    size === "md" ? "h-[55px] px-[45px] text-[18px]" : "h-[44px] px-[28px] text-[15px]",
    variant === "primary" && "bg-brand text-white hover:bg-brand-600",
    variant === "outline" && "border-[1.6px] border-brand text-brand hover:bg-brand hover:text-white",
    variant === "dark" && "bg-navy text-white hover:bg-navy-2",
    variant === "light" && "bg-white text-navy hover:bg-cream-3",
    className,
  );
  const inner = (
    <>
      <span className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/btn:-translate-x-[14px]">
        {children}
      </span>
      <span
        aria-hidden
        className={cn(
          "absolute right-[10px] top-1/2 z-10 grid -translate-y-1/2 translate-x-[60px] scale-50 place-items-center rounded-full opacity-0 transition-[transform,opacity] duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover/btn:translate-x-0 group-hover/btn:scale-100 group-hover/btn:opacity-100",
          size === "md" ? "size-[36px]" : "size-[28px]",
          variant === "light" ? "bg-brand text-white" : "bg-white text-navy",
        )}
      >
        <ArrowRight className={size === "md" ? "size-[18px]" : "size-[14px]"} />
      </span>
    </>
  );
  if (external)
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
