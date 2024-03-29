/*
The MIT License (MIT)

Copyright (c) 2017 Martin Allien
Copyright (c) 2017 Andreas Greimel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

export default function getColor(currency: string): string {
  const colors = {
    ["ACT*"]: "#626efb",
    ADC: "#3CB0E5",
    AE: "#f7296e",
    AEON: "#164450",
    AION: "#004651",
    AMP: "#048DD2",
    ANC: "#000",
    ARCH: "#002652",
    ARDR: "#1162a1",
    ARK: "#f1373a",
    AUR: "#136c5e",
    BANX: "#225BA6",
    BAT: "#9e1f63",
    BAY: "#584ba1",
    BC: "#202121",
    BCN: "#964F51",
    BFT: "#4fc3f7",
    BNB: "#f3ba2f",
    BNT: "#1295e5",
    BRK: "#194fa0",
    BRX: "#a8c300",
    BSD: "#1186E7",
    BTA: "#210094",
    BTC: "#F7931A",
    BTG: "#F7931A",
    BCH: "#F7931A",
    BCC: "#F7931A",
    BTCD: "#2A72DC",
    BTCP: "#2c3062",
    BTS: "#03A9E0",
    BTX: "#ff17a1",
    CLAM: "#D6AB31",
    CLOAK: "#DF3F1E",
    CVC: "#3ab03e",
    DAO: "#FF3B3B",
    DASH: "#1c75bc",
    DCR: "#3b7cfb",
    DCT: "#008770",
    DGB: "#0066cc",
    DGD: "#D8A24A",
    DGX: "#D8A24A",
    DMD: "#5497b2",
    DOGE: "#BA9F33",
    DRGN: "#138fdd",
    ELF: "#5807a1",
    EMC: "#674c8c",
    ENG: "#1131ab",
    EOS: "#19191A",
    ERC: "#101E84",
    ETC: "#669073",
    ETH: "#282828",
    ETHOS: "#00cfab",
    ETN: "#21bce0",
    FC2: "#040405",
    FCT: "#2175BB",
    FLO: "#1358C8",
    FRK: "#0633cd",
    FTC: "#679EF1",
    FUN: "#ef0667",
    GAME: "#ed1b24",
    GAS: "#58BF00",
    GBYTE: "#3f4f60",
    GDC: "#E9A226",
    GEMZ: "#e86060",
    GLD: "#E8BE24",
    GNO: "#00A6C4",
    GNT: "#00d6e3",
    GOLOS: "#2670B7",
    GRC: "#88A13C",
    GRS: "#648FA0",
    GTO: "#7e27ff",
    HEAT: "#ff5606",
    HSR: "#56428e",
    ICN: "#4c6f8c",
    ICX: "#1aa9b8",
    IFC: "#ed272d",
    INCNT: "#f2932f",
    IOC: "#2fa3de",
    IOT: "#FFFFFF",
    IOTA: "#FFFFFF",
    IOST: "#FFFFFF",
    JBS: "#1A8BCD",
    KCS: "#0e75ee",
    KMD: "#326464",
    KNC: "#31c09e",
    KOBO: "#80C342",
    KORE: "#DF4124",
    LBC: "#015C47",
    LDOGE: "#ffcc00",
    LINK: "#3f7baa",
    LISK: "#1A6896",
    LSK: "#1A6896",
    LTC: "#838383",
    LRC: "#e9b405",
    MAID: "#5492D6",
    MCO: "#0D3459",
    MIOTA: "#FFFFFF",
    MINT: "#006835",
    MKR: "#1bc4a6",
    MONA: "#a99364",
    MRC: "#4279bd",
    MSC: "#1D4983",
    MTR: "#b92429",
    MUE: "#f5a10e",
    NANO: "#4a90e2",
    NAS: "#ffffff",
    NBT: "#FFC93D",
    NEBL: "#36a2d4",
    NEO: "#58BF00",
    NEOS: "#1d1d1b",
    NEU: "#2983c0",
    NLG: "#003E7E",
    NMC: "#6787B7",
    NOTE: "#42daff",
    NVC: "#ecab41",
    NXT: "#008FBB",
    OK: "#0165A4",
    OMG: "#1A53F0",
    OMNI: "#18347E",
    OPAL: "#7193AA",
    PART: "#05D5A3",
    PAY: "#000000",
    PIGGY: "#F27A7A",
    PINK: "#ED31CA",
    PIVX: "#3b2f4d",
    POLY: "#2a3f7d",
    POT: "#105B2F",
    POWR: "#05bca9",
    PPC: "#3FA30C",
    PPT: "#293d5e",
    QRK: "#22AABF",
    QASH: "#0b45e9",
    QTUM: "#2e9ad0",
    R: "#bd2df5",
    RADS: "#924cea",
    RBIES: "#C62436",
    RBT: "#0d4982",
    RBY: "#D31F26",
    RDD: "#ED1C24",
    REP: "#40a2cb",
    REQ: "#0e3f55",
    RHOC: "#cc1e46",
    RISE: "#43CEA2",
    SAR: "#1B72B8",
    SALT: "#373c43",
    SCOT: "#3498DB",
    SDC: "#981D2D",
    SIA: "#00CBA0",
    SJCX: "#003366",
    SLG: "#5A6875",
    SLS: "#1EB549",
    SMART: "#f4b517",
    SNRG: "#160363",
    SNT: "#5d71ea",
    SRN: "#070f12",
    START: "#01AEF0",
    STEEM: "#1A5099",
    STORJ: "#2683ff",
    STR: "#08B5E5",
    STRAT: "#2398dd",
    SUB: "#e43331",
    SWIFT: "#428BCA",
    SYNC: "#008DD2",
    SYS: "#0098DA",
    TRIG: "#1fbff4",
    TX: "#1F8BCC",
    UBQ: "#00ec8d",
    UNITY: "#ED8527",
    USDT: "#2CA07A",
    VIOR: "#1F52A4",
    VEN: "#15c9ff",
    VERI: "#f6983f",
    VNL: "#404249",
    VPN: "#589700",
    VRC: "#418bca",
    VTC: "#1b5c2e",
    WAVES: "#24aad6",
    WTC: "#8200ff",
    XAI: "#2ef99f",
    XBS: "#d3261d",
    XCH: "#3AAB59",
    XCP: "#EC1550",
    XEM: "#41bf76",
    XLM: "#08b5e5",
    XMR: "#FF6600",
    XPM: "#e5b625",
    XRB: "#4a90e2",
    XRP: "#346AA9",
    XTZ: "#A6DF00",
    XVG: "#42AFB2",
    XZC: "#23b852",
    YBC: "#D6C154",
    ZCL: "#c76e35",
    ZEC: "#e5a93d",
    ZEIT: "#ACACAC",
    ZIL: "#49c1be",
    ZRX: "#404040",

    // Fiat currencies
    EUR: "#4caf50",
    USD: "#4caf50",
  };

  return colors[currency] || "#888";
}
