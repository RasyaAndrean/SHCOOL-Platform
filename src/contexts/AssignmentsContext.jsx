import { createContext, useContext, useEffect, useState } from 'react';

const AssignmentsContext = createContext();

export const useAssignmentsContext = () => {
  const context = useContext(AssignmentsContext);
  if (!context) {
    throw new Error(
      'useAssignmentsContext must be used within an AssignmentsProvider'
    );
  }
  return context;
};

export const AssignmentsProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Load assignments and submissions from localStorage on initial load
  useEffect(() => {
    const savedAssignments = localStorage.getItem('assignments');
    const savedSubmissions = localStorage.getItem('submissions');

    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }

    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }
  }, []);

  // Save assignments to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('assignments', JSON.stringify(assignments));
  }, [assignments]);

  // Save submissions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('submissions', JSON.stringify(submissions));
  }, [submissions]);

  const addAssignment = assignmentData => {
    const newAssignment = {
      id: Date.now(),
      postedDate: new Date().toISOString().split('T')[0],
      ...assignmentData,
    };
    setAssignments(prev => [...prev, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = (id, updatedData) => {
    setAssignments(prev =>
      prev.map(assignment =>
        assignment.id === id ? { ...assignment, ...updatedData } : assignment
      )
    );
  };

  const deleteAssignment = id => {
    setAssignments(prev => prev.filter(assignment => assignment.id !== id));
    // Also remove submissions for this assignment
    setSubmissions(prev =>
      prev.filter(submission => submission.assignmentId !== id)
    );
  };

  const submitAssignment = (assignmentId, submissionData) => {
    const newSubmission = {
      id: Date.now(),
      assignmentId,
      submittedDate: new Date().toISOString().split('T')[0],
      ...submissionData,
    };
    setSubmissions(prev => [...prev, newSubmission]);
    return newSubmission;
  };

  const getAssignmentSubmissions = assignmentId => {
    return submissions.filter(
      submission => submission.assignmentId === assignmentId
    );
  };

  const getUserSubmissions = userId => {
    return submissions.filter(submission => submission.userId === userId);
  };

  const isAssignmentSubmitted = (assignmentId, userId) => {
    return submissions.some(
      submission =>
        submission.assignmentId === assignmentId && submission.userId === userId
    );
  };

  // New function to get submission by assignment and user
  const getSubmissionByAssignmentAndUser = (assignmentId, userId) => {
    return submissions.find(
      submission =>
        submission.assignmentId === assignmentId && submission.userId === userId
    );
  };

  // New function to update a submission
  const updateSubmission = (id, updatedData) => {
    setSubmissions(prev =>
      prev.map(submission =>
        submission.id === id ? { ...submission, ...updatedData } : submission
      )
    );
  };

  // New function to delete a submission
  const deleteSubmission = id => {
    setSubmissions(prev => prev.filter(submission => submission.id !== id));
  };

  // New function to get all submissions with assignment details
  const getAllSubmissionsWithDetails = () => {
    return submissions.map(submission => {
      const assignment = assignments.find(
        a => a.id === submission.assignmentId
      );
      return {
        ...submission,
        assignmentTitle: assignment ? assignment.title : 'Unknown Assignment',
        assignmentSubject: assignment ? assignment.subject : 'Unknown Subject',
      };
    });
  };

  // New function to get overdue assignments
  const getOverdueAssignments = () => {
    const today = new Date();
    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate < today && !isAssignmentSubmitted(assignment.id, 1); // Assuming user ID 1 for demo
    });
  };

  // New function to get completed assignments for a user
  const getUserCompletedAssignments = userId => {
    return submissions
      .filter(submission => submission.userId === userId)
      .map(submission => {
        const assignment = assignments.find(
          a => a.id === submission.assignmentId
        );
        return {
          ...submission,
          assignment,
        };
      })
      .filter(item => item.assignment); // Filter out submissions without matching assignments
  };

  // New function to get assignment statistics
  const getAssignmentStatistics = () => {
    const total = assignments.length;
    const overdue = getOverdueAssignments().length;
    const completed = submissions.length; // Simplified for demo

    return {
      total,
      overdue,
      completed,
      pending: total - completed,
    };
  };

  // New function to get assignments by subject
  const getAssignmentsBySubject = subject => {
    return assignments.filter(assignment => assignment.subject === subject);
  };

  // New function to get recent assignments
  const getRecentAssignments = (limit = 5) => {
    return [...assignments]
      .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
      .slice(0, limit);
  };

  const value = {
    assignments,
    submissions,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    submitAssignment,
    getAssignmentSubmissions,
    getUserSubmissions,
    isAssignmentSubmitted,
    getSubmissionByAssignmentAndUser,
    updateSubmission,
    deleteSubmission,
    getAllSubmissionsWithDetails,
    getOverdueAssignments,
    getUserCompletedAssignments,
    getAssignmentStatistics,
    getAssignmentsBySubject,
    getRecentAssignments,
  };

  return (
    <AssignmentsContext.Provider value={value}>
      {children}
    </AssignmentsContext.Provider>
  );
};
