import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  const login = (userAddress, token) => {
    setUserAddress(userAddress);
    setIsConnected(true);
    localStorage.setItem('authToken', token);
  };

  const logout = () => {
    setUserAddress(null);
    setIsConnected(false);
    localStorage.removeItem('authToken');
  };

  useEffect(() => {

    const token = localStorage.getItem('authToken');
    if (token) {
     
      setUserAddress();
      setIsConnected(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ userAddress, isConnected, login, logout }}>
      {!loading && children} {}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
