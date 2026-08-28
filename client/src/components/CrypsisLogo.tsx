/** Ember Sentinel brand primitive: the generated split-shield mark remains large, tactile, and unbranded by third parties. */
type CrypsisLogoProps = { compact?: boolean; inverse?: boolean };

export default function CrypsisLogo({ compact = false, inverse = false }: CrypsisLogoProps) {
  return (
    <div className={`crypsis-logo ${compact ? "crypsis-logo--compact" : ""} ${inverse ? "crypsis-logo--inverse" : ""}`}>
      <img src="/manus-storage/crypsis-shield-mark_00967499.png" alt="Crypsis split shield" />
      {!compact && <span className="crypsis-logo__wordmark"><b>Cryp</b><i>sis</i><em aria-hidden="true" /></span>}
    </div>
  );
}
