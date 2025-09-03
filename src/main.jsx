import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

// Create a combined provider component to improve performance
import { AchievementProvider } from './contexts/AchievementContext';
import { ActivityProvider } from './contexts/ActivityContext';
import { AlumniProvider } from './contexts/AlumniContext';
import { AppProvider } from './contexts/AppContext';
import { AssignmentsProvider } from './contexts/AssignmentsContext';
import { AttendanceProvider } from './contexts/AttendanceContext';
import { CalendarProvider } from './contexts/CalendarContext';
import { CareerProvider } from './contexts/CareerContext';
import { CertificateProvider } from './contexts/CertificateContext';
import { ClassroomProvider } from './contexts/ClassroomContext';
import { DataProvider } from './contexts/DataContext';
import { FeedbackProvider } from './contexts/FeedbackContext';
import { ForumProvider } from './contexts/ForumContext';
import { GradesProvider } from './contexts/GradesContext';
import { LearningAnalyticsProvider } from './contexts/LearningAnalyticsContext';
import { LibraryProvider } from './contexts/LibraryContext';
import { MaterialProvider } from './contexts/MaterialContext';
import { MentoringProvider } from './contexts/MentoringContext';
import { MessageProvider } from './contexts/MessageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ParentCommunicationProvider } from './contexts/ParentCommunicationContext';
import { PeerAssessmentProvider } from './contexts/PeerAssessmentContext';
import { PeerCollaborationProvider } from './contexts/PeerCollaborationContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { QuizProvider } from './contexts/QuizContext';
import { RankingProvider } from './contexts/RankingContext';
import { RecommendationProvider } from './contexts/RecommendationContext';
import { ReportProvider } from './contexts/ReportContext';
import { SkillProvider } from './contexts/SkillContext';
import { StudentProvider } from './contexts/StudentContext';
import { StudyGroupProvider } from './contexts/StudyGroupContext';
import { StudyPlannerProvider } from './contexts/StudyPlannerContext';
import { StudyProgressProvider } from './contexts/StudyProgressContext';

// Group providers by category to improve render performance
const CoreProviders = ({ children }) => (
  <AppProvider>
    <NotificationProvider>
      <ActivityProvider>
        <MessageProvider>{children}</MessageProvider>
      </ActivityProvider>
    </NotificationProvider>
  </AppProvider>
);

const StudentDataProviders = ({ children }) => (
  <StudentProvider>
    <GradesProvider>
      <ProgressProvider>
        <AttendanceProvider>
          <CertificateProvider>
            <AchievementProvider>{children}</AchievementProvider>
          </CertificateProvider>
        </AttendanceProvider>
      </ProgressProvider>
    </GradesProvider>
  </StudentProvider>
);

const LearningResourceProviders = ({ children }) => (
  <LibraryProvider>
    <MaterialProvider>
      <AssignmentsProvider>
        <QuizProvider>
          <SkillProvider>
            <RecommendationProvider>
              <StudyPlannerProvider>
                <StudyProgressProvider>{children}</StudyProgressProvider>
              </StudyPlannerProvider>
            </RecommendationProvider>
          </SkillProvider>
        </QuizProvider>
      </AssignmentsProvider>
    </MaterialProvider>
  </LibraryProvider>
);

const CollaborationProviders = ({ children }) => (
  <StudyGroupProvider>
    <ForumProvider>
      <PeerCollaborationProvider>
        <PeerAssessmentProvider>
          <ParentCommunicationProvider>
            <ClassroomProvider>
              <FeedbackProvider>{children}</FeedbackProvider>
            </ClassroomProvider>
          </ParentCommunicationProvider>
        </PeerAssessmentProvider>
      </PeerCollaborationProvider>
    </ForumProvider>
  </StudyGroupProvider>
);

const AnalyticsProviders = ({ children }) => (
  <DataProvider>
    <LearningAnalyticsProvider>
      <ReportProvider>
        <RankingProvider>{children}</RankingProvider>
      </ReportProvider>
    </LearningAnalyticsProvider>
  </DataProvider>
);

const CareerProviders = ({ children }) => (
  <CareerProvider>
    <AlumniProvider>
      <ProjectProvider>
        <MentoringProvider>{children}</MentoringProvider>
      </ProjectProvider>
    </AlumniProvider>
  </CareerProvider>
);

const CalendarProviders = ({ children }) => (
  <CalendarProvider>{children}</CalendarProvider>
);

// Application entry point with optimized provider structure
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CoreProviders>
        <StudentDataProviders>
          <LearningResourceProviders>
            <CollaborationProviders>
              <AnalyticsProviders>
                <CareerProviders>
                  <CalendarProviders>
                    <App />
                  </CalendarProviders>
                </CareerProviders>
              </AnalyticsProviders>
            </CollaborationProviders>
          </LearningResourceProviders>
        </StudentDataProviders>
      </CoreProviders>
    </BrowserRouter>
  </StrictMode>
);
