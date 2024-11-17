import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  userAddress: null,
  isConnected: false,
  authToken: null,  // Add authToken to the context
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState(null);
  const [authToken, setAuthToken] = useState(null);  // Manage the token state
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true); 

  const login = (userAddress, token) => {
    setUserAddress(userAddress);
    setAuthToken(token);  // Set the token
    setIsConnected(true);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userAddress', userAddress);  // Store userAddress as well
  };

  const logout = () => {
    setUserAddress(null);
    setAuthToken(null);  // Clear the token
    setIsConnected(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userAddress');  // Clear userAddress from localStorage
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userAddress');
    if (token && user) {
      setAuthToken(token);  // Set the authToken from localStorage
      setUserAddress(user);  // Set the userAddress from localStorage
      setIsConnected(true);
    }
    setLoading(false);
  }, []);

  // Only render children after loading is complete
  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ userAddress, authToken, isConnected, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);