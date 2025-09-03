import {
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Computer as ComputerIcon,
  EventAvailable as EventAvailableIcon,
  Group as GroupIcon,
  LocationOn as LocationOnIcon,
  Pending as PendingIcon,
  Search as SearchIcon,
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
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useClassroomContext } from '../contexts/ClassroomContext';

const ClassroomManagement = ({ darkMode, toggleDarkMode }) => {
  const {
    classrooms,
    reservations,
    addReservation,
    getReservationsByUser,
    getAvailableClassrooms,
  } = useClassroomContext();
  const { addNotification } = useAppContext();
  const navigate = useNavigate();
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [userReservations, setUserReservations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [reservationData, setReservationData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    purpose: '',
  });
  const [filteredClassrooms, setFilteredClassrooms] = useState([]);

  useEffect(() => {
    const userRes = getReservationsByUser(currentUser);
    setUserReservations(userRes);
  }, [currentUser, getReservationsByUser, reservations]);

  useEffect(() => {
    setFilteredClassrooms(
      classrooms.filter(
        classroom =>
          classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          classroom.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, classrooms]);

  const handleOpenDialog = classroomId => {
    setSelectedClassroom(classroomId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedClassroom('');
    setReservationData({
      date: '',
      startTime: '',
      endTime: '',
      purpose: '',
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setReservationData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitReservation = () => {
    if (
      !reservationData.date ||
      !reservationData.startTime ||
      !reservationData.endTime ||
      !reservationData.purpose
    ) {
      addNotification('Harap lengkapi semua field', 'warning');
      return;
    }

    // Validate time
    if (reservationData.startTime >= reservationData.endTime) {
      addNotification(
        'Waktu mulai harus lebih awal dari waktu selesai',
        'warning'
      );
      return;
    }

    const reservation = {
      classroomId: selectedClassroom,
      reservedBy: currentUser,
      purpose: reservationData.purpose,
      date: reservationData.date,
      startTime: reservationData.startTime,
      endTime: reservationData.endTime,
      status: 'pending',
    };

    addReservation(reservation);
    addNotification('Permintaan reservasi berhasil dikirim', 'success');
    handleCloseDialog();
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
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Manajemen Ruang Kelas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Reservasi ruang kelas untuk kegiatan belajar
          </Typography>
        </Box>

        {/* Search and Filter */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Cari ruang kelas..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Available Classrooms */}
          <Grid item xs={12} md={8}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <ComputerIcon sx={{ mr: 1 }} />
              Ruang Kelas Tersedia
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {filteredClassrooms.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography color="text.secondary">
                    Tidak ada ruang kelas yang tersedia
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {filteredClassrooms.map(classroom => (
                  <Grid item xs={12} key={classroom.id}>
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
                        <Button
                          variant="contained"
                          onClick={() => handleOpenDialog(classroom.id)}
                          disabled={classroom.status !== 'available'}
                        >
                          Reservasi Ruang
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* User Reservations */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <EventAvailableIcon sx={{ mr: 1 }} />
              Reservasi Saya
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {userReservations.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <EventAvailableIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Belum ada reservasi
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Box sx={{ maxHeight: 600, overflow: 'auto' }}>
                {userReservations.map(reservation => {
                  const classroom = classrooms.find(
                    c => c.id === reservation.classroomId
                  );
                  return (
                    <Card key={reservation.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1" gutterBottom>
                              {classroom?.name || 'Ruang Tidak Diketahui'}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <CalendarTodayIcon sx={{ mr: 1, fontSize: 16 }} />
                              <Typography variant="body2">
                                {reservation.date}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <AccessTimeIcon sx={{ mr: 1, fontSize: 16 }} />
                              <Typography variant="body2">
                                {reservation.startTime} - {reservation.endTime}
                              </Typography>
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 1 }}
                            >
                              {reservation.purpose}
                            </Typography>
                          </Box>
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
                            size="small"
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Reservation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reservasi Ruang Kelas</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tanggal"
                type="date"
                name="date"
                value={reservationData.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Waktu Mulai"
                type="time"
                name="startTime"
                value={reservationData.startTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Waktu Selesai"
                type="time"
                name="endTime"
                value={reservationData.endTime}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tujuan Reservasi"
                name="purpose"
                value={reservationData.purpose}
                onChange={handleInputChange}
                placeholder="Contoh: Praktikum Jaringan, Diskusi Kelompok, dll."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitReservation} variant="contained">
            Kirim Permintaan
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ClassroomManagement;
