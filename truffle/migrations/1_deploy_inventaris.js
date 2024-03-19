const Inventaris = artifacts.require("Inventaris");

module.exports = function (deployer) {
    deployer.deploy(Inventaris);
};