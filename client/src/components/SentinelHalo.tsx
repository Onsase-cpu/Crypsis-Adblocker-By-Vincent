/** Ember Sentinel dashboard motif: a concise protection indicator with physical depth and no decorative excess. */
import { ShieldCheck, ShieldOff } from "lucide-react";

type SentinelHaloProps = { active: boolean; compact?: boolean };

export default function SentinelHalo({ active, compact = false }: SentinelHaloProps) {
  return (
    <div className={`sentinel-halo ${active ? "sentinel-halo--active" : "sentinel-halo--muted"} ${compact ? "sentinel-halo--compact" : ""}`} aria-label={active ? "Protection active" : "Protection paused"}>
      <div className="sentinel-halo__core">{active ? <ShieldCheck size={compact ? 20 : 32} strokeWidth={1.8} /> : <ShieldOff size={compact ? 20 : 32} strokeWidth={1.8} />}</div>
    </div>
  );
}
