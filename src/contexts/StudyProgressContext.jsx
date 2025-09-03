import { createContext, useContext, useEffect, useState } from 'react';

const StudyProgressContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useStudyProgressContext = () => {
  const context = useContext(StudyProgressContext);
  if (!context) {
    throw new Error(
      'useStudyProgressContext must be used within a StudyProgressProvider'
    );
  }
  return context;
};

export const StudyProgressProvider = ({ children }) => {
  const [studyProgressData, setStudyProgressData] = useState(() => {
    const saved = localStorage.getItem('studyProgressData');
    return saved
      ? JSON.parse(saved)
      : [
          // Sample data for demonstration
          {
            id: 1,
            studentId: 1,
            subject: 'Matematika',
            topic: 'Aljabar',
            progress: 75,
            timeSpent: 120, // in minutes
            lastAccessed: '2023-05-15T10:30:00Z',
            goals: [
              {
                id: 1,
                description: 'Memahami konsep persamaan linear',
                completed: true,
              },
              {
                id: 2,
                description: 'Menyelesaikan soal sistem persamaan',
                completed: false,
              },
            ],
          },
          {
            id: 2,
            studentId: 1,
            subject: 'Fisika',
            topic: 'Mekanika',
            progress: 60,
            timeSpent: 90,
            lastAccessed: '2023-05-14T14:20:00Z',
            goals: [
              { id: 3, description: 'Memahami hukum Newton', completed: true },
              { id: 4, description: 'Menghitung gaya gesek', completed: false },
            ],
          },
          {
            id: 3,
            studentId: 2,
            subject: 'Matematika',
            topic: 'Geometri',
            progress: 85,
            timeSpent: 150,
            lastAccessed: '2023-05-16T09:15:00Z',
            goals: [
              {
                id: 5,
                description: 'Memahami teorema Pythagoras',
                completed: true,
              },
              {
                id: 6,
                description: 'Menghitung luas bangun datar',
                completed: true,
              },
            ],
          },
        ];
  });

  // Save to localStorage whenever studyProgressData changes
  useEffect(() => {
    localStorage.setItem(
      'studyProgressData',
      JSON.stringify(studyProgressData)
    );
  }, [studyProgressData]);

  const addStudyProgress = progressData => {
    const newProgress = {
      id: Date.now(),
      ...progressData,
      lastAccessed: new Date().toISOString(),
    };
    setStudyProgressData(prev => [...prev, newProgress]);
    return newProgress.id;
  };

  const updateStudyProgress = (id, updatedData) => {
    setStudyProgressData(prev =>
      prev.map(progress =>
        progress.id === id
          ? {
              ...progress,
              ...updatedData,
              lastAccessed: new Date().toISOString(),
            }
          : progress
      )
    );
  };

  const deleteStudyProgress = id => {
    setStudyProgressData(prev => prev.filter(progress => progress.id !== id));
  };

  const getStudyProgressById = id => {
    return studyProgressData.find(progress => progress.id === id);
  };

  const getStudyProgressByStudentId = studentId => {
    return studyProgressData.filter(
      progress => progress.studentId === studentId
    );
  };

  const getStudyProgressBySubject = subject => {
    return studyProgressData.filter(progress => progress.subject === subject);
  };

  const getAllStudyProgress = () => {
    return studyProgressData;
  };

  const addGoalToProgress = (progressId, goalData) => {
    setStudyProgressData(prev =>
      prev.map(progress => {
        if (progress.id === progressId) {
          const newGoal = {
            id: Date.now(),
            ...goalData,
            completed: false,
          };
          return {
            ...progress,
            goals: [...(progress.goals || []), newGoal],
          };
        }
        return progress;
      })
    );
  };

  const updateGoal = (progressId, goalId, updatedGoal) => {
    setStudyProgressData(prev =>
      prev.map(progress => {
        if (progress.id === progressId) {
          return {
            ...progress,
            goals: progress.goals.map(goal =>
              goal.id === goalId ? { ...goal, ...updatedGoal } : goal
            ),
          };
        }
        return progress;
      })
    );
  };

  const deleteGoal = (progressId, goalId) => {
    setStudyProgressData(prev =>
      prev.map(progress => {
        if (progress.id === progressId) {
          return {
            ...progress,
            goals: progress.goals.filter(goal => goal.id !== goalId),
          };
        }
        return progress;
      })
    );
  };

  const getOverallProgressForStudent = studentId => {
    const studentProgress = studyProgressData.filter(
      p => p.studentId === studentId
    );
    if (studentProgress.length === 0) return 0;

    const totalProgress = studentProgress.reduce(
      (sum, p) => sum + p.progress,
      0
    );
    return Math.round(totalProgress / studentProgress.length);
  };

  const getSubjectProgressForStudent = studentId => {
    const studentProgress = studyProgressData.filter(
      p => p.studentId === studentId
    );
    const subjectProgress = {};

    studentProgress.forEach(progress => {
      if (!subjectProgress[progress.subject]) {
        subjectProgress[progress.subject] = {
          subject: progress.subject,
          totalProgress: 0,
          count: 0,
          averageProgress: 0,
        };
      }
      subjectProgress[progress.subject].totalProgress += progress.progress;
      subjectProgress[progress.subject].count += 1;
    });

    // Calculate average progress for each subject
    Object.keys(subjectProgress).forEach(subject => {
      subjectProgress[subject].averageProgress = Math.round(
        subjectProgress[subject].totalProgress / subjectProgress[subject].count
      );
    });

    return Object.values(subjectProgress);
  };

  const getStudyTimeStats = studentId => {
    const studentProgress = studyProgressData.filter(
      p => p.studentId === studentId
    );
    const totalTime = studentProgress.reduce((sum, p) => sum + p.timeSpent, 0);

    // Group by subject
    const subjectTime = {};
    studentProgress.forEach(progress => {
      if (!subjectTime[progress.subject]) {
        subjectTime[progress.subject] = 0;
      }
      subjectTime[progress.subject] += progress.timeSpent;
    });

    return {
      totalTime,
      subjectTime,
    };
  };

  const value = {
    studyProgressData,
    addStudyProgress,
    updateStudyProgress,
    deleteStudyProgress,
    getStudyProgressById,
    getStudyProgressByStudentId,
    getStudyProgressBySubject,
    getAllStudyProgress,
    addGoalToProgress,
    updateGoal,
    deleteGoal,
    getOverallProgressForStudent,
    getSubjectProgressForStudent,
    getStudyTimeStats,
  };

  return (
    <StudyProgressContext.Provider value={value}>
      {children}
    </StudyProgressContext.Provider>
  );
};
