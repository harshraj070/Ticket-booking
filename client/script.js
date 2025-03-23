document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.book-btn');

    async function connectWallet() {
        if (window.ethereum) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            return signer;
        } else {
            alert("Please install MetaMask!");
        }
    }

    async function bookConcert(concertId, priceInEth) {
        const signer = await connectWallet();
        const contractAddress = "0xYourContractAddress";  // Replace with deployed address
        const abi = [ /* Your Contract ABI Here */ ];

        const contract = new ethers.Contract(contractAddress, abi, signer);

        const tx = await contract.bookConcert(concertId, {
            value: ethers.utils.parseEther(priceInEth)
        });

        await tx.wait();
        alert(`Concert booked successfully! Tx: ${tx.hash}`);
    }

    buttons.forEach(button => {
        button.addEventListener('click', async () => {
            const concertId = button.dataset.id;
            const priceInEth = button.dataset.price;

            try {
                await bookConcert(concertId, priceInEth);
            } catch (error) {
                console.error('Booking failed:', error);
                alert('Booking failed. Try again.');
            }
        });
    });
});
