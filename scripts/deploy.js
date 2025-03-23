const hre = require("hardhat");

async function main() {
    const ConcertBooking = await hre.ethers.getContractFactory("ConcertBooking");
    const concertBooking = await ConcertBooking.deploy();
    await concertBooking.waitForDeployment();

    console.log(`Contract deployed at: ${concertBooking.target}`);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
