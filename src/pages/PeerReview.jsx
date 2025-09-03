import {
  RateReview as RateReviewIcon,
  Star as StarIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useDataContext } from '../contexts/DataContext';
import { useProjectContext } from '../contexts/ProjectContext';

const PeerReview = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { students, currentUser } = useDataContext();
  const { getAllProjects, addPeerReview, getPeerReviews } = useProjectContext();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [openReviewDialog, setOpenReviewDialog] = useState(false);
  const [reviewData, setReviewData] = useState({
    reviewerId: currentUser?.id || 1,
    rating: 0,
    comment: '',
    criteria: {
      creativity: 0,
      technicalSkill: 0,
      presentation: 0,
      functionality: 0,
    },
  });

  // Get all projects except those created by the current user
  useEffect(() => {
    const allProjects = getAllProjects();
    const filteredProjects = allProjects.filter(
      project => project.studentId !== (currentUser?.id || 1)
    );
    setProjects(filteredProjects);
  }, [getAllProjects, currentUser]);

  const handleOpenReviewDialog = project => {
    setSelectedProject(project);
    setOpenReviewDialog(true);
  };

  const handleCloseReviewDialog = () => {
    setOpenReviewDialog(false);
    setSelectedProject(null);
    setReviewData({
      reviewerId: currentUser?.id || 1,
      rating: 0,
      comment: '',
      criteria: {
        creativity: 0,
        technicalSkill: 0,
        presentation: 0,
        functionality: 0,
      },
    });
  };

  const handleRatingChange = newValue => {
    setReviewData(prev => ({ ...prev, rating: newValue }));
  };

  const handleCriteriaChange = (criteriaName, value) => {
    setReviewData(prev => ({
      ...prev,
      criteria: {
        ...prev.criteria,
        [criteriaName]: value,
      },
    }));
  };

  const handleCommentChange = e => {
    setReviewData(prev => ({ ...prev, comment: e.target.value }));
  };

  const handleSubmitReview = () => {
    if (selectedProject && reviewData.rating > 0) {
      addPeerReview(selectedProject.id, {
        ...reviewData,
        projectId: selectedProject.id,
      });

      handleCloseReviewDialog();
    }
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const getAverageRating = projectId => {
    const reviews = getPeerReviews(projectId);
    if (reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getReviewCount = projectId => {
    return getPeerReviews(projectId).length;
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/projects')}
            sx={{ mb: 2 }}
          >
            ← Kembali ke Proyek
          </Button>
          <Typography variant="h4" gutterBottom>
            Peer Review Proyek
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Berikan penilaian dan umpan balik untuk proyek teman sekelas
          </Typography>
        </Box>

        {projects.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <WorkIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Tidak Ada Proyek untuk Direview
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Saat ini tidak ada proyek dari teman sekelas yang dapat Anda
                review.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/projects')}>
                Lihat Semua Proyek
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {projects.map(project => (
              <Grid item xs={12} md={6} key={project.id}>
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
                        <Typography variant="h6" gutterBottom>
                          {project.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          oleh {getStudentName(project.studentId)}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <StarIcon
                            sx={{ color: 'gold', fontSize: '1rem', mr: 0.5 }}
                          />
                          <Typography variant="body2">
                            {getAverageRating(project.id)} (
                            {getReviewCount(project.id)} review)
                          </Typography>
                        </Box>
                        <Chip
                          label={project.subject}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {project.description}
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
                        {new Date(project.createdAt).toLocaleDateString(
                          'id-ID'
                        )}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenReviewDialog(project)}
                      >
                        Beri Review
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Review Dialog */}
      <Dialog
        open={openReviewDialog}
        onClose={handleCloseReviewDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RateReviewIcon sx={{ mr: 1 }} />
            Beri Review untuk "{selectedProject?.title}"
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                oleh {getStudentName(selectedProject.studentId)}
              </Typography>

              {/* Overall Rating */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Penilaian Keseluruhan
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    my: 2,
                  }}
                >
                  <Rating
                    value={reviewData.rating}
                    onChange={(event, newValue) => handleRatingChange(newValue)}
                    size="large"
                  />
                  <Typography variant="h5" sx={{ ml: 2 }}>
                    {reviewData.rating}.0
                  </Typography>
                </Box>
              </Box>

              {/* Detailed Criteria */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Kriteria Penilaian
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Kreativitas</FormLabel>
                      <RadioGroup
                        row
                        value={reviewData.criteria.creativity}
                        onChange={e =>
                          handleCriteriaChange(
                            'creativity',
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <FormControlLabel
                            key={value}
                            value={value}
                            control={<Radio />}
                            label={value}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">
                        Keterampilan Teknis
                      </FormLabel>
                      <RadioGroup
                        row
                        value={reviewData.criteria.technicalSkill}
                        onChange={e =>
                          handleCriteriaChange(
                            'technicalSkill',
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <FormControlLabel
                            key={value}
                            value={value}
                            control={<Radio />}
                            label={value}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Presentasi</FormLabel>
                      <RadioGroup
                        row
                        value={reviewData.criteria.presentation}
                        onChange={e =>
                          handleCriteriaChange(
                            'presentation',
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <FormControlLabel
                            key={value}
                            value={value}
                            control={<Radio />}
                            label={value}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Fungsionalitas</FormLabel>
                      <RadioGroup
                        row
                        value={reviewData.criteria.functionality}
                        onChange={e =>
                          handleCriteriaChange(
                            'functionality',
                            parseInt(e.target.value)
                          )
                        }
                      >
                        {[1, 2, 3, 4, 5].map(value => (
                          <FormControlLabel
                            key={value}
                            value={value}
                            control={<Radio />}
                            label={value}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              {/* Comment */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Komentar
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Berikan komentar dan saran untuk proyek ini..."
                  value={reviewData.comment}
                  onChange={handleCommentChange}
                />
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewDialog}>Batal</Button>
          <Button
            onClick={handleSubmitReview}
            variant="contained"
            disabled={reviewData.rating === 0}
          >
            Kirim Review
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PeerReview;
