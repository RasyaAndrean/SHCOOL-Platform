import {
  Analytics as AnalyticsIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import React from 'react';
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
import { useLearningAnalyticsContext } from '../contexts/LearningAnalyticsContext';

const LearningAnalytics = ({ darkMode, toggleDarkMode }) => {
  const {
    analyticsData,
    generateAnalytics,
    getTopPerformingSubjects,
    getMostActiveGroups,
    getAssignmentPerformanceSummary,
    getProjectAnalyticsSummary,
  } = useLearningAnalyticsContext();

  // Generate analytics when component mounts
  React.useMemo(() => {
    generateAnalytics();
  }, []);

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
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Learning Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Analisis mendalam tentang pola belajarmu dan performa akademik
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Mata Pelajaran</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {analyticsData.studyPatterns.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GroupIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Grup Belajar Aktif</Typography>
                </Box>
                <Typography variant="h4" align="center" color="secondary">
                  {analyticsData.groupActivity.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Tugas Selesai</Typography>
                </Box>
                <Typography variant="h4" align="center" color="success.main">
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
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AnalyticsIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Rata-rata Nilai</Typography>
                </Box>
                <Typography variant="h4" align="center" color="info.main">
                  {assignmentSummary.avgScore}
                </Typography>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  Tingkat penyelesaian: {assignmentSummary.completionRate}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3}>
          {/* Study Patterns Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pola Belajar
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={studyPatternsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Progress" fill="#8884d8" />
                    <Bar dataKey="Frequency" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Performing Subjects Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Mata Pelajaran Terbaik
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topSubjectsData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {topSubjectsData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Assignment Performance Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Performa Tugas
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={assignmentPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Completion" fill="#ffc658" />
                    <Bar dataKey="Score" fill="#0088fe" />
                  </BarChart>
                </ResponsiveContainer>
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
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={groupActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Activity" fill="#ff7300" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Learning Efficiency Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Efisiensi Belajar
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={learningEfficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Efficiency" fill="#8dd1e1" />
                    <Bar dataKey="Progress" fill="#a4de6c" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Project Analytics Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Analitik Proyek
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={projectAnalyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Projects" fill="#fdb462" />
                    <Bar dataKey="Activity" fill="#b3de69" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Insights */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Grup Belajar Teraktif
                </Typography>
                {mostActiveGroups.length > 0 ? (
                  <Box>
                    {mostActiveGroups.map((group, index) => (
                      <Box
                        key={group.groupId}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          py: 1,
                          borderBottom:
                            index < mostActiveGroups.length - 1 ? 1 : 0,
                          borderColor: 'divider',
                        }}
                      >
                        <Typography variant="body2">
                          {group.groupName}
                        </Typography>
                        <Chip
                          label={`${group.activityScore} aktifitas`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada data grup belajar
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistik Proyek
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    {projectSummary.totalProjects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Proyek
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    mt: 2,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main">
                      {projectSummary.activeProjects}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aktif
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="info.main">
                      {projectSummary.avgTeamSize}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rata-rata Tim
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rekomendasi
                </Typography>
                <Box>
                  {analyticsData.studyPatterns.length > 0 ? (
                    <Box>
                      <Typography variant="body2" paragraph>
                        Fokus pada mata pelajaran dengan progress rendah untuk
                        meningkatkan performa akademik secara keseluruhan.
                      </Typography>
                      <Typography variant="body2">
                        Pertimbangkan untuk bergabung dengan grup belajar untuk
                        meningkatkan interaksi dan pemahaman materi.
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Tidak ada rekomendasi saat ini. Lakukan beberapa aktivitas
                      belajar untuk mendapatkan analisis.
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default LearningAnalytics;
