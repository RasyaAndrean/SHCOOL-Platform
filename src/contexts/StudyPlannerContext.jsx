import { createContext, useContext, useEffect, useState } from 'react';

const StudyPlannerContext = createContext();

export const useStudyPlannerContext = () => {
  const context = useContext(StudyPlannerContext);
  if (!context) {
    throw new Error(
      'useStudyPlannerContext must be used within a StudyPlannerProvider'
    );
  }
  return context;
};

export const StudyPlannerProvider = ({ children }) => {
  const [studyPlans, setStudyPlans] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedStudyPlans = localStorage.getItem('studyPlans');
    const savedCompletedTasks = localStorage.getItem('completedTasks');

    if (savedStudyPlans) setStudyPlans(JSON.parse(savedStudyPlans));
    if (savedCompletedTasks) setCompletedTasks(JSON.parse(savedCompletedTasks));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studyPlans', JSON.stringify(studyPlans));
  }, [studyPlans]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  // CRUD operations for study plans
  const addStudyPlan = plan => {
    setStudyPlans(prev => [...prev, { ...plan, id: Date.now() }]);
  };

  const updateStudyPlan = (id, updatedPlan) => {
    setStudyPlans(prev =>
      prev.map(plan => (plan.id === id ? { ...plan, ...updatedPlan } : plan))
    );
  };

  const deleteStudyPlan = id => {
    setStudyPlans(prev => prev.filter(plan => plan.id !== id));
  };

  // Task completion management
  const markTaskAsCompleted = taskId => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks(prev => [...prev, taskId]);
    }
  };

  const markTaskAsIncomplete = taskId => {
    setCompletedTasks(prev => prev.filter(id => id !== taskId));
  };

  // Get study plans for a specific subject
  const getPlansBySubject = subject => {
    return studyPlans.filter(plan => plan.subject === subject);
  };

  // Get upcoming study plans
  const getUpcomingPlans = () => {
    const today = new Date();
    return studyPlans.filter(plan => new Date(plan.date) >= today);
  };

  // Get completed study plans
  const getCompletedPlans = () => {
    return studyPlans.filter(plan =>
      plan.tasks.every(task => completedTasks.includes(task.id))
    );
  };

  const value = {
    studyPlans,
    completedTasks,
    addStudyPlan,
    updateStudyPlan,
    deleteStudyPlan,
    markTaskAsCompleted,
    markTaskAsIncomplete,
    getPlansBySubject,
    getUpcomingPlans,
    getCompletedPlans,
  };

  return (
    <StudyPlannerContext.Provider value={value}>
      {children}
    </StudyPlannerContext.Provider>
  );
};
