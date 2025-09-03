import { createContext, useContext, useEffect, useState } from 'react';

const CareerContext = createContext();

export const useCareerContext = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareerContext must be used within a CareerProvider');
  }
  return context;
};

export const CareerProvider = ({ children }) => {
  const [careers, setCareers] = useState([
    {
      id: 1,
      title: 'Network Administrator',
      description:
        'Bertanggung jawab atas instalasi, konfigurasi, dan pemeliharaan infrastruktur jaringan komputer.',
      skills: [
        'Cisco Networking',
        'Firewall Management',
        'Network Troubleshooting',
        'Server Administration',
      ],
      education:
        'D3/S1 Teknik Informatika, Sistem Informasi, atau bidang terkait',
      salary: 'Rp 4.000.000 - Rp 8.000.000/bulan',
      growth: 'Tinggi',
      imageUrl:
        'https://source.unsplash.com/random/800x600/?network,administrator',
    },
    {
      id: 2,
      title: 'System Analyst',
      description:
        'Menganalisis kebutuhan sistem informasi dan merancang solusi teknologi yang sesuai.',
      skills: [
        'System Design',
        'Requirements Analysis',
        'Database Design',
        'Project Management',
      ],
      education: 'S1 Teknik Informatika, Sistem Informasi, atau bidang terkait',
      salary: 'Rp 5.000.000 - Rp 12.000.000/bulan',
      growth: 'Tinggi',
      imageUrl: 'https://source.unsplash.com/random/800x600/?system,analysis',
    },
    {
      id: 3,
      title: 'Cyber Security Specialist',
      description:
        'Melindungi sistem dan jaringan dari ancaman keamanan siber.',
      skills: [
        'Ethical Hacking',
        'Security Auditing',
        'Incident Response',
        'Risk Assessment',
      ],
      education: 'S1 Teknik Informatika, Sistem Informasi, atau bidang terkait',
      salary: 'Rp 6.000.000 - Rp 15.000.000/bulan',
      growth: 'Sangat Tinggi',
      imageUrl:
        'https://source.unsplash.com/random/800x600/?cybersecurity,hacking',
    },
    {
      id: 4,
      title: 'Software Developer',
      description:
        'Mengembangkan aplikasi perangkat lunak untuk berbagai platform.',
      skills: [
        'Programming (Java, Python, JavaScript)',
        'Database Management',
        'UI/UX Design',
        'Version Control',
      ],
      education: 'S1 Teknik Informatika, Sistem Informasi, atau bidang terkait',
      salary: 'Rp 4.500.000 - Rp 13.000.000/bulan',
      growth: 'Tinggi',
      imageUrl:
        'https://source.unsplash.com/random/800x600/?software,developer',
    },
    {
      id: 5,
      title: 'Database Administrator',
      description: 'Mengelola dan memelihara sistem database organisasi.',
      skills: [
        'SQL',
        'Database Design',
        'Backup & Recovery',
        'Performance Tuning',
      ],
      education:
        'D3/S1 Teknik Informatika, Sistem Informasi, atau bidang terkait',
      salary: 'Rp 5.000.000 - Rp 10.000.000/bulan',
      growth: 'Menengah',
      imageUrl: 'https://source.unsplash.com/random/800x600/?database,server',
    },
    {
      id: 6,
      title: 'IT Support Specialist',
      description:
        'Memberikan dukungan teknis untuk perangkat keras dan perangkat lunak.',
      skills: [
        'Hardware Troubleshooting',
        'Software Installation',
        'Customer Service',
        'Remote Support',
      ],
      education: 'D3 Teknik Informatika, Sistem Informasi, atau bidang terkait',
      salary: 'Rp 3.500.000 - Rp 6.000.000/bulan',
      growth: 'Menengah',
      imageUrl: 'https://source.unsplash.com/random/800x600/?tech,support',
    },
  ]);

  const [interests] = useState([
    { id: 1, name: 'Networking', icon: '🌐' },
    { id: 2, name: 'Programming', icon: '💻' },
    { id: 3, name: 'Security', icon: '🔒' },
    { id: 4, name: 'Database', icon: '🗄️' },
    { id: 5, name: 'System Design', icon: '⚙️' },
    { id: 6, name: 'Support', icon: '🎧' },
  ]);

  const [studentInterests, setStudentInterests] = useState({});

  const [careerPaths, setCareerPaths] = useState([
    {
      id: 1,
      title: 'Networking Path',
      description:
        'Jalur karir yang fokus pada infrastruktur jaringan dan keamanan siber',
      careers: [1, 3],
      duration: '2-4 tahun',
      certification: ['Cisco CCNA', 'CompTIA Network+'],
    },
    {
      id: 2,
      title: 'Software Development Path',
      description:
        'Jalur karir yang fokus pada pengembangan perangkat lunak dan aplikasi',
      careers: [2, 4],
      duration: '3-5 tahun',
      certification: [
        'Oracle Certified Java Programmer',
        'Microsoft Certified: Azure Developer',
      ],
    },
    {
      id: 3,
      title: 'Database & System Path',
      description:
        'Jalur karir yang fokus pada manajemen database dan sistem informasi',
      careers: [5, 2],
      duration: '2-4 tahun',
      certification: [
        'Oracle Database SQL Certified',
        'Microsoft Certified: Azure Administrator',
      ],
    },
    {
      id: 4,
      title: 'IT Support Path',
      description: 'Jalur karir yang fokus pada dukungan teknis dan layanan IT',
      careers: [6, 1],
      duration: '1-3 tahun',
      certification: [
        'CompTIA A+',
        'Microsoft 365 Certified: Modern Desktop Administrator',
      ],
    },
  ]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedStudentInterests = localStorage.getItem('studentInterests');
    const savedCareerPaths = localStorage.getItem('careerPaths');

    if (savedStudentInterests) {
      setStudentInterests(JSON.parse(savedStudentInterests));
    }

    if (savedCareerPaths) {
      setCareerPaths(JSON.parse(savedCareerPaths));
    }
  }, []);

  // Save student interests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studentInterests', JSON.stringify(studentInterests));
  }, [studentInterests]);

  // Save career paths to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('careerPaths', JSON.stringify(careerPaths));
  }, [careerPaths]);

  const addCareer = careerData => {
    const newCareer = {
      id: Date.now(),
      ...careerData,
    };
    setCareers(prev => [...prev, newCareer]);
    return newCareer.id;
  };

  const updateCareer = (id, updatedData) => {
    setCareers(prev =>
      prev.map(career =>
        career.id === id ? { ...career, ...updatedData } : career
      )
    );
  };

  const deleteCareer = id => {
    setCareers(prev => prev.filter(career => career.id !== id));
  };

  const setStudentInterest = (studentId, interestId) => {
    setStudentInterests(prev => ({
      ...prev,
      [studentId]: interestId,
    }));
  };

  const getRecommendedCareers = studentId => {
    const interestId = studentInterests[studentId];
    if (!interestId) return [];

    const interest = interests.find(i => i.id === interestId);
    if (!interest) return [];

    // Return careers that match the student's interest
    return careers.filter(career =>
      career.skills.some(skill =>
        skill.toLowerCase().includes(interest.name.toLowerCase())
      )
    );
  };

  const getCareerById = id => {
    return careers.find(career => career.id === id);
  };

  const getCareerPath = pathId => {
    // Find career path in careerPaths array
    return careerPaths.find(path => path.id === pathId);
  };

  const getCareersByPath = pathId => {
    const path = careerPaths.find(p => p.id === pathId);
    if (!path) return [];

    return careers.filter(career => path.careers.includes(career.id));
  };

  // New function to get careers by interest
  const getCareersByInterest = interestId => {
    const interest = interests.find(i => i.id === interestId);
    if (!interest) return [];

    return careers.filter(career =>
      career.skills.some(skill =>
        skill.toLowerCase().includes(interest.name.toLowerCase())
      )
    );
  };

  // New function to search careers
  const searchCareers = query => {
    const lowerQuery = query.toLowerCase();
    return careers.filter(
      career =>
        career.title.toLowerCase().includes(lowerQuery) ||
        career.description.toLowerCase().includes(lowerQuery) ||
        career.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
    );
  };

  // New function to get related careers
  const getRelatedCareers = careerId => {
    const career = getCareerById(careerId);
    if (!career) return [];

    // Find careers that share similar skills
    return careers
      .filter(c => c.id !== careerId)
      .filter(c =>
        c.skills.some(skill =>
          career.skills.some(
            careerSkill =>
              skill.toLowerCase().includes(careerSkill.toLowerCase()) ||
              careerSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      )
      .slice(0, 3); // Limit to 3 related careers
  };

  // Career Path Management Functions
  const addCareerPath = pathData => {
    const newPath = {
      id: Date.now(),
      ...pathData,
      careers: pathData.careers || [],
      certification: pathData.certification || [],
    };
    setCareerPaths(prev => [...prev, newPath]);
    return newPath.id;
  };

  const updateCareerPath = (id, updatedData) => {
    setCareerPaths(prev =>
      prev.map(path => (path.id === id ? { ...path, ...updatedData } : path))
    );
  };

  const deleteCareerPath = id => {
    setCareerPaths(prev => prev.filter(path => path.id !== id));
  };

  const addCareerToPath = (pathId, careerId) => {
    setCareerPaths(prev =>
      prev.map(path => {
        if (path.id === pathId && !path.careers.includes(careerId)) {
          return {
            ...path,
            careers: [...path.careers, careerId],
          };
        }
        return path;
      })
    );
  };

  const removeCareerFromPath = (pathId, careerId) => {
    setCareerPaths(prev =>
      prev.map(path => {
        if (path.id === pathId && path.careers.includes(careerId)) {
          return {
            ...path,
            careers: path.careers.filter(id => id !== careerId),
          };
        }
        return path;
      })
    );
  };

  const addCertificationToPath = (pathId, certification) => {
    setCareerPaths(prev =>
      prev.map(path => {
        if (path.id === pathId && !path.certification.includes(certification)) {
          return {
            ...path,
            certification: [...path.certification, certification],
          };
        }
        return path;
      })
    );
  };

  const removeCertificationFromPath = (pathId, certification) => {
    setCareerPaths(prev =>
      prev.map(path => {
        if (path.id === pathId && path.certification.includes(certification)) {
          return {
            ...path,
            certification: path.certification.filter(
              cert => cert !== certification
            ),
          };
        }
        return path;
      })
    );
  };

  const value = {
    careers,
    interests,
    studentInterests,
    careerPaths,
    addCareer,
    updateCareer,
    deleteCareer,
    setStudentInterest,
    getRecommendedCareers,
    getCareerById,
    getCareerPath,
    getCareersByPath,
    getCareersByInterest,
    searchCareers,
    getRelatedCareers,
    addCareerPath,
    updateCareerPath,
    deleteCareerPath,
    addCareerToPath,
    removeCareerFromPath,
    addCertificationToPath,
    removeCertificationFromPath,
  };

  return (
    <CareerContext.Provider value={value}>{children}</CareerContext.Provider>
  );
};
