import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
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
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useCalendarContext } from '../../contexts/CalendarContext';

const ManageCalendar = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    category: 'Akademik',
    priority: 'medium',
  });

  // Log access activity
  useEffect(() => {
    addActivity(
      'Mengakses Kelola Kalender',
      'User membuka halaman kelola kalender'
    );
  }, [addActivity]);

  const handleOpenDialog = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description,
        category: event.category,
        priority: event.priority,
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: '',
        time: '',
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

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.title || !formData.date) {
      addNotification('Harap lengkapi field yang wajib diisi!', 'error');
      return;
    }

    const eventData = {
      ...formData,
    };

    if (editingEvent) {
      // Update existing event
      updateEvent(editingEvent.id, eventData);
      addNotification('Acara berhasil diperbarui!', 'success');
      addActivity(
        'Memperbarui acara kalender',
        `Acara diperbarui: ${formData.title}`
      );
    } else {
      // Add new event
      addEvent(eventData);
      addNotification('Acara berhasil ditambahkan!', 'success');
      addActivity(
        'Menambah acara kalender',
        `Acara baru ditambahkan: ${formData.title}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus acara "${title}"?`)) {
      deleteEvent(id);
      addNotification('Acara berhasil dihapus!', 'success');
      addActivity('Menghapus acara kalender', `Acara dihapus: ${title}`);
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryColor = category => {
    switch (category) {
      case 'Akademik':
        return 'primary';
      case 'Kegiatan':
        return 'secondary';
      case 'Tugas':
        return 'success';
      default:
        return 'default';
    }
  };

  const getPriorityLabel = priority => {
    switch (priority) {
      case 'high':
        return 'Tinggi';
      case 'medium':
        return 'Sedang';
      case 'low':
        return 'Rendah';
      default:
        return 'Tidak Diketahui';
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
            Kelola Kalender
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Tambah Acara
          </Button>
        </Box>

        {/* Statistics Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Kalender</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {events.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Acara
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="secondary">
                      {events.filter(e => e.category === 'Akademik').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Acara Akademik
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
                      {events.filter(e => e.category === 'Tugas').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Tugas
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
                      {events.filter(e => e.category === 'Kegiatan').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Kegiatan
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {events.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <CalendarIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Belum ada acara yang ditambahkan
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Mulai dengan menambahkan acara pertama
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Tambah Acara Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Judul</TableCell>
                  <TableCell>Tanggal & Waktu</TableCell>
                  <TableCell>Kategori</TableCell>
                  <TableCell>Prioritas</TableCell>
                  <TableCell>Deskripsi</TableCell>
                  <TableCell align="center">Aksi</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map(event => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <Typography variant="h6">{event.title}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date(event.date).toLocaleDateString('id-ID')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.category}
                        color={getCategoryColor(event.category)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={getPriorityLabel(event.priority)}
                        color={getPriorityColor(event.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {event.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(event)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(event.id, event.title)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Judul Acara"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Tanggal"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
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
              type="time"
              value={formData.time}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />

            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Kategori</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Kategori"
              >
                <MenuItem value="Akademik">Akademik</MenuItem>
                <MenuItem value="Kegiatan">Kegiatan</MenuItem>
                <MenuItem value="Tugas">Tugas</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Prioritas</InputLabel>
              <Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                label="Prioritas"
              >
                <MenuItem value="high">Tinggi</MenuItem>
                <MenuItem value="medium">Sedang</MenuItem>
                <MenuItem value="low">Rendah</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.date}
          >
            {editingEvent ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageCalendar;
