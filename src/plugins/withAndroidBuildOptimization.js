const { withAppBuildGradle } = require("@expo/config-plugins");

module.exports = function withAndroidBuildOptimization(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === "groovy") {
      let gradle = config.modResults.contents;

      // ✅ Ensure release block has optimization flags
      gradle = gradle.replace(
        /buildTypes\s*{[\s\S]*?release\s*{[\s\S]*?}/,
        (match) => {
          if (!match.includes("minifyEnabled")) {
            match = match.replace(/release\s*{[\s\S]*?}/, (releaseBlock) =>
              releaseBlock.replace(
                /release\s*{[\s\S]*?}/,
                `release {
        minifyEnabled true
        shrinkResources true
        zipAlignEnabled true
        proguardFiles getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro"
      }`
              )
            );
          }
          return match;
        }
      );

      // ✅ Add Hermes enablement if not present
      if (!gradle.includes("enableHermes: true")) {
        gradle += `

project.ext.react = [
    enableHermes: true
]
`;
      }

      config.modResults.contents = gradle;
    }
    return config;
  });
};
