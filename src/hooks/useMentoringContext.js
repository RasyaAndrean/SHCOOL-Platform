import { useMentoringContext } from '../contexts/MentoringContext';

export const useMentoring = () => {
  const context = useMentoringContext();
  if (!context) {
    throw new Error('useMentoring must be used within a MentoringProvider');
  }
  return context;
};
