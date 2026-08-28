package com.crypsis.browser;

import android.app.Activity;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import java.util.Locale;

/** Ember Sentinel mobile UI: graphite surfaces, Signal Red controls, orange live status. */
public final class MainActivity extends Activity {
    private static final int INK = Color.rgb(25, 24, 23), SHEET = Color.rgb(41, 37, 35), PAPER = Color.rgb(255, 247, 238), MUTED = Color.rgb(196, 185, 177), RED = Color.rgb(229, 59, 44), ORANGE = Color.rgb(245, 138, 42);
    private static final String PREFS = "crypsis_prefs", FILTERING_ENABLED = "filtering_enabled";
    private WebView webView; private EditText addressInput; private TextView hostLabel, statusLabel, blockedLabel; private Button filterButton, exceptionButton; private RuleStore ruleStore; private boolean filteringEnabled; private int blockedCount;

    @Override public void onCreate(Bundle savedInstanceState) { super.onCreate(savedInstanceState); ruleStore = new RuleStore(this); filteringEnabled = getSharedPreferences(PREFS, MODE_PRIVATE).getBoolean(FILTERING_ENABLED, true); setContentView(buildScreen()); configureWebView(); webView.loadUrl("https://example.com"); renderState(); }

    private View buildScreen() {
        ScrollView scroll = new ScrollView(this); scroll.setFillViewport(true); scroll.setBackgroundColor(INK); LinearLayout root = column(); root.setPadding(dp(18), dp(20), dp(18), dp(24)); scroll.addView(root);
        LinearLayout top = row(); top.setGravity(Gravity.CENTER_VERTICAL); TextView mark = text("C", 24, PAPER, true); mark.setGravity(Gravity.CENTER); mark.setBackground(rounded(RED, 15)); top.addView(mark, new LinearLayout.LayoutParams(dp(48), dp(48))); LinearLayout brand = column(); brand.setPadding(dp(12), 0, 0, 0); brand.addView(text("CRYPSIS", 11, ORANGE, true)); brand.addView(text("Quiet browsing, on command.", 20, PAPER, true)); top.addView(brand, new LinearLayout.LayoutParams(0, -2, 1)); root.addView(top);
        LinearLayout hero = column(); hero.setPadding(dp(20), dp(20), dp(20), dp(18)); hero.setBackground(rounded(SHEET, 25)); LinearLayout.LayoutParams heroParams = new LinearLayout.LayoutParams(-1, -2); heroParams.topMargin = dp(18); root.addView(hero, heroParams); statusLabel = text("Filtering active", 25, PAPER, true); hero.addView(statusLabel); TextView heroCopy = text("Crypsis blocks known advertising and tracker hosts inside this browser.", 13, MUTED, false); heroCopy.setPadding(0, dp(8), 0, 0); hero.addView(heroCopy); blockedLabel = text("0 requests blocked this session", 13, ORANGE, true); blockedLabel.setPadding(0, dp(10), 0, 0); hero.addView(blockedLabel); filterButton = button(""); LinearLayout.LayoutParams filterParams = new LinearLayout.LayoutParams(-1, -2); filterParams.topMargin = dp(12); hero.addView(filterButton, filterParams); filterButton.setOnClickListener(v -> toggleFiltering());
        LinearLayout addressRow = row(); addressRow.setGravity(Gravity.CENTER_VERTICAL); LinearLayout.LayoutParams rowParams = new LinearLayout.LayoutParams(-1, -2); rowParams.topMargin = dp(18); root.addView(addressRow, rowParams); addressInput = new EditText(this); addressInput.setSingleLine(true); addressInput.setHint("Search or enter address"); addressInput.setHintTextColor(Color.rgb(145, 137, 131)); addressInput.setTextColor(PAPER); addressInput.setTextSize(14); addressInput.setPadding(dp(13), 0, dp(13), 0); addressInput.setBackground(rounded(Color.rgb(52, 47, 44), 14)); addressRow.addView(addressInput, new LinearLayout.LayoutParams(0, dp(50), 1)); Button openButton = button("Open"); LinearLayout.LayoutParams openParams = new LinearLayout.LayoutParams(dp(76), dp(50)); openParams.leftMargin = dp(8); addressRow.addView(openButton, openParams); openButton.setOnClickListener(v -> openAddress()); addressInput.setOnEditorActionListener((v, actionId, event) -> { openAddress(); return true; });
        LinearLayout site = column(); site.setPadding(dp(18), dp(17), dp(18), dp(17)); site.setBackground(rounded(SHEET, 21)); LinearLayout.LayoutParams siteParams = new LinearLayout.LayoutParams(-1, -2); siteParams.topMargin = dp(14); root.addView(site, siteParams); site.addView(text("CURRENT SITE", 10, ORANGE, true)); hostLabel = text("Loading page", 16, PAPER, true); hostLabel.setPadding(0, dp(6), 0, 0); site.addView(hostLabel); exceptionButton = subtleButton(""); LinearLayout.LayoutParams exceptionParams = new LinearLayout.LayoutParams(-1, -2); exceptionParams.topMargin = dp(7); site.addView(exceptionButton, exceptionParams); exceptionButton.setOnClickListener(v -> toggleSiteException());
        TextView browserNote = text("Crypsis Browser filters pages opened here. The companion Chrome extension filters Chrome pages separately.", 12, MUTED, false); browserNote.setLineSpacing(dp(2), 1f); LinearLayout.LayoutParams noteParams = new LinearLayout.LayoutParams(-1, -2); noteParams.topMargin = dp(14); root.addView(browserNote, noteParams); webView = new WebView(this); LinearLayout.LayoutParams webParams = new LinearLayout.LayoutParams(-1, dp(580)); webParams.topMargin = dp(16); root.addView(webView, webParams); return scroll;
    }
    private void configureWebView() { WebSettings settings = webView.getSettings(); settings.setJavaScriptEnabled(true); settings.setDomStorageEnabled(true); settings.setLoadWithOverviewMode(true); settings.setUseWideViewPort(true); webView.setWebViewClient(new AdBlockWebViewClient(this, ruleStore)); }
    private void openAddress() { String input = addressInput.getText().toString().trim(); if (input.isEmpty()) return; if (!input.matches("^[a-zA-Z][a-zA-Z0-9+.-]*://.*")) input = "https://" + input; webView.loadUrl(input); }
    private void toggleFiltering() { filteringEnabled = !filteringEnabled; getSharedPreferences(PREFS, MODE_PRIVATE).edit().putBoolean(FILTERING_ENABLED, filteringEnabled).apply(); renderState(); webView.reload(); }
    private void toggleSiteException() { String host = ruleStore.hostFor(webView.getUrl()); if (host.isEmpty()) return; ruleStore.toggleAllowed(host); syncPage(webView.getUrl()); webView.reload(); }
    public boolean isFilteringEnabled() { return filteringEnabled; }
    public void registerBlockedRequest() { blockedCount += 1; renderState(); }
    public void syncPage(String url) { String host = ruleStore.hostFor(url); hostLabel.setText(host.isEmpty() ? "Unsupported page" : host); exceptionButton.setEnabled(!host.isEmpty()); exceptionButton.setText(host.isEmpty() ? "Site controls unavailable" : (ruleStore.isAllowed(host) ? "Resume filtering on this site" : "Pause filtering on this site")); addressInput.setText(url == null ? "" : url); }
    private void renderState() { statusLabel.setText(filteringEnabled ? "Filtering active" : "Filtering paused"); blockedLabel.setText(String.format(Locale.US, "%d requests blocked this session", blockedCount)); filterButton.setText(filteringEnabled ? "Pause protection" : "Enable protection"); filterButton.setBackground(rounded(filteringEnabled ? RED : Color.rgb(96, 89, 84), 14)); }
    private LinearLayout column() { LinearLayout layout = new LinearLayout(this); layout.setOrientation(LinearLayout.VERTICAL); return layout; }
    private LinearLayout row() { LinearLayout layout = new LinearLayout(this); layout.setOrientation(LinearLayout.HORIZONTAL); return layout; }
    private TextView text(String value, int size, int color, boolean bold) { TextView view = new TextView(this); view.setText(value); view.setTextSize(size); view.setTextColor(color); if (bold) view.setTypeface(android.graphics.Typeface.DEFAULT_BOLD); return view; }
    private Button button(String label) { Button view = new Button(this); view.setAllCaps(false); view.setText(label); view.setTextColor(PAPER); view.setTextSize(14); view.setTypeface(android.graphics.Typeface.DEFAULT_BOLD); view.setBackground(rounded(RED, 14)); return view; }
    private Button subtleButton(String label) { Button view = button(label); view.setTextSize(12); view.setBackground(rounded(Color.rgb(62, 56, 52), 12)); return view; }
    private GradientDrawable rounded(int color, int radius) { GradientDrawable drawable = new GradientDrawable(); drawable.setColor(color); drawable.setCornerRadius(dp(radius)); return drawable; }
    private int dp(int value) { return (int) (value * getResources().getDisplayMetrics().density); }
    @Override public void onBackPressed() { if (webView != null && webView.canGoBack()) webView.goBack(); else super.onBackPressed(); }
}
