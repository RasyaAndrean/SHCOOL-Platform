import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

const ManageAnnouncements = ({ darkMode, toggleDarkMode }) => {
  const {
    announcements,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  } = useDataContext();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    category: '',
    content: '',
    image: '',
  });

  const handleOpenDialog = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        date: announcement.date,
        category: announcement.category,
        content: announcement.content,
        image: announcement.image,
      });
      addActivity(
        'Membuka form edit pengumuman',
        `Mengedit pengumuman: ${announcement.title}`
      );
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        date: '',
        category: '',
        content: '',
        image: '',
      });
      addActivity(
        'Membuka form tambah pengumuman',
        'Membuka form untuk menambah pengumuman baru'
      );
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAnnouncement(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingAnnouncement) {
      updateAnnouncement(editingAnnouncement.id, formData);
      addNotification('Pengumuman berhasil diperbarui!', 'success');
      addActivity(
        'Memperbarui pengumuman',
        `Pengumuman diperbarui: ${formData.title}`
      );
    } else {
      addAnnouncement(formData);
      addNotification('Pengumuman berhasil ditambahkan!', 'success');
      addActivity(
        'Menambah pengumuman',
        `Pengumuman baru ditambahkan: ${formData.title}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = id => {
    const announcementToDelete = announcements.find(a => a.id === id);
    if (window.confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
      deleteAnnouncement(id);
      addNotification('Pengumuman berhasil dihapus!', 'success');
      addActivity(
        'Menghapus pengumuman',
        `Pengumuman dihapus: ${announcementToDelete?.title || 'Unknown'}`
      );
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
            Kelola Pengumuman
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Tambah Pengumuman
          </Button>
        </Box>

        <Grid container spacing={4}>
          {announcements.map(announcement => (
            <Grid item xs={12} md={6} key={announcement.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={announcement.image}
                  alt={announcement.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography gutterBottom variant="h6" component="h2">
                      {announcement.title}
                    </Typography>
                    <Chip
                      label={announcement.category}
                      color={
                        announcement.category === 'Akademik'
                          ? 'primary'
                          : announcement.category === 'Kegiatan'
                          ? 'secondary'
                          : announcement.category === 'Tugas'
                          ? 'success'
                          : 'info'
                      }
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {announcement.date}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {announcement.content}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(announcement)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(announcement.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAnnouncement ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Judul"
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
              value={formData.date}
              onChange={handleChange}
              margin="normal"
              required
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
                <MenuItem value="Pengumuman">Pengumuman</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="URL Gambar"
              name="image"
              value={formData.image}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Konten"
              name="content"
              value={formData.content}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingAnnouncement ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageAnnouncements;
