import { Box, Card, CardContent, Typography } from '@mui/material';
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

const LearningPathProgressChart = ({ studentId }) => {
  const { getStudentCurrentPath, getStudentPathProgress } =
    useLearningPathContext();

  const currentPath = getStudentCurrentPath(studentId);
  const pathProgress = getStudentPathProgress(studentId, currentPath?.id);

  if (!currentPath) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" align="center" color="text.secondary">
            Belum ada jalur belajar yang ditetapkan
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Pilih jalur belajar untuk melihat visualisasi progress
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for bar chart
  const moduleProgressData = currentPath.modules.map((module, index) => ({
    name: `Modul ${index + 1}`,
    title: module.title,
    progress: pathProgress[module.id] || 0,
  }));

  // Prepare data for pie chart
  const progressCategories = [
    {
      name: 'Selesai',
      value: moduleProgressData.filter(m => m.progress >= 100).length,
    },
    {
      name: 'Dalam Proses',
      value: moduleProgressData.filter(m => m.progress > 0 && m.progress < 100)
        .length,
    },
    {
      name: 'Belum Dimulai',
      value: moduleProgressData.filter(m => m.progress === 0).length,
    },
  ];

  const COLORS = ['#4CAF50', '#FFC107', '#E0E0E0'];

  // Calculate overall progress
  const overallProgress =
    moduleProgressData.reduce((sum, module) => sum + module.progress, 0) /
    moduleProgressData.length;

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6">Progress Jalur Belajar</Typography>
          <Typography variant="h4" color="primary">
            {Math.round(overallProgress)}%
          </Typography>
        </Box>

        <Box sx={{ height: 300, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={moduleProgressData}
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
                formatter={value => [`${value}%`, 'Progress']}
                labelFormatter={(value, payload) =>
                  payload[0]?.payload?.title || value
                }
              />
              <Legend />
              <Bar
                dataKey="progress"
                name="Progress (%)"
                fill="#2196F3"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={progressCategories}
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
                {progressCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={value => [value, 'Modul']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LearningPathProgressChart;
