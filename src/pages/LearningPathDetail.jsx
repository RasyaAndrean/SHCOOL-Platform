import {
  CheckCircle as CheckCircleIcon,
  PlayArrow as PlayArrowIcon,
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
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LearningPathProgressChart from '../components/LearningPathProgressChart';
import LearningPathVisualization from '../components/LearningPathVisualization';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useLearningPathContext } from '../contexts/LearningPathContext';

const LearningPathDetail = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addNotification } = useAppContext();
  const { currentUser } = useDataContext();
  const {
    updateStudentProgress,
    getStudentPathProgress,
    calculatePathProgress,
  } = useLearningPathContext();

  const [path] = useState(location.state?.path || null);
  const [pathProgress, setPathProgress] = useState({});
  const [selectedModule, setSelectedModule] = useState(null);
  const [openModuleDialog, setOpenModuleDialog] = useState(false);

  // Load progress when user or path changes
  useEffect(() => {
    if (currentUser && path) {
      const progress = getStudentPathProgress(currentUser.id, path.id);
      setPathProgress(progress);
    }
  }, [currentUser, path, getStudentPathProgress]);

  const handleModuleClick = module => {
    setSelectedModule(module);
    setOpenModuleDialog(true);
  };

  const handleMarkAsComplete = moduleId => {
    if (currentUser && path) {
      updateStudentProgress(currentUser.id, path.id, moduleId, 100);
      addNotification(
        `Modul "${selectedModule?.title}" telah ditandai sebagai selesai!`,
        'success'
      );
      setOpenModuleDialog(false);

      // Refresh progress
      const progress = getStudentPathProgress(currentUser.id, path.id);
      setPathProgress(progress);
    }
  };

  const handleMarkAsInProgress = moduleId => {
    if (currentUser && path) {
      updateStudentProgress(currentUser.id, path.id, moduleId, 50);
      addNotification(
        `Modul "${selectedModule?.title}" sedang dalam pengerjaan`,
        'info'
      );
      setOpenModuleDialog(false);

      // Refresh progress
      const progress = getStudentPathProgress(currentUser.id, path.id);
      setPathProgress(progress);
    }
  };

  const getModuleProgress = moduleId => {
    return pathProgress[moduleId] || 0;
  };

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

  if (!path) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Jalur Belajar Tidak Ditemukan
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Silakan pilih jalur belajar terlebih dahulu.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/learning-paths')}
          >
            Kembali ke Jalur Belajar
          </Button>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/learning-paths')}
            sx={{ mb: 2 }}
          >
            ← Kembali ke Jalur Belajar
          </Button>
          <Typography variant="h4" gutterBottom>
            {path.name}
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {path.description}
          </Typography>
        </Box>

        {/* Path Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={path.careerField} color="primary" />
                  <Chip
                    label={path.difficulty}
                    color={getDifficultyColor(path.difficulty)}
                  />
                  <Chip label={path.duration} color="info" />
                </Box>

                <Typography variant="h6" gutterBottom>
                  Prasyarat
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {path.prerequisites.map((prereq, index) => (
                    <Chip
                      key={index}
                      label={prereq}
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Mata Pelajaran Terkait
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {path.subjects.map((subject, index) => (
                    <Chip
                      key={index}
                      label={subject}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>

                <Typography variant="h6" gutterBottom>
                  Keterampilan yang Akan Dipelajari
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {path.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom align="center">
                      Progres Jalur Belajar
                    </Typography>
                    <Typography
                      variant="h3"
                      color="primary"
                      align="center"
                      gutterBottom
                    >
                      {calculatePathProgress(currentUser?.id, path.id)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calculatePathProgress(currentUser?.id, path.id)}
                      sx={{ height: 12, borderRadius: 6, mb: 2 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      {
                        path.modules.filter(m => getModuleProgress(m.id) >= 100)
                          .length
                      }{' '}
                      dari {path.modules.length} modul selesai
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Progress Chart */}
        <Box sx={{ mb: 4 }}>
          <LearningPathProgressChart studentId={currentUser?.id} />
        </Box>

        {/* Learning Path Visualization */}
        <Box sx={{ mb: 4 }}>
          <LearningPathVisualization
            studentId={currentUser?.id}
            darkMode={darkMode}
          />
        </Box>

        {/* Modules List */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Modul Pembelajaran
            </Typography>

            <List>
              {path.modules.map((module, index) => {
                const progress = getModuleProgress(module.id);
                const isCompleted = progress >= 100;
                const isInProgress = progress > 0 && progress < 100;

                return (
                  <ListItem
                    key={module.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 2,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                    onClick={() => handleModuleClick(module)}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        width: '100%',
                        mb: 1,
                      }}
                    >
                      <ListItemIcon>
                        {isCompleted ? (
                          <CheckCircleIcon color="success" />
                        ) : isInProgress ? (
                          <SchoolIcon color="warning" />
                        ) : (
                          <SchoolIcon />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`${index + 1}. ${module.title}`}
                        secondary={module.duration}
                        sx={{
                          '& .MuiListItemText-primary': {
                            fontWeight: isCompleted ? 'bold' : 'normal',
                            color: isCompleted
                              ? 'success.main'
                              : 'text.primary',
                          },
                        }}
                      />
                      <Chip
                        label={`${progress}%`}
                        color={
                          isCompleted
                            ? 'success'
                            : isInProgress
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </Box>

                    <Box sx={{ width: '100%', pl: 6 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{ mb: 1 }}
                      />

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {module.topics.slice(0, 3).map((topic, topicIndex) => (
                          <Chip
                            key={topicIndex}
                            label={topic}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {module.topics.length > 3 && (
                          <Chip
                            label={`+${module.topics.length - 3} lainnya`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    </Box>
                  </ListItem>
                );
              })}
            </List>
          </CardContent>
        </Card>
      </Container>

      {/* Module Detail Dialog */}
      <Dialog
        open={openModuleDialog}
        onClose={() => setOpenModuleDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1 }} />
            {selectedModule?.title}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedModule && (
            <Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                Durasi: {selectedModule.duration}
              </Typography>

              <Typography variant="h6" gutterBottom>
                Topik yang Dipelajari
              </Typography>
              <List>
                {selectedModule.topics.map((topic, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    <ListItemText primary={topic} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom>
                Sumber Belajar
              </Typography>
              <Grid container spacing={2}>
                {selectedModule.resources.map((resource, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1">{resource}</Typography>
                        <Button
                          size="small"
                          variant="outlined"
                          sx={{ mt: 1 }}
                          startIcon={<PlayArrowIcon />}
                        >
                          Akses Materi
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Status Modul
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={`${getModuleProgress(selectedModule.id)}%`}
                    color={
                      getModuleProgress(selectedModule.id) >= 100
                        ? 'success'
                        : getModuleProgress(selectedModule.id) > 0
                        ? 'warning'
                        : 'default'
                    }
                  />
                  <LinearProgress
                    variant="determinate"
                    value={getModuleProgress(selectedModule.id)}
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModuleDialog(false)}>Tutup</Button>
          {selectedModule && getModuleProgress(selectedModule.id) < 100 && (
            <>
              {getModuleProgress(selectedModule.id) === 0 ? (
                <Button
                  onClick={() => handleMarkAsInProgress(selectedModule.id)}
                  variant="outlined"
                  color="warning"
                >
                  Tandai Sedang Dikerjakan
                </Button>
              ) : (
                <Button
                  onClick={() => handleMarkAsInProgress(selectedModule.id)}
                  variant="outlined"
                  color="warning"
                >
                  Tandai Sebagai Dalam Pengerjaan
                </Button>
              )}
              <Button
                onClick={() => handleMarkAsComplete(selectedModule.id)}
                variant="contained"
                startIcon={<CheckCircleIcon />}
              >
                Tandai Selesai
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default LearningPathDetail;
