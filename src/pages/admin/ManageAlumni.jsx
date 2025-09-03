import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAlumniContext } from '../../contexts/AlumniContext';

const ManageAlumni = ({ darkMode, toggleDarkMode }) => {
  const {
    alumni,
    alumniEvents,
    addAlumni,
    updateAlumni,
    deleteAlumni,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useAlumniContext();
  const { addActivity } = useActivityContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [openAlumniDialog, setOpenAlumniDialog] = useState(false);
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [alumniFormData, setAlumniFormData] = useState({
    name: '',
    graduationYear: '',
    currentPosition: '',
    company: '',
    email: '',
    phone: '',
    linkedin: '',
    expertise: '',
    achievements: '',
    bio: '',
    availableForMentoring: false,
    photo: '',
  });
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: '',
    time: '',
    venue: '',
    description: '',
    speaker: '',
    registrationLink: '',
  });

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Alumni',
      'User membuka halaman kelola jaringan alumni'
    );
  }, [addActivity]);

  const handleOpenAlumniDialog = (alumnus = null) => {
    if (alumnus) {
      setEditingAlumni(alumnus);
      setAlumniFormData({
        name: alumnus.name,
        graduationYear: alumnus.graduationYear,
        currentPosition: alumnus.currentPosition,
        company: alumnus.company,
        email: alumnus.email,
        phone: alumnus.phone,
        linkedin: alumnus.linkedin,
        expertise: alumnus.expertise.join(', '),
        achievements: alumnus.achievements.join(', '),
        bio: alumnus.bio,
        availableForMentoring: alumnus.availableForMentoring,
        photo: alumnus.photo,
      });
    } else {
      setEditingAlumni(null);
      setAlumniFormData({
        name: '',
        graduationYear: '',
        currentPosition: '',
        company: '',
        email: '',
        phone: '',
        linkedin: '',
        expertise: '',
        achievements: '',
        bio: '',
        availableForMentoring: false,
        photo: '',
      });
    }
    setOpenAlumniDialog(true);
  };

  const handleCloseAlumniDialog = () => {
    setOpenAlumniDialog(false);
    setEditingAlumni(null);
  };

  const handleOpenEventDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setEventFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        venue: event.venue,
        description: event.description,
        speaker: event.speaker,
        registrationLink: event.registrationLink,
      });
    } else {
      setEditingEvent(null);
      setEventFormData({
        title: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        speaker: '',
        registrationLink: '',
      });
    }
    setOpenEventDialog(true);
  };

  const handleCloseEventDialog = () => {
    setOpenEventDialog(false);
    setEditingEvent(null);
  };

  const handleAlumniInputChange = e => {
    const { name, value, type, checked } = e.target;
    setAlumniFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEventInputChange = e => {
    const { name, value } = e.target;
    setEventFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAlumniSubmit = () => {
    const alumniData = {
      ...alumniFormData,
      graduationYear: parseInt(alumniFormData.graduationYear) || 0,
      expertise: alumniFormData.expertise
        .split(',')
        .map(e => e.trim())
        .filter(e => e),
      achievements: alumniFormData.achievements
        .split(',')
        .map(a => a.trim())
        .filter(a => a),
    };

    if (editingAlumni) {
      updateAlumni(editingAlumni.id, alumniData);
      addActivity(
        'Memperbarui Informasi Alumni',
        `User memperbarui informasi alumni: ${alumniFormData.name}`
      );
    } else {
      addAlumni(alumniData);
      addActivity(
        'Menambah Informasi Alumni',
        `User menambah informasi alumni: ${alumniFormData.name}`
      );
    }
    handleCloseAlumniDialog();
  };

  const handleEventSubmit = () => {
    const eventData = {
      ...eventFormData,
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
      addActivity(
        'Memperbarui Acara Alumni',
        `User memperbarui acara alumni: ${eventFormData.title}`
      );
    } else {
      addEvent(eventData);
      addActivity(
        'Menambah Acara Alumni',
        `User menambah acara alumni: ${eventFormData.title}`
      );
    }
    handleCloseEventDialog();
  };

  const handleDeleteAlumni = alumnus => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus informasi alumni "${alumnus.name}"?`
      )
    ) {
      deleteAlumni(alumnus.id);
      addActivity(
        'Menghapus Informasi Alumni',
        `User menghapus informasi alumni: ${alumnus.name}`
      );
    }
  };

  const handleDeleteEvent = event => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus acara "${event.title}"?`
      )
    ) {
      deleteEvent(event.id);
      addActivity(
        'Menghapus Acara Alumni',
        `User menghapus acara alumni: ${event.title}`
      );
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Jaringan Alumni
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Atur informasi alumni dan acara jaringan alumni
          </Typography>
        </Box>

        <Card>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab icon={<GroupIcon />} label="Daftar Alumni" />
            <Tab icon={<CalendarIcon />} label="Acara Alumni" />
          </Tabs>

          <Divider />

          <CardContent>
            {activeTab === 0 && (
              <>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenAlumniDialog()}
                  >
                    Tambah Alumni
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Alumni</TableCell>
                        <TableCell>Posisi</TableCell>
                        <TableCell>Perusahaan</TableCell>
                        <TableCell>Tahun Lulus</TableCell>
                        <TableCell>Keahlian</TableCell>
                        <TableCell>Status Mentoring</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alumni.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} align="center">
                            <Typography color="text.secondary">
                              Belum ada informasi alumni
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        alumni.map(alumnus => (
                          <TableRow key={alumnus.id}>
                            <TableCell>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <CardMedia
                                  component="img"
                                  height="40"
                                  image={alumnus.photo}
                                  alt={alumnus.name}
                                  sx={{ width: 40, borderRadius: '50%', mr: 2 }}
                                />
                                <Typography variant="subtitle2">
                                  {alumnus.name}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{alumnus.currentPosition}</TableCell>
                            <TableCell>{alumnus.company}</TableCell>
                            <TableCell>{alumnus.graduationYear}</TableCell>
                            <TableCell>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {alumnus.expertise
                                  .slice(0, 2)
                                  .map((skill, index) => (
                                    <Chip
                                      key={index}
                                      label={skill}
                                      size="small"
                                    />
                                  ))}
                                {alumnus.expertise.length > 2 && (
                                  <Chip
                                    label={`+${alumnus.expertise.length - 2}`}
                                    size="small"
                                    variant="outlined"
                                  />
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  alumnus.availableForMentoring
                                    ? 'Tersedia'
                                    : 'Tidak Tersedia'
                                }
                                size="small"
                                color={
                                  alumnus.availableForMentoring
                                    ? 'success'
                                    : 'default'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenAlumniDialog(alumnus)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteAlumni(alumnus)}
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
              </>
            )}

            {activeTab === 1 && (
              <>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenEventDialog()}
                  >
                    Tambah Acara
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Acara</TableCell>
                        <TableCell>Tanggal & Waktu</TableCell>
                        <TableCell>Tempat</TableCell>
                        <TableCell>Pembicara</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {alumniEvents.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography color="text.secondary">
                              Belum ada acara alumni
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        alumniEvents.map(event => (
                          <TableRow key={event.id}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {event.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {event.description.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {event.date}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {event.time}
                              </Typography>
                            </TableCell>
                            <TableCell>{event.venue}</TableCell>
                            <TableCell>{event.speaker}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenEventDialog(event)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteEvent(event)}
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
              </>
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Jaringan Alumni
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Menambah Informasi Alumni
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Klik "Tambah Alumni" untuk menambahkan informasi alumni baru.
                  Isi semua detail yang diperlukan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mengelola Acara
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tab "Acara Alumni" untuk menambah, mengedit, atau
                  menghapus acara jaringan alumni.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Status Mentoring
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tandai alumni yang tersedia untuk mentoring agar siswa dapat
                  menghubungi mereka.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />

      {/* Dialog for Adding/Editing Alumni */}
      <Dialog
        open={openAlumniDialog}
        onClose={handleCloseAlumniDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingAlumni ? 'Edit Informasi Alumni' : 'Tambah Informasi Alumni'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nama Lengkap"
                  name="name"
                  value={alumniFormData.name}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tahun Lulus"
                  name="graduationYear"
                  value={alumniFormData.graduationYear}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                  type="number"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Posisi Saat Ini"
                  name="currentPosition"
                  value={alumniFormData.currentPosition}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Perusahaan"
                  name="company"
                  value={alumniFormData.company}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={alumniFormData.email}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Telepon"
                  name="phone"
                  value={alumniFormData.phone}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LinkedIn"
                  name="linkedin"
                  value={alumniFormData.linkedin}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Keahlian (pisahkan dengan koma)"
                  name="expertise"
                  value={alumniFormData.expertise}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                  helperText="Contoh: Network Security, Cloud Infrastructure, Ethical Hacking"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Prestasi (pisahkan dengan koma)"
                  name="achievements"
                  value={alumniFormData.achievements}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Biografi"
                  name="bio"
                  value={alumniFormData.bio}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL Foto"
                  name="photo"
                  value={alumniFormData.photo}
                  onChange={handleAlumniInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
                  <input
                    type="checkbox"
                    name="availableForMentoring"
                    checked={alumniFormData.availableForMentoring}
                    onChange={handleAlumniInputChange}
                    id="mentoringCheckbox"
                  />
                  <label htmlFor="mentoringCheckbox" style={{ marginLeft: 8 }}>
                    Tersedia untuk Mentoring
                  </label>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlumniDialog}>Batal</Button>
          <Button
            onClick={handleAlumniSubmit}
            variant="contained"
            disabled={!alumniFormData.name}
          >
            {editingAlumni ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding/Editing Events */}
      <Dialog
        open={openEventDialog}
        onClose={handleCloseEventDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? 'Edit Acara Alumni' : 'Tambah Acara Alumni'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Judul Acara"
                  name="title"
                  value={eventFormData.title}
                  onChange={handleEventInputChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tanggal"
                  type="date"
                  name="date"
                  value={eventFormData.date}
                  onChange={handleEventInputChange}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Waktu"
                  type="time"
                  name="time"
                  value={eventFormData.time}
                  onChange={handleEventInputChange}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tempat"
                  name="venue"
                  value={eventFormData.venue}
                  onChange={handleEventInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deskripsi"
                  name="description"
                  value={eventFormData.description}
                  onChange={handleEventInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pembicara"
                  name="speaker"
                  value={eventFormData.speaker}
                  onChange={handleEventInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Link Pendaftaran"
                  name="registrationLink"
                  value={eventFormData.registrationLink}
                  onChange={handleEventInputChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEventDialog}>Batal</Button>
          <Button
            onClick={handleEventSubmit}
            variant="contained"
            disabled={
              !eventFormData.title || !eventFormData.date || !eventFormData.time
            }
          >
            {editingEvent ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAlumni;
