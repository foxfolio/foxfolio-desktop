# fuxfolio

### A portfolio for cryptocurrencies which extracts trades from exchange APIs

<br/>

## Install

* **Note: requires a node version >= 8.7 and an npm version >= 4.**

Install dependencies with yarn.

```bash
$ cd crypto-portfolio
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn) for some reason, try `npm install`.

## Run

Start the app in the `dev` environment. This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a server that sends hot updates to the renderer process:

```bash
$ npm run dev
```

## Packaging

To package apps for the local platform:

```bash
$ npm run package
```

To package apps for all platforms:

First, refer to [Multi Platform Build](https://github.com/electron-userland/electron-builder/wiki/Multi-Platform-Build) for dependencies.

Then,
```bash
$ npm run package-all
```

To package apps with options:

```bash
$ npm run package -- --[option]
```

:bulb: You can debug your production build with devtools by simply setting the `DEBUG_PROD` env variable:
```
DEBUG_PROD=true npm run package
```

## Further commands

To run the application without packaging run

```bash
$ npm run build
$ npm start
```

To run End-to-End Test

```bash
$ npm run build
$ npm run test-e2e
```

#### Options

See [electron-builder CLI Usage](https://github.com/electron-userland/electron-builder#cli-usage)

## Maintainer

- [Andreas Greimel](https://github.com/greimela)

## License
MIT © [Andreas Greimel](https://github.com/greimela)
