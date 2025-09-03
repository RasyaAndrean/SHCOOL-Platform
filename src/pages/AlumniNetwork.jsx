import {
  Book as BookIcon,
  Business as BusinessIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
  LinkedIn as LinkedInIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAlumniContext } from '../contexts/AlumniContext';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';

const AlumniNetwork = ({ darkMode, toggleDarkMode }) => {
  const {
    alumni,
    getAvailableMentors,
    requestMentoring,
    getUpcomingEvents,
    getRecentCareerResources,
    getRecentSuccessStories,
    getRecentJobOpportunities,
  } = useAlumniContext();
  const { students } = useDataContext();
  const { addNotification } = useAppContext();
  const navigate = useNavigate();
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [availableMentors, setAvailableMentors] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentResources, setRecentResources] = useState([]);
  const [recentStories, setRecentStories] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [openMentorDialog, setOpenMentorDialog] = useState(false);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [mentorRequest, setMentorRequest] = useState({
    message: '',
    preferredMeeting: 'online',
  });
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setAvailableMentors(getAvailableMentors());
    setUpcomingEvents(getUpcomingEvents());
    setRecentResources(getRecentCareerResources(3));
    setRecentStories(getRecentSuccessStories(2));
    setRecentJobs(getRecentJobOpportunities(3));
  }, [
    getAvailableMentors,
    getUpcomingEvents,
    getRecentCareerResources,
    getRecentSuccessStories,
    getRecentJobOpportunities,
  ]);

  const handleOpenMentorDialog = alumnus => {
    setSelectedAlumni(alumnus);
    setOpenMentorDialog(true);
  };

  const handleCloseMentorDialog = () => {
    setOpenMentorDialog(false);
    setSelectedAlumni(null);
    setMentorRequest({
      message: '',
      preferredMeeting: 'online',
    });
  };

  const handleMentorRequestChange = e => {
    const { name, value } = e.target;
    setMentorRequest(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitMentorRequest = () => {
    if (!mentorRequest.message.trim()) {
      addNotification('Harap isi pesan permintaan mentoring', 'warning');
      return;
    }

    const student = students.find(s => s.name === currentUser);

    const requestData = {
      studentId: student ? student.id : null,
      studentName: currentUser,
      alumniId: selectedAlumni.id,
      alumniName: selectedAlumni.name,
      message: mentorRequest.message,
      preferredMeeting: mentorRequest.preferredMeeting,
    };

    requestMentoring(requestData);
    addNotification('Permintaan mentoring berhasil dikirim', 'success');
    handleCloseMentorDialog();
  };

  const handleContactAlumni = (alumnus, method) => {
    addNotification(`Menghubungi ${alumnus.name} melalui ${method}`, 'info');
    // In a real app, this would open email client or LinkedIn profile
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Jaringan Alumni
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Terhubung dengan alumni sukses dan dapatkan bimbingan karir
          </Typography>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Beranda" icon={<SchoolIcon />} iconPosition="start" />
            <Tab label="Mentor" icon={<StarIcon />} iconPosition="start" />
            <Tab label="Acara" icon={<CalendarIcon />} iconPosition="start" />
            <Tab label="Karir" icon={<WorkIcon />} iconPosition="start" />
            <Tab label="Sumber Daya" icon={<BookIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box>
            {/* Success Stories */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <EmojiEventsIcon sx={{ mr: 1 }} />
                  Kisah Sukses Alumni
                </Typography>
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
                      const alumniData = alumni.find(
                        a => a.id === story.alumniId
                      );
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

            {/* Career Resources */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <BookIcon sx={{ mr: 1 }} />
                  Sumber Daya Karir
                </Typography>
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
                      <Grid item xs={12} sm={6} md={4} key={resource.id}>
                        <Card sx={{ height: '100%' }}>
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
                            <Button
                              size="small"
                              variant="outlined"
                              href={resource.link}
                            >
                              Baca Selengkapnya
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>

            {/* Job Opportunities */}
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <BusinessIcon sx={{ mr: 1 }} />
                  Kesempatan Kerja
                </Typography>
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
                  <Grid container spacing={3}>
                    {recentJobs.map(job => (
                      <Grid item xs={12} key={job.id}>
                        <Card>
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2,
                              }}
                            >
                              <Box>
                                <Typography variant="h6">
                                  {job.title}
                                </Typography>
                                <Typography variant="subtitle1" color="primary">
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
                              {job.description}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Persyaratan:
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                }}
                              >
                                {job.requirements.map((req, index) => (
                                  <Chip
                                    key={index}
                                    label={req}
                                    size="small"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Diposting: {job.postedDate} • Deadline:{' '}
                                {job.deadline}
                              </Typography>
                              <Button variant="contained" size="small">
                                Lamar Sekarang
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Box>
        )}

        {activeTab === 1 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <StarIcon sx={{ mr: 1 }} />
                Mentor yang Tersedia
              </Typography>
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
                <Grid container spacing={3}>
                  {availableMentors.map(alumnus => (
                    <Grid item xs={12} sm={6} md={4} key={alumnus.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={alumnus.photo}
                          alt={alumnus.name}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h6" component="div">
                            {alumnus.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.primary"
                            paragraph
                          >
                            {alumnus.currentPosition}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {alumnus.company}
                          </Typography>

                          <Typography variant="subtitle2" gutterBottom>
                            Keahlian:
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {alumnus.expertise.map((skill, index) => (
                              <Chip
                                key={index}
                                label={skill}
                                size="small"
                                sx={{ m: 0.5 }}
                              />
                            ))}
                          </Box>

                          <Typography variant="subtitle2" gutterBottom>
                            Prestasi:
                          </Typography>
                          <List dense>
                            {alumnus.achievements
                              .slice(0, 2)
                              .map((achievement, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 24 }}>
                                    <StarIcon sx={{ fontSize: 16 }} />
                                  </ListItemIcon>
                                  <ListItemText primary={achievement} />
                                </ListItem>
                              ))}
                          </List>
                        </CardContent>
                        <CardActions>
                          <Button
                            size="small"
                            onClick={() => handleOpenMentorDialog(alumnus)}
                          >
                            Minta Mentoring
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 2 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <CalendarIcon sx={{ mr: 1 }} />
                Acara Alumni Mendatang
              </Typography>
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
                <Grid container spacing={3}>
                  {upcomingEvents.map(event => (
                    <Grid item xs={12} md={6} key={event.id}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {event.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            paragraph
                          >
                            {event.description}
                          </Typography>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <PersonIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2">
                              Pembicara: {event.speaker}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <CalendarIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2">
                              {event.date} | {event.time}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <WorkIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2">
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
        )}

        {activeTab === 3 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <WorkIcon sx={{ mr: 1 }} />
                Kesempatan Karir
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {recentJobs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <BusinessIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Belum ada kesempatan karir
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={3}>
                  {recentJobs.map(job => (
                    <Grid item xs={12} key={job.id}>
                      <Card>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 2,
                            }}
                          >
                            <Box>
                              <Typography variant="h6">{job.title}</Typography>
                              <Typography variant="subtitle1" color="primary">
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
                            {job.description}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Persyaratan:
                            </Typography>
                            <Box
                              sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                            >
                              {job.requirements.map((req, index) => (
                                <Chip
                                  key={index}
                                  label={req}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Diposting: {job.postedDate} • Deadline:{' '}
                              {job.deadline}
                            </Typography>
                            <Button variant="contained" size="small">
                              Lamar Sekarang
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 4 && (
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <BookIcon sx={{ mr: 1 }} />
                Sumber Daya Karir
              </Typography>
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
                    <Grid item xs={12} sm={6} md={4} key={resource.id}>
                      <Card sx={{ height: '100%' }}>
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
                          <Button
                            size="small"
                            variant="outlined"
                            href={resource.link}
                          >
                            Baca Selengkapnya
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        )}

        {/* All Alumni */}
        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <SchoolIcon sx={{ mr: 1 }} />
                Semua Alumni
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={3}>
                {alumni.map(alumnus => (
                  <Grid item xs={12} sm={6} md={4} key={alumnus.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardMedia
                        component="img"
                        height="140"
                        image={alumnus.photo}
                        alt={alumnus.name}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h6" component="div">
                          {alumnus.name}
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                          {alumnus.currentPosition}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {alumnus.company} ({alumnus.graduationYear})
                        </Typography>

                        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleContactAlumni(alumnus, 'email')
                            }
                            color="primary"
                          >
                            <EmailIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleContactAlumni(alumnus, 'phone')
                            }
                            color="primary"
                          >
                            <PhoneIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleContactAlumni(alumnus, 'LinkedIn')
                            }
                            color="primary"
                          >
                            <LinkedInIcon fontSize="small" />
                          </IconButton>
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
            </CardContent>
          </Card>
        )}

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

      {/* Mentor Request Dialog */}
      <Dialog
        open={openMentorDialog}
        onClose={handleCloseMentorDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Minta Mentoring dari {selectedAlumni?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Pesan untuk Mentor"
              name="message"
              value={mentorRequest.message}
              onChange={handleMentorRequestChange}
              margin="normal"
              multiline
              rows={4}
              placeholder="Jelaskan tujuan mentoring Anda dan area yang ingin Anda kembangkan..."
              required
            />

            <TextField
              fullWidth
              label="Preferensi Pertemuan"
              name="preferredMeeting"
              value={mentorRequest.preferredMeeting}
              onChange={handleMentorRequestChange}
              margin="normal"
              select
              SelectProps={{ native: true }}
            >
              <option value="online">Online (Video Call)</option>
              <option value="offline">Offline (Tatap Muka)</option>
              <option value="flexible">Fleksibel</option>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseMentorDialog}>Batal</Button>
          <Button
            onClick={handleSubmitMentorRequest}
            variant="contained"
            disabled={!mentorRequest.message.trim()}
          >
            Kirim Permintaan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AlumniNetwork;
