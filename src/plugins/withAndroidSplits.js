const { withAppBuildGradle } = require("@expo/config-plugins");

const withAndroidSplits = (config, props = {}) => {
  const abis = props.abis || ["armeabi-v7a", "arm64-v8a"];
  const universalApk = props.universalApk ?? false;

  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (!contents.includes("splits {")) {
      const splitBlock = `
    splits {
        abi {
            enable true
            reset()
            include ${abis.map((a) => `'${a}'`).join(", ")}
            universalApk ${universalApk}
        }
    }
`;
      contents = contents.replace(/android\s*{/, `android {${splitBlock}`);
      console.log(
        `✅ [withAndroidSplits] Injected ABI splits: ${abis.join(", ")}`
      );
    } else {
      console.log(
        "ℹ️ [withAndroidSplits] ABI splits already exist, skipping..."
      );
    }

    config.modResults.contents = contents;
    return config;
  });
};

module.exports = withAndroidSplits;

// const { withAppBuildGradle } = require("@expo/config-plugins");

// /**
//  * Custom Gradle Optimizer Plugin for Expo Prebuild
//  * Injects minifyEnabled, shrinkResources, and ABI splits automatically
//  */
// module.exports = function withCustomBuildGradle(config) {
//   return withAppBuildGradle(config, (config) => {
//     if (config.modResults.language === "groovy") {
//       let buildGradle = config.modResults.contents;

//       // ✅ Ensure minifyEnabled & shrinkResources
//       if (!buildGradle.includes("minifyEnabled true")) {
//         buildGradle = buildGradle.replace(
//           /buildTypes\s*{[^}]*release\s*{[^}]*}/s,
//           (match) =>
//             match.replace(
//               /release\s*{[^}]*/s,
//               (release) =>
//                 `${release}\n        minifyEnabled true\n        shrinkResources true\n        zipAlignEnabled true`
//             )
//         );
//       }

//       // ✅ Ensure ABI splits
//       if (!buildGradle.includes("splits { abi")) {
//         buildGradle += `
// android {
//     splits {
//         abi {
//             enable true
//             reset()
//             include "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
//             universalApk false
//         }
//     }
// }
// `;
//       }

//       config.modResults.contents = buildGradle;
//     }

//     return config;
//   });
// };

// const { withAppBuildGradle } = require("@expo/config-plugins");

// const withAndroidSplits = (config) => {
//   return withAppBuildGradle(config, (config) => {
//     const splitsConfig = `
//     splits {
//         abi {
//             enable true
//             reset()
//             include 'armeabi-v7a', 'arm64-v8a'
//             universalApk false
//         }
//     }

//     // applicationVariants.all { variant ->
//     //     variant.outputs.each { output ->
//     //         def abiVersionCodes = ['armeabi-v7a': 1, 'arm64-v8a': 2]
//     //         def abi = output.getFilter(com.android.build.OutputFile.ABI)
//     //         if (abi != null) {
//     //             output.versionCodeOverride =
//     //                 defaultConfig.versionCode * 10 + abiVersionCodes.get(abi, 0)
//     //         }
//     //     }
//     // }
// `;

//     if (!config.modResults.contents.includes("splits {")) {
//       config.modResults.contents = config.modResults.contents.replace(
//         /android\s*{/,
//         `android {${splitsConfig}`
//       );
//     }

//     return config;
//   });
// };

// module.exports = withAndroidSplits;
