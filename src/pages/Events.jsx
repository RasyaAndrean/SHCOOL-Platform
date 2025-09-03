import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Event as EventIcon,
  LocationOn as LocationIcon,
  AccessTime as TimeIcon,
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
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';

const Events = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Ujian Tengah Semester',
      date: '2025-09-15',
      time: '08:00 - 11:00',
      location: 'Ruang Kelas XI TKJ 3',
      description: 'Ujian tengah semester untuk semua mata pelajaran',
      category: 'Akademik',
      priority: 'high',
    },
    {
      id: 2,
      title: 'Kegiatan Study Tour',
      date: '2025-09-22',
      time: '07:00 - 17:00',
      location: 'Museum Teknologi',
      description: 'Study tour ke Museum Teknologi untuk memperluas wawasan',
      category: 'Kegiatan',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Lomba Keterampilan',
      date: '2025-10-05',
      time: '08:00 - 16:00',
      location: 'Laboratorium Komputer',
      description: 'Lomba keterampilan dalam bidang jaringan dan pemrograman',
      category: 'Lomba',
      priority: 'high',
    },
    {
      id: 4,
      title: 'Parent-Teacher Meeting',
      date: '2025-10-12',
      time: '15:00 - 17:00',
      location: 'Ruang Guru',
      description: 'Pertemuan antara orang tua dan wali kelas',
      category: 'Administrasi',
      priority: 'medium',
    },
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    category: 'Akademik',
    priority: 'medium',
  });

  const categories = [
    'Akademik',
    'Kegiatan',
    'Lomba',
    'Administrasi',
    'Lainnya',
  ];
  const priorities = [
    { value: 'low', label: 'Rendah', color: 'default' },
    { value: 'medium', label: 'Sedang', color: 'primary' },
    { value: 'high', label: 'Tinggi', color: 'error' },
  ];

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setNewEvent({ ...event });
    } else {
      setEditingEvent(null);
      setNewEvent({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        category: 'Akademik',
        priority: 'medium',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.time) {
      if (editingEvent) {
        // Update existing event
        setEvents(
          events.map(event =>
            event.id === editingEvent.id
              ? { ...newEvent, id: editingEvent.id }
              : event
          )
        );
        addNotification('Acara berhasil diperbarui!', 'success');
      } else {
        // Add new event
        setEvents([...events, { ...newEvent, id: Date.now() }]);
        addNotification('Acara berhasil ditambahkan!', 'success');
      }
      handleCloseDialog();
    } else {
      addNotification('Harap lengkapi field yang wajib diisi!', 'error');
    }
  };

  const handleDeleteEvent = id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus acara ini?')) {
      setEvents(events.filter(event => event.id !== id));
      addNotification('Acara berhasil dihapus!', 'success');
    }
  };

  const formatDate = dateString => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getCategoryColor = category => {
    switch (category) {
      case 'Akademik':
        return 'primary';
      case 'Kegiatan':
        return 'secondary';
      case 'Lomba':
        return 'success';
      case 'Administrasi':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = priority => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.label : 'Sedang';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Acara Kelas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Jadwal kegiatan, ujian, dan acara penting kelas XI TKJ 3
          </Typography>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Tambah Acara
          </Button>
        </Box>

        {events.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Belum ada acara yang terjadwal
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tambahkan acara pertama Anda
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {events.map(event => (
              <Grid item xs={12} md={6} key={event.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `4px solid ${
                      event.priority === 'high'
                        ? '#f44336'
                        : event.priority === 'medium'
                        ? '#2196f3'
                        : '#9e9e9e'
                    }`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{ fontWeight: 'bold' }}
                      >
                        {event.title}
                      </Typography>
                      <Chip
                        label={getPriorityLabel(event.priority)}
                        color={
                          event.priority === 'high'
                            ? 'error'
                            : event.priority === 'medium'
                            ? 'primary'
                            : 'default'
                        }
                        size="small"
                      />
                    </Box>

                    <Chip
                      label={event.category}
                      color={getCategoryColor(event.category)}
                      size="small"
                      sx={{ mb: 2 }}
                    />

                    <List>
                      <ListItem sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <CalendarIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={formatDate(event.date)}
                          secondary="Tanggal"
                        />
                      </ListItem>

                      <ListItem sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <TimeIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={event.time} secondary="Waktu" />
                      </ListItem>

                      <ListItem sx={{ pl: 0 }}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <LocationIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={event.location}
                          secondary="Lokasi"
                        />
                      </ListItem>
                    </List>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {event.description}
                    </Typography>
                  </CardContent>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}
                  >
                    <Button
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog(event)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDeleteEvent(event.id)}
                      color="error"
                    >
                      Hapus
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Add/Edit Event Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? 'Edit Acara' : 'Tambah Acara Baru'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Judul Acara"
            name="title"
            value={newEvent.title}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Tanggal"
            name="date"
            type="date"
            value={newEvent.date}
            onChange={handleInputChange}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            required
          />

          <TextField
            fullWidth
            label="Waktu"
            name="time"
            value={newEvent.time}
            onChange={handleInputChange}
            margin="normal"
            placeholder="08:00 - 11:00"
            required
          />

          <TextField
            fullWidth
            label="Lokasi"
            name="location"
            value={newEvent.location}
            onChange={handleInputChange}
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Kategori</InputLabel>
            <Select
              name="category"
              value={newEvent.category}
              onChange={handleInputChange}
              label="Kategori"
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Prioritas</InputLabel>
            <Select
              name="priority"
              value={newEvent.priority}
              onChange={handleInputChange}
              label="Prioritas"
            >
              {priorities.map(priority => (
                <MenuItem key={priority.value} value={priority.value}>
                  {priority.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Deskripsi"
            name="description"
            value={newEvent.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmitEvent}
            variant="contained"
            disabled={!newEvent.title || !newEvent.date || !newEvent.time}
          >
            {editingEvent ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Events;
