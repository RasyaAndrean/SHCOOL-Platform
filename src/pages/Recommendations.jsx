import {
  AutoAwesome as AutoAwesomeIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useProgressContext } from '../contexts/ProgressContext';
import { useRecommendationContext } from '../contexts/RecommendationContext';

const Recommendations = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { progressData } = useProgressContext();
  const {
    generateRecommendations,
    completeRecommendation,
    getRecommendationsByPriority,
    getActiveRecommendations,
  } = useRecommendationContext();

  const [activeTab, setActiveTab] = useState('all');

  // Generate recommendations when progress data changes
  useEffect(() => {
    generateRecommendations();
  }, [progressData]);

  const handleRefreshRecommendations = () => {
    generateRecommendations();
    addNotification('Rekomendasi berhasil diperbarui!', 'success');
  };

  const handleCompleteRecommendation = id => {
    completeRecommendation(id);
    addNotification('Rekomendasi ditandai sebagai selesai!', 'success');
  };

  const getFilteredRecommendations = () => {
    switch (activeTab) {
      case 'high':
        return getRecommendationsByPriority('high');
      case 'medium':
        return getRecommendationsByPriority('medium');
      case 'all':
      default:
        return getActiveRecommendations();
    }
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredRecommendations = getFilteredRecommendations();
  const highPriorityCount = getRecommendationsByPriority('high').length;
  const mediumPriorityCount = getRecommendationsByPriority('medium').length;
  const totalActiveCount = getActiveRecommendations().length;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Rekomendasi Belajar
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Rekomendasi personal untuk meningkatkan hasil belajarmu
          </Typography>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshRecommendations}
            sx={{ mr: 2 }}
          >
            Perbarui Rekomendasi
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AutoAwesomeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Rekomendasi</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalActiveCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AutoAwesomeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Prioritas Tinggi</Typography>
                </Box>
                <Typography variant="h4" align="center" color="error">
                  {highPriorityCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <AutoAwesomeIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Prioritas Sedang</Typography>
                </Box>
                <Typography variant="h4" align="center" color="warning">
                  {mediumPriorityCount}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filter Tabs */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={`Semua (${totalActiveCount})`}
            onClick={() => setActiveTab('all')}
            variant={activeTab === 'all' ? 'filled' : 'outlined'}
            color="primary"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`Prioritas Tinggi (${highPriorityCount})`}
            onClick={() => setActiveTab('high')}
            variant={activeTab === 'high' ? 'filled' : 'outlined'}
            color="error"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`Prioritas Sedang (${mediumPriorityCount})`}
            onClick={() => setActiveTab('medium')}
            variant={activeTab === 'medium' ? 'filled' : 'outlined'}
            color="warning"
          />
        </Box>

        {/* Recommendations List */}
        {filteredRecommendations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AutoAwesomeIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Tidak ada rekomendasi
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeTab === 'all'
                ? 'Sistem tidak menemukan rekomendasi berdasarkan progress belajarmu saat ini.'
                : 'Tidak ada rekomendasi dengan prioritas ini.'}
            </Typography>
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rekomendasi untukmu
              </Typography>
              <List>
                {filteredRecommendations.map(recommendation => (
                  <ListItem
                    key={recommendation.id}
                    sx={{
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 2,
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        mb: 1,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={recommendation.subject}
                          secondary={recommendation.message}
                        />
                      </Box>
                      <Chip
                        label={
                          recommendation.priority === 'high'
                            ? 'Tinggi'
                            : recommendation.priority === 'medium'
                            ? 'Sedang'
                            : 'Rendah'
                        }
                        color={getPriorityColor(recommendation.priority)}
                        size="small"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {recommendation.action}
                      </Typography>
                      <IconButton
                        onClick={() =>
                          handleCompleteRecommendation(recommendation.id)
                        }
                        color="success"
                        size="small"
                      >
                        <CheckCircleIcon />
                      </IconButton>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cara Menggunakan Rekomendasi
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Tinjau Rekomendasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Periksa rekomendasi yang disediakan berdasarkan progress
                  belajarmu.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Prioritaskan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fokus pada rekomendasi dengan prioritas tinggi terlebih
                  dahulu.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Tandai Selesai
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Setelah mengikuti rekomendasi, tandai sebagai selesai dengan
                  ikon centang.
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

export default Recommendations;
