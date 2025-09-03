import {
  Add as AddIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Computer as ComputerIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  LocationOn as LocationOnIcon,
  Pending as PendingIcon,
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
  Divider,
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useClassroomContext } from '../../contexts/ClassroomContext';

const ManageClassroomResources = ({ darkMode, toggleDarkMode }) => {
  const {
    classrooms,
    reservations,
    addClassroom,
    updateClassroom,
    deleteClassroom,
    updateReservation,
    deleteReservation,
  } = useClassroomContext();
  const { addActivity } = useActivityContext();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openClassroomDialog, setOpenClassroomDialog] = useState(false);
  const [openReservationDialog, setOpenReservationDialog] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [classroomData, setClassroomData] = useState({
    name: '',
    capacity: '',
    equipment: '',
    location: '',
    description: '',
  });
  const [reservationStatus, setReservationStatus] = useState('');

  useEffect(() => {
    if (editingClassroom) {
      setClassroomData({
        name: editingClassroom.name,
        capacity: editingClassroom.capacity,
        equipment: editingClassroom.equipment.join(', '),
        location: editingClassroom.location,
        description: editingClassroom.description,
      });
    } else {
      setClassroomData({
        name: '',
        capacity: '',
        equipment: '',
        location: '',
        description: '',
      });
    }
  }, [editingClassroom]);

  useEffect(() => {
    if (editingReservation) {
      setReservationStatus(editingReservation.status);
    } else {
      setReservationStatus('');
    }
  }, [editingReservation]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenClassroomDialog = (classroom = null) => {
    setEditingClassroom(classroom);
    setOpenClassroomDialog(true);
  };

  const handleCloseClassroomDialog = () => {
    setOpenClassroomDialog(false);
    setEditingClassroom(null);
  };

  const handleOpenReservationDialog = reservation => {
    setEditingReservation(reservation);
    setOpenReservationDialog(true);
  };

  const handleCloseReservationDialog = () => {
    setOpenReservationDialog(false);
    setEditingReservation(null);
  };

  const handleClassroomInputChange = e => {
    const { name, value } = e.target;
    setClassroomData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitClassroom = () => {
    const classroom = {
      name: classroomData.name,
      capacity: parseInt(classroomData.capacity),
      equipment: classroomData.equipment
        .split(',')
        .map(item => item.trim())
        .filter(item => item),
      location: classroomData.location,
      description: classroomData.description,
      status: 'available',
    };

    if (editingClassroom) {
      updateClassroom(editingClassroom.id, classroom);
      addActivity(`Memperbarui ruang kelas: ${classroom.name}`, 'classroom');
    } else {
      addClassroom(classroom);
      addActivity(
        `Menambahkan ruang kelas baru: ${classroom.name}`,
        'classroom'
      );
    }

    handleCloseClassroomDialog();
  };

  const handleDeleteClassroom = (id, name) => {
    if (
      window.confirm(`Apakah Anda yakin ingin menghapus ruang kelas ${name}?`)
    ) {
      deleteClassroom(id);
      addActivity(`Menghapus ruang kelas: ${name}`, 'classroom');
    }
  };

  const handleSubmitReservationStatus = () => {
    if (editingReservation && reservationStatus) {
      updateReservation(editingReservation.id, { status: reservationStatus });
      addActivity(
        `Memperbarui status reservasi untuk ${editingReservation.purpose}`,
        'classroom'
      );
      handleCloseReservationDialog();
    }
  };

  const handleDeleteReservation = id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus reservasi ini?')) {
      deleteReservation(id);
      addActivity('Menghapus reservasi', 'classroom');
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon />;
      case 'pending':
        return <PendingIcon />;
      default:
        return null;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <AdminHeader darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Manajemen Ruang Kelas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kelola ruang kelas dan reservasi
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="Ruang Kelas" />
              <Tab label="Reservasi" />
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            {tabValue === 0 && (
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Daftar Ruang Kelas</Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenClassroomDialog()}
                  >
                    Tambah Ruang
                  </Button>
                </Box>

                <Grid container spacing={3}>
                  {classrooms.map(classroom => (
                    <Grid item xs={12} md={6} key={classroom.id}>
                      <Card>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box>
                              <Typography variant="h6" gutterBottom>
                                {classroom.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1,
                                }}
                              >
                                <LocationOnIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {classroom.location}
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 1,
                                }}
                              >
                                <GroupIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Kapasitas: {classroom.capacity} orang
                                </Typography>
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  mb: 2,
                                }}
                              >
                                <ComputerIcon sx={{ mr: 1, fontSize: 20 }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Fasilitas: {classroom.equipment.join(', ')}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ mb: 2 }}>
                                {classroom.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={
                                classroom.status === 'available'
                                  ? 'Tersedia'
                                  : 'Tidak Tersedia'
                              }
                              color={
                                classroom.status === 'available'
                                  ? 'success'
                                  : 'error'
                              }
                              variant="outlined"
                            />
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: 1,
                            }}
                          >
                            <IconButton
                              color="primary"
                              onClick={() =>
                                handleOpenClassroomDialog(classroom)
                              }
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDeleteClassroom(
                                  classroom.id,
                                  classroom.name
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Daftar Reservasi
                </Typography>

                {reservations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Typography color="text.secondary">
                      Belum ada reservasi
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {reservations.map(reservation => {
                      const classroom = classrooms.find(
                        c => c.id === reservation.classroomId
                      );
                      return (
                        <Grid item xs={12} key={reservation.id}>
                          <Card>
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                }}
                              >
                                <Box>
                                  <Typography variant="h6" gutterBottom>
                                    {classroom?.name || 'Ruang Tidak Diketahui'}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      mb: 1,
                                    }}
                                  >
                                    <CalendarTodayIcon
                                      sx={{ mr: 1, fontSize: 20 }}
                                    />
                                    <Typography variant="body2">
                                      {reservation.date} |{' '}
                                      {reservation.startTime} -{' '}
                                      {reservation.endTime}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                  >
                                    Oleh: {reservation.reservedBy}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mb: 2 }}>
                                    Tujuan: {reservation.purpose}
                                  </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                  <Chip
                                    icon={getStatusIcon(reservation.status)}
                                    label={
                                      reservation.status === 'confirmed'
                                        ? 'Dikonfirmasi'
                                        : reservation.status === 'pending'
                                        ? 'Menunggu'
                                        : 'Ditolak'
                                    }
                                    color={getStatusColor(reservation.status)}
                                    sx={{ mb: 2 }}
                                  />
                                  <Box>
                                    <IconButton
                                      color="primary"
                                      onClick={() =>
                                        handleOpenReservationDialog(reservation)
                                      }
                                    >
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        handleDeleteReservation(reservation.id)
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Box>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Classroom Dialog */}
      <Dialog
        open={openClassroomDialog}
        onClose={handleCloseClassroomDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingClassroom ? 'Edit Ruang Kelas' : 'Tambah Ruang Kelas'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nama Ruang"
                name="name"
                value={classroomData.name}
                onChange={handleClassroomInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Kapasitas"
                name="capacity"
                type="number"
                value={classroomData.capacity}
                onChange={handleClassroomInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fasilitas (pisahkan dengan koma)"
                name="equipment"
                value={classroomData.equipment}
                onChange={handleClassroomInputChange}
                placeholder="Contoh: Komputer, Proyektor, Whiteboard"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lokasi"
                name="location"
                value={classroomData.location}
                onChange={handleClassroomInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deskripsi"
                name="description"
                value={classroomData.description}
                onChange={handleClassroomInputChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClassroomDialog}>Batal</Button>
          <Button onClick={handleSubmitClassroom} variant="contained">
            {editingClassroom ? 'Simpan Perubahan' : 'Tambah Ruang'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reservation Dialog */}
      <Dialog
        open={openReservationDialog}
        onClose={handleCloseReservationDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Status Reservasi</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={reservationStatus}
                  onChange={e => setReservationStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="pending">Menunggu</MenuItem>
                  <MenuItem value="confirmed">Dikonfirmasi</MenuItem>
                  <MenuItem value="rejected">Ditolak</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReservationDialog}>Batal</Button>
          <Button onClick={handleSubmitReservationStatus} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageClassroomResources;
