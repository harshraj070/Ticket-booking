import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractABI from './contractABI.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
const API_URL = process.env.REACT_APP_API_URL;

function App() {
  const [account, setAccount] = useState('');
  const [bills, setBills] = useState([]);
  const [amount, setAmount] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    connectWallet();
    fetchBills();
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);
        const admin = await contract.admin();
        setIsAdmin(accounts[0].toLowerCase() === admin.toLowerCase());
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    }
  };

  const fetchBills = async () => {
    try {
      const response = await fetch(`${API_URL}/api/bills`);
      const data = await response.json();
      setBills(data);
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const createBill = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userAddress, amount }),
      });
      await response.json();
      fetchBills();
      setAmount('');
      setUserAddress('');
    } catch (error) {
      console.error('Error creating bill:', error);
    }
  };

  const payBill = async (billId, amount) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const tx = await contract.payBill(billId, {
        value: ethers.utils.parseEther(amount.toString())
      });
      await tx.wait();
      fetchBills();
    } catch (error) {
      console.error('Error paying bill:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Utility Bill Payment DApp</h1>
      
      <div className="mb-4">
        <button
          onClick={connectWallet}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {account ? `Connected: ${account.slice(0,6)}...${account.slice(-4)}` : 'Connect Wallet'}
        </button>
      </div>

      {isAdmin && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Create New Bill</h2>
          <form onSubmit={createBill} className="space-y-4">
            <input
              type="text"
              placeholder="User Address"
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="number"
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
              Create Bill
            </button>
          </form>
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold mb-4">Bills</h2>
        <div className="space-y-4">
          {bills.map((bill) => (
            <div key={bill.id} className="border p-4 rounded">
              <p>Bill ID: {bill.id}</p>
              <p>User: {bill.user}</p>
              <p>Amount: {bill.amount} ETH</p>
              <p>Status: {bill.paid ? 'Paid' : 'Pending'}</p>
              {!bill.paid && bill.user.toLowerCase() === account.toLowerCase() && (
                <button
                  onClick={() => payBill(bill.id, bill.amount)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                >
                  Pay Bill
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;