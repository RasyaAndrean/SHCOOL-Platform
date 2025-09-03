import { useEffect, useState } from 'react';
import { useAssignmentsContext } from './AssignmentsContext';
import { useProgressContext } from './ProgressContext';
import { useProjectContext } from './ProjectContext';
import { useStudyGroupContext } from './StudyGroupContext';
import { LearningAnalyticsContext } from './LearningAnalyticsContext.js';

export function LearningAnalyticsProvider({ children }) {
  const { progressData } = useProgressContext();
  const { studyGroups, groupMemberships } = useStudyGroupContext();
  const { assignments } = useAssignmentsContext();
  const { projects } = useProjectContext();

  const [analyticsData, setAnalyticsData] = useState({
    studyPatterns: [],
    groupActivity: [],
    assignmentPerformance: [],
    learningEfficiency: [],
    projectAnalytics: [],
  });

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedAnalytics = localStorage.getItem('learningAnalytics');
    if (savedAnalytics) {
      setAnalyticsData(JSON.parse(savedAnalytics));
    } else {
      // Generate initial analytics
      generateAnalytics();
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('learningAnalytics', JSON.stringify(analyticsData));
  }, [analyticsData]);

  // Generate learning analytics based on available data
  const generateAnalytics = () => {
    // Study patterns analysis
    const studyPatterns = analyzeStudyPatterns();

    // Group activity analysis
    const groupActivity = analyzeGroupActivity();

    // Assignment performance analysis
    const assignmentPerformance = analyzeAssignmentPerformance();

    // Learning efficiency analysis
    const learningEfficiency = analyzeLearningEfficiency();

    // Project analytics
    const projectAnalytics = analyzeProjectData();

    setAnalyticsData({
      studyPatterns,
      groupActivity,
      assignmentPerformance,
      learningEfficiency,
      projectAnalytics,
    });
  };

  // Analyze study patterns based on progress data
  const analyzeStudyPatterns = () => {
    if (!progressData || progressData.length === 0) return [];

    // Group progress by subject
    const subjectProgress = {};
    progressData.forEach(item => {
      if (!subjectProgress[item.subject]) {
        subjectProgress[item.subject] = [];
      }
      subjectProgress[item.subject].push(item);
    });

    // Calculate average progress and study frequency per subject
    const patterns = Object.keys(subjectProgress).map(subject => {
      const items = subjectProgress[subject];
      const avgProgress =
        items.reduce((sum, item) => sum + item.progress, 0) / items.length;
      const studyFrequency = items.length;

      return {
        subject,
        avgProgress: Math.round(avgProgress),
        studyFrequency,
        lastUpdated: items[items.length - 1]?.date || new Date().toISOString(),
      };
    });

    return patterns;
  };

  // Analyze group activity based on study groups and memberships
  const analyzeGroupActivity = () => {
    if (!studyGroups || studyGroups.length === 0) return [];

    return studyGroups.map(group => {
      const members = groupMemberships.filter(m => m.groupId === group.id);
      const materials = group.materials ? group.materials.length : 0;
      const discussions = group.discussions ? group.discussions.length : 0;
      const meetings = group.meetings ? group.meetings.length : 0;

      return {
        groupId: group.id,
        groupName: group.name,
        memberCount: members.length,
        materialsCount: materials,
        discussionsCount: discussions,
        meetingsCount: meetings,
        activityScore: materials + discussions + meetings,
      };
    });
  };

  // Analyze assignment performance
  const analyzeAssignmentPerformance = () => {
    if (!assignments || assignments.length === 0) return [];

    // Group assignments by subject
    const subjectAssignments = {};
    assignments.forEach(assignment => {
      if (!subjectAssignments[assignment.subject]) {
        subjectAssignments[assignment.subject] = [];
      }
      subjectAssignments[assignment.subject].push(assignment);
    });

    // Calculate performance metrics per subject
    const performance = Object.keys(subjectAssignments).map(subject => {
      const subjectAssignmentsList = subjectAssignments[subject];
      const totalAssignments = subjectAssignmentsList.length;
      const completedAssignments = subjectAssignmentsList.filter(
        a => a.status === 'completed'
      ).length;
      const completionRate =
        totalAssignments > 0
          ? (completedAssignments / totalAssignments) * 100
          : 0;

      // Calculate average score for completed assignments
      const completedWithScores = subjectAssignmentsList.filter(
        a => a.status === 'completed' && a.score !== undefined
      );
      const avgScore =
        completedWithScores.length > 0
          ? completedWithScores.reduce((sum, a) => sum + a.score, 0) /
            completedWithScores.length
          : 0;

      return {
        subject,
        totalAssignments,
        completedAssignments,
        completionRate: Math.round(completionRate),
        avgScore: Math.round(avgScore),
      };
    });

    return performance;
  };

  // Analyze learning efficiency
  const analyzeLearningEfficiency = () => {
    if (!progressData || progressData.length === 0) return [];

    // Group by week to analyze learning trends
    const weeklyData = {};
    progressData.forEach(item => {
      const date = new Date(item.date);
      const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;

      if (!weeklyData[week]) {
        weeklyData[week] = [];
      }
      weeklyData[week].push(item);
    });

    // Calculate efficiency metrics per week
    const efficiency = Object.keys(weeklyData).map(week => {
      const weekItems = weeklyData[week];
      const totalProgress = weekItems.reduce(
        (sum, item) => sum + item.progress,
        0
      );
      const avgProgress = totalProgress / weekItems.length;

      return {
        week,
        itemsCount: weekItems.length,
        avgProgress: Math.round(avgProgress),
        efficiencyScore: Math.round(avgProgress * (weekItems.length / 5)), // Simple efficiency calculation
      };
    });

    return efficiency;
  };

  // Analyze project data
  const analyzeProjectData = () => {
    if (!projects || projects.length === 0) return [];

    // Group projects by category
    const categoryProjects = {};
    projects.forEach(project => {
      if (!categoryProjects[project.category]) {
        categoryProjects[project.category] = [];
      }
      categoryProjects[project.category].push(project);
    });

    // Calculate project metrics per category
    const projectAnalytics = Object.keys(categoryProjects).map(category => {
      const categoryProjectsList = categoryProjects[category];
      const totalProjects = categoryProjectsList.length;
      
      // Count projects with comments as "active"
      const activeProjects = categoryProjectsList.filter(
        p => p.comments && p.comments.length > 0
      ).length;
      
      // Calculate average team size
      const totalTeamMembers = categoryProjectsList.reduce(
        (sum, project) => sum + (project.teamMembers ? project.teamMembers.length : 1),
        0
      );
      const avgTeamSize = totalProjects > 0 ? totalTeamMembers / totalProjects : 0;

      return {
        category,
        totalProjects,
        activeProjects,
        avgTeamSize: Math.round(avgTeamSize * 10) / 10, // Round to 1 decimal place
        activityRate: totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0,
      };
    });

    return projectAnalytics;
  };

  // Get top performing subjects
  const getTopPerformingSubjects = (limit = 5) => {
    if (
      !analyticsData.studyPatterns ||
      analyticsData.studyPatterns.length === 0
    )
      return [];

    return [...analyticsData.studyPatterns]
      .sort((a, b) => b.avgProgress - a.avgProgress)
      .slice(0, limit);
  };

  // Get most active study groups
  const getMostActiveGroups = (limit = 5) => {
    if (
      !analyticsData.groupActivity ||
      analyticsData.groupActivity.length === 0
    )
      return [];

    return [...analyticsData.groupActivity]
      .sort((a, b) => b.activityScore - a.activityScore)
      .slice(0, limit);
  };

  // Get assignment performance summary
  const getAssignmentPerformanceSummary = () => {
    if (
      !analyticsData.assignmentPerformance ||
      analyticsData.assignmentPerformance.length === 0
    ) {
      return {
        totalAssignments: 0,
        completedAssignments: 0,
        completionRate: 0,
        avgScore: 0,
      };
    }

    const totalAssignments = analyticsData.assignmentPerformance.reduce(
      (sum, item) => sum + item.totalAssignments,
      0
    );
    const completedAssignments = analyticsData.assignmentPerformance.reduce(
      (sum, item) => sum + item.completedAssignments,
      0
    );
    const completionRate =
      totalAssignments > 0
        ? (completedAssignments / totalAssignments) * 100
        : 0;

    const scoredSubjects = analyticsData.assignmentPerformance.filter(
      item => item.avgScore > 0
    );
    const avgScore =
      scoredSubjects.length > 0
        ? scoredSubjects.reduce((sum, item) => sum + item.avgScore, 0) /
          scoredSubjects.length
        : 0;

    return {
      totalAssignments,
      completedAssignments,
      completionRate: Math.round(completionRate),
      avgScore: Math.round(avgScore),
    };
  };

  // Get project analytics summary
  const getProjectAnalyticsSummary = () => {
    if (
      !analyticsData.projectAnalytics ||
      analyticsData.projectAnalytics.length === 0
    ) {
      return {
        totalProjects: 0,
        activeProjects: 0,
        activityRate: 0,
        avgTeamSize: 0,
      };
    }

    const totalProjects = analyticsData.projectAnalytics.reduce(
      (sum, item) => sum + item.totalProjects,
      0
    );
    const activeProjects = analyticsData.projectAnalytics.reduce(
      (sum, item) => sum + item.activeProjects,
      0
    );
    const activityRate =
      totalProjects > 0
        ? (activeProjects / totalProjects) * 100
        : 0;

    // Calculate weighted average team size
    const totalWeightedTeamSize = analyticsData.projectAnalytics.reduce(
      (sum, item) => sum + (item.avgTeamSize * item.totalProjects),
      0
    );
    const avgTeamSize = totalProjects > 0 ? totalWeightedTeamSize / totalProjects : 0;

    return {
      totalProjects,
      activeProjects,
      activityRate: Math.round(activityRate),
      avgTeamSize: Math.round(avgTeamSize * 10) / 10, // Round to 1 decimal place
    };
  };

  const value = {
    analyticsData,
    generateAnalytics,
    getTopPerformingSubjects,
    getMostActiveGroups,
    getAssignmentPerformanceSummary,
    getProjectAnalyticsSummary,
  };

  return (
    <LearningAnalyticsContext.Provider value={value}>
      {children}
    </LearningAnalyticsContext.Provider>
  );
}
