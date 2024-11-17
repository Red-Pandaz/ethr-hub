// src/pages/Login.js
import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { userAddress, isConnected, login, logout } = useAuth();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();
  
        if (accounts.length > 0) {
          const userAddress = accounts[0]; // Get the first account address
          const token = localStorage.getItem('authToken');
          localStorage.setItem('userAddress', userAddress); // Store userAddress in localStorage
          
          if (token) {
            login(userAddress, token); // Set user as authenticated if token exists
          } else {
            // Optionally handle the case where there is no token (e.g., prompt user to log in)
            console.log("No token found, user might not be logged in");
          }
        } else {
          console.log("No accounts found, user might not be connected");
        }
      } catch (err) {
        console.error('Error connecting to MetaMask:', err);
      }
    } else {
      alert('Please install MetaMask to use this feature');
    }
  };
  

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      alert('MetaMask is not installed. Please install MetaMask and try again.');
      return;
    }
  
    try {
      // Request user accounts from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts && accounts[0]) {
        const userAddress = accounts[0];
        const message = "Please sign this message to log in"; // Request message
  
        // Initialize Web3 provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Sign the message
        const signature = await signer.signMessage(message);
  
        // Send the address and signature to the backend for verification
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: userAddress, signature, message })
        });
  
        const data = await response.json();
  
        // Handle backend response (set token and login if successful)
        if (data.token) {
          login(userAddress, data.token);  // Call the login function from AuthContext
          console.log('Login successful!', data.token);
        } else {
          console.error('Login failed:', data.error || 'Unknown error');
        }
      } else {
        console.error('No accounts returned from MetaMask');
      }
    } catch (err) {
      console.error('Error connecting to MetaMask:', err);
    }
  };
  
  

  const disconnectWallet = () => {
    logout(); // Call AuthContext's logout
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
