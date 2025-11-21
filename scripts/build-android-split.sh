#!/bin/bash
set -e

echo "PRODUCTION BUILD (with --clean)"
echo "=================================="

# Stop Gradle
(cd android 2>/dev/null && ./gradlew --stop) || true

# Full clean rebuild
npx expo prebuild --clean

# Build
cd android
if command -v ./gradlew.bat >/dev/null 2>&1; then
    ./gradlew.bat clean :app:assembleRelease
else
    ./gradlew clean :app:assembleRelease
fi

echo ""
echo "SUCCESS! Split APKs in:"
echo "   android/app/build/outputs/apk/release/"