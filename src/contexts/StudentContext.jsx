import { createContext, useContext, useEffect, useState } from 'react';

const StudentContext = createContext();

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentContext must be used within a StudentProvider');
  }
  return context;
};

export const StudentProvider = ({ children }) => {
  // Student activities and achievements
  const [studentActivities, setStudentActivities] = useState(() => {
    const saved = localStorage.getItem('studentActivities');
    return saved ? JSON.parse(saved) : [];
  });

  // Student achievements
  const [studentAchievements, setStudentAchievements] = useState(() => {
    const saved = localStorage.getItem('studentAchievements');
    return saved ? JSON.parse(saved) : [];
  });

  // Student projects
  const [studentProjects, setStudentProjects] = useState(() => {
    const saved = localStorage.getItem('studentProjects');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(
      'studentActivities',
      JSON.stringify(studentActivities)
    );
  }, [studentActivities]);

  useEffect(() => {
    localStorage.setItem(
      'studentAchievements',
      JSON.stringify(studentAchievements)
    );
  }, [studentAchievements]);

  useEffect(() => {
    localStorage.setItem('studentProjects', JSON.stringify(studentProjects));
  }, [studentProjects]);

  // Activity functions
  const addActivity = (studentId, activity) => {
    const newActivity = {
      id: Date.now(),
      studentId,
      ...activity,
      timestamp: new Date().toISOString(),
    };
    setStudentActivities(prev => [...prev, newActivity]);
  };

  const getActivitiesByStudentId = studentId => {
    return studentActivities.filter(
      activity => activity.studentId === studentId
    );
  };

  // Achievement functions
  const addAchievement = (studentId, achievement) => {
    const newAchievement = {
      id: Date.now(),
      studentId,
      ...achievement,
      date: new Date().toISOString().split('T')[0],
    };
    setStudentAchievements(prev => [...prev, newAchievement]);
  };

  const getAchievementsByStudentId = studentId => {
    return studentAchievements.filter(
      achievement => achievement.studentId === studentId
    );
  };

  const deleteAchievement = id => {
    setStudentAchievements(prev =>
      prev.filter(achievement => achievement.id !== id)
    );
  };

  // Project functions
  const addProject = (studentId, project) => {
    const newProject = {
      id: Date.now(),
      studentId,
      ...project,
      date: new Date().toISOString().split('T')[0],
    };
    setStudentProjects(prev => [...prev, newProject]);
  };

  const getProjectsByStudentId = studentId => {
    return studentProjects.filter(project => project.studentId === studentId);
  };

  const updateProject = (id, updatedProject) => {
    setStudentProjects(prev =>
      prev.map(project =>
        project.id === id ? { ...project, ...updatedProject } : project
      )
    );
  };

  const deleteProject = id => {
    setStudentProjects(prev => prev.filter(project => project.id !== id));
  };

  const value = {
    // Data
    studentActivities,
    studentAchievements,
    studentProjects,

    // Functions
    addActivity,
    getActivitiesByStudentId,
    addAchievement,
    getAchievementsByStudentId,
    deleteAchievement,
    addProject,
    getProjectsByStudentId,
    updateProject,
    deleteProject,
  };

  return (
    <StudentContext.Provider value={value}>{children}</StudentContext.Provider>
  );
};
