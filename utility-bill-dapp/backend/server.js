const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');
const contractABI = require('./contractABI.json');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

app.post('/api/bills', async (req, res) => {
    try {
        const { userAddress, amount } = req.body;
        const tx = await contract.createBill(userAddress, ethers.utils.parseEther(amount.toString()));
        await tx.wait();
        res.json({ success: true, transaction: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/bills', async (req, res) => {
    try {
        const bills = await contract.getAllBills();
        const formattedBills = bills.map(bill => ({
            id: bill.id.toString(),
            user: bill.user,
            amount: ethers.utils.formatEther(bill.amount),
            paid: bill.paid,
            timestamp: new Date(bill.timestamp * 1000).toISOString()
        }));
        res.json(formattedBills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/bills/:id', async (req, res) => {
    try {
        const bill = await contract.getBill(req.params.id);
        res.json({
            id: bill.id.toString(),
            user: bill.user,
            amount: ethers.utils.formatEther(bill.amount),
            paid: bill.paid,
            timestamp: new Date(bill.timestamp * 1000).toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});