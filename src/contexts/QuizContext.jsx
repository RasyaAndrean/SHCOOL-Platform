import { createContext, useContext, useEffect, useState } from 'react';

const QuizContext = createContext();

export const useQuizContext = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizContext must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedQuizzes = localStorage.getItem('quizzes');
    const savedSubmissions = localStorage.getItem('quizSubmissions');

    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }

    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('quizSubmissions', JSON.stringify(submissions));
  }, [submissions]);

  // CRUD operations for quizzes
  const addQuiz = quiz => {
    setQuizzes(prev => [...prev, { ...quiz, id: Date.now() }]);
  };

  const updateQuiz = (id, updatedQuiz) => {
    setQuizzes(prev =>
      prev.map(quiz => (quiz.id === id ? { ...quiz, ...updatedQuiz } : quiz))
    );
  };

  const deleteQuiz = id => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== id));
    // Also delete associated submissions
    setSubmissions(prev => prev.filter(submission => submission.quizId !== id));
  };

  // Submission management
  const submitQuiz = (quizId, studentId, answers) => {
    const newSubmission = {
      id: Date.now(),
      quizId,
      studentId,
      answers,
      submittedAt: new Date().toISOString(),
      score: calculateScore(quizId, answers),
    };

    setSubmissions(prev => [...prev, newSubmission]);
    return newSubmission;
  };

  const calculateScore = (quizId, answers) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return 0;

    let correct = 0;
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        correct++;
      }
    });

    return Math.round((correct / quiz.questions.length) * 100);
  };

  // Get submissions for a specific quiz
  const getSubmissionsForQuiz = quizId => {
    return submissions.filter(submission => submission.quizId === quizId);
  };

  // Get submissions for a specific student
  const getSubmissionsForStudent = studentId => {
    return submissions.filter(submission => submission.studentId === studentId);
  };

  // Get average score for a quiz
  const getAverageScore = quizId => {
    const quizSubmissions = getSubmissionsForQuiz(quizId);
    if (quizSubmissions.length === 0) return 0;

    const total = quizSubmissions.reduce(
      (sum, submission) => sum + submission.score,
      0
    );
    return Math.round(total / quizSubmissions.length);
  };

  const value = {
    quizzes,
    submissions,
    addQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    getSubmissionsForQuiz,
    getSubmissionsForStudent,
    getAverageScore,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};
