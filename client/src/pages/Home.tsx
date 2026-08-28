/**
 * Ember Sentinel control center: graphite command surface, Signal Red protection controls,
 * amber activity cues, tactile clay panels, and frosted visual layers. The layout is deliberately
 * asymmetric so protection state stays visible while operational controls remain readable.
 */
import CrypsisLogo from "@/components/CrypsisLogo";
import SentinelHalo from "@/components/SentinelHalo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Activity,
  ArrowDownToLine,
  Check,
  CircleHelp,
  CirclePause,
  Code2,
  FileDown,
  Globe2,
  ListFilter,
  MonitorCog,
  Plus,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

type NavItem = "Control" | "Rules" | "Setup";

const DEFAULT_DOMAINS = ["ad.doubleclick.net", "googlesyndication.com", "taboola.com", "outbrain.com"];
const STARTER_FILTER_COUNT = 126;

function validHostname(value: string) {
  return /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(value.trim().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]);
}

function normalizeHostname(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
}

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavItem>("Control");
  const [protectedMode, setProtectedMode] = useState(true);
  const [cleanupEnabled, setCleanupEnabled] = useState(true);
  const [sitePaused, setSitePaused] = useState(false);
  const [customDomain, setCustomDomain] = useState("");
  const [customDomains, setCustomDomains] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("crypsis-dashboard-controls");
    if (!stored) return;
    try {
      const state = JSON.parse(stored);
      setProtectedMode(state.protectedMode !== false);
      setCleanupEnabled(state.cleanupEnabled !== false);
      setSitePaused(Boolean(state.sitePaused));
      setCustomDomains(Array.isArray(state.customDomains) ? state.customDomains : []);
    } catch {
      localStorage.removeItem("crypsis-dashboard-controls");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("crypsis-dashboard-controls", JSON.stringify({ protectedMode, cleanupEnabled, sitePaused, customDomains }));
  }, [protectedMode, cleanupEnabled, sitePaused, customDomains]);

  const totalRules = useMemo(() => STARTER_FILTER_COUNT + customDomains.length, [customDomains]);

  function updateMaster(next: boolean) {
    setProtectedMode(next);
    toast(next ? "Protection enabled." : "Protection paused. Your page is not being filtered.");
  }

  function addDomain(event: FormEvent) {
    event.preventDefault();
    const hostname = normalizeHostname(customDomain);
    if (!validHostname(customDomain)) {
      toast.error("Enter a valid hostname, such as ads.example.com.");
      return;
    }
    if (customDomains.includes(hostname) || DEFAULT_DOMAINS.includes(hostname)) {
      toast("That hostname is already in the active filter set.");
      return;
    }
    setCustomDomains((domains) => [...domains, hostname]);
    setCustomDomain("");
    toast("Custom filter added.");
  }

  function goTo(section: NavItem) {
    setActiveNav(section);
    document.getElementById(section.toLowerCase())?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="app-surface">
      <div className="min-h-screen lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
        <aside className="border-b border-white/10 bg-[#211e1c]/80 px-5 py-5 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
          <div className="flex items-center justify-between lg:block">
            <CrypsisLogo />
            <p className="mt-1 hidden text-xs leading-5 text-[#c9bbb1] lg:block">A quiet web, kept close.</p>
            <div className="flex items-center gap-2 lg:hidden"><span className={`h-2 w-2 rounded-full ${protectedMode ? "bg-[#f58a2a] shadow-[0_0_12px_#f58a2a]" : "bg-[#91847b]"}`} /><span className="text-xs text-[#c9bbb1]">{protectedMode ? "Active" : "Paused"}</span></div>
          </div>

          <div className="mt-9 hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-4 shadow-[inset_1px_1px_0_rgba(255,255,255,0.08),0_18px_40px_rgba(0,0,0,0.25)] lg:block">
            <div className="flex items-center gap-3"><SentinelHalo active={protectedMode} compact /><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f58a2a]">Sentinel</p><p className="mt-1 font-['Space_Grotesk'] text-base font-semibold tracking-tight">{protectedMode ? "On watch" : "Standby"}</p></div></div>
            <Button onClick={() => updateMaster(!protectedMode)} className="mt-4 h-10 w-full rounded-xl bg-[#e53b2c] font-semibold text-[#fff7ee] shadow-[0_9px_20px_rgba(229,59,44,0.22)] hover:bg-[#f04a39] active:scale-[.97]">
              {protectedMode ? "Pause protection" : "Enable protection"}
            </Button>
          </div>

          <nav className="mt-5 flex gap-1 overflow-x-auto lg:mt-8 lg:flex-col" aria-label="Crypsis sections">
            {[
              { name: "Control" as NavItem, icon: MonitorCog },
              { name: "Rules" as NavItem, icon: ListFilter },
              { name: "Setup" as NavItem, icon: ArrowDownToLine },
            ].map(({ name, icon: Icon }) => (
              <button key={name} onClick={() => goTo(name)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition duration-150 ease-out active:scale-[.97] ${activeNav === name ? "bg-[#4b2c25] text-[#fff7ee] shadow-[inset_1px_1px_0_rgba(255,255,255,0.06)]" : "text-[#c9bbb1] hover:bg-white/[0.05] hover:text-[#fff7ee]"}`}>
                <Icon size={17} strokeWidth={1.7} /><span className="flex-1 text-left">{name}</span>{activeNav === name && <span className="signal-notches" aria-hidden="true"><span /><span /><span /></span>}
              </button>
            ))}
          </nav>

          <div className="mt-7 hidden border-t border-white/10 pt-5 lg:block">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f58a2a]">Local first</p>
            <div className="mt-2 flex items-start gap-2"><span className="signal-notches mt-1" aria-hidden="true"><span /><span /><span /></span><p className="text-xs leading-5 text-[#c9bbb1]">The extension keeps its rule settings in your browser. No accounts or traffic profiles.</p></div>
          </div>
        </aside>

        <main className="px-5 pb-16 pt-7 sm:px-8 lg:px-12 lg:pt-11 xl:px-16">
          <section id="control" className="mx-auto max-w-6xl scroll-mt-6">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_294px] lg:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f58a2a]">Control center / 01</p>
                <h1 className="mt-4 max-w-3xl font-['Space_Grotesk'] text-4xl font-semibold leading-[.96] tracking-[-0.075em] text-[#fff7ee] sm:text-5xl xl:text-6xl">Keep the page.<br /><span className="text-[#ffb47b]">Lose the noise.</span></h1>
                <p className="mt-5 max-w-xl text-sm leading-6 text-[#c9bbb1] sm:text-base">Crypsis gives you a clear local control point for browser filtering and a companion Android browser, without asking you to hand over a browsing profile.</p>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-5 lg:block lg:border-t-0 lg:pt-0">
                <div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${protectedMode ? "bg-[#f58a2a] shadow-[0_0_16px_#f58a2a]" : "bg-[#91847b]"}`} /><span className="text-xs font-semibold text-[#c9bbb1]">{protectedMode ? "Filtering is active" : "Filtering is paused"}</span></div>
                <p className="mt-2 text-xs leading-5 text-[#91847b] lg:mt-3">Current web dashboard controls are saved locally in this browser.</p>
              </div>
            </div>

            <div className="mt-10 grid gap-4 xl:grid-cols-[minmax(0,1.42fr)_minmax(280px,.8fr)]">
              <article className={`relative overflow-hidden rounded-[31px] border border-white/10 bg-gradient-to-br from-white/[0.09] to-white/[0.025] p-6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.08),0_28px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-8 ${protectedMode ? "" : "opacity-90"}`}>
                <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-[#f58a2a]/15 shadow-[0_0_0_24px_rgba(229,59,44,0.035),0_0_0_54px_rgba(245,138,42,0.025)]" />
                <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-5"><SentinelHalo active={protectedMode} /><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f58a2a]">Core protection</p><h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.07em] text-[#fff7ee]">{protectedMode ? "Filtering active" : "Filtering paused"}</h2><p className="mt-2 max-w-xs text-sm leading-6 text-[#c9bbb1]">{protectedMode ? "The extension rule engine is set to block its starter list plus any custom hostname filters." : "No Crypsis network rules should block requests while paused."}</p></div></div>
                  <div className="min-w-[150px] rounded-2xl border border-white/10 bg-black/15 p-4 text-right backdrop-blur-md"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c9bbb1]">Rule set</p><span className="signal-notches" aria-hidden="true"><span /><span /><span /></span></div><p className="mt-1 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.07em] text-[#fff7ee]">{totalRules}</p><p className="mt-1 text-xs text-[#f58a2a]">active hosts</p></div>
                </div>
                <div className="relative mt-7 flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold text-[#fff7ee]">Master filter</p><p className="mt-1 text-xs leading-5 text-[#c9bbb1]">Turn the packaged network filters and your custom rules on or off.</p></div><div className="flex items-center gap-3"><span className="text-xs font-semibold text-[#c9bbb1]">{protectedMode ? "On" : "Off"}</span><Switch checked={protectedMode} onCheckedChange={updateMaster} aria-label="Enable Crypsis filtering" className="data-[state=checked]:bg-[#e53b2c]" /></div></div>
              </article>

              <article className="relative min-h-[268px] overflow-hidden rounded-[30px] border border-white/10 bg-[#292523] p-6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.06),0_28px_60px_rgba(0,0,0,0.28)] sm:p-7" style={{ backgroundImage: "linear-gradient(90deg, rgba(25,24,23,.97) 0%, rgba(25,24,23,.81) 59%, rgba(25,24,23,.28) 100%), url('/manus-storage/crypsis-quiet-web_949676ea.jpg')", backgroundSize: "cover", backgroundPosition: "right center" }}>
                <div className="relative"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#f58a2a]">This page</p><h2 className="mt-3 font-['Space_Grotesk'] text-2xl font-semibold tracking-[-0.06em] text-[#fff7ee]">A clear escape hatch.</h2><p className="mt-3 max-w-[15rem] text-sm leading-6 text-[#ded0c5]">The extension popup gives every supported page its own pause control. Site exceptions are visible and reversible.</p><div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-[#fff7ee] backdrop-blur"><Globe2 size={14} className="text-[#f58a2a]" /> Per-site control</div></div>
              </article>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
              <article className="rounded-[25px] border border-white/10 bg-white/[0.045] p-6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.055),0_18px_42px_rgba(0,0,0,0.2)] backdrop-blur-xl"><div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f58a2a]">Visual cleanup</p><span className="signal-notches" aria-hidden="true"><span /><span /><span /></span></div><h2 className="mt-2 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.055em]">Hide vacant ad slots</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#c9bbb1]">Crypsis can remove common ad containers left behind by blocked requests. Turn it off when a page layout needs troubleshooting.</p></div><Switch checked={cleanupEnabled} onCheckedChange={(next) => { setCleanupEnabled(next); toast(next ? "Page cleanup enabled." : "Page cleanup disabled."); }} aria-label="Enable visual page cleanup" className="mt-1 shrink-0 data-[state=checked]:bg-[#e53b2c]" /></div></article>
              <article className="rounded-[25px] border border-white/10 bg-black/15 p-6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.04),0_18px_42px_rgba(0,0,0,0.18)] backdrop-blur-xl"><div className="flex items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#c9bbb1]">Site exception</p><h2 className="mt-2 font-['Space_Grotesk'] text-xl font-semibold tracking-[-0.055em]">Pause with intent</h2><p className="mt-2 max-w-md text-sm leading-6 text-[#91847b]">The installed extension keeps the same control for every supported page.</p></div><Switch checked={sitePaused} onCheckedChange={(next) => { setSitePaused(next); toast(next ? "Preview site exception added." : "Preview site exception removed."); }} aria-label="Toggle the preview site exception" className="mt-1 shrink-0 data-[state=checked]:bg-[#e53b2c]" /></div></article>
            </div>
          </section>

          <section id="rules" className="mx-auto mt-18 max-w-6xl scroll-mt-7 pt-18">
            <div className="console-divider" aria-hidden="true"><span className="signal-notches"><span /><span /><span /></span></div>
            <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f58a2a]">Rules / 02</p><h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-semibold tracking-[-0.07em] sm:text-4xl">Filter only what you mean to.</h2></div><p className="max-w-xl text-sm leading-6 text-[#c9bbb1]">The extension blocks starter hosts at the request level and lets you add a specific third-party hostname when you need it. You can remove every custom entry at any time.</p></div>
            <div className="mt-8 grid gap-4 xl:grid-cols-[1fr_1fr]">
              <article className="overflow-hidden rounded-[29px] border border-white/10 bg-[#292523] shadow-[inset_1px_1px_0_rgba(255,255,255,0.06),0_22px_48px_rgba(0,0,0,0.25)]" style={{ backgroundImage: "linear-gradient(120deg,rgba(41,37,35,.96),rgba(41,37,35,.76)),url('/manus-storage/crypsis-rule-lattice_2aa8f843.jpg')", backgroundSize: "cover", backgroundPosition: "right center" }}><div className="p-6 sm:p-7"><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f58a2a]">Starter layer</p><div className="mt-5 flex items-end justify-between"><div><p className="font-['Space_Grotesk'] text-5xl font-semibold tracking-[-0.09em]">{STARTER_FILTER_COUNT}</p><p className="mt-1 text-sm text-[#c9bbb1]">known ad and tracker hostnames</p></div><ShieldCheck size={32} className="mb-1 text-[#f58a2a]" /></div><div className="mt-7 flex flex-wrap gap-2">{DEFAULT_DOMAINS.map((domain) => <span key={domain} className="rounded-lg border border-white/10 bg-black/20 px-2.5 py-1.5 font-mono text-[11px] text-[#ded0c5]">{domain}</span>)}<span className="rounded-lg border border-[#f58a2a]/25 bg-[#f58a2a]/10 px-2.5 py-1.5 text-[11px] font-semibold text-[#ffcf9d]">+{STARTER_FILTER_COUNT - DEFAULT_DOMAINS.length} more</span></div></div></article>
              <article className="rounded-[29px] border border-white/10 bg-gradient-to-br from-white/[0.065] to-white/[0.018] p-6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.055),0_22px_48px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-7"><div className="flex items-start justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#f58a2a]">Your custom layer</p><h3 className="mt-3 font-['Space_Grotesk'] text-2xl font-semibold tracking-[-0.06em]">Block a hostname</h3></div><Code2 size={23} className="text-[#f58a2a]" /></div><p className="mt-3 text-sm leading-6 text-[#c9bbb1]">Use a direct host like <code className="rounded bg-black/20 px-1.5 py-0.5 text-[#ffcf9d]">ads.example.com</code>. Crypsis applies it to third-party traffic.</p><form onSubmit={addDomain} className="mt-6 flex flex-col gap-2 sm:flex-row"><Input value={customDomain} onChange={(event) => setCustomDomain(event.target.value)} placeholder="ads.example.com" aria-label="Hostname to block" className="h-11 rounded-xl border-white/10 bg-black/20 text-[#fff7ee] placeholder:text-[#91847b] focus-visible:ring-[#f58a2a]" /><Button type="submit" className="h-11 rounded-xl border border-[#f58a2a]/40 bg-[#3a2f2b] px-4 font-semibold text-[#ffcf9d] hover:bg-[#49352d] active:scale-[.97]"><Plus size={16} />Add filter</Button></form><div className="mt-5 space-y-2">{customDomains.length === 0 ? <p className="rounded-xl border border-dashed border-white/10 px-4 py-3 text-xs leading-5 text-[#91847b]">No custom hostnames yet. The default rules are already ready for the extension.</p> : customDomains.map((domain) => <div key={domain} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/15 px-3 py-2.5"><span className="min-w-0 truncate font-mono text-xs text-[#ded0c5]">{domain}</span><button onClick={() => { setCustomDomains((domains) => domains.filter((item) => item !== domain)); toast("Custom filter removed."); }} className="rounded-lg p-1 text-[#c9bbb1] transition hover:bg-[#e53b2c]/15 hover:text-[#ffb7ac]" aria-label={`Remove ${domain}`}><X size={15} /></button></div>)}</div></article>
            </div>
          </section>

          <section id="setup" className="mx-auto mt-18 max-w-6xl scroll-mt-7 pt-18">
            <div className="console-divider" aria-hidden="true"><span className="signal-notches"><span /><span /><span /></span></div>
            <div className="rounded-[33px] border border-white/10 bg-gradient-to-br from-[#3a2925]/95 via-[#282321]/92 to-[#201e1c]/95 p-6 shadow-[inset_1px_1px_0_rgba(255,255,255,0.07),0_26px_60px_rgba(0,0,0,0.28)] sm:p-9"><div className="grid gap-8 lg:grid-cols-[.95fr_1.05fr] lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f58a2a]">Setup / 03</p><h2 className="mt-4 max-w-md font-['Space_Grotesk'] text-3xl font-semibold leading-[.98] tracking-[-0.075em] sm:text-4xl">A browser extension and an Android browser, built as separate tools for the places they can protect.</h2></div><p className="text-sm leading-6 text-[#ded0c5]">Chrome uses its own browser-native rule engine. The Android app filters pages opened inside Crypsis Browser. Both products have their source, packaging notes, and local controls included in this project.</p></div>
              <div className="mt-9 grid gap-3 lg:grid-cols-[1.18fr_.82fr]"><article className="rounded-[24px] border border-white/10 bg-[#3a2925]/70 p-5 backdrop-blur"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e53b2c]/18 text-[#ffb47b]"><Globe2 size={20} /></div><div><p className="font-['Space_Grotesk'] text-lg font-semibold tracking-[-0.05em]">Chrome extension</p><p className="text-xs text-[#c9bbb1]">Manifest V3</p></div><span className="ml-auto signal-notches" aria-hidden="true"><span /><span /><span /></span></div><ol className="mt-5 space-y-3 text-sm leading-5 text-[#ded0c5]"><li className="flex gap-3"><span className="text-[#f58a2a]">01</span>Run the included release command.</li><li className="flex gap-3"><span className="text-[#f58a2a]">02</span>Open <code className="rounded bg-white/5 px-1">chrome://extensions</code>.</li><li className="flex gap-3"><span className="text-[#f58a2a]">03</span>Enable Developer mode and load the unpacked release folder.</li></ol><Button onClick={() => toast("The extension package is produced from the project source. See the delivery guide for the exact build command.")} className="mt-6 h-10 w-full rounded-xl bg-[#e53b2c] font-semibold hover:bg-[#f04a39] active:scale-[.97]"><FileDown size={16} />View extension build</Button></article>
                <article className="rounded-[24px] border border-white/10 bg-black/20 p-5 backdrop-blur"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f58a2a]/15 text-[#ffcf9d]"><Smartphone size={20} /></div><div><p className="font-['Space_Grotesk'] text-lg font-semibold tracking-[-0.05em]">Android app</p><p className="text-xs text-[#c9bbb1]">APK-ready source</p></div></div><ol className="mt-5 space-y-3 text-sm leading-5 text-[#ded0c5]"><li className="flex gap-3"><span className="text-[#f58a2a]">01</span>Prepare the Android build environment.</li><li className="flex gap-3"><span className="text-[#f58a2a]">02</span>Run <code className="rounded bg-white/5 px-1">assembleDebug</code>.</li><li className="flex gap-3"><span className="text-[#f58a2a]">03</span>Install the generated APK on Android 8 or newer.</li></ol><Button onClick={() => toast("The Android source is intentionally scoped to pages opened in Crypsis Browser. Its README contains the exact APK build steps.")} variant="outline" className="mt-6 h-10 w-full rounded-xl border-[#f58a2a]/35 bg-[#f58a2a]/10 font-semibold text-[#fff7ee] hover:bg-[#f58a2a]/20 active:scale-[.97]"><CircleHelp size={16} />View Android scope</Button></article></div>
            </div>
          </section>

          <section className="mx-auto mt-10 max-w-6xl"><div className="grid gap-4 md:grid-cols-3"><div className="flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-4"><Check size={18} className="mt-0.5 shrink-0 text-[#f58a2a]" /><p className="text-xs leading-5 text-[#c9bbb1]">No accounts or claimed live traffic analytics are needed for the included controls.</p></div><div className="flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-4"><CirclePause size={18} className="mt-0.5 shrink-0 text-[#f58a2a]" /><p className="text-xs leading-5 text-[#c9bbb1]">Every extension-managed site exception has a plain-language reverse action.</p></div><div className="flex gap-3 rounded-2xl border border-white/10 bg-black/10 p-4"><Activity size={18} className="mt-0.5 shrink-0 text-[#f58a2a]" /><p className="text-xs leading-5 text-[#c9bbb1]">The Chrome popup surfaces matched request counts during development for transparent verification.</p></div></div></section>
        </main>
      </div>
    </div>
  );
}
