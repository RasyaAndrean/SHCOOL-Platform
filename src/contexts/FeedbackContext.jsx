import { createContext, useContext, useEffect, useState } from 'react';

export const FeedbackContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useFeedbackContext = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error(
      'useFeedbackContext must be used within a FeedbackProvider'
    );
  }
  return context;
};

export const FeedbackProvider = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState(() => {
    const saved = localStorage.getItem('feedbacks');
    return saved
      ? JSON.parse(saved)
      : [
          // Sample feedback data
          {
            id: 1,
            studentId: 1,
            type: 'course',
            category: 'Materi Pembelajaran',
            title: 'Kesulitan memahami konsep jaringan',
            description:
              'Saya merasa materi tentang subnetting masih terlalu rumit dan butuh lebih banyak contoh praktis.',
            rating: 3,
            status: 'submitted',
            createdAt: '2023-05-15T10:30:00Z',
            updatedAt: '2023-05-15T10:30:00Z',
            response: null,
          },
          {
            id: 2,
            studentId: 2,
            type: 'teacher',
            category: 'Metode Pengajaran',
            title: 'Metode pembelajaran sangat menarik',
            description:
              'Pak guru menjelaskan materi dengan cara yang mudah dipahami dan interaktif.',
            rating: 5,
            status: 'submitted',
            createdAt: '2023-05-16T14:20:00Z',
            updatedAt: '2023-05-16T14:20:00Z',
            response: {
              adminId: 1,
              responseText:
                'Terima kasih atas apresiasinya. Kami akan terus berusaha meningkatkan kualitas pembelajaran.',
              respondedAt: '2023-05-17T09:15:00Z',
            },
          },
        ];
  });

  // Save to localStorage whenever feedbacks change
  useEffect(() => {
    localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
  }, [feedbacks]);

  const addFeedback = feedbackData => {
    const newFeedback = {
      id: Date.now(),
      ...feedbackData,
      status: 'submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFeedbacks(prev => [...prev, newFeedback]);
    return newFeedback.id;
  };

  const updateFeedback = (id, updatedData) => {
    setFeedbacks(prev =>
      prev.map(feedback =>
        feedback.id === id
          ? { ...feedback, ...updatedData, updatedAt: new Date().toISOString() }
          : feedback
      )
    );
  };

  const deleteFeedback = id => {
    setFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
  };

  const getFeedbackById = id => {
    return feedbacks.find(feedback => feedback.id === id);
  };

  const getFeedbacksByStudentId = studentId => {
    return feedbacks.filter(feedback => feedback.studentId === studentId);
  };

  const getAllFeedbacks = () => {
    return feedbacks;
  };

  const getPendingFeedbacks = () => {
    return feedbacks.filter(
      feedback => feedback.status === 'submitted' && !feedback.response
    );
  };

  const respondToFeedback = (feedbackId, responseText, adminId) => {
    setFeedbacks(prev =>
      prev.map(feedback => {
        if (feedback.id === feedbackId) {
          return {
            ...feedback,
            status: 'responded',
            response: {
              adminId,
              responseText,
              respondedAt: new Date().toISOString(),
            },
            updatedAt: new Date().toISOString(),
          };
        }
        return feedback;
      })
    );
  };

  const getFeedbackStats = () => {
    const total = feedbacks.length;
    const pending = feedbacks.filter(
      f => f.status === 'submitted' && !f.response
    ).length;
    const responded = feedbacks.filter(
      f => f.status === 'responded' || f.response
    ).length;

    // Calculate average rating
    const ratings = feedbacks.map(f => f.rating).filter(r => r > 0);
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : 0;

    return {
      total,
      pending,
      responded,
      avgRating,
    };
  };

  const value = {
    feedbacks,
    addFeedback,
    updateFeedback,
    deleteFeedback,
    getFeedbackById,
    getFeedbacksByStudentId,
    getAllFeedbacks,
    getPendingFeedbacks,
    respondToFeedback,
    getFeedbackStats,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
