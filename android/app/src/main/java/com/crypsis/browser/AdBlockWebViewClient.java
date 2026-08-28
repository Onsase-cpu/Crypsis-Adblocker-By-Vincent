package com.crypsis.browser;

import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;

public final class AdBlockWebViewClient extends WebViewClient {
    private final MainActivity activity; private final RuleStore rules;
    public AdBlockWebViewClient(MainActivity activity, RuleStore rules) { this.activity = activity; this.rules = rules; }
    @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { view.loadUrl(request.getUrl().toString()); return true; }
    @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) { if (activity.isFilteringEnabled() && rules.shouldBlock(request.getUrl().toString())) { activity.runOnUiThread(activity::registerBlockedRequest); return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream(new byte[0])); } return super.shouldInterceptRequest(view, request); }
    @Override public void onPageFinished(WebView view, String url) { super.onPageFinished(view, url); activity.syncPage(url); if (activity.isFilteringEnabled() && !rules.isAllowed(rules.hostFor(url))) view.evaluateJavascript("(function(){const s=['[id^=\\\"ad-\\\"]','[id*=\\\"-ad-\\\"]','[class~=\\\"ad\\\"]','[class~=\\\"ads\\\"]','[class^=\\\"ad-\\\"]','[class*=\\\" ad-\\\"]','[data-ad]','[data-ad-slot]','ins.adsbygoogle','iframe[src*=\\\"doubleclick\\\"]','iframe[src*=\\\"googlesyndication\\\"]'];document.querySelectorAll(s.join(',')).forEach(function(e){e.style.setProperty('display','none','important');e.style.setProperty('visibility','hidden','important')})})()", null); }
}

