# Crypsis Android App

The Android project builds **Crypsis Browser**, an in-app WebView browser that blocks known advertising and tracker hosts and hides common ad containers on pages opened inside the app. It deliberately does not claim to filter other Android apps or other browsers: device-wide filtering requires a separate, fully forwarding VPN or DNS tunnel implementation and explicit operating-system consent.

## Build an APK

From the project root, prepare the Android build environment and generate the Gradle wrapper:

```bash
bash tools/bootstrap-android.sh
```

Then, from `android/`, use the wrapper to create the APK:

```bash
ANDROID_HOME=../.android-sdk ./gradlew assembleDebug
```

The resulting installable APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

Install it on a connected Android device with developer options enabled:

```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

The app uses only the Internet permission. Its controls, block counter, and per-site exceptions all work locally on the device.
