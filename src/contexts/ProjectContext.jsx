import { createContext, useContext, useEffect, useState } from 'react';

const ProjectContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addProject = projectData => {
    const newProject = {
      id: Date.now(),
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects(prev => [...prev, newProject]);
    return newProject.id;
  };

  const updateProject = (id, updatedData) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === id
          ? { ...project, ...updatedData, updatedAt: new Date().toISOString() }
          : project
      )
    );
  };

  const deleteProject = id => {
    setProjects(prev => prev.filter(project => project.id !== id));
  };

  const getProjectById = id => {
    return projects.find(project => project.id === id);
  };

  const getProjectsByStudentId = studentId => {
    return projects.filter(project => project.studentId === studentId);
  };

  const getAllProjects = () => {
    return projects;
  };

  // Add a comment to a project
  const addProjectComment = (projectId, commentData) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          const newComment = {
            id: Date.now(),
            ...commentData,
            timestamp: new Date().toISOString(),
          };
          return {
            ...project,
            comments: [...(project.comments || []), newComment],
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      })
    );
  };

  // Update a project comment
  const updateProjectComment = (projectId, commentId, updatedComment) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            comments: project.comments.map(comment =>
              comment.id === commentId
                ? {
                    ...comment,
                    ...updatedComment,
                    timestamp: new Date().toISOString(),
                  }
                : comment
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      })
    );
  };

  // Delete a project comment
  const deleteProjectComment = (projectId, commentId) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            comments: project.comments.filter(
              comment => comment.id !== commentId
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      })
    );
  };

  // Add peer review functionality
  const addPeerReview = (projectId, reviewData) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          const newReview = {
            id: Date.now(),
            ...reviewData,
            timestamp: new Date().toISOString(),
          };
          return {
            ...project,
            peerReviews: [...(project.peerReviews || []), newReview],
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      })
    );
  };

  // Update a peer review
  const updatePeerReview = (projectId, reviewId, updatedReview) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            peerReviews: project.peerReviews.map(review =>
              review.id === reviewId
                ? {
                    ...review,
                    ...updatedReview,
                    timestamp: new Date().toISOString(),
                  }
                : review
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      })
    );
  };

  // Delete a peer review
  const deletePeerReview = (projectId, reviewId) => {
    setProjects(prev =>
      prev.map(project => {
        if (project.id === projectId) {
          return {
            ...project,
            peerReviews: project.peerReviews.filter(
              review => review.id !== reviewId
            ),
            updatedAt: new Date().toISOString(),
          };
        }
        return project;
      })
    );
  };

  // Get peer reviews for a project
  const getPeerReviews = projectId => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.peerReviews || [] : [];
  };

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getProjectsByStudentId,
    getAllProjects,
    addProjectComment,
    updateProjectComment,
    deleteProjectComment,
    // Peer review functions
    addPeerReview,
    updatePeerReview,
    deletePeerReview,
    getPeerReviews,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
