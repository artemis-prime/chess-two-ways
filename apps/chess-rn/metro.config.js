const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const { getMetroTools } = require("react-native-monorepo-tools")
const monorepoMetroTools = getMetroTools()
const path = require('path')

// https://github.com/facebook/react-native/blob/main/packages/react-native/template/metro.config.js
// https://mmazzarolo.com/blog/2021-09-18-running-react-native-everywhere-mobile/
const config = {

  projectRoot : path.resolve(__dirname),
  watchFolders: [
    ...monorepoMetroTools.watchFolders,
    path.resolve(__dirname, '../../just-the-chess'),
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

module.exports = mergeConfig(getDefaultConfig(__dirname), config)
