import { BarChart3, Cable, Database, FileCode2, Globe, LayoutGrid, Mail, MousePointer2, Palette, PenTool, Plug, Send, Share2, Star, Users, Workflow, ArrowRightLeft, MonitorSmartphone } from "lucide-react";

const sets = {
  hub: { center: Share2, chips: [Users, BarChart3, Mail, Workflow, Star] },
  plug: { center: Plug, chips: [Database, Cable, Workflow, BarChart3, Mail] },
  migrate: { center: ArrowRightLeft, chips: [Database, FileCode2, Users, Workflow, LayoutGrid] },
  web: { center: Globe, chips: [MonitorSmartphone, LayoutGrid, MousePointer2, BarChart3, Star] },
  mail: { center: Send, chips: [Mail, Users, BarChart3, Star, Workflow] },
  design: { center: PenTool, chips: [Palette, LayoutGrid, MousePointer2, MonitorSmartphone, Star] },
} as const;

const pos = [
  ["52%", "38%"], ["84%", "30%"], ["88%", "62%"], ["56%", "70%"], ["72%", "18%"],
];

/** Illustration for the stacked service cards: pedestal + central tile + orbiting chips. */
export function ServiceArt({ art }: { art: keyof typeof sets }) {
  const s = sets[art];
  const Center = s.center;
  return (
    <div className="absolute inset-0 overflow-hidden bg-[radial-gradient(90%_70%_at_60%_80%,#fff_0%,#fbeee9_55%,#f6e3dd_100%)]">
      <div className="absolute bottom-[-6%] left-[70%] h-[42%] w-[62%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,#fff,#f4dcd5)]" />
      <div className="absolute bottom-[8%] left-[70%] h-[24%] w-[38%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,#fff,#f1d2ca)]" />
      <div className="absolute bottom-[24%] left-[70%] grid size-[22%] min-w-[64px] -translate-x-1/2 place-items-center rounded-[22%] bg-gradient-to-br from-[#ff6b7a] to-brand text-white aspect-square">
        <Center className="size-1/2" strokeWidth={2.2} />
      </div>
      {s.chips.map((C, i) => (
        <div
          key={i}
          className="absolute grid size-[11%] min-w-[26px] place-items-center rounded-[28%] bg-white text-brand shadow-[0_8px_20px_rgba(0,23,41,0.08)] aspect-square"
          style={{ left: pos[i][0], top: pos[i][1], animationDelay: `${i * 0.7}s` }}
        >
          <C className="size-1/2" />
        </div>
      ))}
    </div>
  );
}
export type ServiceArtKey = keyof typeof sets;
