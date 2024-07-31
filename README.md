### Set up steps

1. Create the host and remote applications, host is React and remote is Angular

   ````
   npx create-react-app host
   npx create-nx-workspace@latest remote angular
   ````


2. Delete node_modules for both applications and remove the package-lock.json
3. Use pnpm to install all dependencies
4. Put all content from main.ts to bootstrap.ts, then import the bootstrap.ts, so the application can be lazyloaded
5. Write the extra-webpack.config.ts file and import moduleFederationPlugins
6. Steps below are all for remote Angular application

   1. Create some libraries under the remote Angular project

   ````
   nx g @nx/angular:library products --directory=libs/products --standalone
   nx g @nx/angular:component product-list --directory=libs/products/src/lib/product-list --standalone --export
   
   nx g @nx/angular:library orders --directory=libs/orders --standalone
   nx g @nx/angular:library shared-ui --directory=libs/shared/ui --standalone
   ````


2. Export the sub-routes to index.ts file
3. Create loadApp.ts in remote Angular project and export all the functions

   ````
   // important,needs import zone.js, otherwise the host will not execute remoteEntry.js
   import 'zone.js';
   import { bootstrapApplication } from '@angular/platform-browser';
   import { appConfig } from './app/app.config';
   import { AppComponent } from './app/app.component';
   
   const mount = () => {
       bootstrapApplication(AppComponent, appConfig).catch((err) =>
           console.error(err)
       );
   }
   
   export { mount };
   
   ````

4. Put loadApp.ts to tsconfig.app.json file so it can be compiled by typescript

   ````
   {
     "extends": "./tsconfig.json",
     "compilerOptions": {
       "outDir": "../../dist/out-tsc",
       "types": []
     },
     "files": ["src/main.ts", "src/loadApp.ts"],
     "include": ["src/**/*.d.ts"],
     "exclude": ["jest.config.ts", "src/**/*.test.ts", "src/**/*.spec.ts"]
   }
   ````


5. Using pnpm install @angular-builders/custom-webpack and replace the executor, click [mergeRules](https://github.com/survivejs/webpack-merge#mergewithrules) to see details, for example, 'optimization ' and 'plugins' are the keywords from webpack configurations.

   ````
   "build": {
         "executor": "@angular-builders/custom-webpack:browser",
         "options": {
           "customWebpackConfig": {
             "path": "./apps/remoteangular/extra-webpack.config.js",
             "mergeRules": {
               "optimization": "merge",
               "plugins": "append"
             }
           },
       ...
   }
           
    "serve": {
         "executor": "@angular-builders/custom-webpack:dev-server",
         "options": {
           "browserTarget": "remoteangular:build"
         },
         "configurations": {
           "production": {
             "buildTarget": "remoteangular:build:production"
           },
           "development": {
             "buildTarget": "remoteangular:build:development"
           }
         },
         "defaultConfiguration": "development"
       },
   
   ````


6. Write the webpack-extra.config.js

   ````
   const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
   // important output and optimization are needed for loading the remoteEntry.js
   module.exports = {
       output: {
           uniqueName: "remoteangular",
           publicPath: "auto",
           scriptType: "text/javascript",
       },
       optimization: {
           runtimeChunk: false,
       },
       plugins: [
           new ModuleFederationPlugin({
               name: "remoteangular",
               filename: "remoteEntry.js",
               exposes: {
               //important needs require.resolve, otherwise the path could not be resolved
                   "./AppModule": require.resolve("./src/loadApp.ts")
               }
           })
       ]
   }
   
   ````


7. Steps below are all for host React application

   1. install @craco/craco to config the webpack configuration by using pnpm

      ````
      pnpm add -D @craco/craco
      ````

   2. Replace the scripts in package.json with craco configurations

      ````
      "scripts": {
          "start": "set PORT=3000 && craco start",
          "build": "craco build",
          "test": "craco test",
          "eject": "react-scripts eject"
        },
      
      ````

   3. Write the craco.config.js file

      ````
      const ModuleFederationPlugin = require("webpack").container.ModuleFederationPlugin;
      const deps = require("./package.json").dependencies;
      
      module.exports = {
        plugins: [
          {
            plugin: {
              overrideWebpackConfig: ({ webpackConfig, cracoConfig, pluginOptions, context: { env, paths } }) => {
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
      ````

   4. Create App.module.js file to import remote application

      ````
      import React, { useEffect } from 'react';
      import { mount } from "appModule/AppModule";
      
      const RemoteAppModule = () => {
          useEffect(() => {
              mount();
          }, []);
      
          return (
              <div className="remote-module">
                  <app-root></app-root>
              </div>
          )
      }
      
      export default RemoteAppModule;
      ````

   5. Use RemoteAppModule in App.js

      ````
      import "./App.css";
      import React from "react";
      import RemoteAppModule from "./modules/AppModule";
      
      function App() {
        return (
          <div className="App">
            <header className="App-header">
              <div className="container">
                <div className="header">
                  <h1>REACT HOST</h1>
                </div>
      
                <div className="remotes">
                  <div className="remotes-col">
                    <RemoteAppModule></RemoteAppModule>
                  </div>
                </div>
              </div>
            </header>
          </div>
        );
      }
      
      export default App;
      ````



suggestions on how to handle the router changes between react host and angular remote

[https://betterprogramming.pub/event-based-routing-for-angular-micro-frontends-3bf2c9597ac1](https://betterprogramming.pub/event-based-routing-for-angular-micro-frontends-3bf2c9597ac1)

CONS

````
1.There is no pratice solution for handling routes between React and Angular, that's 
why we always see micro-frontend applications build with React with Vue or other
frameworks, becuase React and Vue can both using browser router and memomry router.
https://udemy.com/course/microfrontend-course

2.The other module fedration solution provided by NX team also don't recomend using
the React and Angular at the same time. https://github.com/nrwl/nx/issues/19722

3.The Single-spa needs more configurations than module federation and even
the framework Qiankun extends from Single-spa also have issues about the sub-routing
when it comes with angular.(I used the repo trying to set second level routes in Angular
but the whole application crashed for no reason)https://github.com/umijs/qiankun

4.Web Component could be a solution but I did not try it, but needs more manual work for
composing all the bundles together in one container
https://www.telerik.com/blogs/angular-16-micro-frontends-angular-elements
````