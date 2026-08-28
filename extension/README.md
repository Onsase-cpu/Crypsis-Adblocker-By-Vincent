# Crypsis Chrome Extension

Crypsis uses the browser's Manifest V3 network-rule engine for packaged filtering and stores its settings locally in the browser. It includes a clear per-site pause control, cosmetic cleanup, custom third-party hostname rules, and a full settings page.

## Build and load

From the Crypsis project root, run:

```bash
python3 tools/compile_filters.py
node tools/package-extension.mjs
```

Open `chrome://extensions`, enable **Developer mode**, select **Load unpacked**, and choose `release/crypsis-extension`. The packaging script also produces `release/crypsis-chrome-extension.zip`.

The starter list is intentionally compact. Add exact hostnames in Settings when a site uses a tracker not included by default. Use **Pause on site** when a website has a legitimate resource that its layout requires.
