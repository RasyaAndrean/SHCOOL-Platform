import {
  Article as ArticleIcon,
  AudioFile as AudioIcon,
  Book as BookIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
  Category as CategoryIcon,
  Description as DocumentIcon,
  Download as DownloadIcon,
  LibraryBooks as LibraryIcon,
  NewReleases as NewIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  TrendingUp as TrendingIcon,
  VideoLibrary as VideoIcon,
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
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
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
import { useLibraryContext } from '../contexts/LibraryContext';

const Library = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const {
    libraryItems,
    bookmarks,
    searchItems,
    incrementDownloadCount,
    getPopularItems,
    getRecentItems,
    getBookmarkedItems,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useLibraryContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [sortOption, setSortOption] = useState('default');

  const categories = [
    { id: 'all', name: 'Semua', icon: <CategoryIcon /> },
    { id: 'Pemrograman', name: 'Pemrograman', icon: <BookIcon /> },
    { id: 'Jaringan', name: 'Jaringan', icon: <LibraryIcon /> },
    { id: 'Desain', name: 'Desain', icon: <ArticleIcon /> },
    { id: 'Sistem Operasi', name: 'Sistem Operasi', icon: <DocumentIcon /> },
    { id: 'Database', name: 'Database', icon: <VideoIcon /> },
  ];

  const types = [
    { id: 'book', name: 'Buku', icon: <BookIcon /> },
    { id: 'document', name: 'Dokumen', icon: <DocumentIcon /> },
    { id: 'video', name: 'Video', icon: <VideoIcon /> },
    { id: 'audio', name: 'Audio', icon: <AudioIcon /> },
  ];

  const sortOptions = [
    { id: 'default', name: 'Default' },
    { id: 'title', name: 'Judul (A-Z)' },
    { id: 'titleDesc', name: 'Judul (Z-A)' },
    { id: 'downloads', name: 'Terpopuler' },
    { id: 'publishedYear', name: 'Terbaru' },
  ];

  // Toggle bookmark status
  const toggleBookmark = resourceId => {
    if (isBookmarked(resourceId)) {
      removeBookmark(resourceId);
      addNotification('Item dihapus dari bookmark', 'info');
    } else {
      addBookmark(resourceId);
      addNotification('Item ditambahkan ke bookmark', 'success');
    }
  };

  // Get filtered resources based on tab and filters
  const getFilteredResources = () => {
    let resources = [];

    switch (tabValue) {
      case 0: // Catalog
        if (searchQuery) {
          resources = searchItems(searchQuery);
        } else {
          resources =
            selectedCategory === 'all'
              ? libraryItems
              : libraryItems.filter(
                  resource => resource.category === selectedCategory
                );
        }
        break;
      case 1: // Popular
        resources = getPopularItems();
        break;
      case 2: // Recent
        resources = getRecentItems();
        break;
      case 3: // Bookmarks
        resources = getBookmarkedItems();
        break;
      default:
        resources = libraryItems;
    }

    // Apply sorting
    switch (sortOption) {
      case 'title':
        return [...resources].sort((a, b) => a.title.localeCompare(b.title));
      case 'titleDesc':
        return [...resources].sort((a, b) => b.title.localeCompare(a.title));
      case 'downloads':
        return [...resources].sort(
          (a, b) => (b.downloads || 0) - (a.downloads || 0)
        );
      case 'publishedYear':
        return [...resources].sort((a, b) => b.publishedYear - a.publishedYear);
      default:
        return resources;
    }
  };

  const filteredResources = getFilteredResources();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = resource => {
    setSelectedResource(resource);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedResource(null);
  };

  const handleDownload = resource => {
    incrementDownloadCount(resource.id);
    addNotification(`"${resource.title}" sedang diunduh...`, 'info');
    // In a real app, this would trigger the actual download
  };

  const getTypeIcon = type => {
    const typeObj = types.find(t => t.id === type);
    return typeObj ? typeObj.icon : <LibraryIcon />;
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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Perpustakaan Digital
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Koleksi buku, modul, video, dan materi pembelajaran untuk kelas XI
            TKJ
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Cari buku, penulis, atau topik..."
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
            <Grid item xs={6} md={3}>
              <TextField
                select
                fullWidth
                label="Kategori"
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                disabled={tabValue !== 0} // Only enable category filter for catalog tab
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
            <Grid item xs={6} md={3}>
              <FormControl fullWidth>
                <Select
                  value={sortOption}
                  onChange={e => setSortOption(e.target.value)}
                  displayEmpty
                  startAdornment={<SortIcon sx={{ mr: 1 }} />}
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab icon={<LibraryIcon />} label="Katalog" />
          <Tab icon={<TrendingIcon />} label="Terpopuler" />
          <Tab icon={<NewIcon />} label="Terbaru" />
          <Tab icon={<BookmarkIcon />} label="Bookmark" />
        </Tabs>

        {filteredResources.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <LibraryIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Tidak ada resource yang ditemukan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tabValue === 3
                ? 'Anda belum memiliki bookmark. Tandai item dengan ikon bookmark untuk menyimpannya di sini.'
                : 'Coba ubah kata kunci pencarian atau kategori'}
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
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                    },
                    position: 'relative',
                  }}
                  onClick={() => handleOpenDialog(resource)}
                >
                  <IconButton
                    sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
                    onClick={e => {
                      e.stopPropagation();
                      toggleBookmark(resource.id);
                    }}
                  >
                    {isBookmarked(resource.id) ? (
                      <BookmarkIcon color="primary" />
                    ) : (
                      <BookmarkBorderIcon />
                    )}
                  </IconButton>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      resource.cover ||
                      `https://source.unsplash.com/random/800x600/?${resource.category},${resource.type}`
                    }
                    alt={resource.title}
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
                      <Typography gutterBottom variant="h6" component="div">
                        {resource.title}
                      </Typography>
                      <Chip
                        icon={getTypeIcon(resource.type)}
                        label={getTypeLabel(resource.type)}
                        size="small"
                        color={getTypeColor(resource.type)}
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {resource.description.substring(0, 100)}...
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        oleh {resource.author}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <DownloadIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">
                          {resource.downloads || 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Resource Detail Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md">
          {selectedResource && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h5" component="div" sx={{ flexGrow: 1 }}>
                    {selectedResource.title}
                  </Typography>
                  <IconButton
                    onClick={() => toggleBookmark(selectedResource.id)}
                    sx={{ mr: 1 }}
                  >
                    {isBookmarked(selectedResource.id) ? (
                      <BookmarkIcon color="primary" />
                    ) : (
                      <BookmarkBorderIcon />
                    )}
                  </IconButton>
                  <Chip
                    icon={getTypeIcon(selectedResource.type)}
                    label={getTypeLabel(selectedResource.type)}
                    color={getTypeColor(selectedResource.type)}
                  />
                </Box>
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <img
                      src={
                        selectedResource.cover ||
                        `https://source.unsplash.com/random/800x600/?${selectedResource.category},${selectedResource.type}`
                      }
                      alt={selectedResource.title}
                      style={{
                        width: '100%',
                        borderRadius: 8,
                        maxHeight: 300,
                        objectFit: 'cover',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Typography variant="body1" paragraph>
                      {selectedResource.description}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">Penulis:</Typography>
                        <Typography variant="body2">
                          {selectedResource.author}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">Kategori:</Typography>
                        <Typography variant="body2">
                          {selectedResource.category}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">Tipe:</Typography>
                        <Typography variant="body2">
                          {getTypeLabel(selectedResource.type)}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">
                          Tahun Terbit:
                        </Typography>
                        <Typography variant="body2">
                          {selectedResource.publishedYear}
                        </Typography>
                      </Grid>
                      {selectedResource.pages && (
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">Halaman:</Typography>
                          <Typography variant="body2">
                            {selectedResource.pages}
                          </Typography>
                        </Grid>
                      )}
                      {selectedResource.duration && (
                        <Grid item xs={6}>
                          <Typography variant="subtitle2">Durasi:</Typography>
                          <Typography variant="body2">
                            {selectedResource.duration}
                          </Typography>
                        </Grid>
                      )}
                      <Grid item xs={6}>
                        <Typography variant="subtitle2">Unduhan:</Typography>
                        <Typography variant="body2">
                          {selectedResource.downloads || 0}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>Tutup</Button>
                <Button
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  onClick={() => handleDownload(selectedResource)}
                >
                  Unduh
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>

      <Footer />
    </div>
  );
};

export default Library;
