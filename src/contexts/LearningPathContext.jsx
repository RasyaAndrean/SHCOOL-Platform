import { createContext, useContext, useEffect, useState } from 'react';
import { useCareerContext } from './CareerContext';
import { useProgressContext } from './ProgressContext';
import { useSkillContext } from './SkillContext';

export const LearningPathContext = createContext();

export const useLearningPathContext = () => {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error(
      'useLearningPathContext must be used within a LearningPathProvider'
    );
  }
  return context;
};

export const LearningPathProvider = ({ children }) => {
  const { progressData } = useProgressContext();
  const { getUserSkillLevels } = useSkillContext();
  const { getUserInterests } = useCareerContext();

  const [learningPaths, setLearningPaths] = useState(() => {
    const saved = localStorage.getItem('learningPaths');
    return saved ? JSON.parse(saved) : [];
  });

  const [studentPaths, setStudentPaths] = useState(() => {
    const saved = localStorage.getItem('studentPaths');
    return saved ? JSON.parse(saved) : {};
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('learningPaths', JSON.stringify(learningPaths));
  }, [learningPaths]);

  useEffect(() => {
    localStorage.setItem('studentPaths', JSON.stringify(studentPaths));
  }, [studentPaths]);

  // Generate learning paths based on different career fields
  const generateLearningPaths = () => {
    const paths = [
      {
        id: 1,
        name: 'Network Engineer',
        description: 'Jalur karir untuk menjadi Network Engineer profesional',
        careerField: 'Teknologi Informasi',
        duration: '24 minggu',
        difficulty: 'Intermediate',
        subjects: [
          'Jaringan Komputer',
          'Sistem Operasi',
          'Keamanan Jaringan',
          'Pemrograman',
        ],
        skills: ['Networking', 'Troubleshooting', 'Security', 'Linux'],
        prerequisites: ['Dasar Komputer', 'Matematika'],
        modules: [
          {
            id: 101,
            title: 'Fundamentals of Networking',
            duration: '4 minggu',
            topics: ['OSI Model', 'TCP/IP', 'Network Devices'],
            resources: ['Modul 1', 'Video Tutorial 1'],
          },
          {
            id: 102,
            title: 'Routing and Switching',
            duration: '6 minggu',
            topics: ['Static Routing', 'Dynamic Routing', 'VLAN', 'STP'],
            resources: ['Modul 2', 'Video Tutorial 2'],
          },
          {
            id: 103,
            title: 'Network Security',
            duration: '5 minggu',
            topics: ['Firewall', 'VPN', 'IDS/IPS', 'Encryption'],
            resources: ['Modul 3', 'Video Tutorial 3'],
          },
          {
            id: 104,
            title: 'Advanced Networking',
            duration: '5 minggu',
            topics: [
              'SDN',
              'Cloud Networking',
              'Wireless Security',
              'Network Automation',
            ],
            resources: ['Modul 4', 'Video Tutorial 4'],
          },
          {
            id: 105,
            title: 'Practical Implementation',
            duration: '4 minggu',
            topics: [
              'Lab Setup',
              'Real-world Scenarios',
              'Troubleshooting',
              'Documentation',
            ],
            resources: ['Modul 5', 'Video Tutorial 5'],
          },
        ],
      },
      {
        id: 2,
        name: 'Web Developer',
        description: 'Jalur karir untuk menjadi Web Developer profesional',
        careerField: 'Teknologi Informasi',
        duration: '30 minggu',
        difficulty: 'Intermediate',
        subjects: [
          'Pemrograman Web',
          'Desain Grafis',
          'Database',
          'Keamanan Web',
        ],
        skills: ['HTML/CSS', 'JavaScript', 'React', 'Database Management'],
        prerequisites: ['Dasar Komputer', 'Logika Pemrograman'],
        modules: [
          {
            id: 201,
            title: 'Frontend Development Basics',
            duration: '6 minggu',
            topics: [
              'HTML',
              'CSS',
              'JavaScript Fundamentals',
              'Responsive Design',
            ],
            resources: ['Modul 1', 'Video Tutorial 1'],
          },
          {
            id: 202,
            title: 'Advanced Frontend',
            duration: '6 minggu',
            topics: ['React', 'State Management', 'API Integration', 'Testing'],
            resources: ['Modul 2', 'Video Tutorial 2'],
          },
          {
            id: 203,
            title: 'Backend Development',
            duration: '7 minggu',
            topics: ['Node.js', 'Express', 'Database Design', 'Authentication'],
            resources: ['Modul 3', 'Video Tutorial 3'],
          },
          {
            id: 204,
            title: 'Database Management',
            duration: '5 minggu',
            topics: ['SQL', 'NoSQL', 'ORM', 'Performance Optimization'],
            resources: ['Modul 4', 'Video Tutorial 4'],
          },
          {
            id: 205,
            title: 'Full-stack Project',
            duration: '6 minggu',
            topics: [
              'Project Planning',
              'Development',
              'Deployment',
              'Maintenance',
            ],
            resources: ['Modul 5', 'Video Tutorial 5'],
          },
        ],
      },
      {
        id: 3,
        name: 'Cybersecurity Specialist',
        description:
          'Jalur karir untuk menjadi Cybersecurity Specialist profesional',
        careerField: 'Teknologi Informasi',
        duration: '36 minggu',
        difficulty: 'Advanced',
        subjects: [
          'Keamanan Jaringan',
          'Sistem Operasi',
          'Kriptografi',
          'Forensik Digital',
        ],
        skills: [
          'Security Analysis',
          'Penetration Testing',
          'Incident Response',
          'Compliance',
        ],
        prerequisites: ['Jaringan Komputer', 'Sistem Operasi'],
        modules: [
          {
            id: 301,
            title: 'Security Fundamentals',
            duration: '6 minggu',
            topics: [
              'Threats and Vulnerabilities',
              'Security Models',
              'Risk Management',
              'Compliance',
            ],
            resources: ['Modul 1', 'Video Tutorial 1'],
          },
          {
            id: 302,
            title: 'Network Security',
            duration: '7 minggu',
            topics: ['Firewalls', 'IDS/IPS', 'VPN', 'Wireless Security'],
            resources: ['Modul 2', 'Video Tutorial 2'],
          },
          {
            id: 303,
            title: 'Application Security',
            duration: '7 minggu',
            topics: [
              'Web Security',
              'Mobile Security',
              'Secure Coding',
              'Authentication',
            ],
            resources: ['Modul 3', 'Video Tutorial 3'],
          },
          {
            id: 304,
            title: 'Incident Response and Forensics',
            duration: '8 minggu',
            topics: [
              'Incident Handling',
              'Digital Forensics',
              'Malware Analysis',
              'Log Analysis',
            ],
            resources: ['Modul 4', 'Video Tutorial 4'],
          },
          {
            id: 305,
            title: 'Advanced Security Topics',
            duration: '8 minggu',
            topics: [
              'Cloud Security',
              'IoT Security',
              'AI in Security',
              'Security Architecture',
            ],
            resources: ['Modul 5', 'Video Tutorial 5'],
          },
        ],
      },
      {
        id: 4,
        name: 'Data Analyst',
        description: 'Jalur karir untuk menjadi Data Analyst profesional',
        careerField: 'Data Science',
        duration: '28 minggu',
        difficulty: 'Intermediate',
        subjects: [
          'Matematika',
          'Statistika',
          'Pemrograman',
          'Visualisasi Data',
        ],
        skills: ['Data Analysis', 'Python', 'SQL', 'Data Visualization'],
        prerequisites: ['Matematika', 'Statistika Dasar'],
        modules: [
          {
            id: 401,
            title: 'Data Fundamentals',
            duration: '5 minggu',
            topics: [
              'Data Types',
              'Data Collection',
              'Data Cleaning',
              'Data Storage',
            ],
            resources: ['Modul 1', 'Video Tutorial 1'],
          },
          {
            id: 402,
            title: 'Statistical Analysis',
            duration: '6 minggu',
            topics: [
              'Descriptive Statistics',
              'Inferential Statistics',
              'Hypothesis Testing',
              'Regression',
            ],
            resources: ['Modul 2', 'Video Tutorial 2'],
          },
          {
            id: 403,
            title: 'Programming for Data',
            duration: '7 minggu',
            topics: ['Python for Data', 'Pandas', 'NumPy', 'Data Manipulation'],
            resources: ['Modul 3', 'Video Tutorial 3'],
          },
          {
            id: 404,
            title: 'Data Visualization',
            duration: '5 minggu',
            topics: ['Matplotlib', 'Seaborn', 'Tableau', 'Dashboard Design'],
            resources: ['Modul 4', 'Video Tutorial 4'],
          },
          {
            id: 405,
            title: 'Real-world Projects',
            duration: '5 minggu',
            topics: [
              'Project Planning',
              'Data Analysis',
              'Presentation',
              'Reporting',
            ],
            resources: ['Modul 5', 'Video Tutorial 5'],
          },
        ],
      },
    ];

    setLearningPaths(paths);
    return paths;
  };

  // Recommend learning paths based on student performance and interests
  const recommendPathsForStudent = studentId => {
    // Get student's progress data
    const studentProgress = progressData.filter(p => p.studentId === studentId);

    // Get student's skill levels
    const studentSkills = getUserSkillLevels(studentId);

    // Get student's career interests
    const studentInterests = getUserInterests(studentId);

    // Calculate subject performance averages
    const subjectPerformance = {};
    studentProgress.forEach(progress => {
      if (!subjectPerformance[progress.subject]) {
        subjectPerformance[progress.subject] = { total: 0, count: 0 };
      }
      subjectPerformance[progress.subject].total += progress.progress;
      subjectPerformance[progress.subject].count += 1;
    });

    // Calculate average performance per subject
    const subjectAverages = {};
    Object.keys(subjectPerformance).forEach(subject => {
      subjectAverages[subject] =
        subjectPerformance[subject].total / subjectPerformance[subject].count;
    });

    // Find paths that match student interests
    let recommendedPaths = [];
    if (studentInterests.length > 0) {
      // Filter paths based on student interests
      recommendedPaths = learningPaths.filter(path =>
        studentInterests.some(
          interest =>
            path.careerField
              .toLowerCase()
              .includes(interest.name.toLowerCase()) ||
            path.name.toLowerCase().includes(interest.name.toLowerCase())
        )
      );
    }

    // If no interest-based recommendations, recommend based on performance
    if (recommendedPaths.length === 0) {
      // Find subjects where student performs well (above 70%)
      const strongSubjects = Object.keys(subjectAverages).filter(
        subject => subjectAverages[subject] > 70
      );

      // Recommend paths that include strong subjects
      recommendedPaths = learningPaths.filter(path =>
        path.subjects.some(subject => strongSubjects.includes(subject))
      );
    }

    // If still no recommendations, recommend all paths
    if (recommendedPaths.length === 0) {
      recommendedPaths = [...learningPaths];
    }

    // Add confidence score based on match
    const scoredPaths = recommendedPaths.map(path => {
      let score = 0;

      // Score based on subject performance match
      path.subjects.forEach(subject => {
        if (subjectAverages[subject]) {
          score += subjectAverages[subject] / 100;
        }
      });

      // Score based on skill match
      path.skills.forEach(skill => {
        const studentSkill = studentSkills.find(s => s.skill.name === skill);
        if (studentSkill) {
          score += studentSkill.score / 100;
        }
      });

      // Score based on interest match
      const interestMatch = studentInterests.some(
        interest =>
          path.careerField
            .toLowerCase()
            .includes(interest.name.toLowerCase()) ||
          path.name.toLowerCase().includes(interest.name.toLowerCase())
      );

      if (interestMatch) {
        score += 1;
      }

      // Adjust score based on difficulty and student performance
      const avgPerformance =
        Object.values(subjectAverages).reduce((sum, val) => sum + val, 0) /
          Object.values(subjectAverages).length || 50;

      // If student performs well, recommend more challenging paths
      if (avgPerformance > 80 && path.difficulty === 'Intermediate') {
        score += 0.5;
      } else if (avgPerformance > 80 && path.difficulty === 'Advanced') {
        score += 1;
      }

      // If student struggles, recommend easier paths
      if (avgPerformance < 60 && path.difficulty === 'Beginner') {
        score += 1;
      } else if (avgPerformance < 60 && path.difficulty === 'Intermediate') {
        score += 0.5;
      }

      return {
        ...path,
        confidence: Math.min(score / (path.subjects.length + 1), 1),
      };
    });

    // Sort by confidence score
    scoredPaths.sort((a, b) => b.confidence - a.confidence);

    return scoredPaths.slice(0, 3); // Return top 3 recommendations
  };

  // Assign a learning path to a student
  const assignPathToStudent = (studentId, pathId) => {
    setStudentPaths(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        assignedPaths: [...(prev[studentId]?.assignedPaths || []), pathId],
        currentPath: pathId,
        progress: {},
      },
    }));
  };

  // Update student progress in a learning path
  const updateStudentProgress = (studentId, pathId, moduleId, progress) => {
    setStudentPaths(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        progress: {
          ...prev[studentId]?.progress,
          [pathId]: {
            ...prev[studentId]?.progress?.[pathId],
            [moduleId]: progress,
          },
        },
      },
    }));
  };

  // Get student's assigned paths
  const getStudentPaths = studentId => {
    return studentPaths[studentId]?.assignedPaths || [];
  };

  // Get student's current path
  const getStudentCurrentPath = studentId => {
    const currentPathId = studentPaths[studentId]?.currentPath;
    return learningPaths.find(path => path.id === currentPathId);
  };

  // Get student's progress in a path
  const getStudentPathProgress = (studentId, pathId) => {
    return studentPaths[studentId]?.progress?.[pathId] || {};
  };

  // Calculate overall progress in a path
  const calculatePathProgress = (studentId, pathId) => {
    const path = learningPaths.find(p => p.id === pathId);
    if (!path) return 0;

    const progress = getStudentPathProgress(studentId, pathId);
    const moduleIds = path.modules.map(m => m.id);

    if (moduleIds.length === 0) return 0;

    const totalProgress = moduleIds.reduce((sum, moduleId) => {
      return sum + (progress[moduleId] || 0);
    }, 0);

    return Math.round(totalProgress / moduleIds.length);
  };

  // Initialize with sample data if empty
  useEffect(() => {
    if (learningPaths.length === 0) {
      generateLearningPaths();
    }
  }, [learningPaths.length]);

  const value = {
    learningPaths,
    studentPaths,
    generateLearningPaths,
    recommendPathsForStudent,
    assignPathToStudent,
    updateStudentProgress,
    getStudentPaths,
    getStudentCurrentPath,
    getStudentPathProgress,
    calculatePathProgress,
  };

  return (
    <LearningPathContext.Provider value={value}>
      {children}
    </LearningPathContext.Provider>
  );
};

export default LearningPathContext;
