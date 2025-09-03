import {
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon,
  Book as BookIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useStudyProgressContext } from '../contexts/StudyProgressContext';

const StudyProgressAnalytics = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { currentUser } = useDataContext();
  const {
    getStudyProgressByStudentId,
    getOverallProgressForStudent,
    getSubjectProgressForStudent,
    getStudyTimeStats,
    addGoalToProgress,
    updateGoal,
  } = useStudyProgressContext();

  const [studyProgress, setStudyProgress] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [subjectProgress, setSubjectProgress] = useState([]);
  const [studyTimeStats, setStudyTimeStats] = useState({});
  const [selectedProgress, setSelectedProgress] = useState(null);
  const [openGoalDialog, setOpenGoalDialog] = useState(false);
  const [newGoal, setNewGoal] = useState('');

  // Load data
  useEffect(() => {
    if (currentUser) {
      const progressData = getStudyProgressByStudentId(currentUser.id);
      const overall = getOverallProgressForStudent(currentUser.id);
      const subjectData = getSubjectProgressForStudent(currentUser.id);
      const timeStats = getStudyTimeStats(currentUser.id);

      setStudyProgress(progressData);
      setOverallProgress(overall);
      setSubjectProgress(subjectData);
      setStudyTimeStats(timeStats);
    }
  }, [
    currentUser,
    getStudyProgressByStudentId,
    getOverallProgressForStudent,
    getSubjectProgressForStudent,
    getStudyTimeStats,
  ]);

  const handleOpenGoalDialog = progress => {
    setSelectedProgress(progress);
    setOpenGoalDialog(true);
  };

  const handleCloseGoalDialog = () => {
    setOpenGoalDialog(false);
    setSelectedProgress(null);
    setNewGoal('');
  };

  const handleAddGoal = () => {
    if (selectedProgress && newGoal.trim()) {
      addGoalToProgress(selectedProgress.id, {
        description: newGoal.trim(),
      });
      addNotification('Tujuan belajar berhasil ditambahkan', 'success');
      handleCloseGoalDialog();
    }
  };

  const handleToggleGoal = (progressId, goal) => {
    updateGoal(progressId, goal.id, {
      completed: !goal.completed,
    });
  };

  const getSubjectColor = subject => {
    const colors = {
      Matematika: '#3182ce',
      Fisika: '#38a169',
      Kimia: '#dd6b20',
      Biologi: '#9b2c2c',
      'Bahasa Indonesia': '#805ad5',
      'Bahasa Inggris': '#d69e2e',
      Sejarah: '#319795',
      Geografi: '#e53e3e',
      Ekonomi: '#38b2ac',
      Sosiologi: '#805ad5',
      Antropologi: '#d53f8c',
    };
    return colors[subject] || '#718096';
  };

  // Prepare chart data
  const subjectProgressData = subjectProgress.map(subject => ({
    name: subject.subject,
    progress: subject.averageProgress,
    fill: getSubjectColor(subject.subject),
  }));

  const studyTimeData = Object.keys(studyTimeStats.subjectTime || {}).map(
    subject => ({
      name: subject,
      time: studyTimeStats.subjectTime[subject],
      fill: getSubjectColor(subject),
    })
  );

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
            Analitik Progres Belajar
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Pantau perkembangan dan pencapaian belajarmu
          </Typography>
        </Box>

        {/* Overall Progress Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AnalyticsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Progres Keseluruhan</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h3" color="primary" gutterBottom>
                {overallProgress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={overallProgress}
                sx={{ height: 12, borderRadius: 6 }}
              />
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {/* Subject Progress Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Progres per Mata Pelajaran
                  </Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={subjectProgressData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={value => [`${value}%`, 'Progres']}
                        labelFormatter={value => `Mata Pelajaran: ${value}`}
                      />
                      <Legend />
                      <Bar dataKey="progress" name="Progres (%)">
                        {subjectProgressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Study Time Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Waktu Belajar per Mata Pelajaran
                  </Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={studyTimeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="time"
                        nameKey="name"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {studyTimeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={value => [`${value} menit`, 'Waktu']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Study Progress Details */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BookIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Detail Progres Belajar</Typography>
                </Box>

                {studyProgress.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <SchoolIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Belum Ada Data Progres
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Data progres belajarmu akan muncul di sini saat kamu mulai
                      belajar.
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {studyProgress.map(progress => (
                      <Grid item xs={12} key={progress.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2,
                              }}
                            >
                              <Box>
                                <Typography variant="h6" gutterBottom>
                                  {progress.subject} - {progress.topic}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mr: 2 }}
                                  >
                                    Progres: {progress.progress}%
                                  </Typography>
                                  <Chip
                                    label={`${progress.timeSpent} menit`}
                                    size="small"
                                    icon={<ScheduleIcon />}
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  Terakhir diakses:{' '}
                                  {new Date(
                                    progress.lastAccessed
                                  ).toLocaleDateString('id-ID')}
                                </Typography>
                              </Box>
                            </Box>

                            <LinearProgress
                              variant="determinate"
                              value={progress.progress}
                              sx={{ mb: 2 }}
                            />

                            {/* Goals Section */}
                            <Box sx={{ mt: 2 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  mb: 1,
                                }}
                              >
                                <Typography variant="subtitle1">
                                  Tujuan Belajar
                                </Typography>
                                <Button
                                  size="small"
                                  onClick={() => handleOpenGoalDialog(progress)}
                                >
                                  Tambah Tujuan
                                </Button>
                              </Box>

                              {progress.goals && progress.goals.length > 0 ? (
                                <Grid container spacing={1}>
                                  {progress.goals.map(goal => (
                                    <Grid item xs={12} key={goal.id}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                        }}
                                      >
                                        <IconButton
                                          size="small"
                                          onClick={() =>
                                            handleToggleGoal(progress.id, goal)
                                          }
                                        >
                                          {goal.completed ? (
                                            <CheckCircleIcon
                                              sx={{ color: 'success.main' }}
                                            />
                                          ) : (
                                            <CheckCircleIcon
                                              sx={{ color: 'grey.400' }}
                                            />
                                          )}
                                        </IconButton>
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            textDecoration: goal.completed
                                              ? 'line-through'
                                              : 'none',
                                            color: goal.completed
                                              ? 'text.secondary'
                                              : 'text.primary',
                                          }}
                                        >
                                          {goal.description}
                                        </Typography>
                                      </Box>
                                    </Grid>
                                  ))}
                                </Grid>
                              ) : (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Belum ada tujuan belajar. Tambahkan tujuan
                                  untuk membantu fokus belajarmu.
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TimelineIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Tips Meningkatkan Progres Belajar
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Tetapkan Tujuan yang Jelas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buat tujuan belajar yang spesifik dan terukur untuk setiap
                  sesi belajar.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Kelola Waktu dengan Baik
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan teknik Pomodoro atau metode manajemen waktu lainnya
                  untuk meningkatkan fokus.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Evaluasi Berkala
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tinjau progres belajarmu secara berkala dan sesuaikan strategi
                  jika diperlukan.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Add Goal Dialog */}
      <Dialog
        open={openGoalDialog}
        onClose={handleCloseGoalDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BookIcon sx={{ mr: 1 }} />
            Tambah Tujuan Belajar
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProgress && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedProgress.subject} - {selectedProgress.topic}
              </Typography>

              <TextField
                fullWidth
                label="Deskripsi Tujuan"
                value={newGoal}
                onChange={e => setNewGoal(e.target.value)}
                margin="normal"
                placeholder="Contoh: Memahami konsep integral dasar"
                autoFocus
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseGoalDialog}>Batal</Button>
          <Button
            onClick={handleAddGoal}
            variant="contained"
            disabled={!newGoal.trim()}
          >
            Tambah Tujuan
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default StudyProgressAnalytics;
