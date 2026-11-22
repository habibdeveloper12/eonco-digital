import { cn } from "../ui/cn";

type Palette = readonly string[]; // [bg, accent, ink]

/**
 * Generated website preview. Used instead of stock imagery for project
 * thumbnails until real screenshots are added (see README).
 */
export function SiteMock({ palette, headline, variant = 0, className, chrome = true }: { palette: Palette; headline: string; variant?: number; className?: string; chrome?: boolean }) {
  const [bg, accent, ink] = palette;
  const v = variant % 3;
  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)} style={{ background: bg, color: ink }}>
      {chrome && (
        <div className="flex h-[7%] min-h-[14px] items-center justify-between px-[5%]" style={{ borderBottom: `1px solid ${ink}14` }}>
          <div className="h-[34%] w-[12%] rounded-sm" style={{ background: accent }} />
          <div className="flex w-[40%] justify-end gap-[6%]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[3px] w-[16%] rounded-full" style={{ background: `${ink}55` }} />
            ))}
          </div>
        </div>
      )}
      <div className={cn("flex h-[93%] gap-[5%] px-[6%] py-[7%]", v === 1 && "flex-col items-center text-center", v === 2 && "flex-row-reverse")}>
        <div className={cn("flex flex-col justify-center", v === 1 ? "w-[80%] items-center" : "w-[48%]")}>
          <div className="mb-[5%] h-[6px] w-[30%] rounded-full" style={{ background: accent }} />
          <div className="font-display font-bold leading-[1.02] [font-size:clamp(9px,2.2cqw+4px,34px)]" style={{ color: ink }}>
            {headline}
          </div>
          <div className="mt-[6%] space-y-[5px]">
            <div className="h-[4px] w-[90%] rounded-full" style={{ background: `${ink}30` }} />
            <div className="h-[4px] w-[70%] rounded-full" style={{ background: `${ink}30` }} />
          </div>
          <div className="mt-[8%] flex gap-2">
            <div className="h-[clamp(10px,3cqw,26px)] w-[clamp(36px,12cqw,110px)] rounded-full" style={{ background: accent }} />
            <div className="h-[clamp(10px,3cqw,26px)] w-[clamp(30px,9cqw,80px)] rounded-full border" style={{ borderColor: `${ink}40` }} />
          </div>
        </div>
        <div className={cn("relative", v === 1 ? "mt-[4%] h-[38%] w-full" : "w-[47%]")}>
          <div
            className="absolute inset-0 rounded-[8px]"
            style={{ background: `radial-gradient(120% 90% at 70% 20%, ${accent}cc, ${accent}22 55%, transparent 70%), linear-gradient(140deg, ${ink}12, ${ink}05)` }}
          />
          <div className="absolute bottom-[10%] left-[8%] h-[30%] w-[40%] rounded-[6px] shadow-lg" style={{ background: bg, border: `1px solid ${ink}18` }}>
            <div className="m-[10%] h-[18%] w-[50%] rounded-full" style={{ background: accent }} />
            <div className="mx-[10%] h-[8%] w-[70%] rounded-full" style={{ background: `${ink}30` }} />
          </div>
          <div className="absolute right-[10%] top-[12%] size-[22%] rounded-full" style={{ background: `${accent}`, opacity: 0.85 }} />
        </div>
      </div>
    </div>
  );
}

/** Browser window frame (traffic lights) around a SiteMock. */
export function BrowserFrame({ children, className, dark = true }: { children: React.ReactNode; className?: string; dark?: boolean }) {
  return (
    <div className={cn("overflow-hidden rounded-[14px] shadow-[0_20px_60px_rgba(0,23,41,0.25)] [container-type:inline-size]", dark ? "bg-navy" : "bg-white", className)}>
      <div className={cn("flex h-[28px] items-center gap-[6px] px-3", dark ? "bg-navy-3" : "bg-cloud")}>
        <span className="size-2 rounded-full bg-[#ff5f57]" />
        <span className="size-2 rounded-full bg-[#ffbd2e]" />
        <span className="size-2 rounded-full bg-[#28c840]" />
      </div>
      <div className="aspect-[16/10.3]">{children}</div>
    </div>
  );
}

/** Laptop device mockup. */
export function Laptop({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("relative mx-auto w-full [container-type:inline-size]", className)}>
      <div className="relative mx-auto w-[84%] rounded-t-[14px] border-[6px] border-b-[10px] border-[#1d1f24] bg-[#1d1f24] shadow-[0_30px_60px_rgba(0,0,0,0.35)]">
        <div className="aspect-[16/10] overflow-hidden rounded-[4px] bg-black">{children}</div>
      </div>
      <div className="relative mx-auto h-[14px] w-full rounded-b-[14px] bg-gradient-to-b from-[#d7d9de] to-[#9da1a8]">
        <div className="mx-auto h-[5px] w-[14%] rounded-b-[6px] bg-[#8b8f96]" />
      </div>
    </div>
  );
}
