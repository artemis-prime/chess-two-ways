// https://www.carlrippon.com/creating-react-app-with-typescript-eslint-with-webpack5/
module.exports = {

  presets: [
    ["@babel/preset-react", { 
      runtime: "automatic", 
      importSource: "@emotion/react" 
    }],
    "@babel/typescript", 
    ["@babel/env", { 
      modules: false 
    }]
  ],
  plugins: [
    ["@emotion/babel-plugin", {
      sourceMap: true,
      autoLabel: "dev-only",
      labelFormat: "[filename]--[local]",
      cssPropOptimization: false
    }],
    ["@babel/plugin-transform-runtime", { regenerator: true }],
    ["module-resolver", {
        // These are applied way before the webpack ones, so have to be 
        // reproduced here so that inline-react-svg can import svg's using asiases
      root: ["./"],
      alias: {
        "~": "./src/",
        "assets": "../../assets/"
      },
    }],
    ["inline-react-svg", {
      svgo: {
        plugins: [{
          name: "preset-default",
          params: {
            overrides: {
              "removeViewBox": false 
            } 
          }
        }]
      }
    }]
  ],
  env: {
    development: {
      sourceMaps: true,
      retainLines: true
    }
  },
}

