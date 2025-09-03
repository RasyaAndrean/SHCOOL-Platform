import { createContext, useContext, useEffect, useState } from 'react';

const ActivityContext = createContext();

export const useActivityContext = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error(
      'useActivityContext must be used within an ActivityProvider'
    );
  }
  return context;
};

export const ActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);

  // Load activities from localStorage on initial load
  useEffect(() => {
    const savedActivities = localStorage.getItem('activities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
  }, []);

  // Save activities to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  const addActivity = (action, details = '') => {
    const newActivity = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      action,
      details,
    };
    setActivities(prev => [newActivity, ...prev.slice(0, 49)]); // Keep only last 50 activities
  };

  const clearActivities = () => {
    setActivities([]);
    localStorage.removeItem('activities');
  };

  const value = {
    activities,
    addActivity,
    clearActivities,
  };

  return (
    <ActivityContext.Provider value={value}>
      {children}
    </ActivityContext.Provider>
  );
};
