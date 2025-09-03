import { createContext, useContext, useEffect, useState } from 'react';
import { useAttendanceContext } from './AttendanceContext';
import { useProgressContext } from './ProgressContext';
import { useQuizContext } from './QuizContext';
import { useStudentContext } from './StudentContext';

const RankingContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useRankingContext = () => {
  const context = useContext(RankingContext);
  if (!context) {
    throw new Error('useRankingContext must be used within a RankingProvider');
  }
  return context;
};

export const RankingProvider = ({ children }) => {
  const { students } = useStudentContext();
  const { getAttendanceSummary } = useAttendanceContext();
  const { progressData } = useProgressContext();
  const { quizzes } = useQuizContext();
  const [rankings, setRankings] = useState([]);

  // Calculate rankings based on multiple factors
  // Attendance: 30%, Learning Progress: 30%, Quiz Scores: 25%, Achievements: 15%
  const calculateRankings = () => {
    const studentRankings = students.map(student => {
      // 1. Attendance score (30% weight)
      const attendanceSummary = getAttendanceSummary(student.id);
      const totalAttendance =
        attendanceSummary.present +
        attendanceSummary.late +
        attendanceSummary.absent;
      const attendanceScore =
        totalAttendance > 0
          ? ((attendanceSummary.present + attendanceSummary.late * 0.5) /
              totalAttendance) *
            30
          : 0;

      // 2. Learning progress score (30% weight)
      const studentProgress = progressData.filter(
        p => p.studentId === student.id
      );
      const totalTasks = studentProgress.reduce(
        (sum, p) => sum + p.tasks.length,
        0
      );
      const completedTasks = studentProgress.reduce(
        (sum, p) => sum + p.tasks.filter(t => t.completed).length,
        0
      );
      const progressScore =
        totalTasks > 0 ? (completedTasks / totalTasks) * 30 : 0;

      // 3. Quiz scores (25% weight)
      const studentQuizzes = quizzes.filter(q => q.studentId === student.id);
      const totalQuizScore = studentQuizzes.reduce(
        (sum, q) => sum + q.score,
        0
      );
      const quizAverage =
        studentQuizzes.length > 0 ? totalQuizScore / studentQuizzes.length : 0;
      const quizScore = (quizAverage / 100) * 25;

      // 4. Achievements (15% weight)
      const achievements = student.achievements || [];
      // Assuming max 10 achievements for normalization
      const achievementScore = Math.min((achievements.length / 10) * 15, 15);

      // Total score
      const totalScore =
        attendanceScore + progressScore + quizScore + achievementScore;

      return {
        studentId: student.id,
        studentName: student.name,
        studentPhoto: student.photo,
        attendanceScore: attendanceScore.toFixed(2),
        progressScore: progressScore.toFixed(2),
        quizScore: quizScore.toFixed(2),
        achievementScore: achievementScore.toFixed(2),
        totalScore: totalScore.toFixed(2),
        achievements: achievements.length,
      };
    });

    // Sort by total score descending
    studentRankings.sort(
      (a, b) => parseFloat(b.totalScore) - parseFloat(a.totalScore)
    );

    // Add rank position
    const rankedStudents = studentRankings.map((student, index) => ({
      ...student,
      rank: index + 1,
      medal:
        index === 0
          ? 'gold'
          : index === 1
          ? 'silver'
          : index === 2
          ? 'bronze'
          : null,
    }));

    setRankings(rankedStudents);
  };

  // Recalculate rankings when dependencies change
  useEffect(() => {
    calculateRankings();
  }, [students, progressData, quizzes]);

  const getStudentRank = studentId => {
    return rankings.find(r => r.studentId === studentId);
  };

  const getTopStudents = (count = 10) => {
    return rankings.slice(0, count);
  };

  const value = {
    rankings,
    getStudentRank,
    getTopStudents,
    calculateRankings,
  };

  return (
    <RankingContext.Provider value={value}>{children}</RankingContext.Provider>
  );
};
