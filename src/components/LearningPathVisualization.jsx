import {
  Book as BookIcon,
  PlayArrow as PlayArrowIcon,
} from '@mui/icons-material';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
} from '@mui/lab';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLearningPathContext } from '../contexts/LearningPathContext';

const LearningPathVisualization = ({ studentId }) => {
  const { getStudentCurrentPath, getStudentPathProgress } =
    useLearningPathContext();
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(null);
  const [openModuleDialog, setOpenModuleDialog] = useState(false);

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

  const getModuleStatus = moduleId => {
    const progress = pathProgress[moduleId] || 0;
    if (progress >= 100) return 'completed';
    if (progress > 0) return 'in-progress';
    return 'not-started';
  };

  const getModuleColor = moduleId => {
    const status = getModuleStatus(moduleId);
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      default:
        return 'grey';
    }
  };

  const getModuleProgress = moduleId => {
    return pathProgress[moduleId] || 0;
  };

  const handleModuleClick = module => {
    setSelectedModule(module);
    setOpenModuleDialog(true);
  };

  const handleStartLearning = () => {
    setOpenModuleDialog(false);
    navigate('/learning-path-detail', { state: { path: currentPath } });
  };

  return (
    <>
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
            <Typography variant="h6">Visualisasi Jalur Belajar</Typography>
            <Chip label={currentPath.name} color="primary" variant="outlined" />
          </Box>

          <Timeline position="right">
            {currentPath.modules.map((module, index) => (
              <TimelineItem key={module.id}>
                <TimelineSeparator>
                  <TimelineDot
                    color={getModuleColor(module.id)}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleModuleClick(module)}
                  />
                  {index < currentPath.modules.length - 1 && (
                    <TimelineConnector />
                  )}
                </TimelineSeparator>
                <TimelineContent
                  sx={{ pb: 3, cursor: 'pointer' }}
                  onClick={() => handleModuleClick(module)}
                >
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">
                      {index + 1}. {module.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {module.duration}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={getModuleProgress(module.id)}
                    sx={{ mb: 1 }}
                  />

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {getModuleProgress(module.id)}% selesai
                    </Typography>
                    <Chip
                      label={
                        getModuleStatus(module.id) === 'completed'
                          ? 'Selesai'
                          : getModuleStatus(module.id) === 'in-progress'
                          ? 'Dalam Proses'
                          : 'Belum Dimulai'
                      }
                      size="small"
                      color={
                        getModuleStatus(module.id) === 'completed'
                          ? 'success'
                          : getModuleStatus(module.id) === 'in-progress'
                          ? 'warning'
                          : 'default'
                      }
                    />
                  </Box>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </CardContent>
      </Card>

      {/* Module Detail Dialog */}
      <Dialog
        open={openModuleDialog}
        onClose={() => setOpenModuleDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BookIcon sx={{ mr: 1 }} />
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
                      <BookIcon />
                    </ListItemIcon>
                    <ListItemText primary={topic} />
                  </ListItem>
                ))}
              </List>

              <Typography variant="h6" gutterBottom>
                Sumber Belajar
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {selectedModule.resources.map((resource, index) => (
                  <Chip
                    key={index}
                    label={resource}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>

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
          <Button
            onClick={handleStartLearning}
            variant="contained"
            startIcon={<PlayArrowIcon />}
          >
            Lanjutkan Belajar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LearningPathVisualization;
