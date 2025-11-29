const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

const PROGUARD_CONTENT = `
# --- Core React Native / Expo ---
-keep class com.facebook.react.** { *; }
-dontwarn com.facebook.react.**
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.hermes.**
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.jni.**
-dontwarn javax.annotation.**

# --- Expo SDK ---
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# --- React Navigation ---
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**
-keep class com.swmansion.gesturehandler.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# --- Reanimated ---
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.reanimated.**

# --- Vector Icons ---
-keep class com.oblador.vectoricons.** { *; }
-dontwarn com.oblador.vectoricons.**

# --- Safe Area Context ---
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# --- Networking ---
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**
-keep class okio.** { *; }
-dontwarn okio.**

# --- Expo Secure Store ---
-keep class expo.modules.securestore.** { *; }
-dontwarn expo.modules.securestore.**

# --- Keep JS interfaces ---
-keepattributes *Annotation*
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
`;

const withProguardRules = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const proguardPath = path.join(
        projectRoot,
        "android",
        "app",
        "proguard-rules.pro"
      );

      // ✅ Ensure directory exists
      fs.mkdirSync(path.dirname(proguardPath), { recursive: true });

      // ✅ Write or overwrite file safely
      fs.writeFileSync(proguardPath, PROGUARD_CONTENT);
      console.log("✅ [withProguardRules] Applied custom Proguard rules.");

      return config;
    },
  ]);
};

module.exports = withProguardRules;
