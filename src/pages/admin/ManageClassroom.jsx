import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  PlayArrow as PlayArrowIcon,
  School as SchoolIcon,
  Stop as StopIcon,
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
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useClassroomContext } from '../../contexts/ClassroomContext';

const ManageClassroom = ({ darkMode, toggleDarkMode }) => {
  const {
    sessions,
    createSession,
    updateSession,
    deleteSession,
    startSession,
    endSession,
  } = useClassroomContext();
  const { addActivity } = useActivityContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  // Calculate statistics
  const totalSessions = sessions.length;
  const activeSessions = sessions.filter(
    session => session.status === 'active'
  ).length;
  const scheduledSessions = sessions.filter(
    session => session.status === 'scheduled'
  ).length;
  const completedSessions = sessions.filter(
    session => session.status === 'completed'
  ).length;

  // Calculate total participants
  const totalParticipants = sessions.reduce(
    (sum, session) =>
      sum + (session.participants ? session.participants.length : 0),
    0
  );

  // Calculate total materials
  const totalMaterials = sessions.reduce(
    (sum, session) => sum + (session.materials ? session.materials.length : 0),
    0
  );

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Kelas Virtual',
      'User membuka halaman kelola kelas virtual'
    );
  }, [addActivity]);

  const handleOpenDialog = (session = null) => {
    if (session) {
      setEditingSession(session);
      setFormData({
        title: session.title,
        subject: session.subject,
        date: session.date,
        startTime: session.startTime,
        endTime: session.endTime,
        description: session.description || '',
      });
    } else {
      setEditingSession(null);
      setFormData({
        title: '',
        subject: '',
        date: '',
        startTime: '',
        endTime: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSession(null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (editingSession) {
      updateSession(editingSession.id, formData);
      addActivity(
        'Memperbarui Sesi Kelas',
        `User memperbarui sesi kelas: ${formData.title}`
      );
    } else {
      createSession(formData);
      addActivity(
        'Menambah Sesi Kelas',
        `User menambah sesi kelas: ${formData.title}`
      );
    }
    handleCloseDialog();
  };

  const handleDeleteSession = session => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus sesi "${session.title}"?`
      )
    ) {
      deleteSession(session.id);
      addActivity(
        'Menghapus Sesi Kelas',
        `User menghapus sesi kelas: ${session.title}`
      );
    }
  };

  const handleStartSession = session => {
    startSession(session.id);
    addActivity(
      'Memulai Sesi Kelas',
      `User memulai sesi kelas: ${session.title}`
    );
  };

  const handleEndSession = session => {
    endSession(session.id);
    addActivity(
      'Mengakhiri Sesi Kelas',
      `User mengakhiri sesi kelas: ${session.title}`
    );
  };

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'scheduled':
        return 'Dijadwalkan';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Kelas Virtual
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Atur sesi kelas virtual dan kelola partisipasi siswa
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Sesi</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalSessions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PlayArrowIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Sesi Aktif</Typography>
                </Box>
                <Typography variant="h4" align="center" color="success.main">
                  {activeSessions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Dijadwalkan</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {scheduledSessions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StopIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Selesai</Typography>
                </Box>
                <Typography variant="h4" align="center" color="default">
                  {completedSessions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GroupIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Peserta</Typography>
                </Box>
                <Typography variant="h4" align="center" color="secondary">
                  {totalParticipants}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Materials Card */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Materi Kelas</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalMaterials}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Tambah Sesi
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Judul</TableCell>
                    <TableCell>Mata Pelajaran</TableCell>
                    <TableCell>Tanggal & Waktu</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Partisipan</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sessions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          Belum ada sesi kelas virtual
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sessions.map(session => (
                      <TableRow key={session.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {session.title}
                          </Typography>
                        </TableCell>
                        <TableCell>{session.subject}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {session.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {session.startTime} - {session.endTime}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(session.status)}
                            size="small"
                            color={getStatusColor(session.status)}
                          />
                        </TableCell>
                        <TableCell>
                          {session.participants
                            ? session.participants.length
                            : 0}{' '}
                          peserta
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(session)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          {session.status === 'scheduled' && (
                            <IconButton
                              size="small"
                              onClick={() => handleStartSession(session)}
                              sx={{ mr: 1 }}
                              color="success"
                            >
                              <PlayArrowIcon fontSize="small" />
                            </IconButton>
                          )}
                          {session.status === 'active' && (
                            <IconButton
                              size="small"
                              onClick={() => handleEndSession(session)}
                              sx={{ mr: 1 }}
                              color="warning"
                            >
                              <StopIcon fontSize="small" />
                            </IconButton>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSession(session)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Kelas Virtual
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Membuat Sesi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Klik "Tambah Sesi" untuk membuat sesi kelas virtual baru. Isi
                  semua detail yang diperlukan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mengelola Sesi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tombol edit untuk memperbarui detail sesi atau tombol
                  hapus untuk menghapus sesi.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Memulai Sesi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Klik tombol play untuk memulai sesi yang dijadwalkan atau
                  tombol stop untuk mengakhiri sesi aktif.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />

      {/* Dialog for Adding/Editing Session */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingSession ? 'Edit Sesi Kelas' : 'Tambah Sesi Kelas'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Judul Sesi"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Mata Pelajaran"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Tanggal"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Waktu Mulai"
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Waktu Selesai"
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.title ||
              !formData.subject ||
              !formData.date ||
              !formData.startTime ||
              !formData.endTime
            }
          >
            {editingSession ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageClassroom;
