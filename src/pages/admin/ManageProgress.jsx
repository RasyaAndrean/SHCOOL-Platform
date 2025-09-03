import {
  BarChart as BarChartIcon,
  Delete as DeleteIcon,
  School as SchoolIcon,
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
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
import { useProgressContext } from '../../contexts/ProgressContext';

const ManageProgress = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { progressData, updateProgress, deleteProgress } = useProgressContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('Jaringan Komputer');
  const [topic, setTopic] = useState('');
  const [progress, setProgress] = useState(50);

  const subjects = [
    'Jaringan Komputer',
    'Pemrograman Web',
    'Sistem Operasi',
    'Desain Grafis',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'PKn',
    'IPS',
    'IPA',
  ];

  // Colors for charts
  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTopic('');
    setProgress(50);
  };

  const handleSubmitProgress = () => {
    if (topic.trim()) {
      updateProgress(selectedSubject, topic, progress);
      addActivity(
        'Menambahkan progress',
        `Menambahkan progress untuk ${selectedSubject} - ${topic}`
      );
      addNotification('Progress berhasil disimpan!', 'success');
      handleCloseDialog();
    } else {
      addNotification('Harap isi topik pembelajaran!', 'error');
    }
  };

  const handleDeleteProgress = (subject, topic) => {
    deleteProgress(subject, topic);
    addActivity(
      'Menghapus progress',
      `Menghapus progress untuk ${subject} - ${topic}`
    );
    addNotification('Progress berhasil dihapus!', 'success');
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate statistics
  const totalProgressEntries = progressData.length;

  // Calculate average progress
  const averageProgress =
    totalProgressEntries > 0
      ? Math.round(
          progressData.reduce((sum, item) => sum + item.progress, 0) /
            totalProgressEntries
        )
      : 0;

  // Count progress by subject
  const progressBySubject = {};
  progressData.forEach(item => {
    if (!progressBySubject[item.subject]) {
      progressBySubject[item.subject] = { count: 0, totalProgress: 0 };
    }
    progressBySubject[item.subject].count += 1;
    progressBySubject[item.subject].totalProgress += item.progress;
  });

  const subjectStats = Object.keys(progressBySubject).map(subject => ({
    name: subject,
    count: progressBySubject[subject].count,
    averageProgress: Math.round(
      progressBySubject[subject].totalProgress /
        progressBySubject[subject].count
    ),
  }));

  // Prepare data for charts
  const progressBySubjectData = subjectStats.map((stat, index) => ({
    name: stat.name,
    progress: stat.averageProgress,
    count: stat.count,
    color: COLORS[index % COLORS.length],
  }));

  const progressDistributionData = progressData
    .slice()
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 10)
    .map((item, index) => ({
      name: `${item.subject} - ${item.topic}`,
      progress: item.progress,
      color: COLORS[index % COLORS.length],
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
            <Typography variant="h4">Kelola Progress Tracker</Typography>
            <Button
              variant="contained"
              startIcon={<SchoolIcon />}
              onClick={handleOpenDialog}
            >
              Tambah Progress
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Entri</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalProgressEntries}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Rata-rata Progress</Typography>
                </Box>
                <Typography variant="h4" align="center" color="secondary">
                  {averageProgress}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Mata Pelajaran</Typography>
                </Box>
                <Typography variant="h4" align="center" color="success.main">
                  {Object.keys(progressBySubject).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Topik Tertinggi</Typography>
                </Box>
                <Typography variant="h4" align="center" color="warning.main">
                  {progressData.length > 0
                    ? Math.max(...progressData.map(item => item.progress))
                    : 0}
                  %
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        {progressData.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Progress by Subject Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Rata-rata Progress per Mata Pelajaran
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={progressBySubjectData}
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
                          formatter={(value, name) => {
                            if (name === 'progress')
                              return [`${value}%`, 'Rata-rata Progress'];
                            if (name === 'count')
                              return [value, 'Jumlah Entri'];
                            return [value, name];
                          }}
                        />
                        <Legend />
                        <Bar dataKey="progress" name="Rata-rata Progress (%)">
                          {progressBySubjectData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Top Progress Entries Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    10 Entri Progress Tertinggi
                  </Typography>
                  <Box sx={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={progressDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="progress"
                          nameKey="name"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {progressDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={value => [`${value}%`, 'Progress']}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {progressData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Belum ada data progress
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Mulai dengan menambahkan progress pertama
            </Typography>
            <Button
              variant="contained"
              startIcon={<SchoolIcon />}
              onClick={handleOpenDialog}
            >
              Tambah Progress
            </Button>
          </Box>
        ) : (
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
                <Typography variant="h6">Data Progress</Typography>
                <Chip label={`${totalProgressEntries} entri`} color="primary" />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mata Pelajaran</TableCell>
                      <TableCell>Topik</TableCell>
                      <TableCell>Progress</TableCell>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {progressData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.subject}</TableCell>
                        <TableCell>{item.topic}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={{ width: 100, mr: 1 }}>
                              <Slider
                                value={item.progress}
                                disabled
                                size="small"
                              />
                            </Box>
                            <Typography variant="body2">
                              {item.progress}%
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              handleDeleteProgress(item.subject, item.topic)
                            }
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Dialog for adding progress */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tambah Progress Pembelajaran</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Mata Pelajaran</InputLabel>
            <Select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              label="Mata Pelajaran"
            >
              {subjects.map(subject => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Topik Pembelajaran"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Tingkat Pemahaman: {progress}%</Typography>
            <TextField
              type="number"
              label="Progress (%)"
              value={progress}
              onChange={e =>
                setProgress(Math.min(100, Math.max(0, e.target.value)))
              }
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              fullWidth
              sx={{ mt: 1 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitProgress} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageProgress;
