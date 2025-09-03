import { createContext, useContext, useEffect, useState } from 'react';

const DataContext = createContext();

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useDataContext must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  // Sample initial data
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: 'Ujian Tengah Semester',
      date: '15 Agustus 2025',
      category: 'Akademik',
      content:
        'Ujian tengah semester akan dilaksanakan pada tanggal 20-25 Agustus 2025. Silakan mempersiapkan diri dengan belajar sesuai jadwal yang telah ditentukan.',
      image: 'https://source.unsplash.com/random/800x400/?exam',
    },
    {
      id: 2,
      title: 'Kegiatan Study Tour',
      date: '10 Agustus 2025',
      category: 'Kegiatan',
      content:
        'Study tour ke Museum Teknologi akan dilaksanakan pada hari Jumat, 22 Agustus 2025. Siswa diwajibkan membawa bekal dan pakaian yang nyaman.',
      image: 'https://source.unsplash.com/random/800x400/?museum',
    },
  ]);

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Andi Prasetyo',
      role: 'Ketua Kelas',
      interests: ['Programming', 'Networking', 'Robotics'],
      avatar: 'https://source.unsplash.com/random/400x400/?portrait,man',
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      role: 'Wakil Ketua',
      interests: ['Design', 'Multimedia', 'Photography'],
      avatar: 'https://source.unsplash.com/random/400x400/?portrait,woman',
    },
  ]);

  const [schedule, setSchedule] = useState([
    {
      day: 'Senin',
      subjects: ['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'Olahraga'],
    },
    {
      day: 'Selasa',
      subjects: [
        'Bahasa Inggris',
        'PKn',
        'Matematika',
        'Seni Budaya',
        'Prakarya',
      ],
    },
  ]);

  const [gallery, setGallery] = useState([
    {
      id: 1,
      title: 'Kegiatan Kelas',
      image: 'https://source.unsplash.com/random/800x600/?classroom,students',
      description: 'Foto kegiatan belajar mengajar di kelas',
    },
    {
      id: 2,
      title: 'Ekstrakurikuler',
      image: 'https://source.unsplash.com/random/800x600/?extracurricular',
      description: 'Kegiatan ekstrakurikuler siswa',
    },
  ]);

  const [resources, setResources] = useState([
    {
      id: 1,
      title: 'Modul Pemrograman Web',
      description:
        'Modul lengkap untuk belajar pemrograman web dengan HTML, CSS, dan JavaScript',
      type: 'document',
      link: '#',
    },
    {
      id: 2,
      title: 'Tutorial Jaringan Komputer',
      description:
        'Video tutorial tentang konfigurasi jaringan dan troubleshooting',
      type: 'video',
      link: '#',
    },
  ]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedAnnouncements = localStorage.getItem('announcements');
    const savedStudents = localStorage.getItem('students');
    const savedSchedule = localStorage.getItem('schedule');
    const savedGallery = localStorage.getItem('gallery');
    const savedResources = localStorage.getItem('resources');

    if (savedAnnouncements) setAnnouncements(JSON.parse(savedAnnouncements));
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    if (savedSchedule) setSchedule(JSON.parse(savedSchedule));
    if (savedGallery) setGallery(JSON.parse(savedGallery));
    if (savedResources) setResources(JSON.parse(savedResources));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem('resources', JSON.stringify(resources));
  }, [resources]);

  // CRUD operations for announcements
  const addAnnouncement = announcement => {
    setAnnouncements(prev => [...prev, { ...announcement, id: Date.now() }]);
  };

  const updateAnnouncement = (id, updatedAnnouncement) => {
    setAnnouncements(prev =>
      prev.map(announcement =>
        announcement.id === id
          ? { ...announcement, ...updatedAnnouncement }
          : announcement
      )
    );
  };

  const deleteAnnouncement = id => {
    setAnnouncements(prev =>
      prev.filter(announcement => announcement.id !== id)
    );
  };

  // CRUD operations for students
  const addStudent = student => {
    setStudents(prev => [...prev, { ...student, id: Date.now() }]);
  };

  const updateStudent = (id, updatedStudent) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, ...updatedStudent } : student
      )
    );
  };

  const deleteStudent = id => {
    setStudents(prev => prev.filter(student => student.id !== id));
  };

  // CRUD operations for schedule
  const updateSchedule = newSchedule => {
    setSchedule(newSchedule);
  };

  // CRUD operations for gallery
  const addGalleryItem = item => {
    setGallery(prev => [...prev, { ...item, id: Date.now() }]);
  };

  const updateGalleryItem = (id, updatedItem) => {
    setGallery(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedItem } : item))
    );
  };

  const deleteGalleryItem = id => {
    setGallery(prev => prev.filter(item => item.id !== id));
  };

  // CRUD operations for resources
  const addResource = resource => {
    setResources(prev => [...prev, { ...resource, id: Date.now() }]);
  };

  const updateResource = (id, updatedResource) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === id ? { ...resource, ...updatedResource } : resource
      )
    );
  };

  const deleteResource = id => {
    setResources(prev => prev.filter(resource => resource.id !== id));
  };

  const value = {
    // Data
    announcements,
    students,
    schedule,
    gallery,
    resources,

    // CRUD operations
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,

    addStudent,
    updateStudent,
    deleteStudent,

    updateSchedule,

    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,

    addResource,
    updateResource,
    deleteResource,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
