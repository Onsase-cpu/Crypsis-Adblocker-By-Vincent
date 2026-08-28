#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TOOLS_DIR="$ROOT/.tools"
SDK_DIR="$ROOT/.android-sdk"
GRADLE_VERSION="8.11.1"
GRADLE_DIR="$TOOLS_DIR/gradle-$GRADLE_VERSION"
CMDLINE_ZIP="$TOOLS_DIR/android-command-line-tools.zip"
CMDLINE_URL="https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
GRADLE_ZIP="$TOOLS_DIR/gradle-$GRADLE_VERSION-bin.zip"
GRADLE_URL="https://services.gradle.org/distributions/gradle-$GRADLE_VERSION-bin.zip"

mkdir -p "$TOOLS_DIR" "$SDK_DIR"

if [[ ! -x "$SDK_DIR/cmdline-tools/latest/bin/sdkmanager" ]]; then
  curl --fail --location --retry 3 --output "$CMDLINE_ZIP" "$CMDLINE_URL"
  rm -rf "$SDK_DIR/cmdline-tools/latest" "$TOOLS_DIR/android-cmdline"
  mkdir -p "$TOOLS_DIR/android-cmdline" "$SDK_DIR/cmdline-tools"
  unzip -q "$CMDLINE_ZIP" -d "$TOOLS_DIR/android-cmdline"
  mv "$TOOLS_DIR/android-cmdline/cmdline-tools" "$SDK_DIR/cmdline-tools/latest"
fi

if [[ ! -x "$GRADLE_DIR/bin/gradle" ]]; then
  curl --fail --location --retry 3 --output "$GRADLE_ZIP" "$GRADLE_URL"
  unzip -q "$GRADLE_ZIP" -d "$TOOLS_DIR"
fi

export ANDROID_HOME="$SDK_DIR"
export ANDROID_SDK_ROOT="$SDK_DIR"
export PATH="$SDK_DIR/cmdline-tools/latest/bin:$SDK_DIR/platform-tools:$PATH"
printf 'y\ny\ny\ny\ny\ny\ny\ny\ny\ny\n' | sdkmanager --sdk_root="$SDK_DIR" --licenses >/dev/null || true
sdkmanager --sdk_root="$SDK_DIR" "platform-tools" "platforms;android-35" "build-tools;35.0.0"

cd "$ROOT/android"
"$GRADLE_DIR/bin/gradle" wrapper --gradle-version "$GRADLE_VERSION" --distribution-type bin
echo "Android build environment prepared. Run: cd android && ANDROID_HOME=$SDK_DIR ./gradlew assembleDebug"
