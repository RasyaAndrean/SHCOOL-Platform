import { createContext, useContext, useEffect, useState } from 'react';

const MentoringContext = createContext();

export const MentoringProvider = ({ children }) => {
  const [mentors, setMentors] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [mentoringSessions, setMentoringSessions] = useState([]);
  const [mentorRequests, setMentorRequests] = useState([]);
  const [sessionFeedback, setSessionFeedback] = useState([]); // New state for session feedback
  const [mentorAvailability, setMentorAvailability] = useState([]); // New state for mentor availability

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedMentors = localStorage.getItem('mentors');
    const savedMentees = localStorage.getItem('mentees');
    const savedSessions = localStorage.getItem('mentoringSessions');
    const savedRequests = localStorage.getItem('mentorRequests');
    const savedFeedback = localStorage.getItem('sessionFeedback');
    const savedAvailability = localStorage.getItem('mentorAvailability');

    if (savedMentors) setMentors(JSON.parse(savedMentors));
    if (savedMentees) setMentees(JSON.parse(savedMentees));
    if (savedSessions) setMentoringSessions(JSON.parse(savedSessions));
    if (savedRequests) setMentorRequests(JSON.parse(savedRequests));
    if (savedFeedback) setSessionFeedback(JSON.parse(savedFeedback));
    if (savedAvailability) setMentorAvailability(JSON.parse(savedAvailability));

    // Add initial data if localStorage is empty
    if (!savedMentors) {
      const initialMentors = [
        {
          id: '1',
          name: 'Dr. Budi Santoso',
          expertise: 'Matematika & Fisika',
          bio: 'Pengajar berpengalaman di bidang sains dengan lebih dari 10 tahun pengalaman mengajar.',
          experience: '12',
          sessionCount: 25,
          photo: '',
        },
        {
          id: '2',
          name: 'Prof. Siti Rahayu',
          expertise: 'Bahasa Inggris & Sastra',
          bio: 'Ahli dalam pendidikan bahasa dengan fokus pada pengembangan kemampuan berbicara dan menulis.',
          experience: '15',
          sessionCount: 30,
          photo: '',
        },
        {
          id: '3',
          name: 'Ir. Andi Prasetyo',
          expertise: 'Teknologi Informasi',
          bio: 'Spesialis dalam pemrograman dan pengembangan aplikasi dengan pengalaman di industri IT.',
          experience: '8',
          sessionCount: 20,
          photo: '',
        },
      ];
      setMentors(initialMentors);
      localStorage.setItem('mentors', JSON.stringify(initialMentors));
    }

    if (!savedMentees) {
      const initialMentees = [
        {
          id: '1',
          name: 'Ahmad Rifai',
          grade: 'XI TKJ 3',
          interests: ['Programming', 'Networking'],
          photo: '',
        },
        {
          id: '2',
          name: 'Dewi Kartika',
          grade: 'XI TKJ 3',
          interests: ['Database', 'Web Development'],
          photo: '',
        },
      ];
      setMentees(initialMentees);
      localStorage.setItem('mentees', JSON.stringify(initialMentees));
    }

    // Initialize availability if empty
    if (!savedAvailability) {
      const initialAvailability = [
        {
          id: '1',
          mentorId: '1',
          days: ['Senin', 'Rabu', 'Jumat'],
          timeSlots: [
            { start: '09:00', end: '11:00' },
            { start: '14:00', end: '16:00' },
          ],
        },
        {
          id: '2',
          mentorId: '2',
          days: ['Selasa', 'Kamis'],
          timeSlots: [
            { start: '10:00', end: '12:00' },
            { start: '15:00', end: '17:00' },
          ],
        },
        {
          id: '3',
          mentorId: '3',
          days: ['Senin', 'Selasa', 'Kamis'],
          timeSlots: [
            { start: '08:00', end: '10:00' },
            { start: '13:00', end: '15:00' },
          ],
        },
      ];
      setMentorAvailability(initialAvailability);
      localStorage.setItem(
        'mentorAvailability',
        JSON.stringify(initialAvailability)
      );
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('mentors', JSON.stringify(mentors));
    localStorage.setItem('mentees', JSON.stringify(mentees));
    localStorage.setItem(
      'mentoringSessions',
      JSON.stringify(mentoringSessions)
    );
    localStorage.setItem('mentorRequests', JSON.stringify(mentorRequests));
    localStorage.setItem('sessionFeedback', JSON.stringify(sessionFeedback));
    localStorage.setItem(
      'mentorAvailability',
      JSON.stringify(mentorAvailability)
    );
  }, [
    mentors,
    mentees,
    mentoringSessions,
    mentorRequests,
    sessionFeedback,
    mentorAvailability,
  ]);

  // Add a new mentor
  const addMentor = mentorData => {
    const newMentor = {
      id: Date.now().toString(),
      ...mentorData,
      createdAt: new Date().toISOString(),
    };
    setMentors([...mentors, newMentor]);
    return newMentor;
  };

  // Update a mentor
  const updateMentor = (id, updatedData) => {
    setMentors(
      mentors.map(mentor =>
        mentor.id === id ? { ...mentor, ...updatedData } : mentor
      )
    );
  };

  // Remove a mentor
  const removeMentor = id => {
    setMentors(mentors.filter(mentor => mentor.id !== id));
    // Also remove any mentoring sessions with this mentor
    setMentoringSessions(sessions =>
      sessions.filter(session => session.mentorId !== id)
    );
    // Remove any requests to this mentor
    setMentorRequests(requests =>
      requests.filter(request => request.mentorId !== id)
    );
    // Remove availability for this mentor
    setMentorAvailability(availability =>
      availability.filter(avail => avail.mentorId !== id)
    );
  };

  // Add a new mentee
  const addMentee = menteeData => {
    const newMentee = {
      id: Date.now().toString(),
      ...menteeData,
      createdAt: new Date().toISOString(),
    };
    setMentees([...mentees, newMentee]);
    return newMentee;
  };

  // Update a mentee
  const updateMentee = (id, updatedData) => {
    setMentees(
      mentees.map(mentee =>
        mentee.id === id ? { ...mentee, ...updatedData } : mentee
      )
    );
  };

  // Remove a mentee
  const removeMentee = id => {
    setMentees(mentees.filter(mentee => mentee.id !== id));
    // Also remove any mentoring sessions with this mentee
    setMentoringSessions(sessions =>
      sessions.filter(session => session.menteeId !== id)
    );
    // Remove any requests from this mentee
    setMentorRequests(requests =>
      requests.filter(request => request.menteeId !== id)
    );
  };

  // Request a mentor
  const requestMentor = requestData => {
    const newRequest = {
      id: Date.now().toString(),
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setMentorRequests([...mentorRequests, newRequest]);
    return newRequest;
  };

  // Update request status
  const updateRequestStatus = (id, status) => {
    setMentorRequests(
      mentorRequests.map(request =>
        request.id === id ? { ...request, status } : request
      )
    );

    // If approved, create a mentoring session
    if (status === 'approved') {
      const request = mentorRequests.find(req => req.id === id);
      if (request) {
        addMentoringSession({
          mentorId: request.mentorId,
          menteeId: request.menteeId,
          subject: request.subject,
          description: request.description,
          status: 'scheduled',
          scheduledDate: request.preferredDate,
        });
      }
    }
  };

  // Add a mentoring session
  const addMentoringSession = sessionData => {
    const newSession = {
      id: Date.now().toString(),
      ...sessionData,
      createdAt: new Date().toISOString(),
    };
    setMentoringSessions([...mentoringSessions, newSession]);
    return newSession;
  };

  // Update a mentoring session
  const updateMentoringSession = (id, updatedData) => {
    setMentoringSessions(
      mentoringSessions.map(session =>
        session.id === id ? { ...session, ...updatedData } : session
      )
    );
  };

  // Remove a mentoring session
  const removeMentoringSession = id => {
    setMentoringSessions(
      mentoringSessions.filter(session => session.id !== id)
    );
    // Also remove feedback for this session
    setSessionFeedback(feedback => feedback.filter(fb => fb.sessionId !== id));
  };

  // Add session feedback
  const addSessionFeedback = feedbackData => {
    const newFeedback = {
      id: Date.now().toString(),
      ...feedbackData,
      createdAt: new Date().toISOString(),
    };
    setSessionFeedback([...sessionFeedback, newFeedback]);
    return newFeedback;
  };

  // Update session feedback
  const updateSessionFeedback = (id, updatedData) => {
    setSessionFeedback(
      sessionFeedback.map(feedback =>
        feedback.id === id ? { ...feedback, ...updatedData } : feedback
      )
    );
  };

  // Remove session feedback
  const removeSessionFeedback = id => {
    setSessionFeedback(sessionFeedback.filter(feedback => feedback.id !== id));
  };

  // Add mentor availability
  const addMentorAvailability = availabilityData => {
    const newAvailability = {
      id: Date.now().toString(),
      ...availabilityData,
    };
    setMentorAvailability([...mentorAvailability, newAvailability]);
    return newAvailability;
  };

  // Update mentor availability
  const updateMentorAvailability = (id, updatedData) => {
    setMentorAvailability(
      mentorAvailability.map(availability =>
        availability.id === id
          ? { ...availability, ...updatedData }
          : availability
      )
    );
  };

  // Remove mentor availability
  const removeMentorAvailability = id => {
    setMentorAvailability(
      mentorAvailability.filter(availability => availability.id !== id)
    );
  };

  // Get mentor by ID
  const getMentorById = id => {
    return mentors.find(mentor => mentor.id === id);
  };

  // Get mentee by ID
  const getMenteeById = id => {
    return mentees.find(mentee => mentee.id === id);
  };

  // Get sessions for a mentor
  const getSessionsForMentor = mentorId => {
    return mentoringSessions.filter(session => session.mentorId === mentorId);
  };

  // Get sessions for a mentee
  const getSessionsForMentee = menteeId => {
    return mentoringSessions.filter(session => session.menteeId === menteeId);
  };

  // Get requests for a mentor
  const getRequestsForMentor = mentorId => {
    return mentorRequests.filter(request => request.mentorId === mentorId);
  };

  // Get requests from a mentee
  const getRequestsFromMentee = menteeId => {
    return mentorRequests.filter(request => request.menteeId === menteeId);
  };

  // Get feedback for a session
  const getFeedbackForSession = sessionId => {
    return sessionFeedback.filter(feedback => feedback.sessionId === sessionId);
  };

  // Get availability for a mentor
  const getAvailabilityForMentor = mentorId => {
    return mentorAvailability.find(
      availability => availability.mentorId === mentorId
    );
  };

  // Get statistics
  const getMentoringStats = () => {
    return {
      totalMentors: mentors.length,
      totalMentees: mentees.length,
      totalSessions: mentoringSessions.length,
      pendingRequests: mentorRequests.filter(req => req.status === 'pending')
        .length,
      approvedRequests: mentorRequests.filter(req => req.status === 'approved')
        .length,
      completedSessions: mentoringSessions.filter(
        session => session.status === 'completed'
      ).length,
      totalFeedback: sessionFeedback.length,
    };
  };

  // Get upcoming sessions
  const getUpcomingSessions = () => {
    const now = new Date();
    return mentoringSessions
      .filter(
        session =>
          session.status === 'scheduled' &&
          new Date(session.scheduledDate) > now
      )
      .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));
  };

  // Get recent feedback
  const getRecentFeedback = () => {
    return sessionFeedback
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  return (
    <MentoringContext.Provider
      value={{
        mentors,
        mentees,
        mentoringSessions,
        mentorRequests,
        sessionFeedback,
        mentorAvailability,
        addMentor,
        updateMentor,
        removeMentor,
        addMentee,
        updateMentee,
        removeMentee,
        requestMentor,
        updateRequestStatus,
        addMentoringSession,
        updateMentoringSession,
        removeMentoringSession,
        addSessionFeedback,
        updateSessionFeedback,
        removeSessionFeedback,
        addMentorAvailability,
        updateMentorAvailability,
        removeMentorAvailability,
        getMentorById,
        getMenteeById,
        getSessionsForMentor,
        getSessionsForMentee,
        getRequestsForMentor,
        getRequestsFromMentee,
        getFeedbackForSession,
        getAvailabilityForMentor,
        getMentoringStats,
        getUpcomingSessions,
        getRecentFeedback,
      }}
    >
      {children}
    </MentoringContext.Provider>
  );
};

export const useMentoringContext = () => {
  const context = useContext(MentoringContext);
  if (!context) {
    throw new Error(
      'useMentoringContext must be used within a MentoringProvider'
    );
  }
  return context;
};
