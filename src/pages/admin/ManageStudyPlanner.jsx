import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
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
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useStudyPlannerContext } from '../../contexts/StudyPlannerContext';

const ManageStudyPlanner = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { studyPlans, addStudyPlan, updateStudyPlan, deleteStudyPlan } =
    useStudyPlannerContext();
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
        addActivity(
          'Mengupdate rencana belajar',
          `Mengupdate rencana belajar untuk ${planData.subject}`
        );
        addNotification('Rencana belajar berhasil diperbarui!', 'success');
      } else {
        addStudyPlan(planData);
        addActivity(
          'Menambahkan rencana belajar',
          `Menambahkan rencana belajar untuk ${planData.subject}`
        );
        addNotification('Rencana belajar berhasil ditambahkan!', 'success');
      }
      handleCloseDialog();
    } else {
      addNotification('Harap lengkapi field yang wajib diisi!', 'error');
    }
  };

  const handleDeletePlan = (id, subject) => {
    deleteStudyPlan(id);
    addActivity(
      'Menghapus rencana belajar',
      `Menghapus rencana belajar untuk ${subject}`
    );
    addNotification('Rencana belajar berhasil dihapus!', 'success');
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
            <Typography variant="h4">Kelola Study Planner</Typography>
            <Button
              variant="contained"
              startIcon={<SchoolIcon />}
              onClick={() => handleOpenDialog()}
            >
              Tambah Rencana
            </Button>
          </Box>
        </Box>

        {studyPlans.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Belum ada rencana belajar
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Mulai dengan menambahkan rencana belajar pertama
            </Typography>
            <Button
              variant="contained"
              startIcon={<SchoolIcon />}
              onClick={() => handleOpenDialog()}
            >
              Tambah Rencana Belajar
            </Button>
          </Box>
        ) : (
          <Card>
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Mata Pelajaran</TableCell>
                      <TableCell>Tanggal</TableCell>
                      <TableCell>Jumlah Tugas</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studyPlans.map(plan => (
                      <TableRow key={plan.id}>
                        <TableCell>{plan.subject}</TableCell>
                        <TableCell>{formatDate(plan.date)}</TableCell>
                        <TableCell>{plan.tasks.length}</TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleOpenDialog(plan)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeletePlan(plan.id, plan.subject)
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

      {/* Dialog for adding/editing study plan */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedPlan ? 'Edit Rencana Belajar' : 'Tambah Rencana Belajar'}
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

          <Button onClick={addTask} sx={{ mt: 1 }}>
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
    </div>
  );
};

export default ManageStudyPlanner;
