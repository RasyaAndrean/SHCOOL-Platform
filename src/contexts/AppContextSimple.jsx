import { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const login = (username, password) => {
    // Simple authentication logic (in a real app, this would be more secure)
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const addNotification = (message, severity = 'info') => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      severity,
      timestamp: new Date(),
    };
    setNotifications(prev => [...prev, notification]);
    return id;
  };

  const removeNotification = id => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const value = {
    darkMode,
    toggleDarkMode,
    isAuthenticated,
    login,
    logout,
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
