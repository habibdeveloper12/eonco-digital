import { Icon } from "../ui/Icon";
import { ServiceArt } from "../visuals/ServiceArt";

/** Right-hand hero visual for service pages. */
export function ServiceHeroVisual({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="relative aspect-[419/453] w-full overflow-hidden rounded-[12px] shadow-soft">
      <ServiceArt art="hub" />
      <div className="absolute left-6 top-6 flex items-center gap-3 rounded-[14px] bg-white p-3 pr-5 shadow-card">
        <span className="grid size-10 place-items-center rounded-[10px] bg-brand text-white">
          <Icon name={icon} className="size-5" />
        </span>
        <span className="font-heading text-[15px] font-medium text-navy">{label}</span>
      </div>
      <div className="absolute bottom-6 left-6 rounded-[14px] bg-navy p-4 text-white shadow-card">
        <p className="text-[12px] text-white/60">Typical go-live</p>
        <p className="font-display text-[28px] font-medium">2 to 6 weeks</p>
      </div>
    </div>
  );
}
