import {
  Add as AddIcon,
  Bookmark as BookmarkIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
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
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useLibraryContext } from '../../contexts/LibraryContext';

const ManageLibrary = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const {
    libraryItems,
    bookmarks,
    addLibraryItem,
    updateLibraryItem,
    deleteLibraryItem,
  } = useLibraryContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    type: 'book',
    category: 'Pemrograman',
    description: '',
    cover: '',
    pages: '',
    duration: '',
    publishedYear: new Date().getFullYear(),
  });

  const categories = [
    'Pemrograman',
    'Jaringan',
    'Desain',
    'Sistem Operasi',
    'Database',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
  ];

  const types = [
    { id: 'book', name: 'Buku' },
    { id: 'document', name: 'Dokumen' },
    { id: 'video', name: 'Video' },
    { id: 'audio', name: 'Audio' },
  ];

  // Log access activity
  useEffect(() => {
    addActivity(
      'Mengakses Kelola Perpustakaan',
      'User membuka halaman kelola perpustakaan'
    );
  }, [addActivity]);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        author: item.author,
        type: item.type,
        category: item.category,
        description: item.description,
        cover: item.cover,
        pages: item.pages || '',
        duration: item.duration || '',
        publishedYear: item.publishedYear,
      });
      addActivity(
        'Membuka form edit item perpustakaan',
        `Mengedit item perpustakaan: ${item.title}`
      );
    } else {
      setEditingItem(null);
      setFormData({
        title: '',
        author: '',
        type: 'book',
        category: 'Pemrograman',
        description: '',
        cover: '',
        pages: '',
        duration: '',
        publishedYear: new Date().getFullYear(),
      });
      addActivity(
        'Membuka form tambah item perpustakaan',
        'Membuka form untuk menambah item perpustakaan baru'
      );
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingItem) {
      // Update existing item
      const updatedItem = {
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publishedYear: parseInt(formData.publishedYear),
      };

      updateLibraryItem(editingItem.id, updatedItem);

      addNotification('Item perpustakaan berhasil diperbarui!', 'success');
      addActivity(
        'Memperbarui item perpustakaan',
        `Item perpustakaan diperbarui: ${formData.title}`
      );
    } else {
      // Add new item
      const newItem = {
        ...formData,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publishedYear: parseInt(formData.publishedYear),
      };

      addLibraryItem(newItem);
      addNotification('Item perpustakaan berhasil ditambahkan!', 'success');
      addActivity(
        'Menambah item perpustakaan',
        `Item perpustakaan baru ditambahkan: ${formData.title}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = id => {
    const itemToDelete = libraryItems.find(item => item.id === id);
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      deleteLibraryItem(id);
      addNotification('Item perpustakaan berhasil dihapus!', 'success');
      addActivity(
        'Menghapus item perpustakaan',
        `Item perpustakaan dihapus: ${itemToDelete?.title || 'Unknown'}`
      );
    }
  };

  const getTypeLabel = type => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.name : 'Resource';
  };

  const getTypeColor = type => {
    switch (type) {
      case 'book':
        return 'primary';
      case 'document':
        return 'secondary';
      case 'video':
        return 'success';
      case 'audio':
        return 'warning';
      default:
        return 'default';
    }
  };

  // Get bookmark count for an item
  const getBookmarkCount = itemId => {
    return bookmarks.filter(id => id === itemId).length;
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
            Kelola Perpustakaan Digital
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Tambah Item
          </Button>
        </Box>

        <Grid container spacing={4}>
          {libraryItems.map(item => (
            <Grid item xs={12} md={6} lg={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.cover}
                  alt={item.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 1,
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      component="h2"
                      sx={{ mr: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Chip
                      label={getTypeLabel(item.type)}
                      color={getTypeColor(item.type)}
                      size="small"
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    oleh {item.author}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    paragraph
                    sx={{ minHeight: 60 }}
                  >
                    {item.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Kategori: {item.category}
                    </Typography>
                  </Box>

                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.type === 'book' || item.type === 'document'
                        ? `${item.pages} halaman`
                        : item.duration}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.publishedYear}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mt: 1,
                      pt: 1,
                      borderTop: '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    <BookmarkIcon
                      sx={{
                        fontSize: 16,
                        mr: 0.5,
                        color: 'primary.main',
                      }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {getBookmarkCount(item.id)} bookmark
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mx: 1 }}
                    >
                      •
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.downloads || 0} unduhan
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(item)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(item.id)}
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
          {editingItem ? 'Edit Item Perpustakaan' : 'Tambah Item Perpustakaan'}
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
              label="Penulis"
              name="author"
              value={formData.author}
              onChange={handleChange}
              margin="normal"
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipe</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Tipe"
              >
                {types.map(type => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Kategori</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Kategori"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <TextField
              fullWidth
              label="URL Cover"
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              margin="normal"
              placeholder="https://example.com/cover.jpg"
            />
            {(formData.type === 'book' || formData.type === 'document') && (
              <TextField
                fullWidth
                label="Jumlah Halaman"
                name="pages"
                type="number"
                value={formData.pages}
                onChange={handleChange}
                margin="normal"
              />
            )}
            {(formData.type === 'video' || formData.type === 'audio') && (
              <TextField
                fullWidth
                label="Durasi"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                margin="normal"
                placeholder="1h 30m"
              />
            )}
            <TextField
              fullWidth
              label="Tahun Terbit"
              name="publishedYear"
              type="number"
              value={formData.publishedYear}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={
              !formData.title || !formData.author || !formData.description
            }
          >
            {editingItem ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageLibrary;
