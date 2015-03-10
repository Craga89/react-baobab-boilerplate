# react-baobab-boilerplate
Originally based off the excellent [isomorphic-react-baobab-example](https://github.com/christianalfoni/isomorphic-react-baobab-example) by [Christian Alforni](https://github.com/christianalfoni). Provides you with a nice boilerplate to get started building `isomorphic` applications with React and a Flux-like framework in ES6 syntax.

## Included features

* [React](http://facebook.github.io/react/) for the UI
* [Baobab](https://github.com/Yomguithereal/baobab) for the application state
* [Babel](http://babel.io) transpiler, for **Harmony/ES6** & **JSX** support
* [Webpack](http://webpack.github.io) build system
* [WebpackDevServer](http://webpack.github.io/docs/webpack-dev-server.html) for build-as-you-go development
* [react-hot-loader](http://github.com/gaearon/react-hot-loader) integration for refresh-less development
* [Koa](http://koa.io) web server (see requirements)
* [Socket.io](http://socket.io) server for real-time UI updates (optional)

## Requirements

* [Node 0.11.x](http://github.com/visionmedia/n) or above
* `--harmony` flag must be used when running manually i.e. `node --harmony index.js`

## Inspiration
Read the article at: [True isomorphic apps with React and Baobab](http://christianalfoni.github.io/javascript/2015/03/01/true-isomorphic-apps-with-react-and-baobab.html).

## Demo
1. Clone repo
2. `npm install`
3. `npm start`
4. Go to `localhost:3000`

Now edit on of the `app/` files, it'll update on-the-fly!


## Production builds
By default the `app` will start in `DEBUG` mode with all the `react-hot-loader` goodness. If you want to simply build the app up and serve it as it would be on a normal
server environment, just pass ` --release` flag to `npm start` like so:

```
npm start -- --release
```

**Note: You must pass that additional `--` for `npm` to pass the arguments after it through to the underlying scripts!**

