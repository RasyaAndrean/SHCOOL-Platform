import {
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon,
  Book as BookIcon,
  Group as GroupIcon,
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
  Grid,
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
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import { useStudyProgressContext } from '../../contexts/StudyProgressContext';

const ManageStudyProgress = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const {
    getAllStudyProgress,
    getOverallProgressForStudent,
    getSubjectProgressForStudent,
    getStudyTimeStats,
  } = useStudyProgressContext();

  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalProgressRecords: 0,
    averageProgress: 0,
    mostStudiedSubject: '',
  });
  const [studentProgressData] = useState([]);
  const [subjectProgressData, setSubjectProgressData] = useState([]);

  // Load data
  useEffect(() => {
    const allProgress = getAllStudyProgress();
    const studentProgress = students.map(student => {
      const overallProgress = getOverallProgressForStudent(student.id);
      const subjectProgress = getSubjectProgressForStudent(student.id);
      const timeStats = getStudyTimeStats(student.id);

      return {
        student,
        overallProgress,
        subjectProgress,
        timeStats,
      };
    });

    // Calculate statistics
    const totalProgressRecords = allProgress.length;
    const averageProgress =
      studentProgress.length > 0
        ? Math.round(
            studentProgress.reduce((sum, sp) => sum + sp.overallProgress, 0) /
              studentProgress.length
          )
        : 0;

    // Find most studied subject
    const subjectTimeTotals = {};
    studentProgress.forEach(sp => {
      Object.keys(sp.timeStats.subjectTime || {}).forEach(subject => {
        if (!subjectTimeTotals[subject]) {
          subjectTimeTotals[subject] = 0;
        }
        subjectTimeTotals[subject] += sp.timeStats.subjectTime[subject];
      });
    });

    const mostStudiedSubject =
      Object.keys(subjectTimeTotals).sort(
        (a, b) => subjectTimeTotals[b] - subjectTimeTotals[a]
      )[0] || '';

    setStatistics({
      totalStudents: students.length,
      totalProgressRecords,
      averageProgress,
      mostStudiedSubject,
    });

    // Prepare subject progress data for chart
    const subjectData = [];
    studentProgress.forEach(sp => {
      sp.subjectProgress.forEach(subject => {
        subjectData.push({
          studentName: sp.student.name,
          subject: subject.subject,
          progress: subject.averageProgress,
        });
      });
    });
    setSubjectProgressData(subjectData);

    addActivity(
      'Mengakses Manajemen Progres Belajar',
      'Admin membuka halaman manajemen progres belajar siswa'
    );
  }, [
    getAllStudyProgress,
    getOverallProgressForStudent,
    getSubjectProgressForStudent,
    getStudyTimeStats,
    students,
    addActivity,
  ]);

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
  const studentProgressChartData = studentProgressData
    .map(sp => ({
      name:
        sp.student.name.length > 15
          ? `${sp.student.name.substring(0, 15)}...`
          : sp.student.name,
      progress: sp.overallProgress,
    }))
    .sort((a, b) => b.progress - a.progress);

  const subjectDistributionData = subjectProgressData.reduce((acc, item) => {
    const existing = acc.find(a => a.subject === item.subject);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ subject: item.subject, count: 1 });
    }
    return acc;
  }, []);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Typography variant="h4">Manajemen Progres Belajar</Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <GroupIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">{statistics.totalStudents}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Siswa
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BookIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.totalProgressRecords}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Rekaman Progres
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <AnalyticsIcon
                  sx={{ fontSize: 40, color: 'info.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.averageProgress}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rata-rata Progres
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon
                  sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                />
                <Typography variant="h6">
                  {statistics.mostStudiedSubject || 'Tidak ada data'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mata Pelajaran Paling Banyak Dipelajari
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Student Progress Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Progres Siswa</Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={studentProgressChartData}
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
                        labelFormatter={value => `Siswa: ${value}`}
                      />
                      <Legend />
                      <Bar
                        dataKey="progress"
                        name="Progres (%)"
                        fill="#8884d8"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Subject Distribution Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Distribusi Mata Pelajaran
                  </Typography>
                </Box>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={subjectDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="subject"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {subjectDistributionData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getSubjectColor(entry.subject)}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => [value, 'Siswa']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Student Progress Details */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Detail Progres Siswa</Typography>
            </Box>

            <Grid container spacing={3}>
              {studentProgressData.map(sp => (
                <Grid item xs={12} md={6} key={sp.student.id}>
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
                            {sp.student.name}
                          </Typography>
                          <Chip
                            label={`Progres: ${sp.overallProgress}%`}
                            color={
                              sp.overallProgress >= 80
                                ? 'success'
                                : sp.overallProgress >= 60
                                ? 'warning'
                                : 'error'
                            }
                            sx={{ mb: 1 }}
                          />
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            ID: {sp.student.id}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Progres per Mata Pelajaran:
                      </Typography>

                      {sp.subjectProgress.length > 0 ? (
                        <Grid container spacing={1}>
                          {sp.subjectProgress.map(subject => (
                            <Grid item xs={12} key={subject.subject}>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <Box sx={{ width: '30%', mr: 1 }}>
                                  <Typography variant="body2">
                                    {subject.subject}
                                  </Typography>
                                </Box>
                                <Box sx={{ width: '70%' }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <Box sx={{ width: '80%' }}>
                                      <Typography variant="caption">
                                        {subject.averageProgress}%
                                      </Typography>
                                      <LinearProgress
                                        variant="determinate"
                                        value={subject.averageProgress}
                                        sx={{ height: 6, borderRadius: 3 }}
                                      />
                                    </Box>
                                    <Typography
                                      variant="caption"
                                      sx={{ width: '20%', textAlign: 'right' }}
                                    >
                                      {subject.count} topik
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Grid>
                          ))}
                        </Grid>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Belum ada data progres untuk siswa ini.
                        </Typography>
                      )}

                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Waktu Belajar:
                        </Typography>
                        <Grid container spacing={1}>
                          {Object.keys(sp.timeStats.subjectTime || {}).map(
                            subject => (
                              <Grid item xs={12} key={subject}>
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <Box sx={{ width: '40%' }}>
                                    <Typography variant="body2">
                                      {subject}
                                    </Typography>
                                  </Box>
                                  <Box sx={{ width: '60%' }}>
                                    <Typography variant="caption">
                                      {sp.timeStats.subjectTime[subject]} menit
                                    </Typography>
                                  </Box>
                                </Box>
                              </Grid>
                            )
                          )}
                        </Grid>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AnalyticsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Panduan Manajemen Progres Belajar
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Monitor Progres Siswa
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan data progres untuk mengidentifikasi siswa yang
                  membutuhkan bantuan tambahan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Identifikasi Pola Belajar
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analisis pola waktu belajar dan progres untuk memahami
                  kebiasaan belajar siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Berikan Dukungan yang Tepat
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan informasi ini untuk memberikan rekomendasi dan
                  dukungan yang sesuai dengan kebutuhan siswa.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ManageStudyProgress;
