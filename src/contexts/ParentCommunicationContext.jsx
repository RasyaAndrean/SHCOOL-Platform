import { createContext, useContext, useEffect, useState } from 'react';

const ParentCommunicationContext = createContext();

export const useParentCommunicationContext = () => {
  const context = useContext(ParentCommunicationContext);
  if (!context) {
    throw new Error(
      'useParentCommunicationContext must be used within a ParentCommunicationProvider'
    );
  }
  return context;
};

export const ParentCommunicationProvider = ({ children }) => {
  const [communications, setCommunications] = useState([]);

  // Load communications from localStorage on initial load
  useEffect(() => {
    const savedCommunications = localStorage.getItem('parentCommunications');
    if (savedCommunications) {
      setCommunications(JSON.parse(savedCommunications));
    } else {
      // Add sample data for demonstration
      const sampleCommunications = [
        {
          id: 1,
          studentId: 1,
          subject: 'Perkembangan Akademik',
          content:
            'Kami ingin memberitahukan bahwa Andi menunjukkan kemajuan yang baik dalam pelajaran Jaringan Komputer. Pertahankan terus semangat belajarnya!',
          sender: 'Guru/Wali Kelas',
          date: '2025-08-10',
          read: false,
        },
        {
          id: 2,
          studentId: 1,
          subject: 'Kehadiran',
          content:
            'Andi tidak hadir pada hari Senin kemarin karena sakit. Mohon pastikan ia sudah sehat sepenuhnya sebelum kembali ke sekolah.',
          sender: 'Guru/Wali Kelas',
          date: '2025-08-15',
          read: true,
        },
        {
          id: 3,
          studentId: 2,
          subject: 'Prestasi Lomba',
          content:
            'Selamat! Siti berhasil meraih juara 2 dalam lomba desain grafis tingkat kota. Kami bangga dengan pencapaiannya.',
          sender: 'Guru/Wali Kelas',
          date: '2025-08-20',
          read: false,
        },
      ];
      setCommunications(sampleCommunications);
    }
  }, []);

  // Save communications to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'parentCommunications',
      JSON.stringify(communications)
    );
  }, [communications]);

  const addCommunication = communicationData => {
    const newCommunication = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...communicationData,
    };
    setCommunications(prev => [...prev, newCommunication]);
    return newCommunication;
  };

  const updateCommunication = (id, updatedData) => {
    setCommunications(prev =>
      prev.map(communication =>
        communication.id === id
          ? { ...communication, ...updatedData }
          : communication
      )
    );
  };

  const deleteCommunication = id => {
    setCommunications(prev =>
      prev.filter(communication => communication.id !== id)
    );
  };

  const getStudentCommunications = studentId => {
    return communications.filter(
      communication => communication.studentId === studentId
    );
  };

  const getCommunicationById = id => {
    return communications.find(communication => communication.id === id);
  };

  const markAsRead = id => {
    setCommunications(prev =>
      prev.map(communication =>
        communication.id === id
          ? { ...communication, read: true }
          : communication
      )
    );
  };

  const getUnreadCount = () => {
    return communications.filter(communication => !communication.read).length;
  };

  const value = {
    communications,
    addCommunication,
    updateCommunication,
    deleteCommunication,
    getStudentCommunications,
    getCommunicationById,
    markAsRead,
    getUnreadCount,
  };

  return (
    <ParentCommunicationContext.Provider value={value}>
      {children}
    </ParentCommunicationContext.Provider>
  );
};
