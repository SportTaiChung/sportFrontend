module.exports = {
  // eslint錯誤,不會使得編譯失敗
  lintOnSave: false,
  devServer: {
    port: 8080,
    proxy: {
      '/data': {
        target: `${process.env.VUE_APP_DEV_DOMAIN}/`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/data': '',
        },
      },
      '/chat': {
        target: `https://${process.env.VUE_APP_CHAT_API}/`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/chat': '',
        },
      },
    },
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
           @import "@/style/index.scss";
        `,
      },
    },
  },
  // chainWebpack: (config) => {
  //   const svgRule = config.module.rule('svg');
  //   svgRule.uses.clear();
  //   svgRule.use('svg-sprite-loader').loader('svg-sprite-loader').options({
  //     symbolId: 'icon-[name]',
  //   });
  // },
  // 打包路徑
  // outputDir: '../web_pages',
};
