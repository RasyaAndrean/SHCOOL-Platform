import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Rating,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import { usePeerAssessmentContext } from '../../contexts/PeerAssessmentContext';
import { useStudyGroupContext } from '../../contexts/StudyGroupContext';

const PeerAssessmentDetail = ({ darkMode, toggleDarkMode }) => {
  const { studentId, projectId } = useParams();
  const { assessments, criteria, calculateAverageScore } =
    usePeerAssessmentContext();
  const { students } = useDataContext();
  const { studyGroups } = useStudyGroupContext();
  const { addActivity } = useActivityContext();
  const navigate = useNavigate();
  const [studentAssessments, setStudentAssessments] = useState([]);
  const [student, setStudent] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    addActivity(
      'Mengakses Detail Penilaian Teman',
      `User membuka halaman detail penilaian untuk siswa ${studentId} pada proyek ${projectId}`
    );

    // Find the student
    const foundStudent = students.find(s => s.id === parseInt(studentId));
    setStudent(foundStudent);

    // Find the project
    const foundProject = studyGroups.find(
      g => g.projectId === parseInt(projectId)
    );
    setProject(foundProject);

    // Get assessments for this student and project
    const filteredAssessments = assessments.filter(
      assessment =>
        assessment.assessedStudentId === foundStudent?.name &&
        assessment.projectId === parseInt(projectId)
    );
    setStudentAssessments(filteredAssessments);
  }, [studentId, projectId, students, studyGroups, assessments, addActivity]);

  const handleBack = () => {
    navigate('/admin/peer-assessment');
  };

  const averageScore = calculateAverageScore(studentAssessments);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Kembali
          </Button>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" gutterBottom>
              Detail Penilaian Teman
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {student?.name} - {project?.projectName || `Proyek ${projectId}`}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Student Info and Summary */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <IconButton
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.light',
                      mb: 2,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                  <Typography variant="h5" gutterBottom>
                    {student?.name}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {student?.role || 'Siswa'}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {averageScore}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    Rata-rata Nilai
                  </Typography>
                  <Chip
                    label={
                      averageScore >= 80
                        ? 'Sangat Baik'
                        : averageScore >= 60
                        ? 'Baik'
                        : 'Perlu Perbaikan'
                    }
                    color={
                      averageScore >= 80
                        ? 'success'
                        : averageScore >= 60
                        ? 'primary'
                        : 'warning'
                    }
                    sx={{ mt: 1 }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Statistik:
                  </Typography>
                  <Typography variant="body2">
                    Jumlah Penilaian: {studentAssessments.length}
                  </Typography>
                  <Typography variant="body2">
                    Kriteria Penilaian: {criteria.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Detailed Assessments */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Penilaian dari Teman
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {studentAssessments.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      Belum ada penilaian untuk siswa ini
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {studentAssessments.map((assessment, index) => (
                      <Box key={assessment.id}>
                        <ListItem alignItems="flex-start">
                          <ListItemAvatar>
                            <IconButton sx={{ bgcolor: 'secondary.light' }}>
                              <PersonIcon />
                            </IconButton>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box
                                sx={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Typography variant="subtitle1">
                                  {assessment.assessor}
                                </Typography>
                                <Chip
                                  label={calculateAverageScore([assessment])}
                                  color="primary"
                                  size="small"
                                />
                              </Box>
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
                                        sx={{ width: 150 }}
                                      >
                                        {criterion.name}:
                                      </Typography>
                                      <Rating
                                        value={
                                          assessment.ratings[criterion.id] || 0
                                        }
                                        readOnly
                                        size="small"
                                        icon={<StarIcon fontSize="inherit" />}
                                        emptyIcon={
                                          <StarIcon fontSize="inherit" />
                                        }
                                      />
                                      <Typography
                                        variant="caption"
                                        sx={{ ml: 1 }}
                                      >
                                        ({assessment.ratings[criterion.id] || 0}
                                        )
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              </>
                            }
                          />
                        </ListItem>
                        {index < studentAssessments.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Criteria Summary */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Ringkasan Berdasarkan Kriteria
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {criteria.map(criterion => {
                // Calculate average rating for this criterion
                const ratings = studentAssessments.map(
                  assessment => assessment.ratings[criterion.id] || 0
                );
                const averageRating =
                  ratings.length > 0
                    ? ratings.reduce((sum, rating) => sum + rating, 0) /
                      ratings.length
                    : 0;

                return (
                  <Grid item xs={12} sm={6} md={4} key={criterion.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          {criterion.name}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          paragraph
                        >
                          {criterion.description}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Rating
                            value={averageRating}
                            readOnly
                            precision={0.5}
                          />
                          <Chip
                            label={`${Math.round(averageRating * 100) / 100}`}
                            size="small"
                            color={
                              averageRating >= 4
                                ? 'success'
                                : averageRating >= 3
                                ? 'primary'
                                : 'warning'
                            }
                          />
                        </Box>
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption">
                            Bobot: {criterion.weight}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default PeerAssessmentDetail;
