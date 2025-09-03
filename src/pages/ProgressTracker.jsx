import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
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
import { useProgressContext } from '../contexts/ProgressContext';

const ProgressTracker = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const {
    progressData,
    updateProgress,
    getProgressBySubject,
    getOverallProgress,
    getProgressSummary,
    deleteProgress,
  } = useProgressContext();
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
      addNotification('Progress berhasil disimpan!', 'success');
      handleCloseDialog();
    } else {
      addNotification('Harap isi topik pembelajaran!', 'error');
    }
  };

  const handleDeleteProgress = (subject, topic) => {
    deleteProgress(subject, topic);
    addNotification('Progress berhasil dihapus!', 'success');
  };

  const progressSummary = getProgressSummary();
  const overallProgress = getOverallProgress();

  // Prepare data for charts
  const progressBySubjectData = Object.keys(progressSummary).map(
    (subject, index) => ({
      name: subject,
      progress: progressSummary[subject],
      color: COLORS[index % COLORS.length],
    })
  );

  const progressDistributionData = progressData.map((item, index) => ({
    name: `${item.subject} - ${item.topic}`,
    progress: item.progress,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Progress Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Pantau perkembangan belajarmu di setiap mata pelajaran
          </Typography>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<SchoolIcon />}
            onClick={handleOpenDialog}
          >
            Tambah Progress
          </Button>
        </Box>

        {/* Overall Progress */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <TrendingUpIcon sx={{ fontSize: 40, mr: 2 }} />
              <Typography variant="h5">
                Progress Keseluruhan: {overallProgress}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <CircularProgress
                variant="determinate"
                value={overallProgress}
                size={100}
                thickness={4}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Charts Section */}
        {progressData.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Progress by Subject Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Progress per Mata Pelajaran
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
                          formatter={value => [`${value}%`, 'Progress']}
                        />
                        <Legend />
                        <Bar dataKey="progress" name="Progress (%)">
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

            {/* Progress Distribution Chart */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribusi Progress
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

        {/* Progress by Subject */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.keys(progressSummary).map((subject, index) => (
            <Grid item xs={12} sm={6} md={4} key={subject}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {subject}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <CircularProgress
                      variant="determinate"
                      value={progressSummary[subject]}
                      size={50}
                      thickness={4}
                    />
                    <Typography variant="h6" sx={{ ml: 2 }}>
                      {progressSummary[subject]}%
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {getProgressBySubject(subject).length} topik
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Detailed Progress List */}
        {progressData.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Belum ada data progress
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Mulai dengan menambahkan progress pertamamu
            </Typography>
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detail Progress
              </Typography>
              <Grid container spacing={2}>
                {progressData.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        p: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box>
                        <Typography variant="subtitle1">
                          {item.topic}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.subject}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 100, mr: 2 }}>
                          <Slider
                            value={item.progress}
                            disabled
                            size="small"
                            sx={{ mr: 2 }}
                          />
                        </Box>
                        <Typography variant="body2" sx={{ width: 40 }}>
                          {item.progress}%
                        </Typography>
                        <Button
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDeleteProgress(item.subject, item.topic)
                          }
                        >
                          Hapus
                        </Button>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
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
            <Slider
              value={progress}
              onChange={(e, newValue) => setProgress(newValue)}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={0}
              max={100}
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

      <Footer />
    </div>
  );
};

export default ProgressTracker;
