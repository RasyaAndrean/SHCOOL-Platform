import {
  BarChart as BarChartIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  RateReview as RateReviewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Rating,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { usePeerAssessmentContext } from '../contexts/PeerAssessmentContext';
import { useStudyGroupContext } from '../contexts/StudyGroupContext';

const PeerAssessment = ({ darkMode, toggleDarkMode }) => {
  const {
    criteria,
    createAssessment,
    getAssessmentsByStudent,
    calculateAverageScore,
    getAssessmentsByAssessor,
  } = usePeerAssessmentContext();
  const { students } = useDataContext();
  const { studyGroups } = useStudyGroupContext();
  const { addNotification } = useAppContext();
  const navigate = useNavigate();
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [comments, setComments] = useState('');
  const [ratings, setRatings] = useState({});
  const [receivedAssessments, setReceivedAssessments] = useState([]);
  const [givenAssessments, setGivenAssessments] = useState([]);

  useEffect(() => {
    // Initialize ratings with 0 for each criterion
    const initialRatings = {};
    criteria.forEach(criterion => {
      initialRatings[criterion.id] = 0;
    });
    setRatings(initialRatings);
  }, [criteria]);

  useEffect(() => {
    // Get assessments for the current user (received)
    const userReceivedAssessments = getAssessmentsByStudent(currentUser);
    setReceivedAssessments(userReceivedAssessments);

    // Get assessments given by the current user
    const userGivenAssessments = getAssessmentsByAssessor(currentUser);
    setGivenAssessments(userGivenAssessments);
  }, [currentUser, getAssessmentsByStudent, getAssessmentsByAssessor]);

  const handleRatingChange = (criterionId, value) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: value,
    }));
  };

  const handleSubmit = () => {
    if (!selectedStudent || !selectedGroup) {
      addNotification('Harap pilih siswa dan grup terlebih dahulu', 'warning');
      return;
    }

    // Check if all criteria are rated
    const unratedCriteria = criteria.filter(
      criterion => !ratings[criterion.id]
    );
    if (unratedCriteria.length > 0) {
      addNotification('Harap beri penilaian untuk semua kriteria', 'warning');
      return;
    }

    const assessmentData = {
      assessedStudentId: selectedStudent,
      groupId: selectedGroup,
      assessor: currentUser,
      ratings,
      comments,
      projectId:
        studyGroups.find(g => g.id === selectedGroup)?.projectId || null,
    };

    createAssessment(assessmentData);
    addNotification('Penilaian berhasil dikirim', 'success');

    // Reset form
    setSelectedStudent('');
    setSelectedGroup('');
    setComments('');
    const resetRatings = {};
    criteria.forEach(criterion => {
      resetRatings[criterion.id] = 0;
    });
    setRatings(resetRatings);
  };

  const getGroupMembers = groupId => {
    const group = studyGroups.find(g => g.id === groupId);
    return group ? group.members.filter(member => member !== currentUser) : [];
  };

  const averageReceivedScore = calculateAverageScore(receivedAssessments);
  const averageGivenScore = calculateAverageScore(givenAssessments);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Penilaian Teman
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Berikan penilaian terhadap kinerja teman dalam kelompok
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="primary">
                  {receivedAssessments.length}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Penilaian Diterima
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="secondary">
                  {averageReceivedScore}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Rata-rata Nilai
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="success">
                  {givenAssessments.length}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Penilaian Diberikan
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h4" color="info">
                  {averageGivenScore}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary">
                  Rata-rata yang Diberikan
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Assessment Form */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <RateReviewIcon sx={{ mr: 1 }} />
                  Form Penilaian
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Grup Belajar</InputLabel>
                      <Select
                        value={selectedGroup}
                        onChange={e => {
                          setSelectedGroup(e.target.value);
                          setSelectedStudent(''); // Reset student selection when group changes
                        }}
                        label="Grup Belajar"
                      >
                        {studyGroups.map(group => (
                          <MenuItem key={group.id} value={group.id}>
                            {group.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {selectedGroup && (
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Siswa</InputLabel>
                        <Select
                          value={selectedStudent}
                          onChange={e => setSelectedStudent(e.target.value)}
                          label="Siswa"
                        >
                          {getGroupMembers(selectedGroup).map(member => (
                            <MenuItem key={member} value={member}>
                              {member}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  <Grid item xs={12}>
                    <Typography variant="subtitle1" gutterBottom>
                      Kriteria Penilaian
                    </Typography>
                    {criteria.map(criterion => (
                      <Box key={criterion.id} sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {criterion.name} ({criterion.weight}%)
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mb: 1, display: 'block' }}
                        >
                          {criterion.description}
                        </Typography>
                        <Rating
                          value={ratings[criterion.id] || 0}
                          onChange={(event, value) =>
                            handleRatingChange(criterion.id, value)
                          }
                          icon={<StarIcon fontSize="inherit" />}
                          emptyIcon={<StarIcon fontSize="inherit" />}
                          size="large"
                        />
                      </Box>
                    ))}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Komentar"
                      multiline
                      rows={4}
                      value={comments}
                      onChange={e => setComments(e.target.value)}
                      placeholder="Tambahkan komentar atau masukan konstruktif..."
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={!selectedStudent || !selectedGroup}
                      fullWidth
                    >
                      Kirim Penilaian
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Assessment History */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <GroupIcon sx={{ mr: 1 }} />
                  Riwayat Penilaian Diterima
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {receivedAssessments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <RateReviewIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada penilaian yang diterima
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {receivedAssessments.map((assessment, index) => (
                      <Box key={assessment.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <IconButton sx={{ bgcolor: 'primary.light' }}>
                              <PersonIcon />
                            </IconButton>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography variant="subtitle1">
                                {assessment.assessor}
                              </Typography>
                            }
                            secondary={
                              <>
                                <Typography
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {assessment.comments || 'Tidak ada komentar'}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  {criteria.map(criterion => (
                                    <Box
                                      key={criterion.id}
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mb: 0.5,
                                      }}
                                    >
                                      <Typography
                                        variant="caption"
                                        sx={{ width: 120 }}
                                      >
                                        {criterion.name}:
                                      </Typography>
                                      <Rating
                                        value={
                                          assessment.ratings[criterion.id] || 0
                                        }
                                        readOnly
                                        size="small"
                                      />
                                    </Box>
                                  ))}
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                        {index < receivedAssessments.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Given Assessments */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <BarChartIcon sx={{ mr: 1 }} />
              Penilaian yang Anda Berikan
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {givenAssessments.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <RateReviewIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                />
                <Typography color="text.secondary">
                  Anda belum memberikan penilaian kepada teman
                </Typography>
              </Box>
            ) : (
              <List>
                {givenAssessments.map((assessment, index) => (
                  <Box key={assessment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <IconButton sx={{ bgcolor: 'secondary.light' }}>
                          <PersonIcon />
                        </IconButton>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {assessment.assessedStudentId}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              color="text.primary"
                              paragraph
                            >
                              {assessment.comments || 'Tidak ada komentar'}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              {criteria.map(criterion => (
                                <Box
                                  key={criterion.id}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 0.5,
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{ width: 120 }}
                                  >
                                    {criterion.name}:
                                  </Typography>
                                  <Rating
                                    value={
                                      assessment.ratings[criterion.id] || 0
                                    }
                                    readOnly
                                    size="small"
                                  />
                                </Box>
                              ))}
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    {index < givenAssessments.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Penilaian Teman
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Pilih Grup
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pilih grup belajar tempat Anda ingin memberikan penilaian
                  kepada teman.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Pilih Teman
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pilih teman dalam grup yang ingin Anda nilai berdasarkan
                  kriteria yang telah ditentukan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Beri Penilaian
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Berikan penilaian jujur dan konstruktif untuk setiap kriteria
                  serta tambahkan komentar jika diperlukan.
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

export default PeerAssessment;
