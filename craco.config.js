const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
const deps = require("./package.json").dependencies;

module.exports = {
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
          // webpackConfig.devServer = {
          //   port: 3001,
          //   historyApiFallback: true,
          // }
          webpackConfig.plugins = [
            ...webpackConfig.plugins,
            new ModuleFederationPlugin({
              name: "app",
              remotes: {
                appModule: "remoteangular@http://localhost:4200/remoteEntry.js",
              },
              shared: {
                ...deps,
                "react-dom": {
                  singleton: true,
                  eager: true,
                },
                react: {
                  singleton: true,
                  eager: true,
                },
              },
            }),
          ];
          return webpackConfig;
        },
      },
    },
  ],
};
