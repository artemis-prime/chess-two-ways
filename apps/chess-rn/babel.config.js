module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: ['.js', '.jsx', '.json', '.svg', '.png', '.jpg','.tsx','.ts'],
        alias: {
          "~": "./src",
          "~assets": "../../assets"
        }
      }
    ]
  ]
};
