import { createContext, useContext, useState } from 'react';
import { useAssignmentsContext } from './AssignmentsContext';
import { useAttendanceContext } from './AttendanceContext';
import { useDataContext } from './DataContext';
import { useFeedbackContext } from './FeedbackContext';
import { useGradesContext } from './GradesContext';
import { useProgressContext } from './ProgressContext';
import { useProjectContext } from './ProjectContext';
import { useQuizContext } from './QuizContext';
import { useStudyGroupContext } from './StudyGroupContext';

const ReportContext = createContext();

export function useReportContext() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReportContext must be used within a ReportProvider');
  }
  return context;
}

export function ReportProvider({ children }) {
  const { students } = useDataContext();
  const { progressData } = useProgressContext();
  const { assignments } = useAssignmentsContext();
  const { attendanceRecords } = useAttendanceContext();
  const { grades } = useGradesContext();
  const { quizzes } = useQuizContext();
  const { projects } = useProjectContext();
  const { feedbacks } = useFeedbackContext();
  const { studyGroups, groupMemberships } = useStudyGroupContext();
  const [reports, setReports] = useState([]);

  // Generate a comprehensive student report
  const generateStudentReport = studentId => {
    const student = students.find(s => s.id === studentId);
    if (!student) return null;

    // Progress data for the student
    const studentProgress = progressData.filter(p => p.studentId === studentId);

    // Assignments for the student
    const studentAssignments = assignments.filter(
      a => a.studentId === studentId
    );

    // Attendance records for the student
    const studentAttendance = attendanceRecords.filter(
      a => a.studentId === studentId
    );

    // Grades for the student
    const studentGrades = grades.filter(g => g.studentId === studentId);

    // Quiz results for the student
    const studentQuizzes = quizzes.filter(q => q.studentId === studentId);

    // Projects for the student
    const studentProjects = projects.filter(p => p.studentId === studentId);

    // Feedback from the student
    const studentFeedbacks = feedbacks.filter(f => f.studentId === studentId);

    // Study group memberships for the student
    const studentGroupMemberships = groupMemberships.filter(
      g => g.studentId === studentId
    );
    const studentGroups = studentGroupMemberships
      .map(m => studyGroups.find(g => g.id === m.groupId))
      .filter(Boolean);

    // Calculate statistics
    const totalProgressItems = studentProgress.length;
    const avgProgress =
      totalProgressItems > 0
        ? Math.round(
            studentProgress.reduce((sum, p) => sum + p.progress, 0) /
              totalProgressItems
          )
        : 0;

    const totalAssignments = studentAssignments.length;
    const completedAssignments = studentAssignments.filter(
      a => a.status === 'completed'
    ).length;
    const assignmentCompletionRate =
      totalAssignments > 0
        ? Math.round((completedAssignments / totalAssignments) * 100)
        : 0;

    const totalAttendance = studentAttendance.length;
    const presentAttendance = studentAttendance.filter(
      a => a.status === 'present'
    ).length;
    const attendanceRate =
      totalAttendance > 0
        ? Math.round((presentAttendance / totalAttendance) * 100)
        : 0;

    const avgGrade =
      studentGrades.length > 0
        ? Math.round(
            studentGrades.reduce((sum, g) => sum + g.score, 0) /
              studentGrades.length
          )
        : 0;

    const avgQuizScore =
      studentQuizzes.length > 0
        ? Math.round(
            studentQuizzes.reduce((sum, q) => sum + q.score, 0) /
              studentQuizzes.length
          )
        : 0;

    // Calculate grade distribution
    const gradeDistribution = {
      A: studentGrades.filter(g => g.score >= 85).length,
      B: studentGrades.filter(g => g.score >= 70 && g.score < 85).length,
      C: studentGrades.filter(g => g.score >= 55 && g.score < 70).length,
      D: studentGrades.filter(g => g.score >= 40 && g.score < 55).length,
      E: studentGrades.filter(g => g.score < 40).length,
    };

    // Calculate assignment trend
    const assignmentTrend = studentAssignments.map((assignment, index) => ({
      date: assignment.dueDate,
      status: assignment.status,
      index: index + 1,
    }));

    // Calculate attendance trend
    const attendanceTrend = studentAttendance.map((attendance, index) => ({
      date: attendance.date,
      status: attendance.status,
      index: index + 1,
    }));

    const report = {
      id: Date.now(),
      studentId,
      studentName: student.name,
      studentPhoto: student.photo,
      generatedAt: new Date().toISOString(),
      summary: {
        totalProgressItems,
        avgProgress,
        totalAssignments,
        completedAssignments,
        assignmentCompletionRate,
        totalAttendance,
        presentAttendance,
        attendanceRate,
        avgGrade,
        avgQuizScore,
        totalProjects: studentProjects.length,
        totalFeedbacks: studentFeedbacks.length,
        totalStudyGroups: studentGroups.length,
        gradeDistribution,
      },
      details: {
        progress: studentProgress,
        assignments: studentAssignments,
        attendance: studentAttendance,
        grades: studentGrades,
        quizzes: studentQuizzes,
        projects: studentProjects,
        feedbacks: studentFeedbacks,
        studyGroups: studentGroups,
        assignmentTrend,
        attendanceTrend,
      },
    };

    setReports(prev => [...prev, report]);
    return report;
  };

  // Generate a class report
  const generateClassReport = () => {
    const classReport = {
      id: Date.now(),
      generatedAt: new Date().toISOString(),
      totalStudents: students.length,
      studentReports: [],
    };

    students.forEach(student => {
      const report = generateStudentReport(student.id);
      if (report) {
        classReport.studentReports.push(report);
      }
    });

    // Calculate class averages
    const totalReports = classReport.studentReports.length;
    if (totalReports > 0) {
      const totalProgress = classReport.studentReports.reduce(
        (sum, r) => sum + r.summary.avgProgress,
        0
      );
      const totalAssignmentRate = classReport.studentReports.reduce(
        (sum, r) => sum + r.summary.assignmentCompletionRate,
        0
      );
      const totalAttendanceRate = classReport.studentReports.reduce(
        (sum, r) => sum + r.summary.attendanceRate,
        0
      );
      const totalGrade = classReport.studentReports.reduce(
        (sum, r) => sum + r.summary.avgGrade,
        0
      );
      const totalQuizScore = classReport.studentReports.reduce(
        (sum, r) => sum + r.summary.avgQuizScore,
        0
      );

      // Calculate subject averages
      const subjectAverages = {};
      classReport.studentReports.forEach(report => {
        report.details.grades.forEach(grade => {
          if (!subjectAverages[grade.subject]) {
            subjectAverages[grade.subject] = { total: 0, count: 0 };
          }
          subjectAverages[grade.subject].total += grade.score;
          subjectAverages[grade.subject].count += 1;
        });
      });

      const subjectPerformance = Object.keys(subjectAverages).map(subject => ({
        subject,
        average: Math.round(
          subjectAverages[subject].total / subjectAverages[subject].count
        ),
      }));

      // Calculate top performing students
      const topStudents = classReport.studentReports
        .sort((a, b) => b.summary.avgGrade - a.summary.avgGrade)
        .slice(0, 5)
        .map(report => ({
          studentId: report.studentId,
          studentName: report.studentName,
          avgGrade: report.summary.avgGrade,
        }));

      classReport.classAverages = {
        avgProgress: Math.round(totalProgress / totalReports),
        avgAssignmentCompletionRate: Math.round(
          totalAssignmentRate / totalReports
        ),
        avgAttendanceRate: Math.round(totalAttendanceRate / totalReports),
        avgGrade: Math.round(totalGrade / totalReports),
        avgQuizScore: Math.round(totalQuizScore / totalReports),
        subjectPerformance,
        topStudents,
      };
    }

    setReports(prev => [...prev, classReport]);
    return classReport;
  };

  // Get all reports
  const getAllReports = () => {
    return reports;
  };

  // Get report by ID
  const getReportById = reportId => {
    return reports.find(r => r.id === reportId);
  };

  // Delete a report
  const deleteReport = reportId => {
    setReports(prev => prev.filter(r => r.id !== reportId));
  };

  const value = {
    reports,
    generateStudentReport,
    generateClassReport,
    getAllReports,
    getReportById,
    deleteReport,
  };

  return (
    <ReportContext.Provider value={value}>{children}</ReportContext.Provider>
  );
}
