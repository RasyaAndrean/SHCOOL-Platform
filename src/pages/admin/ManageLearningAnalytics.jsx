import {
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon,
  Group as GroupIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
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
import { useMemo } from 'react';
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
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';
import { useLearningAnalytics } from '../../hooks/useLearningAnalytics';

const ManageLearningAnalytics = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const {
    analyticsData,
    generateAnalytics,
    getTopPerformingSubjects,
    getMostActiveGroups,
    getAssignmentPerformanceSummary,
    getProjectAnalyticsSummary,
  } = useLearningAnalytics();

  // Generate analytics when component mounts
  useMemo(() => {
    generateAnalytics();
    addActivity(
      'Mengakses Dashboard Analytics',
      'Admin membuka halaman manajemen learning analytics'
    );
  }, []);

  const handleRefreshAnalytics = () => {
    generateAnalytics();
    addActivity(
      'Memperbarui Analytics',
      'Admin memperbarui data learning analytics'
    );
    addNotification('Data analytics berhasil diperbarui!', 'success');
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Prepare data for study patterns chart
  const studyPatternsData = analyticsData.studyPatterns.map(pattern => ({
    name: pattern.subject,
    Progress: pattern.avgProgress,
    Frequency: pattern.studyFrequency,
  }));

  // Prepare data for group activity chart
  const groupActivityData = analyticsData.groupActivity.map(activity => ({
    name:
      activity.groupName.length > 15
        ? `${activity.groupName.substring(0, 15)}...`
        : activity.groupName,
    Activity: activity.activityScore,
  }));

  // Prepare data for assignment performance chart
  const assignmentPerformanceData = analyticsData.assignmentPerformance.map(
    performance => ({
      name: performance.subject,
      Completion: performance.completionRate,
      Score: performance.avgScore,
    })
  );

  // Prepare data for learning efficiency chart
  const learningEfficiencyData = analyticsData.learningEfficiency.map(
    efficiency => ({
      name: efficiency.week,
      Efficiency: efficiency.efficiencyScore,
      Progress: efficiency.avgProgress,
    })
  );

  // Prepare data for pie chart of top subjects
  const topSubjectsData = getTopPerformingSubjects().map(subject => ({
    name: subject.subject,
    value: subject.avgProgress,
  }));

  // Get assignment performance summary
  const assignmentSummary = getAssignmentPerformanceSummary();

  // Get most active groups
  const mostActiveGroups = getMostActiveGroups();

  // Get project analytics summary
  const projectSummary = getProjectAnalyticsSummary();

  // Prepare data for project analytics chart
  const projectAnalyticsData = analyticsData.projectAnalytics.map(project => ({
    name: project.category,
    Projects: project.totalProjects,
    Activity: project.activityRate,
  }));

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">Manajemen Learning Analytics</Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshAnalytics}
            >
              Perbarui Data
            </Button>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Learning Analytics</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <SchoolIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Mata Pelajaran</Typography>
                    </Box>
                    <Typography variant="h4" align="center" color="primary">
                      {analyticsData.studyPatterns.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <GroupIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Grup Belajar</Typography>
                    </Box>
                    <Typography variant="h4" align="center" color="secondary">
                      {analyticsData.groupActivity.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <TrendingUpIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Siswa</Typography>
                    </Box>
                    <Typography
                      variant="h4"
                      align="center"
                      color="success.main"
                    >
                      {students.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AnalyticsIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Tugas Selesai</Typography>
                    </Box>
                    <Typography variant="h4" align="center" color="info.main">
                      {assignmentSummary.completedAssignments}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      dari {assignmentSummary.totalAssignments} tugas
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <WorkIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Total Proyek</Typography>
                    </Box>
                    <Typography variant="h4" align="center" color="warning.main">
                      {projectSummary.totalProjects}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Aktif: {projectSummary.activityRate}%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Study Patterns Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pola Belajar Siswa
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={studyPatternsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="Progress"
                        fill="#8884d8"
                        name="Progress Rata-rata (%)"
                      />
                      <Bar
                        dataKey="Frequency"
                        fill="#82ca9d"
                        name="Frekuensi Studi"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Assignment Performance Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performa Tugas Siswa
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={assignmentPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        domain={[0, 100]}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        domain={[0, 100]}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="Completion"
                        fill="#ffc658"
                        name="Penyelesaian (%)"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="Score"
                        fill="#ff7300"
                        name="Nilai Rata-rata"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Performing Subjects Pie Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mata Pelajaran dengan Progress Terbaik
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={topSubjectsData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topSubjectsData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => [`${value}%`, 'Progress']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Group Activity Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Aktivitas Grup Belajar
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={groupActivityData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="Activity"
                        fill="#0088FE"
                        name="Skor Aktivitas"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Project Analytics Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analisis Proyek per Kategori
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectAnalyticsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis yAxisId="left" orientation="left" />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="Projects"
                        fill="#8884d8"
                        name="Total Proyek"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="Activity"
                        fill="#82ca9d"
                        name="Tingkat Aktivitas (%)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Insights */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Most Active Groups */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Grup Belajar Paling Aktif
                </Typography>
                {mostActiveGroups.length > 0 ? (
                  <Grid container spacing={2}>
                    {mostActiveGroups.map((group, index) => (
                      <Grid item xs={12} key={group.groupId}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1">
                              {group.groupName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {group.memberCount} anggota •{' '}
                              {group.materialsCount} materi •{' '}
                              {group.discussionsCount} diskusi
                            </Typography>
                          </Box>
                          <Chip
                            label={`Skor: ${group.activityScore}`}
                            color={index === 0 ? 'primary' : 'default'}
                            variant={index === 0 ? 'filled' : 'outlined'}
                          />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary">
                    Belum ada data grup belajar
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Learning Efficiency */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Efisiensi Belajar Siswa
                </Typography>
                <Box sx={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={learningEfficiencyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="Efficiency"
                        fill="#82ca9d"
                        name="Efisiensi"
                      />
                      <Bar
                        dataKey="Progress"
                        fill="#ffc658"
                        name="Progress Rata-rata"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Information Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Manajemen Learning Analytics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Memantau Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan data pola belajar untuk mengidentifikasi mata
                  pelajaran yang perlu perhatian lebih dari siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Meningkatkan Partisipasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analisis aktivitas grup belajar untuk mendorong kolaborasi dan
                  partisipasi siswa yang lebih aktif.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Evaluasi Efektivitas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan data efisiensi belajar untuk mengevaluasi efektivitas
                  metode pengajaran dan memberikan rekomendasi.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ManageLearningAnalytics;
