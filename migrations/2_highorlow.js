const HighOrLow = artifacts.require("HighOrLow");

module.exports = function (deployer) {
  deployer.deploy(
    HighOrLow,
    // Name
    "ETH 1k 2020",
    // 1k with 8 decimals
    "100000000000",
    // 2020-10-26 00:00:00
    "1603670400",
    // 0.01 ETH
    "10000000000000000",
    // Kovan address
    "0x9326BFA02ADD2366b30bacB125260Af641031331"
  );
};