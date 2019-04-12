module.exports = {
  css: {
    modules: true,
    loaderOptions: {
      css: {
        localIdentName: "[name]-[hash]",
        camelCase: "only"
      }
    }
  }
};
