import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Task as TaskIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useStudyPlannerContext } from '../contexts/StudyPlannerContext';

const StudyPlanner = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const {
    studyPlans,
    addStudyPlan,
    updateStudyPlan,
    deleteStudyPlan,
    markTaskAsCompleted,
    markTaskAsIncomplete,
    completedTasks,
  } = useStudyPlannerContext();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({
    subject: 'Jaringan Komputer',
    date: '',
    tasks: [{ id: Date.now(), description: '', completed: false }],
  });

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (plan = null) => {
    if (plan) {
      setSelectedPlan(plan);
      setNewPlan({
        ...plan,
      });
    } else {
      setSelectedPlan(null);
      setNewPlan({
        subject: 'Jaringan Komputer',
        date: '',
        tasks: [{ id: Date.now(), description: '', completed: false }],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPlan(null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewPlan(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTaskChange = (index, value) => {
    const updatedTasks = [...newPlan.tasks];
    updatedTasks[index].description = value;
    setNewPlan(prev => ({
      ...prev,
      tasks: updatedTasks,
    }));
  };

  const addTask = () => {
    setNewPlan(prev => ({
      ...prev,
      tasks: [
        ...prev.tasks,
        { id: Date.now(), description: '', completed: false },
      ],
    }));
  };

  const removeTask = index => {
    if (newPlan.tasks.length > 1) {
      const updatedTasks = [...newPlan.tasks];
      updatedTasks.splice(index, 1);
      setNewPlan(prev => ({
        ...prev,
        tasks: updatedTasks,
      }));
    }
  };

  const handleSubmitPlan = () => {
    if (
      newPlan.subject &&
      newPlan.date &&
      newPlan.tasks.some(task => task.description.trim())
    ) {
      const planData = {
        ...newPlan,
        tasks: newPlan.tasks.filter(task => task.description.trim()),
      };

      if (selectedPlan) {
        updateStudyPlan(selectedPlan.id, planData);
        addNotification('Rencana belajar berhasil diperbarui!', 'success');
      } else {
        addStudyPlan(planData);
        addNotification('Rencana belajar berhasil ditambahkan!', 'success');
      }
      handleCloseDialog();
    } else {
      addNotification('Harap lengkapi field yang wajib diisi!', 'error');
    }
  };

  const handleDeletePlan = id => {
    deleteStudyPlan(id);
    addNotification('Rencana belajar berhasil dihapus!', 'success');
  };

  const toggleTaskCompletion = taskId => {
    if (completedTasks.includes(taskId)) {
      markTaskAsIncomplete(taskId);
    } else {
      markTaskAsCompleted(taskId);
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getUpcomingPlans = () => {
    const today = new Date();
    return studyPlans.filter(plan => new Date(plan.date) >= today);
  };

  const getCompletedPlans = () => {
    return studyPlans.filter(
      plan =>
        plan.tasks.length > 0 &&
        plan.tasks.every(task => completedTasks.includes(task.id))
    );
  };

  const getAllPlans = () => {
    return studyPlans;
  };

  const getPlansBySubject = subject => {
    return studyPlans.filter(plan => plan.subject === subject);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Study Planner
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Rencanakan dan pantau aktivitas belajarmu
          </Typography>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Buat Rencana Belajar
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Akan Datang" icon={<CalendarIcon />} />
          <Tab label="Semua" icon={<SchoolIcon />} />
          <Tab label="Selesai" icon={<CheckCircleIcon />} />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            {getUpcomingPlans().length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CalendarIcon
                    sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Belum ada rencana belajar mendatang
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Mulai dengan membuat rencana belajar pertamamu
                  </Typography>
                </Box>
              </Grid>
            ) : (
              getUpcomingPlans().map(plan => (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">{plan.subject}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(plan.date)}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {plan.tasks.map(task => (
                          <Box
                            key={task.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => toggleTaskCompletion(task.id)}
                              color={
                                completedTasks.includes(task.id)
                                  ? 'success'
                                  : 'default'
                              }
                            >
                              {completedTasks.includes(task.id) ? (
                                <CheckCircleIcon />
                              ) : (
                                <TaskIcon />
                              )}
                            </IconButton>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: completedTasks.includes(task.id)
                                  ? 'line-through'
                                  : 'none',
                                ml: 1,
                              }}
                            >
                              {task.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 1,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleOpenDialog(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          Hapus
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            {getAllPlans().length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <SchoolIcon
                    sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Belum ada rencana belajar
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Mulai dengan membuat rencana belajar pertamamu
                  </Typography>
                </Box>
              </Grid>
            ) : (
              getAllPlans().map(plan => (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">{plan.subject}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(plan.date)}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {plan.tasks.map(task => (
                          <Box
                            key={task.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => toggleTaskCompletion(task.id)}
                              color={
                                completedTasks.includes(task.id)
                                  ? 'success'
                                  : 'default'
                              }
                            >
                              {completedTasks.includes(task.id) ? (
                                <CheckCircleIcon />
                              ) : (
                                <TaskIcon />
                              )}
                            </IconButton>
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: completedTasks.includes(task.id)
                                  ? 'line-through'
                                  : 'none',
                                ml: 1,
                              }}
                            >
                              {task.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'flex-end',
                          gap: 1,
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleOpenDialog(plan)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeletePlan(plan.id)}
                        >
                          Hapus
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {tabValue === 2 && (
          <Grid container spacing={3}>
            {getCompletedPlans().length === 0 ? (
              <Grid item xs={12}>
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <CheckCircleIcon
                    sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Belum ada rencana belajar yang selesai
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Selesaikan tugas-tugasmu untuk melihat rencana yang sudah
                    selesai
                  </Typography>
                </Box>
              </Grid>
            ) : (
              getCompletedPlans().map(plan => (
                <Grid item xs={12} md={6} key={plan.id}>
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'success.light',
                      color: 'success.contrastText',
                    }}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6">{plan.subject}</Typography>
                        <Typography variant="body2">
                          {formatDate(plan.date)}
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {plan.tasks.map(task => (
                          <Box
                            key={task.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <CheckCircleIcon sx={{ fontSize: 20 }} />
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: 'line-through',
                                ml: 1,
                              }}
                            >
                              {task.description}
                            </Typography>
                          </Box>
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          onClick={() => handleOpenDialog(plan)}
                        >
                          Lihat
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}
      </Container>

      {/* Dialog for adding/editing study plan */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPlan ? 'Edit Rencana Belajar' : 'Buat Rencana Belajar'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Mata Pelajaran</InputLabel>
            <Select
              name="subject"
              value={newPlan.subject}
              onChange={handleInputChange}
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
            label="Tanggal"
            type="date"
            name="date"
            value={newPlan.date}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mt: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Tugas Belajar
          </Typography>

          {newPlan.tasks.map((task, index) => (
            <Box
              key={task.id}
              sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
            >
              <TextField
                fullWidth
                label={`Tugas ${index + 1}`}
                value={task.description}
                onChange={e => handleTaskChange(index, e.target.value)}
              />
              {newPlan.tasks.length > 1 && (
                <IconButton onClick={() => removeTask(index)} sx={{ ml: 1 }}>
                  <span style={{ fontSize: '1.5rem' }}>×</span>
                </IconButton>
              )}
            </Box>
          ))}

          <Button startIcon={<AddIcon />} onClick={addTask} sx={{ mt: 1 }}>
            Tambah Tugas
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitPlan} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default StudyPlanner;
