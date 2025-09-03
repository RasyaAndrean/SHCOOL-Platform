import { createContext, useContext, useEffect, useState } from 'react';

const ProgressContext = createContext();

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error(
      'useProgressContext must be used within a ProgressProvider'
    );
  }
  return context;
};

export const ProgressProvider = ({ children }) => {
  const [progressData, setProgressData] = useState([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedProgress = localStorage.getItem('progressData');
    if (savedProgress) {
      setProgressData(JSON.parse(savedProgress));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('progressData', JSON.stringify(progressData));
  }, [progressData]);

  // Add or update progress for a subject
  const updateProgress = (subject, topic, progress) => {
    setProgressData(prev => {
      const existingIndex = prev.findIndex(
        item => item.subject === subject && item.topic === topic
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], progress };
        return updated;
      } else {
        return [
          ...prev,
          { subject, topic, progress, date: new Date().toISOString() },
        ];
      }
    });
  };

  // Get progress for a specific subject
  const getProgressBySubject = subject => {
    return progressData.filter(item => item.subject === subject);
  };

  // Get overall progress across all subjects
  const getOverallProgress = () => {
    if (progressData.length === 0) return 0;
    const total = progressData.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(total / progressData.length);
  };

  // Get progress summary by subject
  const getProgressSummary = () => {
    const summary = {};
    progressData.forEach(item => {
      if (!summary[item.subject]) {
        summary[item.subject] = { total: 0, count: 0 };
      }
      summary[item.subject].total += item.progress;
      summary[item.subject].count += 1;
    });

    const result = {};
    Object.keys(summary).forEach(subject => {
      result[subject] = Math.round(
        summary[subject].total / summary[subject].count
      );
    });

    return result;
  };

  // Delete progress entry
  const deleteProgress = (subject, topic) => {
    setProgressData(prev =>
      prev.filter(item => !(item.subject === subject && item.topic === topic))
    );
  };

  const value = {
    progressData,
    updateProgress,
    getProgressBySubject,
    getOverallProgress,
    getProgressSummary,
    deleteProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
