import {
  Article as ArticleIcon,
  Description as DocumentIcon,
  CloudDownload as DownloadIcon,
  History as HistoryIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Tag as TagIcon,
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
  Grid,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useMaterialContext } from '../contexts/MaterialContext';

const Materials = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const {
    materials,
    incrementDownloadCount,
    searchMaterials,
    getVersionsByMaterialId,
  } = useMaterialContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const subjects = [...new Set(materials.map(material => material.subject))];
  const categories = [...new Set(materials.map(material => material.category))];

  const filteredMaterials = materials.filter(material => {
    // Search filter
    const matchesSearch = searchQuery
      ? material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        material.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        material.tags.some(tag =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true;

    // Subject filter
    const matchesSubject =
      selectedSubject === 'all' || material.subject === selectedSubject;

    // Category filter
    const matchesCategory =
      selectedCategory === 'all' || material.category === selectedCategory;

    return matchesSearch && matchesSubject && matchesCategory;
  });

  const handleOpenDialog = material => {
    setSelectedMaterial(material);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMaterial(null);
  };

  const handleDownload = material => {
    incrementDownloadCount(material.id);
    addNotification(`"${material.title}" sedang diunduh...`, 'info');
    // In a real app, this would trigger the actual download
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getFileIcon = fileType => {
    switch (fileType) {
      case 'pdf':
        return <DocumentIcon />;
      case 'doc':
      case 'docx':
        return <ArticleIcon />;
      default:
        return <DocumentIcon />;
    }
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
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Repositori Materi Kelas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kumpulan materi pembelajaran dengan riwayat versi dan kolaborasi
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Cari materi, subjek, atau tag..."
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
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Mata Pelajaran"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
              >
                <MenuItem value="all">Semua Mata Pelajaran</MenuItem>
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select
                fullWidth
                label="Kategori"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Semua Kategori</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Semua Materi" icon={<SchoolIcon />} />
          <Tab label="Terbaru" icon={<HistoryIcon />} />
        </Tabs>

        {filteredMaterials.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Tidak ada materi yang ditemukan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Coba ubah kata kunci pencarian atau filter
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredMaterials.map(material => (
              <Grid item xs={12} sm={6} md={4} key={material.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => handleOpenDialog(material)}
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
                        icon={getFileIcon(material.fileType)}
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
                          icon={<TagIcon />}
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
                  </CardContent>

                  <Box sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={e => {
                        e.stopPropagation();
                        handleDownload(material);
                      }}
                    >
                      Unduh ({material.downloadCount})
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Material Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedMaterial && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {getFileIcon(selectedMaterial.fileType)}
                {selectedMaterial.title}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Typography variant="h6" gutterBottom>
                    oleh {selectedMaterial.author}
                  </Typography>

                  <Typography variant="body1" paragraph>
                    {selectedMaterial.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Tags:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {selectedMaterial.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          icon={<TagIcon />}
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Mata Pelajaran
                      </Typography>
                      <Chip label={selectedMaterial.subject} size="small" />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Kategori
                      </Typography>
                      <Chip label={selectedMaterial.category} size="small" />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Tipe File
                      </Typography>
                      <Chip
                        label={getFileTypeLabel(selectedMaterial.fileType)}
                        color={getFileTypeColor(selectedMaterial.fileType)}
                        size="small"
                        icon={getFileIcon(selectedMaterial.fileType)}
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Ukuran File
                      </Typography>
                      <Typography variant="body2">
                        {selectedMaterial.fileSize}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Versi
                      </Typography>
                      <Typography variant="body2">
                        v{selectedMaterial.version}
                      </Typography>
                    </Grid>

                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Terakhir Diupdate
                      </Typography>
                      <Typography variant="body2">
                        {selectedMaterial.lastUpdated}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        <HistoryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Riwayat Versi
                      </Typography>

                      {getVersionsByMaterialId(selectedMaterial.id).length >
                      0 ? (
                        <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                          {getVersionsByMaterialId(selectedMaterial.id)
                            .slice()
                            .reverse()
                            .map((version, index) => (
                              <Box
                                key={version.id}
                                sx={{
                                  mb: 2,
                                  pb: 2,
                                  borderBottom:
                                    index <
                                    getVersionsByMaterialId(selectedMaterial.id)
                                      .length -
                                      1
                                      ? 1
                                      : 0,
                                  borderColor: 'divider',
                                }}
                              >
                                <Typography variant="subtitle2">
                                  v{version.version} - {version.releaseDate}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  oleh {version.author}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>
                                  {version.changes}
                                </Typography>
                              </Box>
                            ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Tidak ada riwayat versi
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Tutup</Button>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(selectedMaterial)}
              >
                Unduh ({selectedMaterial.downloadCount})
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default Materials;
