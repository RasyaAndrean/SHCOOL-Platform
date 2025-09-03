import {
  Add as AddIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Code as CodeIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  VideoLibrary as VideoLibraryIcon,
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
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Link as MuiLink,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';

const Resources = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { resources, addResource } = useDataContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document',
    link: '',
  });
  const [tabValue, setTabValue] = useState(0);

  // Sample additional resources data
  const additionalResources = [
    {
      id: 5,
      title: 'Modul Sistem Operasi',
      description: 'Modul lengkap tentang sistem operasi Windows dan Linux',
      type: 'document',
      link: '#',
    },
    {
      id: 6,
      title: 'Tutorial Troubleshooting',
      description:
        'Video tutorial tentang cara mengatasi masalah teknis komputer',
      type: 'video',
      link: '#',
    },
    {
      id: 7,
      title: 'Template Project',
      description: 'Template dasar untuk memulai project pemrograman',
      type: 'code',
      link: '#',
    },
    {
      id: 8,
      title: 'E-Book Keamanan Jaringan',
      description: 'E-book tentang keamanan jaringan dan best practices',
      type: 'document',
      link: '#',
    },
  ];

  const allResources = [...resources, ...additionalResources];

  const usefulLinks = [
    {
      id: 1,
      title: 'W3Schools',
      url: 'https://www.w3schools.com/',
      description: 'Tutorial dan referensi web development',
    },
    {
      id: 2,
      title: 'GitHub',
      url: 'https://github.com/',
      description: 'Platform untuk hosting dan kolaborasi kode',
    },
    {
      id: 3,
      title: 'Stack Overflow',
      url: 'https://stackoverflow.com/',
      description: 'Komunitas untuk programmer',
    },
    {
      id: 4,
      title: 'Cisco Networking Academy',
      url: 'https://www.netacad.com/',
      description: 'Pelatihan jaringan komputer',
    },
    {
      id: 5,
      title: 'Khan Academy',
      url: 'https://www.khanacademy.org/',
      description: 'Platform pembelajaran online gratis',
    },
    {
      id: 6,
      title: 'MDN Web Docs',
      url: 'https://developer.mozilla.org/',
      description: 'Dokumentasi web development terpercaya',
    },
  ];

  const categories = [
    { id: 'all', name: 'Semua', icon: <CategoryIcon /> },
    { id: 'document', name: 'Dokumen', icon: <BookIcon /> },
    { id: 'video', name: 'Video', icon: <VideoLibraryIcon /> },
    { id: 'code', name: 'Kode', icon: <CodeIcon /> },
  ];

  const filteredResources = allResources.filter(resource => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || resource.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getIcon = type => {
    switch (type) {
      case 'document':
        return <BookIcon />;
      case 'video':
        return <VideoLibraryIcon />;
      case 'code':
        return <CodeIcon />;
      default:
        return <DownloadIcon />;
    }
  };

  const getTypeLabel = type => {
    switch (type) {
      case 'document':
        return 'Dokumen';
      case 'video':
        return 'Video';
      case 'code':
        return 'Kode';
      default:
        return 'Lainnya';
    }
  };

  const getTypeColor = type => {
    switch (type) {
      case 'document':
        return 'primary';
      case 'video':
        return 'secondary';
      case 'code':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewResource({
      title: '',
      description: '',
      type: 'document',
      link: '',
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitResource = () => {
    if (newResource.title && newResource.description && newResource.link) {
      addResource({
        ...newResource,
        id: Date.now(),
      });
      handleCloseDialog();
      addNotification('Sumber belajar berhasil ditambahkan!', 'success');
    } else {
      addNotification('Harap lengkapi semua field!', 'error');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Sumber Belajar
        </Typography>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Materi Pembelajaran" />
          <Tab label="Tautan Bermanfaat" />
        </Tabs>

        {tabValue === 0 && (
          <>
            <Box sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h5" gutterBottom>
                  Materi Pembelajaran
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                >
                  Tambah Sumber
                </Button>
              </Box>
              <Typography variant="body1" paragraph>
                Kumpulan materi, tutorial, dan sumber belajar untuk mendukung
                pembelajaran di kelas XI TKJ.
              </Typography>
            </Box>

            {/* Search and Filter */}
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Cari materi pembelajaran..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label="Kategori"
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {category.icon}
                          <span style={{ marginLeft: 8 }}>{category.name}</span>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>

            {/* Category Chips */}
            <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {categories.map(category => (
                <Chip
                  key={category.id}
                  label={category.name}
                  icon={category.icon}
                  onClick={() => setSelectedCategory(category.id)}
                  color={
                    selectedCategory === category.id ? 'primary' : 'default'
                  }
                  variant={
                    selectedCategory === category.id ? 'filled' : 'outlined'
                  }
                />
              ))}
            </Box>

            {filteredResources.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Tidak ada sumber belajar yang ditemukan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Coba ubah kata kunci pencarian atau kategori
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={4}>
                {filteredResources.map(resource => (
                  <Grid item xs={12} sm={6} md={4} key={resource.id}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        boxShadow: 3,
                        borderRadius: 2,
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          <ListItemIcon>{getIcon(resource.type)}</ListItemIcon>
                          <Typography gutterBottom variant="h6" component="h2">
                            {resource.title}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {resource.description}
                        </Typography>
                        <Chip
                          label={getTypeLabel(resource.type)}
                          color={getTypeColor(resource.type)}
                          size="small"
                        />
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          component={MuiLink}
                          href={resource.link}
                          target="_blank"
                          startIcon={<DownloadIcon />}
                          sx={{ ml: 'auto' }}
                        >
                          Unduh
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {tabValue === 1 && (
          <>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" gutterBottom>
                Tautan Bermanfaat
              </Typography>
              <Typography variant="body1" paragraph>
                Kumpulan website dan platform yang bisa membantu dalam proses
                belajar.
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {usefulLinks.map(link => (
                <Grid item xs={12} sm={6} md={4} key={link.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {link.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        component={MuiLink}
                        href={link.url}
                        target="_blank"
                        sx={{ ml: 'auto' }}
                      >
                        Kunjungi
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>

      {/* Add Resource Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <UploadIcon sx={{ mr: 1 }} />
            Tambah Sumber Belajar
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Judul"
            name="title"
            value={newResource.title}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Deskripsi"
            name="description"
            value={newResource.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipe</InputLabel>
            <Select
              name="type"
              value={newResource.type}
              onChange={handleInputChange}
              label="Tipe"
            >
              <MenuItem value="document">Dokumen</MenuItem>
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="code">Kode</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Tautan"
            name="link"
            value={newResource.link}
            onChange={handleInputChange}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmitResource}
            variant="contained"
            disabled={
              !newResource.title ||
              !newResource.description ||
              !newResource.link
            }
          >
            Tambah
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Resources;
