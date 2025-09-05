import {
  Analytics as AnalyticsIcon,
  Announcement as AnnouncementIcon,
  Assignment as AssignmentIcon,
  BarChart as BarChartIcon,
  Book as BookIcon,
  CalendarToday as CalendarIcon,
  CardMembership as CardMembershipIcon,
  Email as EmailIcon,
  EmojiEvents as EmojiEventsIcon,
  EventAvailable as EventAvailableIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
  Handshake as HandshakeIcon,
  LibraryBooks as LibraryBooksIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  PhotoLibrary as PhotoLibraryIcon,
  // Add new icons for our new features
  Psychology as PsychologyIcon,
  RateReview as RateReviewIcon,
  Recommend as RecommendIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  Videocam as VideocamIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useAssignmentsContext } from '../../contexts/AssignmentsContext';
import { useCalendarContext } from '../../contexts/CalendarContext';
import { useCareerContext } from '../../contexts/CareerContext';
import { useCertificateContext } from '../../contexts/CertificateContext';
import { useClassroomContext } from '../../contexts/ClassroomContext';
import { useDataContext } from '../../contexts/DataContext';
import { useForumContext } from '../../contexts/ForumContext';
import { useGradesContext } from '../../contexts/GradesContext';
import { useLibraryContext } from '../../contexts/LibraryContext';
import { useMaterialContext } from '../../contexts/MaterialContext';
import { useParentCommunicationContext } from '../../contexts/ParentCommunicationContext';
import { usePeerAssessmentContext } from '../../contexts/PeerAssessmentContext';
import { useProgressContext } from '../../contexts/ProgressContext';
import { useStudyGroupContext } from '../../contexts/StudyGroupContext';
import { useStudyPlannerContext } from '../../contexts/StudyPlannerContext';
// Add imports for our new contexts
import LearningPathAdminAnalytics from '../../components/LearningPathAdminAnalytics';
import { useFeedbackContext } from '../../contexts/FeedbackContext';
import { useLearningAnalyticsContext } from '../../contexts/LearningAnalyticsContext';
import { useLearningPathContext } from '../../contexts/LearningPathContext';
import { usePeerCollaborationContext } from '../../contexts/PeerCollaborationContext'; // Add this line
import { useRecommendationContext } from '../../contexts/RecommendationContext';
import { useReportContext } from '../../contexts/ReportContext';
import { useSkillContext } from '../../contexts/SkillContext';
import { useStudyProgressContext } from '../../contexts/StudyProgressContext';

const Dashboard = ({ darkMode, toggleDarkMode }) => {
  const { logout } = useAppContext();
  const { announcements, students, gallery, resources } = useDataContext();
  const { activities, addActivity } = useActivityContext();
  const { studyPlans } = useStudyPlannerContext();
  const { progressData } = useProgressContext();
  const { posts } = useForumContext();
  const { materials } = useMaterialContext();
  const { studyGroups } = useStudyGroupContext();
  const { assignments } = useAssignmentsContext();
  const { grades } = useGradesContext();
  const { libraryItems } = useLibraryContext();
  const { certificates } = useCertificateContext();
  const { communications } = useParentCommunicationContext();
  const { events } = useCalendarContext();
  const { sessions } = useClassroomContext();
  const { assessments } = usePeerAssessmentContext();
  const { careers, careerPaths } = useCareerContext();
  // Add our new contexts
  const { recommendations } = useRecommendationContext();
  const { skills } = useSkillContext();
  const { analyticsData } = useLearningAnalyticsContext();
  const { connections, collaborations } = usePeerCollaborationContext(); // Add this line
  const { learningPaths } = useLearningPathContext();
  const { getAllReports } = useReportContext();
  const { feedbacks } = useFeedbackContext();
  const { getAllStudyProgress } = useStudyProgressContext();
  const navigate = useNavigate();

  // Log dashboard access activity
  useEffect(() => {
    addActivity(
      'Mengakses Dashboard Admin',
      'User membuka halaman dashboard admin'
    );
  }, [addActivity]);

  const handleLogout = () => {
    addActivity('Logout', 'User keluar dari sistem admin');
    logout();
    navigate('/');
  };

  const handleProfile = () => {
    addActivity('Mengakses Profil', 'User membuka halaman profil admin');
    navigate('/admin/profile');
  };

  const handleSettings = () => {
    addActivity('Mengakses Pengaturan', 'User membuka halaman pengaturan');
    navigate('/admin/settings');
  };

  const handleStatistics = () => {
    addActivity('Mengakses Statistik', 'User membuka halaman statistik');
    navigate('/admin/statistics');
  };

  const quickActions = [
    {
      title: 'Kelola Pengumuman',
      description: 'Tambah, edit, atau hapus pengumuman kelas',
      icon: <AnnouncementIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Pengumuman',
          'User membuka halaman kelola pengumuman'
        );
        navigate('/admin/announcements');
      },
      count: announcements.length,
    },
    {
      title: 'Kelola Data Siswa',
      description: 'Update informasi dan profil siswa',
      icon: <PeopleIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Data Siswa',
          'User membuka halaman kelola data siswa'
        );
        navigate('/admin/students');
      },
      count: students.length,
    },
    {
      title: 'Kelola Jadwal',
      description: 'Update jadwal pelajaran dan kegiatan',
      icon: <ScheduleIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Jadwal',
          'User membuka halaman kelola jadwal'
        );
        navigate('/admin/schedule');
      },
      count: 0,
    },
    {
      title: 'Kelola Galeri',
      description: 'Upload dan kelola foto kegiatan kelas',
      icon: <PhotoLibraryIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Galeri',
          'User membuka halaman kelola galeri'
        );
        navigate('/admin/gallery');
      },
      count: gallery.length,
    },
    {
      title: 'Kelola Sumber Belajar',
      description: 'Tambah atau update materi pembelajaran',
      icon: <SchoolIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Sumber Belajar',
          'User membuka halaman kelola sumber belajar'
        );
        navigate('/admin/resources');
      },
      count: resources.length,
    },
    {
      title: 'Kelola Tugas',
      description: 'Tambah, edit, atau hapus tugas kelas',
      icon: <AssignmentIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Tugas',
          'User membuka halaman kelola tugas'
        );
        navigate('/admin/assignments');
      },
      count: assignments.length,
    },
    {
      title: 'Kelola Perpustakaan',
      description: 'Kelola koleksi buku dan materi digital',
      icon: <LibraryBooksIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Perpustakaan',
          'User membuka halaman kelola perpustakaan'
        );
        navigate('/admin/library');
      },
      count: libraryItems.length,
    },
    {
      title: 'Kelola Study Planner',
      description: 'Kelola rencana belajar siswa',
      icon: <SchoolIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Study Planner',
          'User membuka halaman kelola study planner'
        );
        navigate('/admin/study-planner');
      },
      count: studyPlans.length,
    },
    {
      title: 'Kelola Progress Tracker',
      description: 'Kelola progress pembelajaran siswa',
      icon: <BarChartIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Progress Tracker',
          'User membuka halaman kelola progress tracker'
        );
        navigate('/admin/progress');
      },
      count: progressData.length,
    },
    {
      title: 'Kelola Kehadiran',
      description: 'Kelola data kehadiran siswa',
      icon: <EventAvailableIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Kehadiran',
          'User membuka halaman kelola kehadiran'
        );
        navigate('/admin/attendance');
      },
      count: 0,
    },
    {
      title: 'Kelola Forum',
      description: 'Kelola postingan dan diskusi forum',
      icon: <ForumIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Forum',
          'User membuka halaman kelola forum'
        );
        navigate('/admin/forum');
      },
      count: posts.length,
    },
    {
      title: 'Kelola Repositori Materi',
      description: 'Kelola materi pembelajaran dengan versi',
      icon: <BookIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Repositori Materi',
          'User membuka halaman kelola repositori materi'
        );
        navigate('/admin/materials');
      },
      count: materials.length,
    },
    {
      title: 'Kelola Grup Belajar',
      description: 'Kelola grup belajar dan keanggotaan',
      icon: <GroupIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Grup Belajar',
          'User membuka halaman kelola grup belajar'
        );
        navigate('/admin/study-groups');
      },
      count: studyGroups.length,
    },
    {
      title: 'Kelola Nilai',
      description: 'Tambah, edit, atau hapus nilai siswa',
      icon: <SchoolIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Nilai',
          'User membuka halaman kelola nilai'
        );
        navigate('/admin/grades');
      },
      count: grades.length,
    },
    {
      title: 'Kelola Sertifikat',
      description: 'Terbitkan dan kelola sertifikat siswa',
      icon: <CardMembershipIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Sertifikat',
          'User membuka halaman kelola sertifikat'
        );
        navigate('/admin/certificates');
      },
      count: certificates.length,
    },
    {
      title: 'Komunikasi Orang Tua',
      description: 'Kelola komunikasi dengan orang tua siswa',
      icon: <EmailIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Komunikasi Orang Tua',
          'User membuka halaman kelola komunikasi orang tua'
        );
        navigate('/admin/parent-communication');
      },
      count: communications.length,
    },
    {
      title: 'Kelola Kalender',
      description: 'Kelola acara dan jadwal kelas',
      icon: <CalendarIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Kalender',
          'User membuka halaman kelola kalender'
        );
        navigate('/admin/calendar');
      },
      count: events.length,
    },
    {
      title: 'Kelola Kelas Virtual',
      description: 'Atur sesi kelas online dan interaktif',
      icon: <VideocamIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Kelas Virtual',
          'User membuka halaman kelola kelas virtual'
        );
        navigate('/admin/classroom');
      },
      count: sessions.length,
    },
    {
      title: 'Kelola Ruang Kelas',
      description: 'Kelola ruang kelas dan reservasi',
      icon: <SchoolIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Ruang Kelas',
          'User membuka halaman kelola ruang kelas'
        );
        navigate('/admin/classroom-resources');
      },
      count: 0,
    },
    {
      title: 'Kelola Penilaian Teman',
      description: 'Atur kriteria dan lihat hasil penilaian teman',
      icon: <RateReviewIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Penilaian Teman',
          'User membuka halaman kelola penilaian teman'
        );
        navigate('/admin/peer-assessment');
      },
      count: assessments.length,
    },
    {
      title: 'Kelola Karir',
      description: 'Atur informasi karir untuk siswa',
      icon: <WorkIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Karir',
          'User membuka halaman kelola informasi karir'
        );
        navigate('/admin/careers');
      },
      count: careers.length,
    },
    {
      title: 'Kelola Jalur Karir',
      description: 'Atur jalur karir untuk siswa',
      icon: <WorkIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Jalur Karir',
          'User membuka halaman kelola jalur karir'
        );
        navigate('/admin/career-paths');
      },
      count: careerPaths.length,
    },
    {
      title: 'Kelola Proyek Siswa',
      description: 'Kelola proyek yang dibuat oleh siswa',
      icon: <WorkIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Proyek Siswa',
          'User membuka halaman kelola proyek siswa'
        );
        navigate('/admin/projects');
      },
      count: 0, // This would be dynamically calculated
    },
    {
      title: 'Kelola Peringkat',
      description: 'Kelola sistem peringkat siswa',
      icon: <BarChartIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Peringkat',
          'User membuka halaman kelola peringkat'
        );
        navigate('/admin/ranking');
      },
      count: 0, // This would be dynamically calculated
    },
    // Add our new quick actions
    {
      title: 'Kelola Portfolios',
      description: 'Kelola portfolios dan pencapaian siswa',
      icon: <StarIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Portfolios',
          'User membuka halaman kelola portfolios'
        );
        navigate('/admin/portfolios');
      },
      count: students.length,
    },
    {
      title: 'Analitik Portfolios',
      description: 'Lihat analitik mendalam portfolios siswa',
      icon: <AnalyticsIcon />,
      action: () => {
        addActivity(
          'Mengakses Analitik Portfolios',
          'User membuka halaman analitik portfolios'
        );
        navigate('/admin/portfolio-analytics');
      },
      count: students.length,
    },
    {
      title: 'Kelola Rekomendasi',
      description: 'Kelola rekomendasi belajar untuk siswa',
      icon: <RecommendIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Rekomendasi',
          'User membuka halaman kelola rekomendasi'
        );
        navigate('/admin/recommendations');
      },
      count: recommendations.length,
    },
    {
      title: 'Kelola Skill',
      description: 'Kelola skill dan penilaian kemampuan siswa',
      icon: <PsychologyIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Skill',
          'User membuka halaman kelola skill'
        );
        navigate('/admin/skills');
      },
      count: skills.length,
    },
    {
      title: 'Statistik',
      description: 'Lihat analitik dan statistik website',
      icon: <BarChartIcon />,
      action: handleStatistics,
      count: 0,
    },
    {
      title: 'Learning Analytics',
      description: 'Lihat analisis pola belajar dan performa siswa',
      icon: <BarChartIcon />,
      action: () => {
        addActivity(
          'Mengakses Learning Analytics',
          'User membuka halaman learning analytics'
        );
        navigate('/admin/learning-analytics');
      },
      count: analyticsData.studyPatterns.length,
    },
    {
      title: 'Kelola Feedback',
      description: 'Kelola feedback dari siswa',
      icon: <RateReviewIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Feedback',
          'User membuka halaman kelola feedback'
        );
        navigate('/admin/feedback');
      },
      count: feedbacks.length,
    },
    {
      title: 'Kelola Laporan',
      description: 'Kelola laporan siswa dan kelas',
      icon: <BarChartIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Laporan',
          'User membuka halaman kelola laporan'
        );
        navigate('/admin/reports');
      },
      count: getAllReports().length,
    },
    // Add our new quick action
    {
      title: 'Kelola Kolaborasi Teman',
      description: 'Kelola koneksi dan kolaborasi antar siswa',
      icon: <HandshakeIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Kolaborasi Teman',
          'User membuka halaman kelola kolaborasi teman'
        );
        navigate('/admin/peer-collaboration');
      },
      count: connections.length + collaborations.length,
    },
    {
      title: 'Kelola Progres Belajar',
      description: 'Kelola progres belajar dan analitik siswa',
      icon: <TimelineIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Progres Belajar',
          'User membuka halaman kelola progres belajar'
        );
        navigate('/admin/study-progress');
      },
      count: getAllStudyProgress().length,
    },
    // Add learning paths management
    {
      title: 'Kelola Jalur Belajar',
      description: 'Kelola jalur belajar dan rekomendasi untuk siswa',
      icon: <TimelineIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Jalur Belajar',
          'User membuka halaman kelola jalur belajar'
        );
        navigate('/admin/learning-paths');
      },
      count: learningPaths.length,
    },
    {
      title: 'Analytics Jalur Belajar',
      description: 'Lihat analitik penggunaan jalur belajar',
      icon: <BarChartIcon />,
      action: () => {
        addActivity(
          'Mengakses Analytics Jalur Belajar',
          'User membuka halaman analytics jalur belajar'
        );
        navigate('/admin/learning-path-analytics');
      },
      count: learningPaths.length,
    },
    // Add achievements management
    {
      title: 'Kelola Prestasi',
      description: 'Kelola prestasi dan lencana siswa',
      icon: <EmojiEventsIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Prestasi',
          'User membuka halaman kelola prestasi'
        );
        navigate('/admin/achievements');
      },
      count: 0, // This would be dynamically calculated
    },
    // Add mentoring management
    {
      title: 'Kelola Mentoring',
      description: 'Kelola program mentoring dan sesi bimbingan',
      icon: <PersonIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Mentoring',
          'User membuka halaman kelola mentoring'
        );
        navigate('/admin/mentoring');
      },
      count: 0, // This would be dynamically calculated
    },
    // Add alumni management
    {
      title: 'Kelola Alumni',
      description: 'Kelola jaringan alumni dan informasi kontak',
      icon: <GroupIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Alumni',
          'User membuka halaman kelola jaringan alumni'
        );
        navigate('/admin/alumni');
      },
      count: 0, // This would be dynamically calculated
    },
    // Add alumni careers management
    {
      title: 'Kelola Karir Alumni',
      description:
        'Kelola sumber daya karir, kisah sukses, dan kesempatan kerja alumni',
      icon: <WorkIcon />,
      action: () => {
        addActivity(
          'Mengakses Kelola Karir Alumni',
          'User membuka halaman kelola karir alumni'
        );
        navigate('/admin/alumni-careers');
      },
      count: 0, // This would be dynamically calculated
    },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom>
              Dashboard Admin
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Selamat datang kembali! Kelola konten website kelas Anda.
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<BarChartIcon />}
              onClick={handleStatistics}
              sx={{ mr: 2 }}
            >
              Statistik
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<SettingsIcon />}
              onClick={handleSettings}
              sx={{ mr: 2 }}
            >
              Pengaturan
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonIcon />}
              onClick={handleProfile}
              sx={{ mr: 2 }}
            >
              Profil
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Akses Cepat
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: 3,
                          borderRadius: 2,
                          transition: 'transform 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                          },
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              {item.icon}
                            </ListItemIcon>
                            <Typography
                              gutterBottom
                              variant="h6"
                              component="h2"
                            >
                              {item.title}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {item.description}
                          </Typography>
                        </CardContent>
                        <CardActions
                          sx={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            px: 2,
                            pb: 2,
                          }}
                        >
                          <Chip
                            label={`${item.count} item`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={item.action}
                          >
                            Kelola
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Aktivitas Terbaru
                </Typography>
                <List>
                  {activities.slice(0, 5).map((activity, index) => (
                    <Box key={activity.id}>
                      <ListItem>
                        <ListItemIcon>
                          <SearchIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={`${activity.details} - ${activity.timestamp}`}
                        />
                      </ListItem>
                      {index <
                        Math.min(4, activities.slice(0, 5).length - 1) && (
                        <Divider />
                      )}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Learning Path Analytics */}
        <Box sx={{ mb: 6 }}>
          <LearningPathAdminAnalytics />
        </Box>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Penggunaan
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Kelola Konten
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan menu akses cepat untuk mengelola berbagai konten
                  website seperti pengumuman, data siswa, dan jadwal.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Pantau Statistik
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lihat statistik dan analitik website untuk memahami bagaimana
                  pengguna berinteraksi dengan konten Anda.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Perbarui Profil
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pastikan profil admin dan pengaturan website selalu diperbarui
                  untuk pengalaman terbaik.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Dashboard;
