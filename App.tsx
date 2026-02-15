import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Optional: Check local storage to persist session for reload
  useEffect(() => {
    const session = localStorage.getItem('barcelona_session');
    if (session === 'active') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('barcelona_session', 'active');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('barcelona_session');
  };

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;