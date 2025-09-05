import { createContext, useContext, useEffect, useState } from 'react';

export const AchievementContext = createContext();

export const useAchievementContext = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      'useAchievementContext must be used within an AchievementProvider'
    );
  }
  return context;
};

export const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });

  const [badges] = useState(() => {
    const saved = localStorage.getItem('badges');
    return saved
      ? JSON.parse(saved)
      : [
          // Sample badges for demonstration
          {
            id: 1,
            name: 'Pembelajar Aktif',
            description: 'Selesaikan 5 tugas',
            icon: '📚',
            criteria: { type: 'assignmentsCompleted', count: 5 },
            earned: false,
          },
          {
            id: 2,
            name: 'Master Kuis',
            description: 'Dapatkan skor sempurna di 3 kuis',
            icon: '🏆',
            criteria: { type: 'perfectQuizScores', count: 3 },
            earned: false,
          },
          {
            id: 3,
            name: 'Kolaborator Hebat',
            description: 'Bergabung dalam 2 kelompok studi',
            icon: '👥',
            criteria: { type: 'studyGroupsJoined', count: 2 },
            earned: false,
          },
          {
            id: 4,
            name: 'Pembaca Rajin',
            description: 'Baca 10 materi perpustakaan',
            icon: '📖',
            criteria: { type: 'libraryItemsRead', count: 10 },
            earned: false,
          },
          {
            id: 5,
            name: 'Pengumpul Tepat Waktu',
            description: 'Kumpulkan 5 tugas tepat waktu',
            icon: '⏰',
            criteria: { type: 'onTimeSubmissions', count: 5 },
            earned: false,
          },
        ];
  });

  const [studentAchievements, setStudentAchievements] = useState(() => {
    const saved = localStorage.getItem('studentAchievements');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(achievements));
  }, [achievements]);

  useEffect(() => {
    localStorage.setItem('badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem(
      'studentAchievements',
      JSON.stringify(studentAchievements)
    );
  }, [studentAchievements]);

  // Achievement management
  const addAchievement = achievementData => {
    const newAchievement = {
      id: Date.now(),
      ...achievementData,
      earnedAt: new Date().toISOString(),
    };
    setAchievements(prev => [...prev, newAchievement]);
    return newAchievement.id;
  };

  const getAchievementsByStudent = studentId => {
    return achievements.filter(
      achievement => achievement.studentId === studentId
    );
  };

  // Badge management
  const getBadgesByStudent = studentId => {
    return badges.filter(badge => {
      const studentBadges = studentAchievements[studentId] || [];
      return studentBadges.includes(badge.id);
    });
  };

  const getUnearnedBadgesByStudent = studentId => {
    return badges.filter(badge => {
      const studentBadges = studentAchievements[studentId] || [];
      return !studentBadges.includes(badge.id);
    });
  };

  const earnBadge = (studentId, badgeId) => {
    setStudentAchievements(prev => {
      const studentBadges = prev[studentId] || [];
      if (!studentBadges.includes(badgeId)) {
        return {
          ...prev,
          [studentId]: [...studentBadges, badgeId],
        };
      }
      return prev;
    });
  };

  // Check if student has earned a specific badge
  const hasEarnedBadge = (studentId, badgeId) => {
    const studentBadges = studentAchievements[studentId] || [];
    return studentBadges.includes(badgeId);
  };

  // Get badge by ID
  const getBadgeById = badgeId => {
    return badges.find(badge => badge.id === badgeId);
  };

  // Statistics
  const getAchievementCount = studentId => {
    return getAchievementsByStudent(studentId).length;
  };

  const getBadgeCount = studentId => {
    return getBadgesByStudent(studentId).length;
  };

  const value = {
    achievements,
    badges,
    studentAchievements,
    addAchievement,
    getAchievementsByStudent,
    getBadgesByStudent,
    getUnearnedBadgesByStudent,
    earnBadge,
    hasEarnedBadge,
    getBadgeById,
    getAchievementCount,
    getBadgeCount,
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};

export default AchievementContext;
