import { createContext, useContext, useEffect, useState } from 'react';

const GradesContext = createContext();

export const useGradesContext = () => {
  const context = useContext(GradesContext);
  if (!context) {
    throw new Error('useGradesContext must be used within a GradesProvider');
  }
  return context;
};

export const GradesProvider = ({ children }) => {
  const [grades, setGrades] = useState([]);
  const [subjects] = useState([
    'Jaringan Komputer',
    'Pemrograman Web',
    'Sistem Operasi',
    'Desain Grafis',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
  ]);

  // Load grades from localStorage on initial load
  useEffect(() => {
    const savedGrades = localStorage.getItem('grades');
    if (savedGrades) {
      setGrades(JSON.parse(savedGrades));
    } else {
      // Add sample data for demonstration
      const sampleGrades = [
        {
          id: 1,
          studentId: 1,
          subject: 'Jaringan Komputer',
          description: 'Ujian Tengah Semester',
          score: 85,
          date: '2025-08-15',
        },
        {
          id: 2,
          studentId: 1,
          subject: 'Pemrograman Web',
          description: 'Tugas Praktik',
          score: 92,
          date: '2025-08-20',
        },
        {
          id: 3,
          studentId: 1,
          subject: 'Matematika',
          description: 'Kuis Mingguan',
          score: 78,
          date: '2025-08-25',
        },
        {
          id: 4,
          studentId: 2,
          subject: 'Jaringan Komputer',
          description: 'Ujian Tengah Semester',
          score: 90,
          date: '2025-08-15',
        },
      ];
      setGrades(sampleGrades);
    }
  }, []);

  // Save grades to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('grades', JSON.stringify(grades));
  }, [grades]);

  const addGrade = gradeData => {
    const newGrade = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      ...gradeData,
    };
    setGrades(prev => [...prev, newGrade]);
    return newGrade;
  };

  const updateGrade = (id, updatedData) => {
    setGrades(prev =>
      prev.map(grade =>
        grade.id === id ? { ...grade, ...updatedData } : grade
      )
    );
  };

  const deleteGrade = id => {
    setGrades(prev => prev.filter(grade => grade.id !== id));
  };

  const getStudentGrades = studentId => {
    return grades.filter(grade => grade.studentId === studentId);
  };

  const getSubjectGrades = subject => {
    return grades.filter(grade => grade.subject === subject);
  };

  const getStudentSubjectGrades = (studentId, subject) => {
    return grades.filter(
      grade => grade.studentId === studentId && grade.subject === subject
    );
  };

  const getAverageGrade = (studentId, subject = null) => {
    let filteredGrades = grades.filter(grade => grade.studentId === studentId);

    if (subject) {
      filteredGrades = filteredGrades.filter(
        grade => grade.subject === subject
      );
    }

    if (filteredGrades.length === 0) return 0;

    const sum = filteredGrades.reduce((acc, grade) => acc + grade.score, 0);
    return Math.round(sum / filteredGrades.length);
  };

  const getStudentReport = studentId => {
    const studentGrades = getStudentGrades(studentId);

    // Group grades by subject
    const subjects = [...new Set(studentGrades.map(grade => grade.subject))];

    return subjects.map(subject => {
      const subjectGrades = studentGrades.filter(
        grade => grade.subject === subject
      );
      const average = getAverageGrade(studentId, subject);

      return {
        subject,
        grades: subjectGrades,
        average,
      };
    });
  };

  const value = {
    grades,
    subjects,
    addGrade,
    updateGrade,
    deleteGrade,
    getStudentGrades,
    getSubjectGrades,
    getStudentSubjectGrades,
    getAverageGrade,
    getStudentReport,
  };

  return (
    <GradesContext.Provider value={value}>{children}</GradesContext.Provider>
  );
};
