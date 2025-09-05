import {
  BarChart as BarChartIcon,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useLearningPathContext } from '../../contexts/LearningPathContext';

const LearningPathAnalytics = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { learningPaths, studentPaths } = useLearningPathContext();

  useEffect(() => {
    addActivity(
      'Mengakses Analytics Jalur Belajar',
      'User membuka halaman analytics jalur belajar'
    );
  }, [addActivity]);

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

  // Get path popularity data
  const pathPopularity = learningPaths
    .map(path => {
      const assignedCount = Object.keys(studentPaths).filter(studentId =>
        studentPaths[studentId].assignedPaths?.includes(path.id)
      ).length;

      return {
        ...path,
        assignedCount,
      };
    })
    .sort((a, b) => b.assignedCount - a.assignedCount);

  // Get student progress data
  const studentProgressData = Object.keys(studentPaths)
    .map(studentId => {
      const studentPathData = studentPaths[studentId];
      if (studentPathData.currentPath) {
        const path = learningPaths.find(
          p => p.id === studentPathData.currentPath
        );
        if (path) {
          const progress = studentPathData.progress?.[path.id] || {};
          const moduleIds = path.modules.map(m => m.id);
          const completedModules = moduleIds.filter(
            id => progress[id] >= 100
          ).length;
          const progressPercentage =
            moduleIds.length > 0
              ? Math.round((completedModules / moduleIds.length) * 100)
              : 0;

          return {
            studentId,
            pathName: path.name,
            progress: progressPercentage,
            completedModules,
            totalModules: moduleIds.length,
          };
        }
      }
      return null;
    })
    .filter(Boolean)
    .sort((a, b) => b.progress - a.progress);

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
      <Header darkMode={darkMode} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Typography variant="h4" gutterBottom>
            Analytics Jalur Belajar
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Analisis komprehensif tentang penggunaan dan efektivitas jalur
            belajar
          </Typography>
        </Box>

        {/* Summary Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BookIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Jalur</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalPaths}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Siswa dengan Jalur</Typography>
                </Box>
                <Typography variant="h4" align="center" color="secondary">
                  {studentsWithPaths}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Jalur Aktif</Typography>
                </Box>
                <Typography variant="h4" align="center" color="success.main">
                  {studentsWithCurrentPaths}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Penyelesaian</Typography>
                </Box>
                <Typography variant="h4" align="center" color="info.main">
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

        {/* Path Popularity */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Popularitas Jalur Belajar
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama Jalur</TableCell>
                    <TableCell>Bidang Karir</TableCell>
                    <TableCell>Tingkat Kesulitan</TableCell>
                    <TableCell>Modul</TableCell>
                    <TableCell>Siswa yang Mengambil</TableCell>
                    <TableCell>Popularitas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pathPopularity.map(path => (
                    <TableRow key={path.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{path.name}</Typography>
                      </TableCell>
                      <TableCell>{path.careerField}</TableCell>
                      <TableCell>
                        <Chip
                          label={path.difficulty}
                          size="small"
                          color={getDifficultyColor(path.difficulty)}
                        />
                      </TableCell>
                      <TableCell>{path.modules.length} modul</TableCell>
                      <TableCell>{path.assignedCount} siswa</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {path.assignedCount > 0
                              ? Math.round(
                                  (path.assignedCount / studentsWithPaths) * 100
                                )
                              : 0}
                            %
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={
                              path.assignedCount > 0
                                ? (path.assignedCount / studentsWithPaths) * 100
                                : 0
                            }
                            sx={{ flexGrow: 1 }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Student Progress */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Progress Siswa dalam Jalur Belajar
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID Siswa</TableCell>
                    <TableCell>Jalur Belajar</TableCell>
                    <TableCell>Modul Selesai</TableCell>
                    <TableCell>Progress</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentProgressData.map((student, index) => (
                    <TableRow key={index}>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell>{student.pathName}</TableCell>
                      <TableCell>
                        {student.completedModules} dari {student.totalModules}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {student.progress}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={student.progress}
                            sx={{ flexGrow: 1 }}
                            color={
                              student.progress >= 80
                                ? 'success'
                                : student.progress >= 50
                                ? 'warning'
                                : 'error'
                            }
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default LearningPathAnalytics;
