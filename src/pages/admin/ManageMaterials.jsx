import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  History as HistoryIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
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
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useMaterialContext } from '../../contexts/MaterialContext';

const ManageMaterials = ({ darkMode, toggleDarkMode }) => {
  const { logout } = useAppContext();
  const { addActivity } = useActivityContext();
  const {
    materials,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addVersion,
    getVersionsByMaterialId,
  } = useMaterialContext();

  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [openVersionDialog, setOpenVersionDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Jaringan Komputer',
    author: '',
    category: 'Modul',
    fileType: 'pdf',
    fileSize: '',
    tags: '',
  });
  const [versionData, setVersionData] = useState({
    version: '',
    changes: '',
    author: '',
  });

  const navigate = useNavigate();

  const subjects = [
    'Jaringan Komputer',
    'Pemrograman Web',
    'Sistem Operasi',
    'Database',
    'Multimedia',
    'Keamanan Jaringan',
    'Pemrograman Berorientasi Objek',
  ];

  const categories = [
    'Modul',
    'Presentasi',
    'Referensi',
    'Tugas',
    'Kuis',
    'Lainnya',
  ];

  const fileTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

  // Log access activity
  useEffect(() => {
    addActivity(
      'Mengakses Kelola Repositori Materi',
      'User membuka halaman kelola repositori materi'
    );
  }, [addActivity]);

  const handleLogout = () => {
    addActivity('Logout', 'User keluar dari sistem admin');
    logout();
    navigate('/');
  };

  const handleOpenDialog = (material = null) => {
    if (material) {
      setEditingMaterial(material);
      setFormData({
        title: material.title,
        description: material.description,
        subject: material.subject,
        author: material.author,
        category: material.category,
        fileType: material.fileType,
        fileSize: material.fileSize,
        tags: material.tags.join(', '),
      });
      addActivity(
        'Membuka form edit materi',
        `Mengedit materi: ${material.title}`
      );
    } else {
      setEditingMaterial(null);
      setFormData({
        title: '',
        description: '',
        subject: 'Jaringan Komputer',
        author: '',
        category: 'Modul',
        fileType: 'pdf',
        fileSize: '',
        tags: '',
      });
      addActivity(
        'Membuka form tambah materi',
        'Membuka form untuk menambah materi baru'
      );
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingMaterial(null);
  };

  const handleOpenVersionDialog = material => {
    setSelectedMaterial(material);
    setVersionData({
      version: '',
      changes: '',
      author: material.author,
    });
    setOpenVersionDialog(true);
    addActivity(
      'Membuka form tambah versi',
      `Menambah versi untuk materi: ${material.title}`
    );
  };

  const handleCloseVersionDialog = () => {
    setOpenVersionDialog(false);
    setSelectedMaterial(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVersionChange = e => {
    const { name, value } = e.target;
    setVersionData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const materialData = {
      ...formData,
      tags: formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag),
    };

    if (editingMaterial) {
      // Update existing material
      updateMaterial(editingMaterial.id, materialData);
      addActivity('Memperbarui materi', `Materi diperbarui: ${formData.title}`);
    } else {
      // Add new material
      addMaterial(materialData);
      addActivity(
        'Menambah materi',
        `Materi baru ditambahkan: ${formData.title}`
      );
    }

    handleCloseDialog();
  };

  const handleSubmitVersion = e => {
    e.preventDefault();

    if (selectedMaterial) {
      addVersion(selectedMaterial.id, versionData);
      addActivity(
        'Menambah versi materi',
        `Versi ${versionData.version} ditambahkan untuk: ${selectedMaterial.title}`
      );
    }

    handleCloseVersionDialog();
  };

  const handleDelete = (id, title) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus materi ini?')) {
      deleteMaterial(id);
      addActivity('Menghapus materi', `Materi dihapus: ${title}`);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFileTypeLabel = fileType => {
    switch (fileType) {
      case 'pdf':
        return 'PDF';
      case 'doc':
        return 'DOC';
      case 'docx':
        return 'DOCX';
      case 'ppt':
        return 'PPT';
      case 'pptx':
        return 'PPTX';
      default:
        return fileType.toUpperCase();
    }
  };

  const getFileTypeColor = fileType => {
    switch (fileType) {
      case 'pdf':
        return 'error';
      case 'doc':
      case 'docx':
        return 'primary';
      case 'ppt':
      case 'pptx':
        return 'secondary';
      default:
        return 'default';
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
          <Box>
            <Typography variant="h3" gutterBottom>
              Kelola Repositori Materi
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Kelola materi pembelajaran dengan riwayat versi
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenDialog()}
              startIcon={<AddIcon />}
              sx={{ mr: 2 }}
            >
              Tambah Materi
            </Button>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Semua Materi" />
          <Tab label="Dengan Versi" icon={<HistoryIcon />} />
        </Tabs>

        <Grid container spacing={4}>
          {materials
            .filter(
              material =>
                tabValue === 0 ||
                getVersionsByMaterialId(material.id).length > 1
            )
            .map(material => (
              <Grid item xs={12} md={6} lg={4} key={material.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
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
                        {material.title}
                      </Typography>
                      <Chip
                        label={getFileTypeLabel(material.fileType)}
                        color={getFileTypeColor(material.fileType)}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      oleh {material.author}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                      sx={{ minHeight: 60 }}
                    >
                      {material.description}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Chip
                        label={material.subject}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        v{material.version}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        mb: 1,
                      }}
                    >
                      {material.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                      {material.tags.length > 3 && (
                        <Chip
                          label={`+${material.tags.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <HistoryIcon sx={{ fontSize: 16, mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {getVersionsByMaterialId(material.id).length} versi
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenVersionDialog(material)}
                      title="Tambah versi"
                    >
                      <UploadIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(material)}
                      sx={{ mr: 1 }}
                      title="Edit materi"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(material.id, material.title)}
                      title="Hapus materi"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
        </Grid>
      </Container>

      {/* Add/Edit Material Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingMaterial ? 'Edit Materi' : 'Tambah Materi'}
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
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Mata Pelajaran</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                label="Mata Pelajaran"
              >
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipe File</InputLabel>
              <Select
                name="fileType"
                value={formData.fileType}
                onChange={handleChange}
                label="Tipe File"
              >
                {fileTypes.map(type => (
                  <MenuItem key={type} value={type}>
                    {getFileTypeLabel(type)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Ukuran File"
              name="fileSize"
              value={formData.fileSize}
              onChange={handleChange}
              margin="normal"
              placeholder="Contoh: 2.4 MB"
            />
            <TextField
              fullWidth
              label="Tags (pisahkan dengan koma)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              margin="normal"
              placeholder="Contoh: jaringan, konfigurasi, troubleshooting"
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
              !formData.title || !formData.description || !formData.author
            }
          >
            {editingMaterial ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Version Dialog */}
      <Dialog
        open={openVersionDialog}
        onClose={handleCloseVersionDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedMaterial && (
          <>
            <DialogTitle>
              Tambah Versi untuk "{selectedMaterial.title}"
            </DialogTitle>
            <DialogContent>
              <Box
                component="form"
                onSubmit={handleSubmitVersion}
                sx={{ pt: 2 }}
              >
                <TextField
                  fullWidth
                  label="Versi"
                  name="version"
                  value={versionData.version}
                  onChange={handleVersionChange}
                  margin="normal"
                  placeholder="Contoh: 1.1, 2.0"
                  required
                />
                <TextField
                  fullWidth
                  label="Perubahan"
                  name="changes"
                  value={versionData.changes}
                  onChange={handleVersionChange}
                  margin="normal"
                  multiline
                  rows={3}
                  required
                />
                <TextField
                  fullWidth
                  label="Penulis"
                  name="author"
                  value={versionData.author}
                  onChange={handleVersionChange}
                  margin="normal"
                  required
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseVersionDialog}>Batal</Button>
              <Button
                onClick={handleSubmitVersion}
                variant="contained"
                color="primary"
                disabled={
                  !versionData.version ||
                  !versionData.changes ||
                  !versionData.author
                }
              >
                Tambah Versi
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageMaterials;
