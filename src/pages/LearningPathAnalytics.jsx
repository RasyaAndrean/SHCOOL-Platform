import {
  Book as BookIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useActivityContext } from '../contexts/ActivityContext';
import { useDataContext } from '../contexts/DataContext';
import { useLearningPathContext } from '../contexts/LearningPathContext';

const LearningPathAnalytics = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { currentUser } = useDataContext();
  const {
    learningPaths,
    getStudentCurrentPath,
    getStudentPathProgress,
    calculatePathProgress,
  } = useLearningPathContext();

  useEffect(() => {
    addActivity(
      'Mengakses Analytics Jalur Belajar',
      'User membuka halaman analytics jalur belajar'
    );
  }, [addActivity]);

  // For demo purposes, we'll use a fixed user ID if currentUser is not available
  const currentUserId = currentUser?.id || 1;

  // Get current path data
  const currentPath = getStudentCurrentPath(currentUserId);
  const pathProgress = currentPath
    ? getStudentPathProgress(currentUserId, currentPath.id)
    : {};
  const overallProgress = currentPath
    ? calculatePathProgress(currentUserId, currentPath.id)
    : 0;

  // Calculate module progress data
  const moduleProgressData = currentPath
    ? currentPath.modules.map(module => {
        const progress = pathProgress[module.id] || 0;
        return {
          ...module,
          progress,
          status:
            progress >= 100
              ? 'completed'
              : progress > 0
              ? 'in-progress'
              : 'not-started',
        };
      })
    : [];

  const getModuleStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2 }}
          >
            ← Kembali ke Dashboard
          </Button>
          <Typography variant="h4" gutterBottom>
            Analytics Jalur Belajar
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Analisis komprehensif tentang progress dalam jalur belajarmu
          </Typography>
        </Box>

        {currentPath ? (
          <>
            {/* Path Overview */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Jalur Belajarmu Saat Ini</Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>
                      {currentPath.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      {currentPath.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={currentPath.careerField}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={currentPath.difficulty}
                        color={getDifficultyColor(currentPath.difficulty)}
                        size="small"
                      />
                      <Chip
                        label={currentPath.duration}
                        color="info"
                        size="small"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom align="center">
                          Progress Keseluruhan
                        </Typography>
                        <Typography
                          variant="h3"
                          color="primary"
                          align="center"
                          gutterBottom
                        >
                          {overallProgress}%
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={overallProgress}
                          sx={{ height: 12, borderRadius: 6, mb: 2 }}
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          align="center"
                        >
                          {
                            moduleProgressData.filter(m => m.progress >= 100)
                              .length
                          }{' '}
                          dari {moduleProgressData.length} modul selesai
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Module Progress */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progress Modul
                </Typography>

                <Grid container spacing={3}>
                  {moduleProgressData.map((module, index) => (
                    <Grid item xs={12} key={module.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="h6">
                                {index + 1}. {module.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {module.duration}
                              </Typography>
                            </Box>
                            <Chip
                              label={
                                module.status === 'completed'
                                  ? 'Selesai'
                                  : module.status === 'in-progress'
                                  ? 'Dalam Proses'
                                  : 'Belum Dimulai'
                              }
                              color={getModuleStatusColor(module.status)}
                              size="small"
                            />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              {module.progress}%
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={module.progress}
                              sx={{ flexGrow: 1 }}
                              color={
                                module.progress >= 100
                                  ? 'success'
                                  : module.progress > 0
                                  ? 'warning'
                                  : 'inherit'
                              }
                            />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 1,
                              mt: 2,
                            }}
                          >
                            {module.topics
                              .slice(0, 5)
                              .map((topic, topicIndex) => (
                                <Chip
                                  key={topicIndex}
                                  label={topic}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            {module.topics.length > 5 && (
                              <Chip
                                label={`+${module.topics.length - 5} lainnya`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Path Comparison */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Perbandingan dengan Jalur Lain
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Berikut adalah perbandingan progressmu dengan jalur belajar
                  lain yang tersedia:
                </Typography>

                <Grid container spacing={3}>
                  {learningPaths
                    .filter(path => path.id !== currentPath.id)
                    .slice(0, 3)
                    .map(path => (
                      <Grid item xs={12} md={4} key={path.id}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="h6" gutterBottom>
                              {path.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                            >
                              {path.description.substring(0, 100)}...
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <Chip
                                label={path.difficulty}
                                color={getDifficultyColor(path.difficulty)}
                                size="small"
                              />
                            </Box>

                            <Box sx={{ textAlign: 'center' }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Jalur alternatif
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                sx={{ mt: 1 }}
                                onClick={() => navigate('/learning-paths')}
                              >
                                Lihat Detail
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                </Grid>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Belum ada jalur belajar yang ditetapkan
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Pilih jalur belajar untuk melihat analytics progress
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/learning-paths')}
              >
                Pilih Jalur Belajar
              </Button>
            </CardContent>
          </Card>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default LearningPathAnalytics;
