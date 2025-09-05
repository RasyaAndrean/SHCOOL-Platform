import { createContext, useContext, useEffect, useState } from 'react';

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
  const [loading, setLoading] = useState(false);

  // Check for saved theme preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
      }
    } catch (error) {
      console.warn(
        'Unable to access localStorage for theme preference:',
        error
      );
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    try {
      if (darkMode) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    } catch (error) {
      console.warn('Unable to access localStorage for theme:', error);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const login = (username, password) => {
    // Simple authentication logic (in a real app, this would be more secure)
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('isAuthenticated', 'true');
      } catch (error) {
        console.warn(
          'Unable to access localStorage for authentication:',
          error
        );
      }
      addNotification('Login berhasil!', 'success');
      return true;
    }
    addNotification('Username atau password salah!', 'error');
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.warn('Unable to access localStorage for authentication:', error);
    }
    addNotification('Logout berhasil!', 'info');
  };

  const addNotification = (
    message,
    severity = 'info',
    duration = 6000,
    category = null,
    title = null
  ) => {
    const id = Date.now() + Math.random();
    const notification = {
      id,
      message,
      severity,
      timestamp: new Date(),
      category,
      title,
    };
    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after specified duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }

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
    loading,
    setLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContext;
