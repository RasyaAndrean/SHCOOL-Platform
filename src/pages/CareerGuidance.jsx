import {
  Explore as ExploreIcon,
  Favorite as FavoriteIcon,
  School as SchoolIcon,
  Search as SearchIcon,
  Work as WorkIcon,
  TrendingUp as TrendingUpIcon,
  FilterList as FilterListIcon,
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
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useCareerContext } from '../contexts/CareerContext';
import { useDataContext } from '../contexts/DataContext';

const CareerGuidance = ({ darkMode, toggleDarkMode }) => {
  const {
    careers,
    interests,
    studentInterests,
    careerPaths,
    setStudentInterest,
    getRecommendedCareers,
    searchCareers,
    getCareersByInterest,
  } = useCareerContext();
  const { students } = useDataContext();
  const { addNotification } = useAppContext();
  const navigate = useNavigate();
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [recommendedCareers, setRecommendedCareers] = useState([]);
  const [userInterest, setUserInterest] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCareers, setFilteredCareers] = useState([]);
  const [selectedInterest, setSelectedInterest] = useState('all');
  const [selectedGrowth, setSelectedGrowth] = useState('all');

  useEffect(() => {
    // Get the current user's interest
    const student = students.find(s => s.name === currentUser);
    const interestId = student ? studentInterests[student.id] : null;
    const interest = interestId
      ? interests.find(i => i.id === interestId)
      : null;

    setUserInterest(interest);

    // Get recommended careers based on interest
    if (student) {
      const recCareers = getRecommendedCareers(student.id);
      setRecommendedCareers(recCareers);
    }
  }, [
    currentUser,
    students,
    studentInterests,
    interests,
    getRecommendedCareers,
  ]);

  useEffect(() => {
    // Filter careers based on search query and filters
    let result = careers;
    
    // Apply search filter
    if (searchQuery) {
      result = searchCareers(searchQuery);
    }
    
    // Apply interest filter
    if (selectedInterest !== 'all') {
      result = getCareersByInterest(selectedInterest);
    }
    
    // Apply growth filter
    if (selectedGrowth !== 'all') {
      result = result.filter(career => career.growth === selectedGrowth);
    }
    
    setFilteredCareers(result);
  }, [searchQuery, selectedInterest, selectedGrowth, careers, searchCareers, getCareersByInterest]);

  const handleSetInterest = interestId => {
    const student = students.find(s => s.name === currentUser);
    if (student) {
      setStudentInterest(student.id, interestId);
      addNotification(
        `Minat Anda telah diatur ke ${
          interests.find(i => i.id === interestId)?.name
        }`,
        'success'
      );

      // Update recommended careers
      const recCareers = getRecommendedCareers(student.id);
      setRecommendedCareers(recCareers);

      // Also update user interest state
      setUserInterest(interests.find(i => i.id === interestId));
    }
  };

  const getGrowthColor = growth => {
    switch (growth) {
      case 'Sangat Tinggi':
        return 'success';
      case 'Tinggi':
        return 'primary';
      case 'Menengah':
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
            Bimbingan Karir
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Jelajahi peluang karir di bidang Teknik Komputer dan Jaringan
          </Typography>
        </Box>

        {/* Interest Selection */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <FavoriteIcon sx={{ mr: 1 }} />
              Minat Anda
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography variant="body1" sx={{ mb: 2 }}>
              {userInterest
                ? `Minat Anda saat ini: ${userInterest.icon} ${userInterest.name}`
                : 'Pilih minat Anda untuk mendapatkan rekomendasi karir yang sesuai'}
            </Typography>

            <Grid container spacing={1}>
              {interests.map(interest => (
                <Grid item key={interest.id}>
                  <Chip
                    label={`${interest.icon} ${interest.name}`}
                    onClick={() => handleSetInterest(interest.id)}
                    color={
                      userInterest?.id === interest.id ? 'primary' : 'default'
                    }
                    variant={
                      userInterest?.id === interest.id ? 'filled' : 'outlined'
                    }
                    sx={{ m: 0.5 }}
                  />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Cari karir, keterampilan, atau bidang pekerjaan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Filter berdasarkan Minat</InputLabel>
                  <Select
                    value={selectedInterest}
                    label="Filter berdasarkan Minat"
                    onChange={e => setSelectedInterest(e.target.value)}
                  >
                    <MenuItem value="all">Semua Minat</MenuItem>
                    {interests.map(interest => (
                      <MenuItem key={interest.id} value={interest.id}>
                        {interest.icon} {interest.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Filter berdasarkan Pertumbuhan</InputLabel>
                  <Select
                    value={selectedGrowth}
                    label="Filter berdasarkan Pertumbuhan"
                    onChange={e => setSelectedGrowth(e.target.value)}
                  >
                    <MenuItem value="all">Semua Tingkat Pertumbuhan</MenuItem>
                    <MenuItem value="Sangat Tinggi">Sangat Tinggi</MenuItem>
                    <MenuItem value="Tinggi">Tinggi</MenuItem>
                    <MenuItem value="Menengah">Menengah</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Recommended Careers */}
        {userInterest && recommendedCareers.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <ExploreIcon sx={{ mr: 1 }} />
                Rekomendasi Karir untuk Anda
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                {recommendedCareers.map(career => (
                  <Grid item xs={12} md={6} key={career.id}>
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
                        image={career.imageUrl}
                        alt={career.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {career.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {career.description}
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>
                          Keterampilan yang Dibutuhkan:
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {career.skills.slice(0, 3).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>

                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2">
                              Pendidikan:
                            </Typography>
                            <Typography variant="body2">
                              {career.education}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2">Gaji:</Typography>
                            <Typography variant="body2">
                              {career.salary}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="subtitle2">
                              Pertumbuhan:
                            </Typography>
                            <Chip
                              label={career.growth}
                              size="small"
                              color={getGrowthColor(career.growth)}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => navigate(`/career/${career.id}`)}
                        >
                          Selengkapnya
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* All Careers */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WorkIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Semua Peluang Karir ({filteredCareers.length})
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {filteredCareers.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Tidak ada karir yang sesuai dengan filter yang dipilih
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredCareers.map(career => (
                  <Grid item xs={12} sm={6} md={4} key={career.id}>
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
                        image={career.imageUrl}
                        alt={career.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {career.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {career.description.substring(0, 100)}...
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                          {career.skills.slice(0, 2).map((skill, index) => (
                            <Chip
                              key={index}
                              label={skill}
                              size="small"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        </Box>

                        <Chip
                          label={career.growth}
                          size="small"
                          color={getGrowthColor(career.growth)}
                        />
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          onClick={() => navigate(`/career/${career.id}`)}
                        >
                          Selengkapnya
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Career Paths */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <TrendingUpIcon sx={{ mr: 1 }} />
              Jalur Karir
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {careerPaths.map(path => (
                <Grid item xs={12} md={6} key={path.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {path.id}. {path.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {path.description}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Durasi: {path.duration} | Sertifikasi:{' '}
                          {path.certification.join(', ')}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Karir Terkait:
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {path.careers.map(careerId => {
                            const career = careers.find(c => c.id === careerId);
                            return career ? (
                              <Chip
                                key={careerId}
                                label={career.title}
                                size="small"
                                variant="outlined"
                                onClick={() => navigate(`/career/${careerId}`)}
                                sx={{ cursor: 'pointer' }}
                              />
                            ) : null;
                          })}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Bimbingan Karir
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Kenali Minat
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pilih minat Anda untuk mendapatkan rekomendasi karir yang
                  sesuai dengan bakat dan passion Anda.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Eksplorasi Karir
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Jelajahi berbagai peluang karir di bidang TKJ untuk memahami
                  persyaratan dan prospeknya.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Perencanaan Masa Depan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan informasi ini untuk merencanakan pendidikan dan
                  sertifikasi yang akan membantu karir Anda.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default CareerGuidance;