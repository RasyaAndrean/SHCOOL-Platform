import { createContext, useContext, useEffect, useState } from 'react';

const ClassroomContext = createContext();

export const useClassroomContext = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error(
      'useClassroomContext must be used within a ClassroomProvider'
    );
  }
  return context;
};

export const ClassroomProvider = ({ children }) => {
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      name: 'Lab Komputer A',
      capacity: 30,
      equipment: ['Komputer', 'Proyektor', 'Whiteboard', 'AC'],
      status: 'available',
      schedule: [],
      location: 'Lantai 2, Gedung A',
      description:
        'Laboratorium komputer lengkap dengan perangkat terbaru untuk praktikum jaringan',
    },
    {
      id: 2,
      name: 'Lab Komputer B',
      capacity: 25,
      equipment: ['Komputer', 'Proyektor', 'Whiteboard'],
      status: 'available',
      schedule: [],
      location: 'Lantai 2, Gedung A',
      description: 'Laboratorium komputer untuk praktikum pemrograman',
    },
    {
      id: 3,
      name: 'Ruang Teori',
      capacity: 40,
      equipment: ['Proyektor', 'Whiteboard', 'Sound System'],
      status: 'available',
      schedule: [],
      location: 'Lantai 1, Gedung B',
      description: 'Ruang kelas utama untuk kegiatan teori',
    },
  ]);

  const [reservations, setReservations] = useState([
    {
      id: 1,
      classroomId: 1,
      reservedBy: 'Budi Santoso, S.Kom',
      purpose: 'Praktikum Jaringan Komputer',
      date: '2025-09-05',
      startTime: '08:00',
      endTime: '10:00',
      status: 'confirmed',
    },
    {
      id: 2,
      classroomId: 2,
      reservedBy: 'Siti Rahayu, S.Pd',
      purpose: 'Praktikum Pemrograman Web',
      date: '2025-09-05',
      startTime: '10:00',
      endTime: '12:00',
      status: 'confirmed',
    },
    {
      id: 3,
      classroomId: 3,
      reservedBy: 'Andi Pranata, S.T',
      purpose: 'Kuliah Sistem Operasi',
      date: '2025-09-06',
      startTime: '09:00',
      endTime: '11:00',
      status: 'pending',
    },
  ]);

  // Virtual classroom sessions state
  const [sessions, setSessions] = useState([
    {
      id: 1,
      title: 'Pengenalan Jaringan Komputer',
      subject: 'Jaringan Komputer',
      date: '2025-09-05',
      startTime: '08:00',
      endTime: '10:00',
      description:
        'Pengenalan dasar-dasar jaringan komputer dan protokol TCP/IP',
      status: 'scheduled',
      participants: [],
      materials: [
        { id: 1, name: 'Modul_Jaringan_Komputer.pdf', url: '#' },
        { id: 2, name: 'Latihan_Jaringan_Komputer.docx', url: '#' },
      ],
    },
    {
      id: 2,
      title: 'Praktikum Konfigurasi Router',
      subject: 'Jaringan Komputer',
      date: '2025-09-07',
      startTime: '10:00',
      endTime: '12:00',
      description: 'Praktikum konfigurasi router Cisco dengan Packet Tracer',
      status: 'scheduled',
      participants: [],
      materials: [
        { id: 1, name: 'Modul_Konfigurasi_Router.pdf', url: '#' },
        { id: 2, name: 'Topology_Network.pkt', url: '#' },
      ],
    },
  ]);

  const [activeSession, setActiveSession] = useState(null);
  const [participants, setParticipants] = useState([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedClassrooms = localStorage.getItem('classrooms');
    const savedReservations = localStorage.getItem('classroomReservations');
    const savedSessions = localStorage.getItem('classroomSessions');
    const savedActiveSession = localStorage.getItem('activeClassroomSession');
    const savedParticipants = localStorage.getItem('classroomParticipants');

    if (savedClassrooms) {
      setClassrooms(JSON.parse(savedClassrooms));
    }

    if (savedReservations) {
      setReservations(JSON.parse(savedReservations));
    }

    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    if (savedActiveSession) {
      setActiveSession(JSON.parse(savedActiveSession));
    }

    if (savedParticipants) {
      setParticipants(JSON.parse(savedParticipants));
    }
  }, []);

  // Save classrooms to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('classrooms', JSON.stringify(classrooms));
  }, [classrooms]);

  // Save reservations to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('classroomReservations', JSON.stringify(reservations));
  }, [reservations]);

  // Save sessions to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('classroomSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save active session to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'activeClassroomSession',
      JSON.stringify(activeSession)
    );
  }, [activeSession]);

  // Save participants to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('classroomParticipants', JSON.stringify(participants));
  }, [participants]);

  const addClassroom = classroomData => {
    const newClassroom = {
      id: Date.now(),
      ...classroomData,
      schedule: [],
    };
    setClassrooms(prev => [...prev, newClassroom]);
    return newClassroom.id;
  };

  const updateClassroom = (id, updatedData) => {
    setClassrooms(prev =>
      prev.map(classroom =>
        classroom.id === id ? { ...classroom, ...updatedData } : classroom
      )
    );
  };

  const deleteClassroom = id => {
    setClassrooms(prev => prev.filter(classroom => classroom.id !== id));
  };

  const addReservation = reservationData => {
    const newReservation = {
      id: Date.now(),
      ...reservationData,
    };
    setReservations(prev => [...prev, newReservation]);

    // Update classroom schedule
    setClassrooms(prev =>
      prev.map(classroom => {
        if (classroom.id === reservationData.classroomId) {
          return {
            ...classroom,
            schedule: [...classroom.schedule, newReservation],
          };
        }
        return classroom;
      })
    );

    return newReservation.id;
  };

  const updateReservation = (id, updatedData) => {
    setReservations(prev =>
      prev.map(reservation =>
        reservation.id === id ? { ...reservation, ...updatedData } : reservation
      )
    );
  };

  const deleteReservation = id => {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      // Remove from classroom schedule
      setClassrooms(prev =>
        prev.map(classroom => {
          if (classroom.id === reservation.classroomId) {
            return {
              ...classroom,
              schedule: classroom.schedule.filter(s => s.id !== id),
            };
          }
          return classroom;
        })
      );
    }
    setReservations(prev => prev.filter(reservation => reservation.id !== id));
  };

  // Virtual classroom session management
  const createSession = sessionData => {
    const newSession = {
      id: Date.now(),
      ...sessionData,
      status: 'scheduled',
      participants: [],
      materials: [],
    };
    setSessions(prev => [...prev, newSession]);
    return newSession.id;
  };

  const updateSession = (id, updatedData) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === id ? { ...session, ...updatedData } : session
      )
    );
  };

  const deleteSession = id => {
    setSessions(prev => prev.filter(session => session.id !== id));

    // If the deleted session was active, clear active session
    if (activeSession === id) {
      setActiveSession(null);
    }
  };

  const startSession = id => {
    setSessions(prev =>
      prev.map(session =>
        session.id === id
          ? {
              ...session,
              status: 'active',
              startTime: new Date().toLocaleTimeString(),
            }
          : session
      )
    );
    setActiveSession(id);
  };

  const endSession = id => {
    setSessions(prev =>
      prev.map(session =>
        session.id === id
          ? {
              ...session,
              status: 'completed',
              endTime: new Date().toLocaleTimeString(),
            }
          : session
      )
    );
    setActiveSession(null);
  };

  const joinSession = (sessionId, participantData) => {
    const newParticipant = {
      id: Date.now(),
      sessionId,
      ...participantData,
    };

    setParticipants(prev => [...prev, newParticipant]);

    // Update session participants
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              participants: [...(session.participants || []), newParticipant],
            }
          : session
      )
    );

    return newParticipant.id;
  };

  const leaveSession = (sessionId, participantId) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));

    // Update session participants
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              participants: (session.participants || []).filter(
                p => p.id !== participantId
              ),
            }
          : session
      )
    );
  };

  const getSessionParticipants = sessionId => {
    return participants.filter(p => p.sessionId === sessionId);
  };

  const addSessionMaterial = (sessionId, materialData) => {
    const newMaterial = {
      id: Date.now(),
      ...materialData,
    };

    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              materials: [...(session.materials || []), newMaterial],
            }
          : session
      )
    );

    return newMaterial.id;
  };

  const removeSessionMaterial = (sessionId, materialId) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? {
              ...session,
              materials: (session.materials || []).filter(
                m => m.id !== materialId
              ),
            }
          : session
      )
    );
  };

  const getClassroomById = id => {
    return classrooms.find(classroom => classroom.id === id);
  };

  const getReservationsByClassroom = classroomId => {
    return reservations.filter(
      reservation => reservation.classroomId === classroomId
    );
  };

  const getReservationsByUser = user => {
    return reservations.filter(reservation => reservation.reservedBy === user);
  };

  const getAvailableClassrooms = (date, startTime, endTime) => {
    return classrooms.filter(classroom => {
      // Check if classroom is available at the requested time
      const conflictingReservations = reservations.filter(reservation => {
        if (reservation.classroomId !== classroom.id) return false;
        if (reservation.date !== date) return false;

        // Check time overlap
        return (
          reservation.startTime < endTime && reservation.endTime > startTime
        );
      });

      return conflictingReservations.length === 0;
    });
  };

  return (
    <ClassroomContext.Provider
      value={{
        classrooms,
        reservations,
        sessions,
        activeSession,
        participants,
        addClassroom,
        updateClassroom,
        deleteClassroom,
        addReservation,
        updateReservation,
        deleteReservation,
        createSession,
        updateSession,
        deleteSession,
        startSession,
        endSession,
        joinSession,
        leaveSession,
        getSessionParticipants,
        addSessionMaterial,
        removeSessionMaterial,
        getClassroomById,
        getReservationsByClassroom,
        getReservationsByUser,
        getAvailableClassrooms,
      }}
    >
      {children}
    </ClassroomContext.Provider>
  );
};
