import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Login = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();

        if (accounts.length > 0) {
          setUserAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (err) {
        console.error('Error connecting to MetaMask:', err);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts[0]) {
        const userAddress = accounts[0];
        setUserAddress(userAddress);
        setIsConnected(true);

        const message = "Please sign this message to log in";
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const signature = await signer.signMessage(message);

        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: userAddress, signature, message })
        });

        const data = await response.json();
        if (data.token) {
            console.log(data.token)
          localStorage.setItem('authToken', data.token);
          console.log('Login successful!');
        } else {
          console.error('Login failed:', data.error);
        }
      } else {
        console.error('No accounts returned from MetaMask');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
    }
  };

  const disconnectWallet = () => {
    setUserAddress(null);
    setIsConnected(false);
    localStorage.removeItem('authToken'); // Remove JWT on logout
  };

  return (
    <div className="login-container">
      {!isConnected ? (
        <div>
          <h3>Login with MetaMask</h3>
          <button onClick={connectWallet}>Connect MetaMask</button>
        </div>
      ) : (
        <div>
          <h3>Welcome!</h3>
          <p>Your address: {userAddress}</p>
          <button onClick={disconnectWallet}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default Login;
