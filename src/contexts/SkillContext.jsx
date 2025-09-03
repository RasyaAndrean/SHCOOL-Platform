import { createContext, useContext, useEffect, useState } from 'react';

const SkillContext = createContext();

export function useSkillContext() {
  const context = useContext(SkillContext);
  if (!context) {
    throw new Error('useSkillContext must be used within a SkillProvider');
  }
  return context;
}

export function SkillProvider({ children }) {
  const [skills, setSkills] = useState([]);
  const [assessments, setAssessments] = useState([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedSkills = localStorage.getItem('skills');
    const savedAssessments = localStorage.getItem('skillAssessments');

    if (savedSkills) {
      setSkills(JSON.parse(savedSkills));
    } else {
      // Sample skills data
      const sampleSkills = [
        {
          id: 1,
          name: 'Pemrograman Web',
          category: 'Teknologi',
          description: 'Kemampuan dalam pengembangan aplikasi web',
        },
        {
          id: 2,
          name: 'Jaringan Komputer',
          category: 'Teknologi',
          description: 'Pemahaman tentang infrastruktur jaringan',
        },
        {
          id: 3,
          name: 'Desain Grafis',
          category: 'Kreatif',
          description: 'Kemampuan dalam desain visual dan multimedia',
        },
        {
          id: 4,
          name: 'Matematika',
          category: 'Akademik',
          description: 'Pemahaman konsep matematika dasar dan lanjutan',
        },
        {
          id: 5,
          name: 'Bahasa Inggris',
          category: 'Bahasa',
          description: 'Kemampuan berbahasa Inggris secara lisan dan tulisan',
        },
        {
          id: 6,
          name: 'Komunikasi',
          category: 'Soft Skills',
          description: 'Kemampuan menyampaikan ide dan bekerja dalam tim',
        },
      ];
      setSkills(sampleSkills);
    }

    if (savedAssessments) {
      setAssessments(JSON.parse(savedAssessments));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('skills', JSON.stringify(skills));
  }, [skills]);

  useEffect(() => {
    localStorage.setItem('skillAssessments', JSON.stringify(assessments));
  }, [assessments]);

  // Add a new skill
  const addSkill = skill => {
    const newSkill = {
      id: Date.now(),
      ...skill,
    };
    setSkills(prev => [...prev, newSkill]);
  };

  // Update an existing skill
  const updateSkill = (id, updatedSkill) => {
    setSkills(prev =>
      prev.map(skill =>
        skill.id === id ? { ...skill, ...updatedSkill } : skill
      )
    );
  };

  // Delete a skill
  const deleteSkill = id => {
    setSkills(prev => prev.filter(skill => skill.id !== id));
  };

  // Assess a skill
  const assessSkill = (skillId, userId, score, feedback = '') => {
    const newAssessment = {
      id: Date.now(),
      skillId,
      userId,
      score,
      feedback,
      date: new Date().toISOString(),
    };
    setAssessments(prev => [...prev, newAssessment]);
  };

  // Get assessments for a specific user
  const getUserAssessments = userId => {
    return assessments.filter(assessment => assessment.userId === userId);
  };

  // Get assessments for a specific skill
  const getSkillAssessments = skillId => {
    return assessments.filter(assessment => assessment.skillId === skillId);
  };

  // Get average score for a skill
  const getSkillAverageScore = skillId => {
    const skillAssessments = getSkillAssessments(skillId);
    if (skillAssessments.length === 0) return 0;

    const total = skillAssessments.reduce(
      (sum, assessment) => sum + assessment.score,
      0
    );
    return Math.round(total / skillAssessments.length);
  };

  // Get user's skill levels
  const getUserSkillLevels = userId => {
    const userAssessments = getUserAssessments(userId);
    const skillLevels = {};

    userAssessments.forEach(assessment => {
      const skill = skills.find(s => s.id === assessment.skillId);
      if (skill) {
        if (
          !skillLevels[skill.id] ||
          assessment.date > skillLevels[skill.id].date
        ) {
          skillLevels[skill.id] = {
            skill,
            score: assessment.score,
            feedback: assessment.feedback,
            date: assessment.date,
          };
        }
      }
    });

    return Object.values(skillLevels);
  };

  const value = {
    skills,
    assessments,
    addSkill,
    updateSkill,
    deleteSkill,
    assessSkill,
    getUserAssessments,
    getSkillAssessments,
    getSkillAverageScore,
    getUserSkillLevels,
  };

  return (
    <SkillContext.Provider value={value}>{children}</SkillContext.Provider>
  );
}
