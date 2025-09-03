import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import {
  Avatar,
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
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';

const ManageStudents = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { students, addStudent, updateStudent, deleteStudent } =
    useDataContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Siswa',
    interests: '',
  });

  const roles = [
    'Siswa',
    'Ketua Kelas',
    'Wakil Ketua',
    'Sekretaris',
    'Bendahara',
  ];

  const handleOpenDialog = (student = null) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        name: student.name,
        role: student.role,
        interests: student.interests.join(', '),
      });
    } else {
      setEditingStudent(null);
      setFormData({
        name: '',
        role: 'Siswa',
        interests: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingStudent(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const studentData = {
      ...formData,
      interests: formData.interests
        .split(',')
        .map(item => item.trim())
        .filter(item => item),
    };

    if (editingStudent) {
      // Update existing student
      updateStudent(editingStudent.id, studentData);
      addNotification(
        `Profil siswa ${formData.name} berhasil diperbarui!`,
        'success',
        6000,
        'Manajemen Siswa',
        'Pembaruan Profil Siswa'
      );
      addActivity(
        'Memperbarui profil siswa',
        `Memperbarui profil siswa: ${formData.name}`
      );
    } else {
      // Add new student
      addStudent(studentData);
      addNotification(
        `Siswa ${formData.name} berhasil ditambahkan!`,
        'success',
        6000,
        'Manajemen Siswa',
        'Penambahan Siswa Baru'
      );
      addActivity(
        'Menambahkan siswa baru',
        `Menambahkan siswa baru: ${formData.name}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${name}?`)) {
      deleteStudent(id);
      addNotification(
        `Siswa ${name} berhasil dihapus!`,
        'info',
        6000,
        'Manajemen Siswa',
        'Penghapusan Siswa'
      );
      addActivity('Menghapus siswa', `Menghapus siswa: ${name}`);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h3" gutterBottom>
            Kelola Profil Siswa
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Tambah Siswa
          </Button>
        </Box>

        {/* Statistics Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Siswa</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {students.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Siswa
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="secondary">
                      {students.filter(s => s.role === 'Ketua Kelas').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Ketua Kelas
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="success.main"
                    >
                      {students.filter(s => s.role === 'Wakil Ketua').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Wakil Ketua
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="warning.main"
                    >
                      {
                        students.filter(s =>
                          ['Sekretaris', 'Bendahara'].includes(s.role)
                        ).length
                      }
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Sekretaris & Bendahara
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {students.map(student => (
            <Grid item xs={12} sm={6} md={4} key={student.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar
                      src={student.avatar}
                      sx={{ width: 80, height: 80, mx: 'auto', mb: 2 }}
                    >
                      <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Typography variant="h6" component="h2">
                      {student.name}
                    </Typography>
                    <Chip
                      label={student.role}
                      color={
                        student.role === 'Ketua Kelas'
                          ? 'primary'
                          : student.role === 'Wakil Ketua'
                          ? 'secondary'
                          : student.role === 'Sekretaris'
                          ? 'success'
                          : student.role === 'Bendahara'
                          ? 'warning'
                          : 'default'
                      }
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Minat:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {student.interests.slice(0, 3).map((interest, index) => (
                        <Chip
                          key={index}
                          label={interest}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {student.interests.length > 3 && (
                        <Chip
                          label={`+${student.interests.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Box>
                </CardContent>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    p: 2,
                  }}
                >
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(student)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(student.id, student.name)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Add/Edit Student Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingStudent ? 'Edit Profil Siswa' : 'Tambah Siswa Baru'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Peran</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Peran"
              >
                {roles.map(role => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Minat (pisahkan dengan koma)"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              margin="normal"
              placeholder="Programming, Networking, Design"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.name}
          >
            {editingStudent ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageStudents;
