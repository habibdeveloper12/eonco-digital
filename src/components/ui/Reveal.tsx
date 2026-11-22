type Props = React.HTMLAttributes<HTMLElement> & {
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article" | "section";
  /** "scroll" (default) animates when scrolled into view, "load" on page load. */
  on?: "scroll" | "load";
};

/**
 * Fade-and-rise reveal. Plain server-rendered markup; the GSAP runtime
 * (components/motion/MotionRuntime) animates it. Skipped for reduced motion.
 */
export function Reveal({ delay = 0, y, as: Tag = "div", on = "scroll", children, style, ...rest }: Props) {
  // "load" runs as a CSS animation (globals.css) so above-the-fold content never waits for JS.
  const loadStyle = on === "load" ? ({ "--d": `${delay}s`, ...(y !== undefined && { "--y": `${y}px` }) } as React.CSSProperties) : undefined;
  return (
    <Tag data-reveal={on === "load" ? "load" : ""} data-delay={delay || undefined} data-y={y} style={{ ...loadStyle, ...style }} {...rest}>
      {children}
    </Tag>
  );
}
