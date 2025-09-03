import { createContext, useContext, useEffect, useState } from 'react';

const PeerCollaborationContext = createContext();

const usePeerCollaborationContext = () => {
  const context = useContext(PeerCollaborationContext);
  if (!context) {
    throw new Error(
      'usePeerCollaborationContext must be used within a PeerCollaborationProvider'
    );
  }
  return context;
};

const PeerCollaborationProvider = ({ children }) => {
  const [connections, setConnections] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [knowledgeSharing, setKnowledgeSharing] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [collaborationForums, setCollaborationForums] = useState([]); // New state for collaboration forums

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedConnections = localStorage.getItem('peerConnections');
    const savedCollaborations = localStorage.getItem('peerCollaborations');
    const savedKnowledgeSharing = localStorage.getItem('knowledgeSharing');
    const savedMentorshipRequests = localStorage.getItem('mentorshipRequests');
    const savedCollaborationForums = localStorage.getItem(
      'collaborationForums'
    ); // Load forums

    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }

    if (savedCollaborations) {
      setCollaborations(JSON.parse(savedCollaborations));
    }

    if (savedKnowledgeSharing) {
      setKnowledgeSharing(JSON.parse(savedKnowledgeSharing));
    }

    if (savedMentorshipRequests) {
      setMentorshipRequests(JSON.parse(savedMentorshipRequests));
    }

    if (savedCollaborationForums) {
      setCollaborationForums(JSON.parse(savedCollaborationForums));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('peerConnections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('peerCollaborations', JSON.stringify(collaborations));
  }, [collaborations]);

  useEffect(() => {
    localStorage.setItem('knowledgeSharing', JSON.stringify(knowledgeSharing));
  }, [knowledgeSharing]);

  useEffect(() => {
    localStorage.setItem(
      'mentorshipRequests',
      JSON.stringify(mentorshipRequests)
    );
  }, [mentorshipRequests]);

  useEffect(() => {
    localStorage.setItem(
      'collaborationForums',
      JSON.stringify(collaborationForums)
    ); // Save forums
  }, [collaborationForums]);

  // Connection management
  const connectWithPeer = (studentId, peerId) => {
    const newConnection = {
      id: Date.now(),
      studentId,
      peerId,
      connectedAt: new Date().toISOString(),
      status: 'active',
    };
    setConnections(prev => [...prev, newConnection]);
    return newConnection.id;
  };

  const disconnectFromPeer = (studentId, peerId) => {
    setConnections(prev =>
      prev.filter(
        conn =>
          !(conn.studentId === studentId && conn.peerId === peerId) &&
          !(conn.studentId === peerId && conn.peerId === studentId)
      )
    );
  };

  const getConnections = studentId => {
    return connections.filter(
      conn => conn.studentId === studentId || conn.peerId === studentId
    );
  };

  // Collaboration management
  const createCollaboration = collaborationData => {
    const newCollaboration = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      participants: [],
      status: 'active',
      ...collaborationData,
    };
    setCollaborations(prev => [...prev, newCollaboration]);
    return newCollaboration.id;
  };

  const joinCollaboration = (collaborationId, studentId) => {
    setCollaborations(prev =>
      prev.map(collab =>
        collab.id === collaborationId
          ? {
              ...collab,
              participants: [...collab.participants, studentId],
            }
          : collab
      )
    );
  };

  const leaveCollaboration = (collaborationId, studentId) => {
    setCollaborations(prev =>
      prev.map(collab =>
        collab.id === collaborationId
          ? {
              ...collab,
              participants: collab.participants.filter(id => id !== studentId),
            }
          : collab
      )
    );
  };

  const getCollaborationsByStudent = studentId => {
    return collaborations.filter(collab =>
      collab.participants.includes(studentId)
    );
  };

  // Knowledge sharing
  const shareKnowledge = knowledgeData => {
    const newKnowledge = {
      id: Date.now(),
      sharedAt: new Date().toISOString(),
      likes: 0,
      comments: [],
      ...knowledgeData,
    };
    setKnowledgeSharing(prev => [...prev, newKnowledge]);
    return newKnowledge.id;
  };

  const likeKnowledge = knowledgeId => {
    setKnowledgeSharing(prev =>
      prev.map(knowledge =>
        knowledge.id === knowledgeId
          ? { ...knowledge, likes: knowledge.likes + 1 }
          : knowledge
      )
    );
  };

  const commentOnKnowledge = (knowledgeId, commentData) => {
    setKnowledgeSharing(prev =>
      prev.map(knowledge =>
        knowledge.id === knowledgeId
          ? {
              ...knowledge,
              comments: [...knowledge.comments, commentData],
            }
          : knowledge
      )
    );
  };

  const getKnowledgeBySubject = subject => {
    return knowledgeSharing.filter(knowledge => knowledge.subject === subject);
  };

  const getKnowledgeByStudent = studentId => {
    return knowledgeSharing.filter(
      knowledge => knowledge.studentId === studentId
    );
  };

  // Mentorship requests
  const requestMentorship = requestData => {
    const newRequest = {
      id: Date.now(),
      requestedAt: new Date().toISOString(),
      status: 'pending',
      ...requestData,
    };
    setMentorshipRequests(prev => [...prev, newRequest]);
    return newRequest.id;
  };

  const acceptMentorship = requestId => {
    setMentorshipRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'accepted',
              acceptedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  const rejectMentorship = requestId => {
    setMentorshipRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'rejected',
              rejectedAt: new Date().toISOString(),
            }
          : request
      )
    );
  };

  const getMentorshipRequestsByStudent = studentId => {
    return mentorshipRequests.filter(
      request => request.studentId === studentId
    );
  };

  const getMentorshipRequestsByMentor = mentorId => {
    return mentorshipRequests.filter(request => request.mentorId === mentorId);
  };

  // Collaboration forums functionality
  const createForum = (collaborationId, forumData) => {
    const newForum = {
      id: Date.now(),
      collaborationId,
      createdAt: new Date().toISOString(),
      posts: [],
      ...forumData,
    };
    setCollaborationForums(prev => [...prev, newForum]);
    return newForum.id;
  };

  const addPostToForum = (forumId, postData) => {
    setCollaborationForums(prev =>
      prev.map(forum =>
        forum.id === forumId
          ? {
              ...forum,
              posts: [
                ...forum.posts,
                {
                  id: Date.now(),
                  createdAt: new Date().toISOString(),
                  comments: [],
                  ...postData,
                },
              ],
            }
          : forum
      )
    );
  };

  const addCommentToPost = (forumId, postId, commentData) => {
    setCollaborationForums(prev =>
      prev.map(forum =>
        forum.id === forumId
          ? {
              ...forum,
              posts: forum.posts.map(post =>
                post.id === postId
                  ? {
                      ...post,
                      comments: [...post.comments, commentData],
                    }
                  : post
              ),
            }
          : forum
      )
    );
  };

  const getForumsByCollaboration = collaborationId => {
    return collaborationForums.filter(
      forum => forum.collaborationId === collaborationId
    );
  };

  // Statistics
  const getConnectionCount = studentId => {
    return getConnections(studentId).length;
  };

  const getCollaborationCount = studentId => {
    return getCollaborationsByStudent(studentId).length;
  };

  const getKnowledgeSharingCount = studentId => {
    return getKnowledgeByStudent(studentId).length;
  };

  const getMentorshipRequestCount = studentId => {
    return getMentorshipRequestsByStudent(studentId).length;
  };

  const value = {
    connections,
    collaborations,
    knowledgeSharing,
    mentorshipRequests,
    collaborationForums, // Add to context value
    connectWithPeer,
    disconnectFromPeer,
    getConnections,
    createCollaboration,
    joinCollaboration,
    leaveCollaboration,
    getCollaborationsByStudent,
    shareKnowledge,
    likeKnowledge,
    commentOnKnowledge,
    getKnowledgeBySubject,
    getKnowledgeByStudent,
    requestMentorship,
    acceptMentorship,
    rejectMentorship,
    getMentorshipRequestsByStudent,
    getMentorshipRequestsByMentor,
    getConnectionCount,
    getCollaborationCount,
    getKnowledgeSharingCount,
    getMentorshipRequestCount,
    // Forum functions
    createForum,
    addPostToForum,
    addCommentToPost,
    getForumsByCollaboration,
  };

  return (
    <PeerCollaborationContext.Provider value={value}>
      {children}
    </PeerCollaborationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { PeerCollaborationProvider, usePeerCollaborationContext };
