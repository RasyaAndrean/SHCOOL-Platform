import { createContext, useContext, useEffect, useState } from 'react';

const AlumniContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAlumniContext = () => {
  const context = useContext(AlumniContext);
  if (!context) {
    throw new Error('useAlumniContext must be used within an AlumniProvider');
  }
  return context;
};

export const AlumniProvider = ({ children }) => {
  const [alumni, setAlumni] = useState([
    {
      id: 1,
      name: 'Budi Santoso',
      graduationYear: 2018,
      currentPosition: 'Senior Network Engineer',
      company: 'TechCorp Indonesia',
      email: 'budi.santoso@techcorp.co.id',
      phone: '+628123456789',
      linkedin: 'linkedin.com/in/budisantoso',
      expertise: ['Network Security', 'Cisco Systems', 'Cloud Infrastructure'],
      achievements: [
        'CCIE Certified',
        'Led network migration project worth $2M',
        'Mentored 15 junior engineers',
      ],
      photo:
        'https://source.unsplash.com/random/400x400/?portrait,man,professional',
      bio: 'Lulusan terbaik tahun 2018, sekarang memimpin tim network engineering di TechCorp Indonesia. Spesialisasi dalam keamanan jaringan dan infrastruktur cloud.',
      availableForMentoring: true,
    },
    {
      id: 2,
      name: 'Siti Rahayu',
      graduationYear: 2019,
      currentPosition: 'Cybersecurity Analyst',
      company: 'SecureNet Solutions',
      email: 'siti.rahayu@securenet.id',
      phone: '+628198765432',
      linkedin: 'linkedin.com/in/sitirahayu',
      expertise: ['Ethical Hacking', 'Incident Response', 'Security Auditing'],
      achievements: [
        'CISSP Certified',
        'Discovered critical vulnerability in government system',
        'Speaker at National Cybersecurity Conference 2023',
      ],
      photo:
        'https://source.unsplash.com/random/400x400/?portrait,woman,professional',
      bio: 'Ahli keamanan siber dengan fokus pada ethical hacking dan incident response. Aktif dalam komunitas keamanan siber nasional.',
      availableForMentoring: true,
    },
    {
      id: 3,
      name: 'Andi Pranata',
      graduationYear: 2020,
      currentPosition: 'Software Developer',
      company: 'StartupHub',
      email: 'andi.pranata@startuphub.co.id',
      phone: '+628567891234',
      linkedin: 'linkedin.com/in/andipranata',
      expertise: ['Web Development', 'Mobile Apps', 'Database Design'],
      achievements: [
        'Developed app with 100K+ downloads',
        'Winner of National Student Startup Competition 2021',
        'Full Stack Developer Certification',
      ],
      photo:
        'https://source.unsplash.com/random/400x400/?portrait,man,developer',
      bio: 'Pengembang perangkat lunak yang berfokus pada solusi web dan mobile. Co-founder aplikasi edukasi yang digunakan di seluruh Indonesia.',
      availableForMentoring: false,
    },
    {
      id: 4,
      name: 'Dewi Kusuma',
      graduationYear: 2017,
      currentPosition: 'IT Manager',
      company: 'Global Enterprises',
      email: 'dewi.kusuma@globalent.com',
      phone: '+628134567890',
      linkedin: 'linkedin.com/in/dewikusuma',
      expertise: [
        'Project Management',
        'Team Leadership',
        'Enterprise Systems',
      ],
      achievements: [
        'Managed IT budget of $5M annually',
        'Led digital transformation project',
        'MBA in Information Technology Management',
      ],
      photo:
        'https://source.unsplash.com/random/400x400/?portrait,woman,manager',
      bio: 'Manajer TI dengan pengalaman dalam kepemimpinan tim dan transformasi digital. Fokus pada implementasi sistem enterprise dan manajemen proyek.',
      availableForMentoring: true,
    },
  ]);

  const [mentoringRequests, setMentoringRequests] = useState([]);
  const [alumniEvents, setAlumniEvents] = useState([
    {
      id: 1,
      title: 'Sharing Session: Karir di Bidang Cybersecurity',
      date: '2025-09-15',
      time: '14:00',
      venue: 'Lab Komputer XI TKJ',
      description:
        'Sharing pengalaman dan peluang karir di bidang keamanan siber bersama alumni Siti Rahayu.',
      speaker: 'Siti Rahayu',
      speakerId: 2,
      registrationLink: '#',
    },
    {
      id: 2,
      title: 'Workshop: Membangun Startup Teknologi',
      date: '2025-10-05',
      time: '10:00',
      venue: 'Aula Sekolah',
      description:
        'Workshop membangun startup teknologi dari ide hingga peluncuran bersama alumni Andi Pranata.',
      speaker: 'Andi Pranata',
      speakerId: 3,
      registrationLink: '#',
    },
  ]);

  // New states for enhanced alumni features
  const [careerResources, setCareerResources] = useState([
    {
      id: 1,
      title: 'Panduan Lengkap Menjadi Network Engineer',
      category: 'Networking',
      description:
        'Langkah-langkah membangun karir di bidang network engineering',
      link: '#',
      createdAt: '2025-01-15',
    },
    {
      id: 2,
      title: 'Sertifikasi IT yang Paling Dicari di 2025',
      category: 'Certifications',
      description:
        'Daftar sertifikasi teknologi informasi yang paling diminati',
      link: '#',
      createdAt: '2025-02-20',
    },
    {
      id: 3,
      title: 'Tips Wawancara Kerja di Perusahaan Teknologi',
      category: 'Career Advice',
      description:
        'Strategi sukses dalam wawancara kerja di perusahaan teknologi',
      link: '#',
      createdAt: '2025-03-10',
    },
  ]);

  const [successStories, setSuccessStories] = useState([
    {
      id: 1,
      alumniId: 1,
      title: 'Dari Siswa Biasa ke Senior Network Engineer',
      content:
        'Perjalanan Budi Santoso dari lulusan SMK hingga menjadi pemimpin tim di TechCorp',
      image: 'https://source.unsplash.com/random/800x400/?network,engineer',
      date: '2025-04-01',
    },
    {
      id: 2,
      alumniId: 4,
      title: 'Transformasi Digital di Global Enterprises',
      content:
        'Bagaimana Dewi Kusuma memimpin proyek transformasi digital yang sukses',
      image: 'https://source.unsplash.com/random/800x400/?business,technology',
      date: '2025-05-15',
    },
  ]);

  const [jobOpportunities, setJobOpportunities] = useState([
    {
      id: 1,
      title: 'Network Administrator',
      company: 'IndoTech Solutions',
      location: 'Jakarta',
      salary: 'Rp 7.000.000 - Rp 10.000.000',
      description:
        'Mencari network administrator dengan pengalaman minimal 2 tahun',
      requirements: [
        'Sertifikasi CCNA',
        'Pengalaman Linux',
        'Bahasa Inggris aktif',
      ],
      postedDate: '2025-08-25',
      deadline: '2025-09-15',
    },
    {
      id: 2,
      title: 'Junior Cybersecurity Analyst',
      company: 'SecureNet Indonesia',
      location: 'Bandung',
      salary: 'Rp 5.500.000 - Rp 8.000.000',
      description: 'Posisi terbuka untuk lulusan baru di bidang keamanan siber',
      requirements: [
        'Lulusan TI/TKJ',
        'Pemahaman dasar keamanan jaringan',
        'Sertifikasi CEH (nilai tambah)',
      ],
      postedDate: '2025-08-20',
      deadline: '2025-09-30',
    },
  ]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedMentoringRequests = localStorage.getItem('mentoringRequests');
    const savedAlumniEvents = localStorage.getItem('alumniEvents');
    const savedCareerResources = localStorage.getItem('careerResources');
    const savedSuccessStories = localStorage.getItem('successStories');
    const savedJobOpportunities = localStorage.getItem('jobOpportunities');

    if (savedMentoringRequests) {
      setMentoringRequests(JSON.parse(savedMentoringRequests));
    }

    if (savedAlumniEvents) {
      setAlumniEvents(JSON.parse(savedAlumniEvents));
    }

    if (savedCareerResources) {
      setCareerResources(JSON.parse(savedCareerResources));
    }

    if (savedSuccessStories) {
      setSuccessStories(JSON.parse(savedSuccessStories));
    }

    if (savedJobOpportunities) {
      setJobOpportunities(JSON.parse(savedJobOpportunities));
    }
  }, []);

  // Save mentoring requests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'mentoringRequests',
      JSON.stringify(mentoringRequests)
    );
  }, [mentoringRequests]);

  // Save alumni events to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('alumniEvents', JSON.stringify(alumniEvents));
  }, [alumniEvents]);

  // Save career resources to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('careerResources', JSON.stringify(careerResources));
  }, [careerResources]);

  // Save success stories to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('successStories', JSON.stringify(successStories));
  }, [successStories]);

  // Save job opportunities to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('jobOpportunities', JSON.stringify(jobOpportunities));
  }, [jobOpportunities]);

  const addAlumni = alumniData => {
    const newAlumni = {
      id: Date.now(),
      ...alumniData,
    };
    setAlumni(prev => [...prev, newAlumni]);
    return newAlumni.id;
  };

  const updateAlumni = (id, updatedData) => {
    setAlumni(prev =>
      prev.map(alumnus =>
        alumnus.id === id ? { ...alumnus, ...updatedData } : alumnus
      )
    );
  };

  const deleteAlumni = id => {
    setAlumni(prev => prev.filter(alumnus => alumnus.id !== id));
  };

  const requestMentoring = requestData => {
    const newRequest = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      ...requestData,
    };
    setMentoringRequests(prev => [...prev, newRequest]);
    return newRequest.id;
  };

  const updateMentoringRequest = (id, updatedData) => {
    setMentoringRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, ...updatedData } : request
      )
    );
  };

  const addEvent = eventData => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
    };
    setAlumniEvents(prev => [...prev, newEvent]);
    return newEvent.id;
  };

  const updateEvent = (id, updatedData) => {
    setAlumniEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updatedData } : event
      )
    );
  };

  const deleteEvent = id => {
    setAlumniEvents(prev => prev.filter(event => event.id !== id));
  };

  // Career resources functions
  const addCareerResource = resourceData => {
    const newResource = {
      id: Date.now(),
      ...resourceData,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCareerResources(prev => [...prev, newResource]);
    return newResource.id;
  };

  const updateCareerResource = (id, updatedData) => {
    setCareerResources(prev =>
      prev.map(resource =>
        resource.id === id ? { ...resource, ...updatedData } : resource
      )
    );
  };

  const deleteCareerResource = id => {
    setCareerResources(prev => prev.filter(resource => resource.id !== id));
  };

  // Success stories functions
  const addSuccessStory = storyData => {
    const newStory = {
      id: Date.now(),
      ...storyData,
      date: new Date().toISOString().split('T')[0],
    };
    setSuccessStories(prev => [...prev, newStory]);
    return newStory.id;
  };

  const updateSuccessStory = (id, updatedData) => {
    setSuccessStories(prev =>
      prev.map(story =>
        story.id === id ? { ...story, ...updatedData } : story
      )
    );
  };

  const deleteSuccessStory = id => {
    setSuccessStories(prev => prev.filter(story => story.id !== id));
  };

  // Job opportunities functions
  const addJobOpportunity = jobData => {
    const newJob = {
      id: Date.now(),
      ...jobData,
      postedDate: new Date().toISOString().split('T')[0],
    };
    setJobOpportunities(prev => [...prev, newJob]);
    return newJob.id;
  };

  const updateJobOpportunity = (id, updatedData) => {
    setJobOpportunities(prev =>
      prev.map(job => (job.id === id ? { ...job, ...updatedData } : job))
    );
  };

  const deleteJobOpportunity = id => {
    setJobOpportunities(prev => prev.filter(job => job.id !== id));
  };

  const getAlumniByExpertise = expertise => {
    return alumni.filter(alumnus =>
      alumnus.expertise.some(e =>
        e.toLowerCase().includes(expertise.toLowerCase())
      )
    );
  };

  const getAvailableMentors = () => {
    return alumni.filter(alumnus => alumnus.availableForMentoring);
  };

  const getMentoringRequestsByStudent = studentId => {
    return mentoringRequests.filter(request => request.studentId === studentId);
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    return alumniEvents.filter(event => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      return eventDate > now;
    });
  };

  // Get recent career resources
  const getRecentCareerResources = (limit = 5) => {
    return [...careerResources]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, limit);
  };

  // Get recent success stories
  const getRecentSuccessStories = (limit = 3) => {
    return [...successStories]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Get recent job opportunities
  const getRecentJobOpportunities = (limit = 5) => {
    return [...jobOpportunities]
      .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
      .slice(0, limit);
  };

  const value = {
    alumni,
    mentoringRequests,
    alumniEvents,
    careerResources,
    successStories,
    jobOpportunities,
    addAlumni,
    updateAlumni,
    deleteAlumni,
    requestMentoring,
    updateMentoringRequest,
    addEvent,
    updateEvent,
    deleteEvent,
    addCareerResource,
    updateCareerResource,
    deleteCareerResource,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    addJobOpportunity,
    updateJobOpportunity,
    deleteJobOpportunity,
    getAlumniByExpertise,
    getAvailableMentors,
    getMentoringRequestsByStudent,
    getUpcomingEvents,
    getRecentCareerResources,
    getRecentSuccessStories,
    getRecentJobOpportunities,
  };

  return (
    <AlumniContext.Provider value={value}>{children}</AlumniContext.Provider>
  );
};
