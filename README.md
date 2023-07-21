# Foxfolio

[![GitHub release](https://img.shields.io/github/release/foxfolio/foxfolio-desktop/all.svg?style=flat-square)](https://github.com/foxfolio/foxfolio-desktop/releases)
[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://github.com/foxfolio/foxfolio-desktop)

> Cryptocurrency portfolio management application which automatically retrieves balances and trades using exchange APIs

![Foxfolio screenshot](public/screenshots/foxfolio.png?raw=true)

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

* **Note: requires a node version >= 14.**

Install dependencies with yarn.

```bash
$ yarn
```
**Note**: If you can't use [yarn](https://github.com/yarnpkg/yarn) for some reason, try `npm install`.

To run the app in the `dev` environment use

```bash
$ yarn dev
```

To package the project for your operating system use

```bash
$ yarn build
```

This builds the application and provides an executuable under `release`.

## Maintainers

[@greimela](https://github.com/greimela)

## Contribute
Feel free to add issues/PRs/comments.

## Donations
If you appreciate my work, you can buy me a coffee using your favourite cryptocurrencies! 

```
BTC bc1qeq43ma8nwrmr8cuuxrvy0xmsr446g4l5kqlzwd
ETH acevail.eth / 0xdA43422c16b094f6428173fbe15E295523893549
XCH xch1ue73qkk0haklxedjmxsymhmtgcvxr6k8va3xvj0jnfehheu37fyqe3gzzd
```
## License

MIT © 2017 - 2023 Andreas Greimel
