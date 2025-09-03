import { createContext, useContext, useEffect, useState } from 'react';

const PeerAssessmentContext = createContext();

export const usePeerAssessmentContext = () => {
  const context = useContext(PeerAssessmentContext);
  if (!context) {
    throw new Error(
      'usePeerAssessmentContext must be used within a PeerAssessmentProvider'
    );
  }
  return context;
};

export const PeerAssessmentProvider = ({ children }) => {
  const [assessments, setAssessments] = useState([]);
  const [criteria, setCriteria] = useState([
    {
      id: 1,
      name: 'Kualitas Kerja',
      description: 'Seberapa baik kualitas kerja yang dihasilkan',
      weight: 30,
    },
    {
      id: 2,
      name: 'Kerjasama Tim',
      description: 'Seberapa baik kemampuan bekerja sama dalam tim',
      weight: 25,
    },
    {
      id: 3,
      name: 'Kreativitas',
      description: 'Seberapa kreatif dan inovatif solusi yang diajukan',
      weight: 20,
    },
    {
      id: 4,
      name: 'Tanggung Jawab',
      description: 'Seberapa bertanggung jawab dalam mengerjakan tugas',
      weight: 15,
    },
    {
      id: 5,
      name: 'Komunikasi',
      description: 'Seberapa efektif komunikasi dengan anggota tim',
      weight: 10,
    },
  ]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedAssessments = localStorage.getItem('peerAssessments');
    const savedCriteria = localStorage.getItem('peerAssessmentCriteria');

    if (savedAssessments) {
      setAssessments(JSON.parse(savedAssessments));
    }

    if (savedCriteria) {
      setCriteria(JSON.parse(savedCriteria));
    }
  }, []);

  // Save assessments to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('peerAssessments', JSON.stringify(assessments));
  }, [assessments]);

  // Save criteria to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('peerAssessmentCriteria', JSON.stringify(criteria));
  }, [criteria]);

  const createAssessment = assessmentData => {
    const newAssessment = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...assessmentData,
    };
    setAssessments(prev => [...prev, newAssessment]);
    return newAssessment.id;
  };

  const updateAssessment = (id, updatedData) => {
    setAssessments(prev =>
      prev.map(assessment =>
        assessment.id === id ? { ...assessment, ...updatedData } : assessment
      )
    );
  };

  const deleteAssessment = id => {
    setAssessments(prev => prev.filter(assessment => assessment.id !== id));
  };

  const getAssessmentsByProject = projectId => {
    return assessments.filter(assessment => assessment.projectId === projectId);
  };

  const getAssessmentsByStudent = studentId => {
    return assessments.filter(
      assessment => assessment.assessedStudentId === studentId
    );
  };

  const getAssessmentsByAssessor = assessor => {
    return assessments.filter(assessment => assessment.assessor === assessor);
  };

  const addCriteria = criteriaData => {
    const newCriteria = {
      id: Date.now(),
      ...criteriaData,
    };
    setCriteria(prev => [...prev, newCriteria]);
    return newCriteria.id;
  };

  const updateCriteria = (id, updatedData) => {
    setCriteria(prev =>
      prev.map(criterion =>
        criterion.id === id ? { ...criterion, ...updatedData } : criterion
      )
    );
  };

  const deleteCriteria = id => {
    setCriteria(prev => prev.filter(criterion => criterion.id !== id));
  };

  const calculateAverageScore = assessments => {
    if (assessments.length === 0) return 0;

    const totalScore = assessments.reduce((sum, assessment) => {
      // Calculate weighted score based on criteria
      const weightedScore = criteria.reduce((score, criterion) => {
        const rating = assessment.ratings[criterion.id] || 0;
        return score + (rating * criterion.weight) / 100;
      }, 0);

      return sum + weightedScore;
    }, 0);

    return Math.round((totalScore / assessments.length) * 100) / 100;
  };

  const calculateCriterionAverage = (assessments, criterionId) => {
    if (assessments.length === 0) return 0;

    const totalRating = assessments.reduce((sum, assessment) => {
      return sum + (assessment.ratings[criterionId] || 0);
    }, 0);

    return Math.round((totalRating / assessments.length) * 100) / 100;
  };

  const getStudentStatistics = (projectId, studentId) => {
    const projectAssessments = getAssessmentsByProject(projectId);
    const studentAssessments = projectAssessments.filter(
      assessment => assessment.assessedStudentId === studentId
    );

    const criterionStats = criteria.map(criterion => ({
      criterionId: criterion.id,
      criterionName: criterion.name,
      averageRating: calculateCriterionAverage(
        studentAssessments,
        criterion.id
      ),
      weight: criterion.weight,
    }));

    return {
      totalAssessments: studentAssessments.length,
      averageScore: calculateAverageScore(studentAssessments),
      criterionStats,
    };
  };

  const getProjectStatistics = projectId => {
    const projectAssessments = getAssessmentsByProject(projectId);

    // Get unique students assessed in this project
    const assessedStudents = [
      ...new Set(
        projectAssessments.map(assessment => assessment.assessedStudentId)
      ),
    ];

    const studentStats = assessedStudents.map(studentId => ({
      studentId,
      ...getStudentStatistics(projectId, studentId),
    }));

    return {
      totalAssessments: projectAssessments.length,
      assessedStudents: assessedStudents.length,
      studentStats,
    };
  };

  const value = {
    assessments,
    criteria,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    getAssessmentsByProject,
    getAssessmentsByStudent,
    getAssessmentsByAssessor,
    addCriteria,
    updateCriteria,
    deleteCriteria,
    calculateAverageScore,
    calculateCriterionAverage,
    getStudentStatistics,
    getProjectStatistics,
  };

  return (
    <PeerAssessmentContext.Provider value={value}>
      {children}
    </PeerAssessmentContext.Provider>
  );
};
