import {
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useQuizContext } from '../contexts/QuizContext';

const Quizzes = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { quizzes, getSubmissionsForStudent, getAverageScore } =
    useQuizContext();

  // For demo purposes, we'll use a fixed student ID
  const studentId = 1;
  const studentSubmissions = getSubmissionsForStudent(studentId);

  const formatTime = minutes => {
    return `${minutes} menit`;
  };

  const getSubmissionStatus = quizId => {
    const submission = studentSubmissions.find(sub => sub.quizId === quizId);
    return submission ? submission : null;
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kuis & Assessment
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Uji pemahamanmu dengan kuis yang tersedia
          </Typography>
        </Box>

        {quizzes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <SchoolIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Belum ada kuis yang tersedia
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Guru belum membuat kuis. Silakan periksa kembali nanti.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {quizzes.map(quiz => {
              const submission = getSubmissionStatus(quiz.id);
              const averageScore = getAverageScore(quiz.id);

              return (
                <Grid item xs={12} md={6} key={quiz.id}>
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
                      border: submission ? '2px solid' : 'none',
                      borderColor: submission ? 'success.main' : 'transparent',
                    }}
                    onClick={() => !submission && navigate(`/quiz/${quiz.id}`)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" component="h2">
                          {quiz.title}
                        </Typography>
                        {submission && <CheckCircleIcon color="success" />}
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {quiz.description}
                      </Typography>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">
                          {formatTime(quiz.timeLimit)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                      >
                        <SchoolIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2">
                          {quiz.questions.length} pertanyaan
                        </Typography>
                      </Box>

                      {submission ? (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2" color="success.main">
                            Sudah dikerjakan
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              mt: 1,
                            }}
                          >
                            <Typography variant="body2">
                              Nilaimu: <strong>{submission.score}%</strong>
                            </Typography>
                            <Typography variant="body2">
                              Rata-rata: <strong>{averageScore}%</strong>
                            </Typography>
                          </Box>
                        </Box>
                      ) : (
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 2 }}
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/quiz/${quiz.id}`);
                          }}
                        >
                          Kerjakan Kuis
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Quizzes;
