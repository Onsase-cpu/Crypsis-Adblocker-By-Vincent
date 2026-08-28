package com.crypsis.browser;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Collections;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public final class RuleStore {
    private static final String PREFS = "crypsis_prefs";
    private static final String ALLOWED_SITES = "allowed_sites";
    private final Context context;
    private final Set<String> blockedHosts = new HashSet<>();
    public RuleStore(Context context) { this.context = context.getApplicationContext(); loadBundledRules(); }
    private void loadBundledRules() { try (BufferedReader reader = new BufferedReader(new InputStreamReader(context.getAssets().open("blocklist.txt")))) { String line; while ((line = reader.readLine()) != null) { String domain = line.trim().toLowerCase(Locale.US); if (!domain.isEmpty() && !domain.startsWith("#")) blockedHosts.add(domain); } } catch (Exception ignored) { } }
    public boolean shouldBlock(String address) { String host = hostFor(address); if (host.isEmpty() || isAllowed(host)) return false; for (String blocked : blockedHosts) if (host.equals(blocked) || host.endsWith("." + blocked)) return true; return false; }
    public boolean isAllowed(String host) { return allowedSites().contains(normalizeHost(host)); }
    public void toggleAllowed(String host) { String normalized = normalizeHost(host); if (normalized.isEmpty()) return; Set<String> next = new HashSet<>(allowedSites()); if (next.contains(normalized)) next.remove(normalized); else next.add(normalized); preferences().edit().putStringSet(ALLOWED_SITES, next).apply(); }
    public String hostFor(String address) { try { return normalizeHost(Uri.parse(address).getHost()); } catch (Exception error) { return ""; } }
    private Set<String> allowedSites() { Set<String> stored = preferences().getStringSet(ALLOWED_SITES, Collections.emptySet()); return new HashSet<>(stored == null ? Collections.emptySet() : stored); }
    private SharedPreferences preferences() { return context.getSharedPreferences(PREFS, Context.MODE_PRIVATE); }
    private String normalizeHost(String value) { if (value == null) return ""; return value.toLowerCase(Locale.US).replaceFirst("^www\\.", "").trim(); }
}
