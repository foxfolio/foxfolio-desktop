# Foxfolio

[![GitHub release](https://img.shields.io/github/release/foxfolio/foxfolio-desktop/all.svg?style=flat-square)](https://github.com/foxfolio/foxfolio-desktop/releases)
[![Travis](https://img.shields.io/travis/foxfolio/foxfolio-desktop/master.svg?style=flat-square)](https://travis-ci.org/foxfolio/foxfolio-desktop)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/foxfolio/foxfolio-desktop)
[![CodeFactor](https://www.codefactor.io/repository/github/foxfolio/foxfolio-desktop/badge)](https://www.codefactor.io/repository/github/foxfolio/foxfolio-desktop)
[![Coveralls github](https://img.shields.io/coveralls/github/foxfolio/foxfolio-desktop.svg?style=flat-square)](https://coveralls.io/github/foxfolio/foxfolio-desktop)
[![Gitter](https://img.shields.io/gitter/room/foxfolio/foxfolio-desktop.js.svg?style=flat-square)](https://gitter.im/foxfolio-desktop/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)
[![Twitter Follow](https://img.shields.io/twitter/follow/foxfol_io.svg?label=Follow%20Foxfolio&style=flat-square)](https://twitter.com/foxfol_io)

> Cryptocurrency portfolio management application which automatically retrieves balances and trades using exchange APIs

![Foxfolio screenshot](resources/screenshots/foxfolio.png?raw=true)

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Build from source](#build-from-source)
- [Maintainers](#maintainers)
- [Contribute](#contribute)
- [License](#license)


## Install

You can find binaries for the latest release under [releases](https://github.com/foxfolio/foxfolio-desktop/releases).

Currently available for
- Windows (`.exe`)
- Linux (`.AppImage`, `.deb`)
- Mac (`.dmg`)

## Usage

- Add the credentials for your exchanges under **Exchanges**. 
Foxfolio will then retrieve the current balances and update the portfolio.
  - **Note**: Create new API credentials for Foxfolio and only configure the necessary permissions (i.e. no trading, no withdrawals)
- **Wallets** can be used to add balances that can not be retrieved automatically.


## Build from source

* **Note: requires a node version >= 8.7 and an npm version >= 5.**

Install dependencies with yarn.

```bash
$ cd crypto-portfolio
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn) for some reason, try `npm install`.

To run the app in the `dev` environment use

```bash
$ npm run dev
```

This starts the renderer process in [**hot-module-replacement**](https://webpack.js.org/guides/hmr-react/) mode and starts a server that sends hot updates to the renderer process

To run the application without packaging use

```bash
$ npm start
```

This builds the application using Webpack and launches it.

## Maintainers

[@greimela](https://github.com/greimela)

## Contribute
Feel free to add issues/PRs/comments.

## Donations
If you appreciate my work, you can buy me a coffee using your favourite cryptocurrencies! 

```
BTC 3E8yR2viEgLpErjfmFkMTZ9ntVP66KBLGD
ETH 0x588fFcb52d43fe7Def5D4F45Bb7c324ECAA79010
LTC MQTha8UbFoagdrM4RWKvrNvzJFFUat4jN3
ARK AXkXn8h18dYKQMfkE3Va8WJ9SPQqCrATc3
NANO xrb_3bua4emgw1ygmf3p4wfw43nkqdxsxuoxmk6bfx8ajsq91m9jxwdm6go6ebq9
```
## License

MIT © 2017 Andreas Greimel
