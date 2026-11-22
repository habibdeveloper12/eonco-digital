import {
  AppWindow, ArrowRightLeft, Award, Blocks, Bot, Briefcase, Building2, Cloud, Code2, Database, Globe,
  GraduationCap, Handshake, HardHat, Headset, HeartPulse, Layers, LayoutTemplate, LifeBuoy, Megaphone,
  Newspaper, Palette, PenTool, Plug, Rocket, Send, ShoppingBag, TrendingUp, Workflow, type LucideProps,
} from "lucide-react";

const map = {
  AppWindow, ArrowRightLeft, Award, Blocks, Bot, Briefcase, Building2, Cloud, Code2, Database, Globe,
  GraduationCap, Handshake, HardHat, Headset, HeartPulse, Layers, LayoutTemplate, LifeBuoy, Megaphone,
  Newspaper, Palette, PenTool, Plug, Rocket, Send, ShoppingBag, TrendingUp, Workflow,
};

export type IconName = keyof typeof map;

export function Icon({ name, ...props }: { name: string } & LucideProps) {
  const C = map[name as IconName] ?? Rocket;
  return <C aria-hidden {...props} />;
}
