#!/bin/bash
set -e

echo "PRODUCTION BUILD (without --clean)"
echo "=================================="

# Stop Gradle
(cd android 2>/dev/null && ./gradlew --stop) || true

# Full clean rebuild
npx expo prebuild

# Build
cd android
if [ -f ./gradlew.bat ]; then
    ./gradlew.bat :app:assembleRelease
else
    ./gradlew :app:assembleRelease
fi

echo ""
echo "SUCCESS! Release APK built:"
echo "   android/app/build/outputs/apk/release/"
