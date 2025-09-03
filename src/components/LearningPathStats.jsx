import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useLearningPathContext } from '../contexts/LearningPathContext';

const LearningPathStats = () => {
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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Statistik Jalur Belajar
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Total Jalur Belajar</Typography>
            <Typography variant="body1" color="primary">
              {totalPaths}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Siswa dengan Jalur</Typography>
            <Typography variant="body1" color="primary">
              {studentsWithPaths}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Siswa dengan Jalur Aktif</Typography>
            <Typography variant="body1" color="primary">
              {studentsWithCurrentPaths}
            </Typography>
          </Box>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Tingkat Penyelesaian</Typography>
            <Typography variant="body1" color="primary">
              {completionRate}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={completionRate}
            color="primary"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default LearningPathStats;
