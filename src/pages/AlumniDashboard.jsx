import {
  Book as BookIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
  Star as StarIcon,
  Work as WorkIcon,
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
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useActivityContext } from '../contexts/ActivityContext';
import { useAlumniContext } from '../contexts/AlumniContext';

const AlumniDashboard = ({ darkMode, toggleDarkMode }) => {
  const {
    alumni,
    careerResources,
    jobOpportunities,
    getAvailableMentors,
    getUpcomingEvents,
    getRecentCareerResources,
    getRecentSuccessStories,
    getRecentJobOpportunities,
  } = useAlumniContext();
  const { addActivity } = useActivityContext();
  const navigate = useNavigate();
  const [availableMentors, setAvailableMentors] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [recentStories, setRecentStories] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);

  useEffect(() => {
    addActivity(
      'Mengakses Dashboard Alumni',
      'User membuka halaman dashboard alumni'
    );

    setAvailableMentors(getAvailableMentors());
    setUpcomingEvents(getUpcomingEvents());
    setRecentResources(getRecentCareerResources(3));
    setRecentStories(getRecentSuccessStories(2));
    setRecentJobs(getRecentJobOpportunities(3));
  }, [
    addActivity,
    getAvailableMentors,
    getUpcomingEvents,
    getRecentCareerResources,
    getRecentSuccessStories,
    getRecentJobOpportunities,
  ]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Dashboard Alumni
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Jelajahi jaringan alumni, kesempatan karir, dan sumber daya
            pengembangan profesional
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    mb: 2,
                  }}
                >
                  <GroupIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {alumni.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Alumni Terdaftar
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'secondary.light',
                    mb: 2,
                  }}
                >
                  <StarIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {availableMentors.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Mentor Tersedia
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    mb: 2,
                  }}
                >
                  <WorkIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {jobOpportunities.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Kesempatan Kerja
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'warning.light',
                    mb: 2,
                  }}
                >
                  <BookIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {careerResources.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sumber Daya Karir
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Success Stories */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <EmojiEventsIcon sx={{ mr: 1 }} />
                Kisah Sukses Alumni
              </Typography>
              <Button size="small" onClick={() => navigate('/alumni-network')}>
                Lihat Semua
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {recentStories.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <EmojiEventsIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                />
                <Typography color="text.secondary">
                  Belum ada kisah sukses alumni
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {recentStories.map(story => {
                  const alumniData = alumni.find(a => a.id === story.alumniId);
                  return (
                    <Grid item xs={12} md={6} key={story.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={story.image}
                          alt={story.title}
                        />
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {story.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {story.content}
                          </Typography>
                          {alumniData && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 2,
                              }}
                            >
                              <img
                                src={alumniData.photo}
                                alt={alumniData.name}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  marginRight: 10,
                                }}
                              />
                              <Typography variant="subtitle2">
                                {alumniData.name}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Available Mentors */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <StarIcon sx={{ mr: 1 }} />
                    Mentor yang Tersedia
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/alumni-network')}
                  >
                    Lihat Semua
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {availableMentors.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <GroupIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Tidak ada mentor yang tersedia saat ini
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {availableMentors.slice(0, 3).map(alumnus => (
                      <Grid item xs={12} key={alumnus.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <img
                                src={alumnus.photo}
                                alt={alumnus.name}
                                style={{
                                  width: 50,
                                  height: 50,
                                  borderRadius: '50%',
                                  marginRight: 15,
                                }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {alumnus.name}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {alumnus.currentPosition}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              {alumnus.expertise
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <Chip
                                    key={index}
                                    label={skill}
                                    size="small"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              onClick={() => navigate(`/alumni/${alumnus.id}`)}
                            >
                              Lihat Profil
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Upcoming Events */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <CalendarIcon sx={{ mr: 1 }} />
                    Acara Alumni Mendatang
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/alumni-network')}
                  >
                    Lihat Semua
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {upcomingEvents.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <CalendarIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Tidak ada acara alumni yang dijadwalkan
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {upcomingEvents.slice(0, 3).map(event => (
                      <Grid item xs={12} key={event.id}>
                        <Card>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {event.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                            >
                              {event.description.substring(0, 80)}...
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <CalendarIcon sx={{ fontSize: 16, mr: 1 }} />
                              <Typography variant="caption">
                                {event.date} | {event.time}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <WorkIcon sx={{ fontSize: 16, mr: 1 }} />
                              <Typography variant="caption">
                                {event.venue}
                              </Typography>
                            </Box>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              variant="outlined"
                              href={event.registrationLink}
                            >
                              Daftar
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Career Resources */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <BookIcon sx={{ mr: 1 }} />
                    Sumber Daya Karir
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/alumni-network')}
                  >
                    Lihat Semua
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {recentResources.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <BookIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada sumber daya karir
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {recentResources.map(resource => (
                      <Grid item xs={12} key={resource.id}>
                        <Card>
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 1,
                              }}
                            >
                              <Typography variant="subtitle2">
                                {resource.title}
                              </Typography>
                              <Chip
                                label={resource.category}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                            >
                              {resource.description}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              variant="outlined"
                              href={resource.link}
                            >
                              Baca Selengkapnya
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Job Opportunities */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <BusinessIcon sx={{ mr: 1 }} />
                    Kesempatan Kerja
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/alumni-network')}
                  >
                    Lihat Semua
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {recentJobs.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 3 }}>
                    <BusinessIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada kesempatan kerja
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {recentJobs.map(job => (
                      <Grid item xs={12} key={job.id}>
                        <Card>
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 1,
                              }}
                            >
                              <Box>
                                <Typography variant="subtitle2">
                                  {job.title}
                                </Typography>
                                <Typography variant="caption" color="primary">
                                  {job.company} • {job.location}
                                </Typography>
                              </Box>
                              <Chip
                                label={job.salary}
                                size="small"
                                color="success"
                              />
                            </Box>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                            >
                              {job.description.substring(0, 80)}...
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Deadline: {job.deadline}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button variant="contained" size="small">
                              Lamar Sekarang
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Jaringan Alumni
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Hubungi Alumni
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tombol kontak untuk menghubungi alumni melalui email,
                  telepon, atau LinkedIn.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Minta Mentoring
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ajukan permintaan mentoring kepada alumni yang tersedia untuk
                  mendapatkan bimbingan karir.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Ikuti Acara
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hadiri acara alumni untuk mendapatkan wawasan dan memperluas
                  jaringan profesional Anda.
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

export default AlumniDashboard;
