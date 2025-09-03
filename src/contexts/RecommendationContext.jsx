import { createContext, useContext, useEffect, useState } from 'react';
import { useProgressContext } from './ProgressContext';

const RecommendationContext = createContext();

export function useRecommendationContext() {
  const context = useContext(RecommendationContext);
  if (!context) {
    throw new Error(
      'useRecommendationContext must be used within a RecommendationProvider'
    );
  }
  return context;
}

export function RecommendationProvider({ children }) {
  const { progressData, getProgressSummary } = useProgressContext();
  const [recommendations, setRecommendations] = useState([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedRecommendations = localStorage.getItem('recommendations');
    if (savedRecommendations) {
      setRecommendations(JSON.parse(savedRecommendations));
    } else {
      // Generate initial recommendations
      generateRecommendations();
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('recommendations', JSON.stringify(recommendations));
  }, [recommendations]);

  // Generate study recommendations based on progress data
  const generateRecommendations = () => {
    const progressSummary = getProgressSummary();
    const newRecommendations = [];

    // Recommendation based on low progress subjects
    Object.keys(progressSummary).forEach(subject => {
      const progress = progressSummary[subject];
      if (progress < 60) {
        newRecommendations.push({
          id: Date.now() + Math.random(),
          type: 'study',
          subject,
          priority: 'high',
          message: `Fokus belajar pada mata pelajaran ${subject} karena progress masih di bawah 60%`,
          action: 'Pelajari materi dasar dan kerjakan latihan tambahan',
        });
      } else if (progress < 80) {
        newRecommendations.push({
          id: Date.now() + Math.random(),
          type: 'study',
          subject,
          priority: 'medium',
          message: `Tingkatkan pemahaman pada mata pelajaran ${subject}`,
          action: 'Review materi dan kerjakan soal latihan',
        });
      }
    });

    // General study recommendations
    if (progressData.length > 0) {
      const averageProgress =
        progressData.reduce((sum, item) => sum + item.progress, 0) /
        progressData.length;

      if (averageProgress < 70) {
        newRecommendations.push({
          id: Date.now() + Math.random(),
          type: 'general',
          subject: 'Semua Mata Pelajaran',
          priority: 'high',
          message: 'Rata-rata progress belajarmu masih di bawah 70%',
          action: 'Buat jadwal belajar yang teratur dan konsisten',
        });
      }

      // Recommendation for subjects with no progress
      const allSubjects = [
        'Jaringan Komputer',
        'Pemrograman Web',
        'Sistem Operasi',
        'Desain Grafis',
        'Matematika',
        'Bahasa Indonesia',
        'Bahasa Inggris',
        'PKn',
        'IPS',
        'IPA',
      ];

      const subjectsWithProgress = progressData.map(item => item.subject);
      const subjectsWithoutProgress = allSubjects.filter(
        subject => !subjectsWithProgress.includes(subject)
      );

      subjectsWithoutProgress.forEach(subject => {
        newRecommendations.push({
          id: Date.now() + Math.random(),
          type: 'study',
          subject,
          priority: 'high',
          message: `Belum ada progress pada mata pelajaran ${subject}`,
          action: 'Mulai pelajari materi dasar',
        });
      });
    }

    setRecommendations(newRecommendations);
  };

  // Add a custom recommendation
  const addRecommendation = recommendation => {
    const newRecommendation = {
      id: Date.now(),
      ...recommendation,
    };
    setRecommendations(prev => [...prev, newRecommendation]);
  };

  // Remove a recommendation
  const removeRecommendation = id => {
    setRecommendations(prev => prev.filter(rec => rec.id !== id));
  };

  // Mark recommendation as completed
  const completeRecommendation = id => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id
          ? { ...rec, completed: true, completedAt: new Date().toISOString() }
          : rec
      )
    );
  };

  // Get recommendations by priority
  const getRecommendationsByPriority = priority => {
    return recommendations.filter(
      rec => rec.priority === priority && !rec.completed
    );
  };

  // Get all active recommendations
  const getActiveRecommendations = () => {
    return recommendations.filter(rec => !rec.completed);
  };

  const value = {
    recommendations,
    generateRecommendations,
    addRecommendation,
    removeRecommendation,
    completeRecommendation,
    getRecommendationsByPriority,
    getActiveRecommendations,
  };

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  );
}
