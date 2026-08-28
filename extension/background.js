const SETTINGS_KEY = "settings";
const CUSTOM_RULE_START = 20000;
const ALLOW_RULE_START = 30000;
const MAX_CUSTOM_DOMAINS = 100;
const MAX_ALLOWED_SITES = 100;
const DEFAULT_SETTINGS = { enabled: true, cosmeticFiltering: true, customDomains: [], allowedSites: [] };
const BLOCKABLE_RESOURCE_TYPES = ["main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", "webtransport", "webbundle", "other"];

function normalizeDomain(value) {
  const candidate = String(value || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  return /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(candidate) ? candidate : null;
}
function normalizeSettings(raw = {}) {
  const clean = (values, maximum) => Array.from(new Set((values || []).map(normalizeDomain).filter(Boolean))).slice(0, maximum);
  return { enabled: raw.enabled !== false, cosmeticFiltering: raw.cosmeticFiltering !== false, customDomains: clean(raw.customDomains, MAX_CUSTOM_DOMAINS), allowedSites: clean(raw.allowedSites, MAX_ALLOWED_SITES) };
}
async function getSettings() { const stored = await chrome.storage.local.get(SETTINGS_KEY); return normalizeSettings({ ...DEFAULT_SETTINGS, ...(stored[SETTINGS_KEY] || {}) }); }
async function saveSettings(next) { const settings = normalizeSettings(next); await chrome.storage.local.set({ [SETTINGS_KEY]: settings }); await syncDynamicRules(settings); return settings; }
function customRule(domain, index) { return { id: CUSTOM_RULE_START + index, priority: 1, action: { type: "block" }, condition: { urlFilter: `||${domain}^`, resourceTypes: BLOCKABLE_RESOURCE_TYPES.filter((type) => type !== "main_frame"), domainType: "thirdParty" } }; }
function allowRule(domain, index) { return { id: ALLOW_RULE_START + index, priority: 100, action: { type: "allow" }, condition: { initiatorDomains: [domain], resourceTypes: BLOCKABLE_RESOURCE_TYPES } }; }
async function syncDynamicRules(settings) {
  const current = await chrome.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = current.filter((rule) => rule.id >= CUSTOM_RULE_START && rule.id < ALLOW_RULE_START + MAX_ALLOWED_SITES + 1).map((rule) => rule.id);
  await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules: settings.enabled ? [...settings.customDomains.map(customRule), ...settings.allowedSites.map(allowRule)] : [] });
}
async function setCoreRuleset(enabled) { const active = await chrome.declarativeNetRequest.getEnabledRulesets(); const on = active.includes("core"); if (enabled && !on) await chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: ["core"] }); if (!enabled && on) await chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: ["core"] }); }
async function initialize() { const settings = await getSettings(); await chrome.storage.local.set({ [SETTINGS_KEY]: settings }); await setCoreRuleset(settings.enabled); await syncDynamicRules(settings); await chrome.action.setBadgeBackgroundColor({ color: "#E53B2C" }); await chrome.declarativeNetRequest.setExtensionActionOptions({ displayActionCountAsBadgeText: true }); }
async function getTabDetails(tabId) { const tab = await chrome.tabs.get(tabId); let hostname = ""; try { hostname = new URL(tab.url).hostname.replace(/^www\./, "").toLowerCase(); } catch { hostname = ""; } return { hostname, url: tab.url || "", title: tab.title || "" }; }
async function getState(tabId) { const settings = await getSettings(); const tab = typeof tabId === "number" ? await getTabDetails(tabId) : { hostname: "", url: "", title: "" }; let matchedCount = 0; if (typeof tabId === "number") { try { const result = await chrome.declarativeNetRequest.getMatchedRules({ tabId }); matchedCount = result.rulesMatchedInfo?.length || 0; } catch { matchedCount = 0; } } return { ...settings, ...tab, matchedCount, sitePaused: Boolean(tab.hostname && settings.allowedSites.includes(tab.hostname)), canControlSite: /^https?:\/\//.test(tab.url) }; }
async function updateEnabled(enabled) { const settings = await getSettings(); settings.enabled = Boolean(enabled); await setCoreRuleset(settings.enabled); return saveSettings(settings); }
async function updateSitePause(hostname, paused) { const domain = normalizeDomain(hostname); if (!domain) throw new Error("This page does not have a supported website address."); const settings = await getSettings(); const sites = new Set(settings.allowedSites); if (paused) sites.add(domain); else sites.delete(domain); settings.allowedSites = Array.from(sites); return saveSettings(settings); }
async function addCustomDomain(value) { const domain = normalizeDomain(value); if (!domain) throw new Error("Enter a valid hostname such as example.com."); const settings = await getSettings(); if (settings.customDomains.includes(domain)) return settings; if (settings.customDomains.length >= MAX_CUSTOM_DOMAINS) throw new Error("The custom block list is full."); settings.customDomains = [...settings.customDomains, domain]; return saveSettings(settings); }
async function removeCustomDomain(value) { const settings = await getSettings(); settings.customDomains = settings.customDomains.filter((domain) => domain !== value); return saveSettings(settings); }
async function clearAllowedSites() { const settings = await getSettings(); settings.allowedSites = []; return saveSettings(settings); }
chrome.runtime.onInstalled.addListener(() => initialize().catch((error) => console.error("Crypsis initialization failed", error)));
chrome.runtime.onStartup.addListener(() => initialize().catch((error) => console.error("Crypsis startup sync failed", error)));
chrome.storage.onChanged.addListener((changes, area) => { if (area === "local" && changes[SETTINGS_KEY]) syncDynamicRules(normalizeSettings(changes[SETTINGS_KEY].newValue || DEFAULT_SETTINGS)).catch((error) => console.error("Crypsis rule sync failed", error)); });
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => { const action = async () => { switch (message?.type) { case "getState": return getState(message.tabId); case "setEnabled": return updateEnabled(message.enabled); case "setSitePaused": return updateSitePause(message.hostname, message.paused); case "setCosmeticFiltering": { const settings = await getSettings(); settings.cosmeticFiltering = Boolean(message.enabled); return saveSettings(settings); } case "addCustomDomain": return addCustomDomain(message.domain); case "removeCustomDomain": return removeCustomDomain(message.domain); case "clearAllowedSites": return clearAllowedSites(); default: throw new Error("Unsupported Crypsis command."); } }; action().then((data) => sendResponse({ ok: true, data })).catch((error) => sendResponse({ ok: false, error: error.message || "Unable to complete this action." })); return true; });
