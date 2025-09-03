import {
  EmojiEvents as EmojiEventsIcon,
  MilitaryTech as MilitaryTechIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { useActivityContext } from '../contexts/ActivityContext';
import { useDataContext } from '../contexts/DataContext';
import useAchievementContext from '../hooks/useAchievementContext';

const Achievements = ({ darkMode, toggleDarkMode }) => {
  const { addActivity } = useActivityContext();
  const { currentUser } = useDataContext();
  const {
    getAchievementsByStudent,
    getBadgesByStudent,
    getUnearnedBadgesByStudent,
  } = useAchievementContext();

  const currentUserId = currentUser?.id || 1;

  // Log activity when accessing achievements page
  useEffect(() => {
    addActivity(
      'Mengakses Prestasi',
      'User membuka halaman prestasi dan pencapaian'
    );
  }, [addActivity]);

  const earnedBadges = getBadgesByStudent(currentUserId);
  const unearnedBadges = getUnearnedBadgesByStudent(currentUserId);
  const achievements = getAchievementsByStudent(currentUserId);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom align="center">
            Prestasi & Pencapaian
          </Typography>
          <Typography variant="h6" color="text.secondary" align="center">
            Lihat dan lacak pencapaian akademik Anda
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <MilitaryTechIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">{earnedBadges.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Lencana Diperoleh
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEventsIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">{achievements.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Prestasi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4">{unearnedBadges.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Lencana Belum Diperoleh
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Earned Badges Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <MilitaryTechIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Lencana yang Telah Diperoleh</Typography>
          </Box>

          {earnedBadges.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <MilitaryTechIcon
                  sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Belum Ada Lencana
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Terus belajar dan berpartisipasi untuk mendapatkan lencana
                  pertama Anda!
                </Typography>
                <Chip
                  label="Terus Semangat!"
                  color="primary"
                  variant="outlined"
                />
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {earnedBadges.map(badge => (
                <Grid item xs={12} sm={6} md={4} key={badge.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                      textAlign: 'center',
                      border: '2px solid',
                      borderColor: 'primary.main',
                      bgcolor: 'primary.light',
                    }}
                  >
                    <Box sx={{ fontSize: '3rem', mb: 2 }}>{badge.icon}</Box>
                    <Typography variant="h6" gutterBottom>
                      {badge.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {badge.description}
                    </Typography>
                    <Chip label="Diperoleh" color="success" size="small" />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Unearned Badges Section */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <SchoolIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Lencana yang Belum Diperoleh</Typography>
          </Box>

          {unearnedBadges.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <EmojiEventsIcon
                  sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Semua Lencana Telah Diperoleh!
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Luar biasa! Anda telah memperoleh semua lencana yang tersedia.
                </Typography>
                <Chip label="Selamat!" color="success" variant="outlined" />
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {unearnedBadges.map(badge => (
                <Grid item xs={12} sm={6} md={4} key={badge.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                      textAlign: 'center',
                      opacity: 0.7,
                    }}
                  >
                    <Box sx={{ fontSize: '3rem', mb: 2 }}>{badge.icon}</Box>
                    <Typography variant="h6" gutterBottom>
                      {badge.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {badge.description}
                    </Typography>
                    <Chip
                      label="Belum Diperoleh"
                      color="default"
                      size="small"
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Achievements Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <EmojiEventsIcon sx={{ mr: 1 }} />
            <Typography variant="h5">Prestasi Terbaru</Typography>
          </Box>

          {achievements.length === 0 ? (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 6 }}>
                <EmojiEventsIcon
                  sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Belum Ada Prestasi
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Terus berprestasi untuk menambah koleksi prestasi Anda!
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {achievements.slice(0, 6).map(achievement => (
                <Grid item xs={12} md={6} key={achievement.id}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <EmojiEventsIcon sx={{ mr: 1, color: 'gold' }} />
                        <Typography variant="h6">
                          {achievement.title}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {achievement.description}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2,
                        }}
                      >
                        <Chip
                          label={achievement.category}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date(achievement.earnedAt).toLocaleDateString(
                            'id-ID'
                          )}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Achievements;
