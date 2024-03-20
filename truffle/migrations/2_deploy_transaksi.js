const Transaksi = artifacts.require("Transaksi");
const Inventaris = artifacts.require("Inventaris");

module.exports = async function (deployer) {
    await deployer.deploy(Inventaris);
    const inventarisInstance = await Inventaris.deployed();
    await deployer.deploy(Transaksi, inventarisInstance.address);
};