import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Card,
  CardActions,
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
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';

const ManageResources = ({ darkMode, toggleDarkMode }) => {
  const { resources, addResource, updateResource, deleteResource } =
    useDataContext();
  const { addNotification } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    link: '',
  });

  const handleOpenDialog = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setFormData({
        title: resource.title,
        description: resource.description,
        type: resource.type,
        link: resource.link,
      });
    } else {
      setEditingResource(null);
      setFormData({
        title: '',
        description: '',
        type: '',
        link: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingResource(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingResource) {
      updateResource(editingResource.id, formData);
      addNotification('Sumber belajar berhasil diperbarui!', 'success');
    } else {
      addResource(formData);
      addNotification('Sumber belajar berhasil ditambahkan!', 'success');
    }

    handleCloseDialog();
  };

  const handleDelete = id => {
    if (
      window.confirm('Apakah Anda yakin ingin menghapus sumber belajar ini?')
    ) {
      deleteResource(id);
      addNotification('Sumber belajar berhasil dihapus!', 'success');
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
            Kelola Sumber Belajar
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
          >
            Tambah Sumber
          </Button>
        </Box>

        <Grid container spacing={4}>
          {resources.map(resource => (
            <Grid item xs={12} sm={6} md={4} key={resource.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {resource.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {resource.description}
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    Tipe: {resource.type}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(resource)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(resource.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
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
          {editingResource ? 'Edit Sumber Belajar' : 'Tambah Sumber Belajar'}
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
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipe</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Tipe"
              >
                <MenuItem value="document">Dokumen</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="code">Kode</MenuItem>
                <MenuItem value="link">Tautan</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="URL"
              name="link"
              value={formData.link}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingResource ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageResources;
