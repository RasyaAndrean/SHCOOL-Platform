import {
  Analytics as AnalyticsIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Bookmark as BookmarkIcon,
  CalendarToday as CalendarIcon,
  CardMembership as CardMembershipIcon,
  CheckCircle as CheckCircleIcon,
  Email as EmailIcon,
  EmojiEvents as EmojiEventsIcon,
  EventAvailable as EventAvailableIcon,
  Event as EventIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
  Handshake as HandshakeIcon,
  LibraryBooks as LibraryIcon,
  Lightbulb as LightbulbIcon,
  MilitaryTech as MilitaryTechIcon,
  Person as PersonIcon,
  // Add new icons for our new features
  Psychology as PsychologyIcon,
  RateReview as RateReviewIcon,
  Recommend as RecommendIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Videocam as VideocamIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useActivityContext } from '../contexts/ActivityContext';
import { useAssignmentsContext } from '../contexts/AssignmentsContext';
import { useCalendarContext } from '../contexts/CalendarContext';
import { useCertificateContext } from '../contexts/CertificateContext';
import { useGradesContext } from '../contexts/GradesContext';
import { useLibraryContext } from '../contexts/LibraryContext';
import { useParentCommunicationContext } from '../contexts/ParentCommunicationContext';
import { useStudyPlannerContext } from '../contexts/StudyPlannerContext';
// Add imports for our new contexts
import { useAchievementContext } from '../contexts/AchievementContext';
import { useFeedbackContext } from '../contexts/FeedbackContext';
import { useLearningAnalyticsContext } from '../contexts/LearningAnalyticsContext';
import { useLearningPathContext } from '../contexts/LearningPathContext';
import { usePeerCollaborationContext } from '../contexts/PeerCollaborationContext';
import { useRecommendationContext } from '../contexts/RecommendationContext';
import { useSkillContext } from '../contexts/SkillContext';
import { useStudyProgressContext } from '../contexts/StudyProgressContext';
// Add alumni context import
import { useAlumniContext } from '../contexts/AlumniContext';

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { assignments } = useAssignmentsContext();
  const { getThisWeeksEvents } = useCalendarContext();
  const { getBookmarkedItems, libraryItems } = useLibraryContext();
  const { studyPlans, completedTasks } = useStudyPlannerContext();
  const { getAverageGrade } = useGradesContext();
  const { getStudentCertificates } = useCertificateContext();
  const { getUnreadCount } = useParentCommunicationContext();
  // Add our new contexts
  const { getActiveRecommendations } = useRecommendationContext();
  const { getUserSkillLevels } = useSkillContext();
  const { getOverallProgressForStudent } = useStudyProgressContext();
  const { getAchievementCount, getBadgeCount } = useAchievementContext();
  const { getFeedbacksByStudentId } = useFeedbackContext();
  const { analyticsData } = useLearningAnalyticsContext();
  const { studentPaths, getForumsByCollaboration } = useLearningPathContext();
  const {
    getConnectionCount,
    getCollaborationCount,
    getKnowledgeSharingCount,
    // Add forum function
  } = usePeerCollaborationContext(); // Add this line
  // Add alumni context
  const { alumni, getAvailableMentors } = useAlumniContext();

  // Log dashboard access activity
  useEffect(() => {
    addActivity('Mengakses Dashboard', 'User membuka halaman dashboard siswa');
  }, [addActivity]);

  const getUpcomingAssignments = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return assignments.filter(assignment => {
      const dueDate = new Date(assignment.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    });
  };

  const getUpcomingPlans = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return studyPlans.filter(plan => {
      const planDate = new Date(plan.date);
      return planDate >= today && planDate <= nextWeek;
    });
  };

  const getCompletedPlansCount = () => {
    return studyPlans.filter(
      plan =>
        plan.tasks.length > 0 &&
        plan.tasks.every(task => completedTasks.includes(task.id))
    ).length;
  };

  // For demo purposes, we'll use a fixed user ID
  const currentUserId = 1;
  const overallGrade = getAverageGrade(currentUserId);
  const certificateCount = getStudentCertificates(currentUserId).length;
  const unreadMessages = getUnreadCount();
  const bookmarkedItems = getBookmarkedItems();
  // Add our new statistics
  const activeRecommendations = getActiveRecommendations().length;
  const skillLevels = getUserSkillLevels(currentUserId).length;
  const feedbackCount = getFeedbacksByStudentId(currentUserId).length;
  const studyProgress = getOverallProgressForStudent(currentUserId);
  const achievementCount = getAchievementCount(currentUserId);
  const badgeCount = getBadgeCount(currentUserId);
  // Add alumni statistics
  const alumniCount = alumni.length;
  const availableMentorsCount = getAvailableMentors().length;

  // Add learning path statistics
  const { getStudentCurrentPath, calculatePathProgress } =
    useLearningPathContext();
  const currentPath = getStudentCurrentPath(currentUserId);
  const pathProgress = currentPath
    ? calculatePathProgress(currentUserId, currentPath.id)
    : 0;

  // Use pathProgress to avoid unused variable warning
  const _ = pathProgress;

  // Get peer collaboration stats
  const connectionCount = currentUserId ? getConnectionCount(currentUserId) : 0;
  const collaborationCount = currentUserId
    ? getCollaborationCount(currentUserId)
    : 0;
  const knowledgeSharingCount = currentUserId
    ? getKnowledgeSharingCount(currentUserId)
    : 0;

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Calculate total forum posts across all collaborations
  const forumPostCount = currentUserId
    ? studentPaths.reduce((total, path) => {
        const forums = getForumsByCollaboration(path.id);
        return (
          total +
          forums.reduce(
            (forumTotal, forum) => forumTotal + forum.posts.length,
            0
          )
        );
      }, 0)
    : 0;

  const statistics = [
    {
      title: 'Tugas Mendatang',
      value: getUpcomingAssignments().length,
      icon: <AssignmentIcon />,
      color: 'primary',
      action: () => navigate('/assignments'),
    },
    {
      title: 'Rencana Belajar',
      value: getUpcomingPlans().length,
      icon: <SchoolIcon />,
      color: 'secondary',
      action: () => navigate('/study-planner'),
    },
    {
      title: 'Tugas Selesai',
      value: getCompletedPlansCount(),
      icon: <CheckCircleIcon />,
      color: 'success',
      action: () => navigate('/study-planner'),
    },
    {
      title: 'Materi Tersedia',
      value: libraryItems.length,
      icon: <LibraryIcon />,
      color: 'info',
      action: () => navigate('/library'),
    },
    {
      title: 'Rata-rata Nilai',
      value: overallGrade,
      icon: <SchoolIcon />,
      color: 'primary',
    },
    {
      title: 'Sertifikat',
      value: certificateCount,
      icon: <CardMembershipIcon />,
      color: 'success',
    },
    {
      title: 'Pesan Baru',
      value: unreadMessages,
      icon: <EmailIcon />,
      color: 'info',
    },
    {
      title: 'Proyek',
      value: 0, // This would be dynamically calculated
      icon: <WorkIcon />,
      color: 'primary',
      action: () => navigate('/projects'),
    },
    // Add our new statistics
    {
      title: 'Rekomendasi',
      value: activeRecommendations,
      icon: <RecommendIcon />,
      color: 'warning',
      action: () => navigate('/recommendations'),
    },
    {
      title: 'Skill Dinilai',
      value: skillLevels,
      icon: <PsychologyIcon />,
      color: 'info',
      action: () => navigate('/skill-assessment'),
    },
    {
      title: 'Analytics',
      value: analyticsData.studyPatterns.length,
      icon: <AnalyticsIcon />,
      color: 'success',
      action: () => navigate('/learning-analytics'),
    },
    {
      title: 'Laporan Saya',
      value: 1, // This would be dynamically calculated
      icon: <BarChartIcon />,
      color: 'primary',
      action: () => navigate('/reports'),
    },
    {
      title: 'Koneksi',
      value: connectionCount,
      icon: <PersonIcon />,
      color: 'info',
      action: () => navigate('/peer-collaboration'),
    },
    {
      title: 'Kolaborasi',
      value: collaborationCount,
      icon: <GroupIcon />,
      color: 'secondary',
      action: () => navigate('/peer-collaboration'),
    },
    {
      title: 'Feedback',
      value: feedbackCount,
      icon: <RateReviewIcon />,
      color: 'warning',
      action: () => navigate('/feedback'),
    },
    {
      title: 'Progres Belajar',
      value: `${studyProgress}%`,
      icon: <TimelineIcon />,
      color: 'primary',
      action: () => navigate('/study-progress'),
    },
    // Add learning path statistic
    {
      title: 'Jalur Belajar',
      value: currentPath ? '1' : '0',
      icon: <TimelineIcon />,
      color: 'info',
      action: () => navigate('/learning-paths'),
    },
    // Achievement statistics
    {
      title: 'Prestasi',
      value: achievementCount,
      icon: <EmojiEventsIcon />,
      color: 'warning',
      action: () => navigate('/achievements'),
    },
    {
      title: 'Lencana',
      value: badgeCount,
      icon: <MilitaryTechIcon />,
      color: 'success',
      action: () => navigate('/achievements'),
    },
    // Add alumni statistics
    {
      title: 'Alumni Terdaftar',
      value: alumniCount,
      icon: <GroupIcon />,
      color: 'primary',
      action: () => navigate('/alumni-dashboard'),
    },
    {
      title: 'Mentor Tersedia',
      value: availableMentorsCount,
      icon: <PersonIcon />,
      color: 'secondary',
      action: () => navigate('/alumni-dashboard'),
    },
  ];

  // Quick actions for the dashboard
  const quickActions = [
    {
      title: 'Tugas Baru',
      description: 'Lihat dan kumpulkan tugas baru',
      icon: <AssignmentIcon />,
      action: () => {
        addActivity('Mengakses Tugas', 'User membuka halaman tugas');
        navigate('/assignments');
      },
    },
    {
      title: 'Rencana Belajar',
      description: 'Atur dan lihat rencana belajarmu',
      icon: <SchoolIcon />,
      action: () => {
        addActivity(
          'Mengakses Rencana Belajar',
          'User membuka halaman rencana belajar'
        );
        navigate('/study-planner');
      },
    },
    {
      title: 'Kuis',
      description: 'Lihat dan ikuti kuis',
      icon: <EventAvailableIcon />,
      action: () => {
        addActivity('Mengakses Kuis', 'User membuka halaman kuis');
        navigate('/quizzes');
      },
    },
    {
      title: 'Nilai Saya',
      description: 'Lihat nilai dan perkembangan akademik',
      icon: <SchoolIcon />,
      action: () => {
        addActivity('Mengakses Nilai', 'User membuka halaman nilai');
        navigate('/grades');
      },
    },
    {
      title: 'Materi',
      description: 'Akses materi belajar',
      icon: <LibraryIcon />,
      action: () => {
        addActivity('Mengakses Materi', 'User membuka halaman materi');
        navigate('/library');
      },
    },
    {
      title: 'Kehadiran',
      description: 'Lihat rekam jejak kehadiran',
      icon: <EventAvailableIcon />,
      action: () => {
        addActivity('Mengakses Kehadiran', 'User membuka halaman kehadiran');
        navigate('/attendance');
      },
    },
    {
      title: 'Sertifikat',
      description: 'Lihat sertifikat dan penghargaan',
      icon: <CardMembershipIcon />,
      action: () => {
        addActivity('Mengakses Sertifikat', 'User membuka halaman sertifikat');
        navigate('/certificates');
      },
    },
    {
      title: 'Komunikasi Orang Tua',
      description: 'Kirim pesan dan lihat komunikasi dengan orang tua',
      icon: <EmailIcon />,
      action: () => {
        addActivity(
          'Mengakses Komunikasi Orang Tua',
          'User membuka halaman komunikasi orang tua'
        );
        navigate('/parent-communication');
      },
    },
    {
      title: 'Kalender',
      description: 'Lihat jadwal dan acara penting',
      icon: <CalendarIcon />,
      action: () => {
        addActivity('Mengakses Kalender', 'User membuka halaman kalender');
        navigate('/calendar');
      },
    },
    {
      title: 'Penilaian Teman',
      description: 'Beri penilaian terhadap teman dalam kelompok',
      icon: <RateReviewIcon />,
      action: () => navigate('/peer-assessment'),
    },
    {
      title: 'Kelas Virtual',
      description: 'Akses kelas online dan sesi interaktif',
      icon: <VideocamIcon />,
      action: () => navigate('/classroom'),
    },
    {
      title: 'Bimbingan Karir',
      description: 'Jelajahi peluang karir di bidang TKJ',
      icon: <WorkIcon />,
      action: () => navigate('/career-guidance'),
    },
    {
      title: 'Proyek Siswa',
      description: 'Kelola dan tampilkan proyek yang telah kamu kerjakan',
      icon: <WorkIcon />,
      action: () => navigate('/projects'),
    },
    // Add our new quick actions
    {
      title: 'Rekomendasi Belajar',
      description:
        'Lihat rekomendasi belajar yang disesuaikan dengan kemampuanmu',
      icon: <RecommendIcon />,
      action: () => {
        addActivity(
          'Mengakses Rekomendasi',
          'User membuka halaman rekomendasi belajar'
        );
        navigate('/recommendations');
      },
    },
    {
      title: 'Penilaian Skill',
      description: 'Lakukan penilaian terhadap skill dan kemampuanmu',
      icon: <PsychologyIcon />,
      action: () => {
        addActivity(
          'Mengakses Penilaian Skill',
          'User membuka halaman penilaian skill'
        );
        navigate('/skill-assessment');
      },
    },
    {
      title: 'Portfolio',
      description: 'Lihat dan kelola pencapaian serta kemampuanmu',
      icon: <StarIcon />,
      action: () => {
        addActivity('Mengakses Portfolio', 'User membuka halaman portfolio');
        navigate('/portfolio');
      },
    },
    {
      title: 'Learning Analytics',
      description: 'Lihat analisis pola belajarmu dan performa akademik',
      icon: <AnalyticsIcon />,
      action: () => {
        addActivity(
          'Mengakses Analytics',
          'User membuka halaman learning analytics'
        );
        navigate('/learning-analytics');
      },
    },
    {
      title: 'Feedback',
      description: 'Berikan feedback terhadap materi dan pengajaran',
      icon: <RateReviewIcon />,
      action: () => {
        addActivity('Mengakses Feedback', 'User membuka halaman feedback');
        navigate('/feedback');
      },
    },
    {
      title: 'Kolaborasi Teman',
      description: 'Lihat koneksi dan kolaborasi dengan teman',
      icon: <HandshakeIcon />,
      action: () => {
        addActivity(
          'Mengakses Kolaborasi Teman',
          'User membuka halaman kolaborasi teman'
        );
        navigate('/peer-collaboration');
      },
      count: collaborationCount,
    },
    {
      title: 'Jalur Belajar',
      description: 'Ikuti jalur belajar yang direkomendasikan untukmu',
      icon: <TimelineIcon />,
      action: () => {
        addActivity(
          'Mengakses Jalur Belajar',
          'User membuka halaman jalur belajar'
        );
        navigate('/learning-paths');
      },
    },
    {
      title: 'Analytics Jalur Belajar',
      description: 'Lihat analisis progress dalam jalur belajarmu',
      icon: <BarChartIcon />,
      action: () => {
        addActivity(
          'Mengakses Analytics Jalur Belajar',
          'User membuka halaman analytics jalur belajar'
        );
        navigate('/learning-path-analytics');
      },
    },
    // Add Mentoring quick action
    {
      title: 'Program Mentoring',
      description: 'Dapatkan bimbingan akademik dari mentor',
      icon: <PersonIcon />,
      action: () => {
        addActivity(
          'Mengakses Program Mentoring',
          'User membuka halaman program mentoring'
        );
        navigate('/mentoring');
      },
    },
    // Add Alumni Network quick action
    {
      title: 'Jaringan Alumni',
      description:
        'Terhubung dengan alumni sukses dan dapatkan bimbingan karir',
      icon: <GroupIcon />,
      action: () => {
        addActivity(
          'Mengakses Jaringan Alumni',
          'User membuka halaman jaringan alumni'
        );
        navigate('/alumni-dashboard');
      },
    },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Dashboard Siswa
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Selamat datang! Pantau aktivitas belajarmu di sini.
          </Typography>
          {/* Add Portfolio Link */}
          <Button
            variant="contained"
            startIcon={<StarIcon />}
            onClick={() => navigate('/portfolio')}
            sx={{ mt: 2, mr: 2 }}
          >
            Lihat Portfolio Saya
          </Button>
          {/* Add Profile Link */}
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            onClick={() => navigate('/profile')}
            sx={{ mt: 2 }}
          >
            Lihat Profil Saya
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statistics.map((stat, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  cursor: stat.action ? 'pointer' : 'default',
                  transition: 'transform 0.2s',
                  '&:hover': stat.action
                    ? {
                        transform: 'translateY(-4px)',
                      }
                    : {},
                }}
                onClick={stat.action}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${stat.color}.light`,
                      mb: 2,
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {/* Peer Collaboration Stats */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <HandshakeIcon
                  sx={{ fontSize: 40, color: 'info.main', mb: 1 }}
                />
                <Typography variant="h5">{collaborationCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Kolaborasi Aktif
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ForumIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h5">{forumPostCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Posting Forum
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <LightbulbIcon
                  sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                />
                <Typography variant="h5">{knowledgeSharingCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Pengetahuan Dibagikan
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h5">{connectionCount}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Koneksi
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Tugas Mendatang</Typography>
                </Box>

                {getUpcomingAssignments().length === 0 ? (
                  <Typography color="text.secondary">
                    Tidak ada tugas dalam seminggu ke depan
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {getUpcomingAssignments()
                      .slice(0, 3)
                      .map(assignment => (
                        <Grid item xs={12} key={assignment.id}>
                          <Box
                            sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                            onClick={() => navigate('/assignments')}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="subtitle1">
                                {assignment.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(assignment.dueDate)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {assignment.subject}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BookmarkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Materi yang Dibookmark</Typography>
                </Box>

                {bookmarkedItems.length === 0 ? (
                  <Typography color="text.secondary">
                    Kamu belum memiliki bookmark. Kunjungi perpustakaan untuk
                    menandai materi favoritmu.
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {bookmarkedItems.slice(0, 3).map(item => (
                      <Grid item xs={12} key={item.id}>
                        <Box
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                          onClick={() => navigate('/library')}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="subtitle1">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.category}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            oleh {item.author}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Acara Minggu Ini</Typography>
                </Box>

                {getThisWeeksEvents().length === 0 ? (
                  <Typography color="text.secondary">
                    Tidak ada acara dalam seminggu ke depan
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {getThisWeeksEvents()
                      .slice(0, 3)
                      .map(event => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                          <Box
                            sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              cursor: 'pointer',
                              '&:hover': {
                                bgcolor: 'action.hover',
                              },
                            }}
                            onClick={() => navigate('/calendar')}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography variant="subtitle1">
                                {event.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formatDate(event.date)}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="text.secondary">
                              {event.category}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Learning Path Progress */}
        {currentPath && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" gutterBottom>
              Progres Jalur Belajar: {currentPath.name}
            </Typography>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body1" sx={{ mr: 2 }}>
                    {studyProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={studyProgress}
                    sx={{ flexGrow: 1 }}
                  />
                </Box>

                <Grid container spacing={2}>
                  {currentPath.modules.slice(0, 4).map((module, index) => {
                    // Use pathProgress for all modules as a placeholder
                    const progress = Math.min(
                      100,
                      Math.max(0, pathProgress + ((index * 5) % 20))
                    );
                    return (
                      <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              {module.title}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" sx={{ mr: 1 }}>
                                {Math.round(progress)}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={progress}
                                sx={{ flexGrow: 1 }}
                              />
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    );
                  })}
                </Grid>

                <Box sx={{ mt: 2, textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/learning-paths')}
                  >
                    Lihat Detail
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Quick Actions Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            Akses Cepat
          </Typography>
          <Grid container spacing={3}>
            {quickActions.map((action, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Box
                      sx={{
                        display: 'inline-flex',
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'primary.light',
                        mb: 2,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom>
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Dashboard;
