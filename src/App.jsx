import { CssBaseline } from '@mui/material';
import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Loading from './components/Loading';
import Notification from './components/Notification';
import ProtectedRoute from './components/ProtectedRoute';
import { useAppContext } from './contexts/AppContext';
import { LearningPathProvider } from './contexts/LearningPathContext';

// Eager load most used pages
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';

// Lazy load other pages to reduce initial bundle size
const Achievements = lazy(() => import('./pages/Achievements'));
const Announcements = lazy(() => import('./pages/Announcements'));
const Assignments = lazy(() => import('./pages/Assignments'));
const Attendance = lazy(() => import('./pages/Attendance'));
const CareerDetail = lazy(() => import('./pages/CareerDetail'));
const CareerGuidance = lazy(() => import('./pages/CareerGuidance'));
const Certificates = lazy(() => import('./pages/Certificates'));
const ClassroomManagement = lazy(() => import('./pages/ClassroomManagement'));
const CollaborationHub = lazy(() => import('./pages/CollaborationHub'));
const Contact = lazy(() => import('./pages/Contact'));
const EnhancedCalendar = lazy(() => import('./pages/EnhancedCalendar'));
const EnhancedVirtualClassroom = lazy(() =>
  import('./pages/EnhancedVirtualClassroom')
);
const Events = lazy(() => import('./pages/Events'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Forum = lazy(() => import('./pages/Forum'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Grades = lazy(() => import('./pages/Grades'));
const LearningAnalytics = lazy(() => import('./pages/LearningAnalytics'));
const LearningPathDetail = lazy(() => import('./pages/LearningPathDetail'));
const LearningPaths = lazy(() => import('./pages/LearningPaths'));
const Library = lazy(() => import('./pages/Library'));
const Materials = lazy(() => import('./pages/Materials'));
const Mentoring = lazy(() => import('./pages/Mentoring'));
const Messages = lazy(() => import('./pages/Messages'));
const NotFound = lazy(() => import('./pages/NotFound'));
const NotificationCenter = lazy(() => import('./pages/NotificationCenter'));
const ParentCommunication = lazy(() => import('./pages/ParentCommunication'));
const PeerAssessment = lazy(() => import('./pages/PeerAssessment'));
const ProgressTracker = lazy(() => import('./pages/ProgressTracker'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Projects = lazy(() => import('./pages/Projects'));
const Quiz = lazy(() => import('./pages/Quiz'));
const Quizzes = lazy(() => import('./pages/Quizzes'));
const Ranking = lazy(() => import('./pages/Ranking'));
const Recommendations = lazy(() => import('./pages/Recommendations'));
const Reports = lazy(() => import('./pages/Reports'));
const Resources = lazy(() => import('./pages/Resources'));
const Schedule = lazy(() => import('./pages/Schedule'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const SkillAssessment = lazy(() => import('./pages/SkillAssessment'));
const Structure = lazy(() => import('./pages/Structure'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const Students = lazy(() => import('./pages/Students'));
const StudyGroups = lazy(() => import('./pages/StudyGroups'));
const StudyPlanner = lazy(() => import('./pages/StudyPlanner'));
const StudyProgressAnalytics = lazy(() =>
  import('./pages/StudyProgressAnalytics')
);
const VirtualClassroom = lazy(() => import('./pages/VirtualClassroom'));

// Lazy load admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const LearningPathAnalytics = lazy(() =>
  import('./pages/admin/LearningPathAnalytics')
);
const ManageAchievements = lazy(() =>
  import('./pages/admin/ManageAchievements')
);
const ManageAnnouncements = lazy(() =>
  import('./pages/admin/ManageAnnouncements')
);
const ManageAssignments = lazy(() => import('./pages/admin/ManageAssignments'));
const ManageAttendance = lazy(() => import('./pages/admin/ManageAttendance'));
const ManageCalendar = lazy(() => import('./pages/admin/ManageCalendar'));
const ManageCareerPaths = lazy(() => import('./pages/admin/ManageCareerPaths'));
const ManageCareers = lazy(() => import('./pages/admin/ManageCareers'));
const ManageCertificates = lazy(() =>
  import('./pages/admin/ManageCertificates')
);
const ManageFeedback = lazy(() => import('./pages/admin/ManageFeedback'));
const ManageForum = lazy(() => import('./pages/admin/ManageForum'));
const ManageGallery = lazy(() => import('./pages/admin/ManageGallery'));
const ManageGrades = lazy(() => import('./pages/admin/ManageGrades'));
const ManageLearningAnalytics = lazy(() =>
  import('./pages/admin/ManageLearningAnalytics')
);
const ManageLibrary = lazy(() => import('./pages/admin/ManageLibrary'));
const ManageMaterials = lazy(() => import('./pages/admin/ManageMaterials'));
const ManageMentoring = lazy(() => import('./pages/admin/ManageMentoring'));
const ManageParentCommunication = lazy(() =>
  import('./pages/admin/ManageParentCommunication')
);
const ManagePeerAssessment = lazy(() =>
  import('./pages/admin/ManagePeerAssessment')
);
const ManagePortfolios = lazy(() => import('./pages/admin/ManagePortfolios'));
const ManageProgress = lazy(() => import('./pages/admin/ManageProgress'));
const ManageProjects = lazy(() => import('./pages/admin/ManageProjects'));
const ManageRanking = lazy(() => import('./pages/admin/ManageRanking'));
const ManageRecommendations = lazy(() =>
  import('./pages/admin/ManageRecommendations')
);
const ManageReports = lazy(() => import('./pages/admin/ManageReports'));
const ManageResources = lazy(() => import('./pages/admin/ManageResources'));
const ManageSchedule = lazy(() => import('./pages/admin/ManageSchedule'));
const ManageSkills = lazy(() => import('./pages/admin/ManageSkills'));
const ManageStudents = lazy(() => import('./pages/admin/ManageStudents'));
const ManageStudyGroups = lazy(() => import('./pages/admin/ManageStudyGroups'));
const ManageStudyPlanner = lazy(() =>
  import('./pages/admin/ManageStudyPlanner')
);
const ManageStudyProgress = lazy(() =>
  import('./pages/admin/ManageStudyProgress')
);
const PeerAssessmentDetail = lazy(() =>
  import('./pages/admin/PeerAssessmentDetail')
);
const Profile = lazy(() => import('./pages/admin/Profile'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const Statistics = lazy(() => import('./pages/admin/Statistics'));

// Lazy load alumni pages
const AlumniNetwork = lazy(() => import('./pages/AlumniNetwork'));
const AlumniProfile = lazy(() => import('./pages/AlumniProfile'));
const ManageAlumni = lazy(() => import('./pages/admin/ManageAlumni'));
const ManageAlumniCareers = lazy(() =>
  import('./pages/admin/ManageAlumniCareers')
);
const AlumniDashboard = lazy(() => import('./pages/AlumniDashboard'));

function App() {
  const { darkMode, toggleDarkMode, notifications, removeNotification } =
    useAppContext();

  return (
    <>
      <CssBaseline />
      <LearningPathProvider>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route
              path="/"
              element={
                <Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/dashboard"
              element={
                <Dashboard
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/announcements"
              element={
                <Announcements
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/gallery"
              element={
                <Gallery darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/students"
              element={
                <Students darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/students/:studentId"
              element={
                <StudentProfile
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/schedule"
              element={
                <Schedule darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/structure"
              element={
                <Structure
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/resources"
              element={
                <Resources
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/contact"
              element={
                <Contact darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/calendar"
              element={
                <EnhancedCalendar
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/forum"
              element={
                <Forum darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/ranking"
              element={
                <Ranking darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/messages"
              element={
                <Messages darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/search"
              element={
                <SearchResults
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/events"
              element={
                <Events darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/projects"
              element={
                <Projects darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/achievements"
              element={
                <Achievements
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/assignments"
              element={
                <Assignments
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/library"
              element={
                <Library darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/study-planner"
              element={
                <StudyPlanner
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/study-groups"
              element={
                <StudyGroups
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/study-groups/:groupId"
              element={
                <CollaborationHub
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/progress-tracker"
              element={
                <ProgressTracker
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/quizzes"
              element={
                <Quizzes darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/quiz/:id"
              element={
                <Quiz darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/attendance"
              element={
                <Attendance
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/materials"
              element={
                <Materials
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/notifications"
              element={
                <NotificationCenter
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/grades"
              element={
                <Grades darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/certificates"
              element={
                <Certificates
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/parent-communication"
              element={
                <ParentCommunication
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/classroom-management"
              element={
                <ClassroomManagement
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/classroom/:sessionId"
              element={
                <VirtualClassroom
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/enhanced-classroom/:sessionId"
              element={
                <EnhancedVirtualClassroom
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/peer-assessment"
              element={
                <PeerAssessment
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/projects"
              element={
                <Projects darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/project/:id"
              element={
                <ProjectDetail
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/career-guidance"
              element={
                <CareerGuidance
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/career/:id"
              element={
                <CareerDetail
                  darkMode={darkMode}
                  toggleDarkMode={toggleDarkMode}
                />
              }
            />
            <Route
              path="/learning-analytics"
              element={
                <ProtectedRoute>
                  <LearningAnalytics
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-analytics"
              element={
                <ProtectedRoute>
                  <LearningAnalytics
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-paths"
              element={
                <ProtectedRoute>
                  <LearningPaths
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-path-detail"
              element={
                <ProtectedRoute>
                  <LearningPathDetail
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/learning-path-analytics"
              element={
                <ProtectedRoute>
                  <LearningPathAnalytics
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/announcements"
              element={
                <ProtectedRoute>
                  <ManageAnnouncements
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <ManageStudents
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/schedule"
              element={
                <ProtectedRoute>
                  <ManageSchedule
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute>
                  <ManageGallery
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/resources"
              element={
                <ProtectedRoute>
                  <ManageResources
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <ProtectedRoute>
                  <Profile
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <Settings
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/statistics"
              element={
                <ProtectedRoute>
                  <Statistics
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/assignments"
              element={
                <ProtectedRoute>
                  <ManageAssignments
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/library"
              element={
                <ProtectedRoute>
                  <ManageLibrary
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/study-planner"
              element={
                <ProtectedRoute>
                  <ManageStudyPlanner
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/progress"
              element={
                <ProtectedRoute>
                  <ManageProgress
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/attendance"
              element={
                <ProtectedRoute>
                  <ManageAttendance
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/forum"
              element={
                <ProtectedRoute>
                  <ManageForum
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/materials"
              element={
                <ProtectedRoute>
                  <ManageMaterials
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/study-groups"
              element={
                <ProtectedRoute>
                  <ManageStudyGroups
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/students"
              element={
                <ProtectedRoute>
                  <ManageStudents
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/grades"
              element={
                <ProtectedRoute>
                  <ManageGrades
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/certificates"
              element={
                <ProtectedRoute>
                  <ManageCertificates
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/parent-communication"
              element={
                <ProtectedRoute>
                  <ManageParentCommunication
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/classroom-resources"
              element={
                <ProtectedRoute>
                  <ManageClassroomResources
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/classroom"
              element={
                <ProtectedRoute>
                  <ManageClassroom
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/peer-assessment"
              element={
                <ProtectedRoute>
                  <ManagePeerAssessment
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/peer-assessment/detail/:studentId/:projectId"
              element={
                <ProtectedRoute>
                  <PeerAssessmentDetail
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <ProtectedRoute>
                  <ManageCalendar
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/careers"
              element={
                <ProtectedRoute>
                  <ManageCareers
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/projects"
              element={
                <ProtectedRoute>
                  <ManageProjects
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ranking"
              element={
                <ProtectedRoute>
                  <ManageRanking
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/career-paths"
              element={
                <ProtectedRoute>
                  <ManageCareerPaths
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recommendations"
              element={
                <ProtectedRoute>
                  <ManageRecommendations
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/skills"
              element={
                <ProtectedRoute>
                  <ManageSkills
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/portfolios"
              element={
                <ProtectedRoute>
                  <ManagePortfolios
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/portfolio-analytics"
              element={
                <ProtectedRoute>
                  <PortfolioAnalytics
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/portfolio"
              element={
                <ProtectedRoute>
                  <Portfolio
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <StudentProfile
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/learning-paths"
              element={
                <ProtectedRoute>
                  <ManageLearningPaths darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/learning-path-analytics"
              element={
                <ProtectedRoute>
                  <LearningPathAnalytics darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/learning-analytics"
              element={
                <ProtectedRoute>
                  <ManageLearningAnalytics
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute>
                  <ManageFeedback darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/achievements"
              element={
                <ProtectedRoute>
                  <ManageAchievements darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute>
                  <ManageReports darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <ProtectedRoute>
                  <Recommendations
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/skill-assessment"
              element={
                <ProtectedRoute>
                  <SkillAssessment
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <Reports
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/study-progress"
              element={
                <ProtectedRoute>
                  <StudyProgressAnalytics
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/achievements"
              element={
                <ProtectedRoute>
                  <Achievements
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route
              path="*"
              element={
                <NotFound darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              }
            />
            <Route
              path="/admin/study-progress"
              element={
                <ProtectedRoute>
                  <ManageStudyProgress darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mentoring"
              element={
                <ProtectedRoute>
                  <Mentoring
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/mentoring"
              element={
                <ProtectedRoute>
                  <ManageMentoring darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            {/* Add alumni routes */}
            <Route
              path="/alumni-network"
              element={
                <ProtectedRoute>
                  <AlumniNetwork
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alumni/:id"
              element={
                <ProtectedRoute>
                  <AlumniProfile
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alumni"
              element={
                <ProtectedRoute>
                  <ManageAlumni darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/alumni-careers"
              element={
                <ProtectedRoute>
                  <ManageAlumniCareers darkMode={darkMode} />
                </ProtectedRoute>
              }
            />
            {/* Add alumni dashboard route */}
            <Route
              path="/alumni-dashboard"
              element={
                <ProtectedRoute>
                  <AlumniDashboard
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>

        {notifications.map(notification => (
          <Notification
            key={notification.id}
            open={true}
            onClose={() => removeNotification(notification.id)}
            message={notification.message}
            severity={notification.severity}
          />
        ))}
      </LearningPathProvider>
    </>
  );
}

export default App;
