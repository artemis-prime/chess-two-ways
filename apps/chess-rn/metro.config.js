const exclusionList = require("metro-config/src/defaults/exclusionList");
const { getMetroTools } = require("react-native-monorepo-tools");
const monorepoMetroTools = getMetroTools();
const path = require('path')

// https://mmazzarolo.com/blog/2021-09-18-running-react-native-everywhere-mobile/
module.exports = {
  watchFolders: [
    ...monorepoMetroTools.watchFolders,
    path.resolve(__dirname, './../../domain/chess-core'),
    path.resolve(__dirname, './../../assets') 
  ],

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Ensure we resolve nohoist libraries from this directory.
    // With "((?!mobile).)", we're blocking all the cases were metro tries to
    // resolve nohoisted libraries from a directory that is not "mobile".
    blockList: exclusionList([
      /^((?!chess-rn).)*\/node_modules\/@react-native-community\/cli-platform-ios\/.*$/,
      /^((?!chess-rn).)*\/node_modules\/@react-native-community\/cli-platform-android\/.*$/,
      /^((?!chess-rn).)*\/node_modules\/hermes-engine\/.*$/,
      /^((?!chess-rn).)*\/node_modules\/jsc-android\/.*$/,
      /^((?!chess-rn).)*\/node_modules\/react-native\/.*$/,
      /^((?!chess-rn).)*\/node_modules\/react-native-codegen\/.*$/,
    ]),
    extraNodeModules: {
        //"/Users/me/my-app/packages/mobile/node_modules/@react-native-community/cli-platform-ios",
      "@react-native-community/cli-platform-ios":
        path.resolve(__dirname, "node_modules/@react-native-community/cli-platform-ios"),
        //"/Users/me/my-app/packages/mobile/node_modules/@react-native-community/cli-platform-android",
      "@react-native-community/cli-platform-android":
        path.resolve(__dirname, "node_modules/@react-native-community/cli-platform-android"),
        //"/Users/me/my-app/packages/mobile/node_modules/hermes-engine",
      "hermes-engine":
        path.resolve(__dirname, "node_modules/hermes-engine"),
        //"/Users/me/my-app/packages/mobile/node_modules/jsc-android",
      "jsc-android":
        path.resolve(__dirname, "node_modules/jsc-android"),
        //"/Users/me/my-app/packages/mobile/node_modules/react-native",
        "react-native":
        path.resolve(__dirname, "node_modules/react-native"),
        //"/Users/me/my-app/packages/mobile/node_modules/react-native-codegen",
      "react-native-codegen":
        path.resolve(__dirname, "node_modules/react-native-codegen"),
      //'assets': path.resolve(__dirname + './../../assets') 
    },
    resolveRequest: (context, moduleName, platform) => {
        // implemment our alias :)
      if (moduleName.startsWith('~assets')) {
        const relName = moduleName.slice('~assets'.length)
        const resolvedName = path.join( __dirname, '../../assets', '.' + relName)
        return {
          filePaths: [resolvedName],
          type: 'assetFiles',
        };
      }
      // Optionally, chain to the standard Metro resolver.
      return context.resolveRequest(context, moduleName, platform);
    },
  },
  server: {
    rewriteRequestUrl: (url) => {
        // for some reason the path of app assets seems to get dropped by metro 
        // when asking the server.  They get bundled fine, but then 
        // the lose their path as it it assumes assets are under the project root! grr 
      if (url.startsWith('/assets') && !url.startsWith('/assets/node_modules')) {
        const relName = url.slice('/assets'.length)
        const fixed = '/assets/../../assets' + relName
        return fixed
      }
      return url
    }
  }
}
