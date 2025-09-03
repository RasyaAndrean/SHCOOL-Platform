import {
  AutoAwesome as AutoAwesomeIcon,
  Book as BookIcon,
  PlayArrow as PlayArrowIcon,
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
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import LearningPathVisualization from '../components/LearningPathVisualization';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useLearningPathContext } from '../contexts/LearningPathContext';

const LearningPaths = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { currentUser } = useDataContext();
  const {
    learningPaths,
    recommendPathsForStudent,
    assignPathToStudent,
    getStudentCurrentPath,
    getStudentPathProgress,
    calculatePathProgress,
  } = useLearningPathContext();

  const [recommendedPaths, setRecommendedPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [openPathDialog, setOpenPathDialog] = useState(false);

  // Load recommendations and current path when user changes
  useEffect(() => {
    if (currentUser) {
      // Get recommendations
      const recommendations = recommendPathsForStudent(currentUser.id);
      setRecommendedPaths(recommendations);

      // Get current path
      const current = getStudentCurrentPath(currentUser.id);
      setCurrentPath(current);

      // Get progress for current path
      if (current) {
        const progress = getStudentPathProgress(currentUser.id, current.id);
        setPathProgress(progress);
      }
    }
  }, [
    currentUser,
    recommendPathsForStudent,
    getStudentCurrentPath,
    getStudentPathProgress,
  ]);

  const handleAssignPath = pathId => {
    if (currentUser) {
      assignPathToStudent(currentUser.id, pathId);
      const path = learningPaths.find(p => p.id === pathId);
      setCurrentPath(path);
      setSelectedPath(path);
      setOpenPathDialog(true);
      addNotification(
        `Jalur belajar "${path.name}" telah ditetapkan!`,
        'success'
      );
    }
  };

  const handleViewPathDetails = path => {
    setSelectedPath(path);
    setOpenPathDialog(true);
  };

  const handleStartLearning = () => {
    if (selectedPath) {
      setOpenPathDialog(false);
      navigate('/learning-path-detail', { state: { path: selectedPath } });
    }
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

  const getConfidenceColor = confidence => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.5) return 'warning';
    return 'error';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2 }}
          >
            ← Kembali ke Dashboard
          </Button>
          <Typography variant="h4" gutterBottom>
            Jalur Belajar Personal
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Rekomendasi jalur belajar berdasarkan minat dan kemampuanmu
          </Typography>
        </Box>

        {/* Current Path Section */}
        {currentPath && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Jalur Belajarmu Saat Ini</Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h5" gutterBottom>
                    {currentPath.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {currentPath.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={currentPath.careerField}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={currentPath.difficulty}
                      color={getDifficultyColor(currentPath.difficulty)}
                      size="small"
                    />
                    <Chip
                      label={currentPath.duration}
                      color="info"
                      size="small"
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Progres Kamu
                    </Typography>
                    <Typography variant="h3" color="primary" gutterBottom>
                      {calculatePathProgress(currentUser?.id, currentPath.id)}%
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={calculatePathProgress(
                        currentUser?.id,
                        currentPath.id
                      )}
                      sx={{ height: 10, borderRadius: 5 }}
                    />
                    <Button
                      variant="contained"
                      sx={{ mt: 2 }}
                      onClick={() => handleViewPathDetails(currentPath)}
                      startIcon={<PlayArrowIcon />}
                    >
                      Lanjutkan Belajar
                    </Button>
                  </Box>
                </Grid>
              </Grid>

              {/* Learning Path Visualization */}
              <Box sx={{ mt: 4 }}>
                <LearningPathVisualization
                  studentId={currentUser?.id}
                  darkMode={darkMode}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Recommendations Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AutoAwesomeIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Rekomendasi Jalur Belajar</Typography>
            </Box>

            {recommendedPaths.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <SchoolIcon
                  sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Tidak ada rekomendasi jalur belajar
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sistem akan memberikan rekomendasi berdasarkan minat dan
                  kemampuanmu.
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {recommendedPaths.map(path => (
                  <Grid item xs={12} key={path.id}>
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
                              {path.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                            >
                              {path.description}
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                              <Chip
                                label={path.careerField}
                                color="primary"
                                size="small"
                              />
                              <Chip
                                label={path.difficulty}
                                color={getDifficultyColor(path.difficulty)}
                                size="small"
                              />
                              <Chip
                                label={path.duration}
                                color="info"
                                size="small"
                              />
                              {path.confidence && (
                                <Chip
                                  label={`Confidence: ${Math.round(
                                    path.confidence * 100
                                  )}%`}
                                  color={getConfidenceColor(path.confidence)}
                                  size="small"
                                />
                              )}
                            </Box>
                          </Box>

                          <Box>
                            {currentPath?.id === path.id ? (
                              <Button
                                variant="contained"
                                color="success"
                                onClick={() => handleViewPathDetails(path)}
                                startIcon={<PlayArrowIcon />}
                              >
                                Lanjutkan
                              </Button>
                            ) : (
                              <Button
                                variant="contained"
                                onClick={() => handleAssignPath(path.id)}
                              >
                                Pilih Jalur Ini
                              </Button>
                            )}
                          </Box>
                        </Box>

                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Mata Pelajaran:
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              flexWrap: 'wrap',
                              gap: 1,
                              mb: 2,
                            }}
                          >
                            {path.subjects.map((subject, index) => (
                              <Chip
                                key={index}
                                label={subject}
                                size="small"
                                variant="outlined"
                              />
                            ))}
                          </Box>

                          <Typography variant="subtitle2" gutterBottom>
                            Keterampilan yang Akan Dipelajari:
                          </Typography>
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                          >
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
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* All Paths Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BookIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Semua Jalur Belajar</Typography>
            </Box>

            <Grid container spacing={3}>
              {learningPaths.map(path => (
                <Grid item xs={12} sm={6} md={4} key={path.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => handleViewPathDetails(path)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {path.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {path.description}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Chip
                          label={path.careerField}
                          color="primary"
                          size="small"
                        />
                        <Chip
                          label={path.difficulty}
                          color={getDifficultyColor(path.difficulty)}
                          size="small"
                        />
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {path.duration}
                        </Typography>
                        <Button size="small" endIcon={<PlayArrowIcon />}>
                          Lihat Detail
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Path Detail Dialog */}
      <Dialog
        open={openPathDialog}
        onClose={() => setOpenPathDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1 }} />
            {selectedPath?.name}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPath && (
            <Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                {selectedPath.description}
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <Chip label={selectedPath.careerField} color="primary" />
                <Chip
                  label={selectedPath.difficulty}
                  color={getDifficultyColor(selectedPath.difficulty)}
                />
                <Chip label={selectedPath.duration} color="info" />
              </Box>

              <Typography variant="h6" gutterBottom>
                Modul Pembelajaran
              </Typography>

              <List>
                {selectedPath.modules.map((module, index) => (
                  <ListItem
                    key={module.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 2,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
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
                        <BookIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={`${index + 1}. ${module.title}`}
                        secondary={module.duration}
                      />
                    </Box>

                    <Box sx={{ pl: 4, width: '100%' }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Topik yang Dipelajari:
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        {module.topics.map((topic, topicIndex) => (
                          <Chip
                            key={topicIndex}
                            label={topic}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom>
                        Sumber Belajar:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {module.resources.map((resource, resourceIndex) => (
                          <Chip
                            key={resourceIndex}
                            label={resource}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom>
                Prasyarat
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedPath.prerequisites.map((prereq, index) => (
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
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {selectedPath.subjects.map((subject, index) => (
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
                {selectedPath.skills.map((skill, index) => (
                  <Chip
                    key={index}
                    label={skill}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPathDialog(false)}>Tutup</Button>
          <Button
            onClick={handleStartLearning}
            variant="contained"
            startIcon={<PlayArrowIcon />}
          >
            Mulai Belajar
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default LearningPaths;
