import {
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
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
import { useLearningPathContext } from '../contexts/LearningPathContext';

const LearningPathAdminAnalytics = () => {
  const { learningPaths, studentPaths } = useLearningPathContext();

  // Calculate statistics
  const totalPaths = learningPaths.length;

  // Count students with assigned paths
  const studentsWithPaths = Object.keys(studentPaths).filter(
    studentId => studentPaths[studentId].assignedPaths?.length > 0
  ).length;

  // Count students with current paths
  const studentsWithCurrentPaths = Object.keys(studentPaths).filter(
    studentId => studentPaths[studentId].currentPath
  ).length;

  // Calculate average completion rate
  let totalModules = 0;
  let completedModules = 0;

  Object.keys(studentPaths).forEach(studentId => {
    const studentPathData = studentPaths[studentId];
    if (studentPathData.currentPath && studentPathData.progress) {
      const currentPathProgress =
        studentPathData.progress[studentPathData.currentPath];
      if (currentPathProgress) {
        Object.keys(currentPathProgress).forEach(moduleId => {
          totalModules++;
          if (currentPathProgress[moduleId] >= 100) {
            completedModules++;
          }
        });
      }
    }
  });

  const completionRate =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Prepare data for path popularity chart
  const pathPopularityData = learningPaths
    .map(path => {
      const assignedCount = Object.keys(studentPaths).filter(studentId =>
        studentPaths[studentId].assignedPaths?.includes(path.id)
      ).length;

      return {
        name: path.name,
        assigned: assignedCount,
      };
    })
    .sort((a, b) => b.assigned - a.assigned)
    .slice(0, 5); // Top 5 most popular paths

  // Prepare data for difficulty distribution
  const difficultyDistribution = learningPaths.reduce((acc, path) => {
    acc[path.difficulty] = (acc[path.difficulty] || 0) + 1;
    return acc;
  }, {});

  const difficultyData = Object.keys(difficultyDistribution).map(
    difficulty => ({
      name: difficulty,
      value: difficultyDistribution[difficulty],
    })
  );

  const DIFFICULTY_COLORS = {
    Beginner: '#4CAF50',
    Intermediate: '#FFC107',
    Advanced: '#F44336',
  };

  // Prepare data for completion rate by path
  const pathCompletionData = learningPaths.slice(0, 5).map(path => {
    const students = Object.keys(studentPaths).filter(studentId =>
      studentPaths[studentId].assignedPaths?.includes(path.id)
    );

    if (students.length === 0) {
      return {
        name: path.name,
        completion: 0,
      };
    }

    let totalProgress = 0;

    students.forEach(studentId => {
      const progress = studentPaths[studentId].progress?.[path.id] || {};
      const moduleIds = path.modules.map(m => m.id);
      const completedModules = moduleIds.filter(
        id => progress[id] >= 100
      ).length;

      const studentProgress =
        moduleIds.length > 0
          ? Math.round((completedModules / moduleIds.length) * 100)
          : 0;
      totalProgress += studentProgress;
    });

    const averageProgress = Math.round(totalProgress / students.length);

    return {
      name: path.name,
      completion: averageProgress,
    };
  });

  return (
    <Box>
      {/* Summary Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Jalur Belajar
              </Typography>
              <Typography variant="h3" align="center" color="primary">
                {totalPaths}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Siswa dengan Jalur
              </Typography>
              <Typography variant="h3" align="center" color="secondary">
                {studentsWithPaths}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Jalur Aktif
              </Typography>
              <Typography variant="h3" align="center" color="success.main">
                {studentsWithCurrentPaths}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tingkat Penyelesaian
              </Typography>
              <Typography variant="h3" align="center" color="info.main">
                {completionRate}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={completionRate}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Popularitas Jalur Belajar (Top 5)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pathPopularityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="assigned"
                      name="Siswa yang Mengambil"
                      fill="#2196F3"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribusi Tingkat Kesulitan
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={difficultyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {difficultyData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={DIFFICULTY_COLORS[entry.name] || '#8884d8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tingkat Penyelesaian per Jalur (Top 5)
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={pathCompletionData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      formatter={value => [`${value}%`, 'Penyelesaian']}
                    />
                    <Legend />
                    <Bar
                      dataKey="completion"
                      name="Tingkat Penyelesaian (%)"
                      fill="#4CAF50"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LearningPathAdminAnalytics;
