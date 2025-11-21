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
if command -v ./gradlew.bat >/dev/null 2>&1; then
    ./gradlew.bat :app:assembleRelease
else
    ./gradlew :app:assembleRelease
fi

echo ""
echo "SUCCESS! Split APKs in:"
echo "   android/app/build/outputs/apk/release/"

# #!/bin/bash
# set -e

# echo "FAST DEV BUILD (without --clean)"
# echo "=================================="

# # Reuse existing android/ folder
# npx expo prebuild

# # Build (no clean needed)
# cd android
# if command -v ./gradlew.bat >/dev/null 2>&1; then
#     ./gradlew.bat :app:assembleRelease
# else
#     ./gradlew :app:assembleRelease
# fi

# echo ""
# echo "FAST BUILD DONE!"
# echo "   APKs → android/app/build/outputs/apk/release/"