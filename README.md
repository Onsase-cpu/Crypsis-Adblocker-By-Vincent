# Crypsis

Crypsis is a local-first ad-blocking product with two working delivery targets:

| Target | What it protects | Included artifact |
| --- | --- | --- |
| **Chrome extension** | Network requests and common empty ad containers in Chrome pages | `release/crypsis-chrome-extension.zip` |
| **Crypsis Browser for Android** | Known advertising/tracker hosts and common empty ad containers in pages opened inside the Android app | `release/crypsis-android-debug.apk` |

The product intentionally separates the two contexts. Chrome extensions use the browser’s Manifest V3 declarative network request engine, which evaluates packaged rules without the extension reading request content directly. Its settings are stored in the browser’s extension storage rather than a remote Crypsis service. [1] [2]

> **Scope:** The Android APK is a functional, filtered in-app browser. It does not claim to block ads in other Android apps or outside browsers. A trustworthy device-wide Android blocker requires a fully forwarding VPN or DNS tunnel and explicit operating-system consent; an incomplete local VPN can break a device’s network traffic. [3]

## Features

| Capability | Chrome extension | Android app |
| --- | --- | --- |
| Starter ad/tracker host filters | Yes — 126 packaged DNR rules | Yes — 126 bundled host rules |
| Custom hostname filters | Yes — up to 100 local rules | Not yet exposed in the app interface |
| Per-site pause control | Yes — from the popup | Yes — for the current in-app page |
| Cosmetic ad-container cleanup | Yes | Yes |
| Master protection control | Yes | Yes |
| Accounts, remote analytics, or profile sync | No | No |

## Quick start

### Use the Chrome extension

1. Unzip `release/crypsis-chrome-extension.zip`.
2. In Chrome, open `chrome://extensions` and enable **Developer mode**.
3. Select **Load unpacked** and choose the unzipped `crypsis-extension` folder.
4. Open a normal HTTP or HTTPS page and select the Crypsis toolbar icon to pause filtering on that site, open settings, or toggle protection.

Chrome service workers can be stopped when idle, so Crypsis persists settings in extension storage and re-applies them at startup rather than relying on in-memory state. [2] [4]

### Use the Android APK

1. Transfer `release/crypsis-android-debug.apk` to an Android 8.0 (API 26) or newer device.
2. Allow installation from the file manager when Android asks, then install the application.
3. Open Crypsis Browser, enter a web address, and use **Pause protection** or **Pause filtering on this site** when a page needs an exception.

The app uses the Internet permission only. All filtering decisions are made against the bundled list and locally stored per-site exceptions.

## Build from source

The project keeps the starter hostnames in `filters/core-domains.txt`. Generate the Chrome rules and Android app list from that shared source before packaging a new release.

```bash
python3 tools/compile_filters.py
node tools/prepare-release.mjs
node tools/package-extension.mjs
```

To build a fresh Android debug APK on Ubuntu:

```bash
bash tools/bootstrap-android.sh
cd android
ANDROID_HOME=../.android-sdk ./gradlew assembleDebug
```

The output is `android/app/build/outputs/apk/debug/app-debug.apk`. For a distributable production Android release, create and secure a signing key and configure a release signing block before using `assembleRelease`.

## Validation

Run the following commands from the project root:

```bash
python3 tools/compile_filters.py
node tools/verify-extension.mjs
node --check extension/background.js
node --check extension/content-cleanup.js
node --check extension/popup.js
node --check extension/options.js
```

## Maintenance and safety

The starter list is purposefully compact and editable. It is not a replacement for a comprehensively curated community filter subscription. Only add hostnames that you have verified as advertising or tracking endpoints, and use the site pause control instead of leaving pages in a broken state.

The Chrome extension uses declarative rules with a minimum Chrome version of 120. Chrome documents that static rules are packaged with the extension while dynamic rules persist across browser sessions, which is why Crypsis uses static starter rules and dynamic local custom rules. [1]

## References

[1] [Chrome Developers — `chrome.declarativeNetRequest`](https://developer.chrome.com/docs/extensions/reference/api/declarativeNetRequest)

[2] [Chrome Developers — `chrome.storage`](https://developer.chrome.com/docs/extensions/reference/api/storage)

[3] [Android Developers — VPN connectivity](https://developer.android.com/develop/connectivity/vpn)

[4] [Chrome Developers — Extension service worker lifecycle](https://developer.chrome.com/docs/extensions/develop/concepts/service-workers/lifecycle)
