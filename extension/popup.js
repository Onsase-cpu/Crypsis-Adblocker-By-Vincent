const byId = (id) => document.getElementById(id);
const globalToggle = byId("globalToggle");
const siteToggle = byId("siteToggle");
let currentState = null;
function setError(message = "") { byId("errorMessage").textContent = message; }
function request(message) { return new Promise((resolve, reject) => { chrome.runtime.sendMessage(message, (response) => { if (chrome.runtime.lastError) return reject(new Error(chrome.runtime.lastError.message)); if (!response?.ok) return reject(new Error(response?.error || "Unable to update Crypsis.")); resolve(response.data); }); }); }
function render(state) { currentState = state; const active = state.enabled; document.querySelector(".popup-shell").classList.toggle("is-off", !active); globalToggle.checked = active; byId("stateIcon").textContent = active ? "ON" : "OFF"; byId("protectionStatus").textContent = active ? "Filtering active" : "Filtering paused"; byId("protectionHint").textContent = active ? "Network and cosmetic filtering are running." : "Re-enable filtering whenever you are ready."; byId("siteName").textContent = state.hostname || "Unsupported page"; byId("siteMeta").textContent = state.canControlSite ? (state.sitePaused ? "Filtering is paused here." : "Site filtering is active.") : "Open an http or https page to control this site."; byId("matchCount").textContent = String(state.matchedCount || 0); siteToggle.disabled = !state.canControlSite || !active; siteToggle.textContent = state.sitePaused ? "Resume on site" : "Pause on site"; }
async function refresh() { const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); render(await request({ type: "getState", tabId: tab?.id })); }
globalToggle.addEventListener("change", async () => { try { setError(); await request({ type: "setEnabled", enabled: globalToggle.checked }); await refresh(); } catch (error) { setError(error.message); await refresh(); } });
siteToggle.addEventListener("click", async () => { if (!currentState) return; try { setError(); await request({ type: "setSitePaused", hostname: currentState.hostname, paused: !currentState.sitePaused }); const [tab] = await chrome.tabs.query({ active: true, currentWindow: true }); if (tab?.id) await chrome.tabs.reload(tab.id); await refresh(); } catch (error) { setError(error.message); } });
byId("openOptions").addEventListener("click", () => chrome.runtime.openOptionsPage());
refresh().catch((error) => setError(error.message));

