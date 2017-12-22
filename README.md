# Foxfolio

[![Travis](https://img.shields.io/travis/foxfolio/foxfolio-desktop/master.svg?style=flat-square)](https://travis-ci.org/foxfolio/foxfolio-desktop)
[![GitHub license](https://img.shields.io/github/license/foxfolio/foxfolio-desktop.svg?style=flat-square)](https://github.com/foxfolio/foxfolio-desktop)

> Cryptocurrency portfolio management application which automatically retrieves balances and trades using exchange APIs

![Foxfolio screenshot](resources/screenshots/foxfolio.png?raw=true)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)

## Install

* **Note: requires a node version >= 8.7 and an npm version >= 5.**

Install dependencies with yarn.

```bash
$ cd crypto-portfolio
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn) for some reason, try `npm install`.

## Usage

To run the application without packaging use

```bash
$ npm start
```

This builds the application using Webpack and launches it.

To run the app in the `dev` environment use

```bash
$ npm run dev
```

This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a server that sends hot updates to the renderer process

## Maintainers

[@greimela](https://github.com/greimela)

## Contribute

PRs accepted.

## License

MIT © 2017 Andreas Greimel

Icon made by [Pixel Perfect](https://www.flaticon.com/authors/pixel-perfect) from [www.flaticon.com](https://www.flaticon.com)
