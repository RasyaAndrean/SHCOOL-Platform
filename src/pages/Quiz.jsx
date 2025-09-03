import { Timer as TimerIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useQuizContext } from '../contexts/QuizContext';

const Quiz = ({ darkMode, toggleDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { quizzes, submitQuiz } = useQuizContext();
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  // Find the quiz by ID
  useEffect(() => {
    if (id) {
      const quiz = quizzes.find(q => q.id === parseInt(id));
      if (quiz) {
        setCurrentQuiz(quiz);
        setAnswers(new Array(quiz.questions.length).fill(''));
        setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
      } else {
        navigate('/quizzes');
      }
    }
  }, [id, quizzes, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleTimeUp();
    }
  }, [timeLeft, showResults]);

  const handleTimeUp = () => {
    addNotification('Waktu habis! Kuis telah otomatis dikumpulkan.', 'warning');
    handleSubmitQuiz();
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    if (currentQuiz) {
      // Submit the quiz with student ID (for demo, we'll use a fixed ID)
      const result = submitQuiz(currentQuiz.id, 1, answers);
      setSubmission(result);
      setShowResults(true);
      addNotification('Kuis berhasil dikumpulkan!', 'success');
    }
  };

  const handleConfirmSubmit = () => {
    setOpenConfirmation(false);
    handleSubmitQuiz();
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  if (!currentQuiz) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Memuat kuis...
            </Typography>
          </Box>
        </Container>
        <Footer />
      </div>
    );
  }

  if (showResults) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" gutterBottom>
              Hasil Kuis
            </Typography>
            <Typography variant="h5" color="text.secondary">
              {currentQuiz.title}
            </Typography>
          </Box>

          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box sx={{ textAlign: 'center', mr: 4 }}>
                  <Typography variant="h4" color="primary">
                    {submission?.score}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Nilai
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="secondary">
                    {
                      answers.filter(
                        (answer, index) =>
                          answer === currentQuiz.questions[index].correctAnswer
                      ).length
                    }
                    /{currentQuiz.questions.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Jawaban Benar
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {currentQuiz.questions.map((question, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    border: '2px solid',
                    borderColor:
                      answers[index] === question.correctAnswer
                        ? 'success.main'
                        : answers[index]
                        ? 'error.main'
                        : 'divider',
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {index + 1}. {question.question}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      {question.options.map((option, optionIndex) => (
                        <Box
                          key={optionIndex}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                            p: 1,
                            borderRadius: 1,
                            bgcolor:
                              answers[index] === optionIndex
                                ? answers[index] === question.correctAnswer
                                  ? 'success.light'
                                  : 'error.light'
                                : 'transparent',
                          }}
                        >
                          <Typography variant="body1">
                            {String.fromCharCode(65 + optionIndex)}. {option}
                          </Typography>
                        </Box>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Jawaban Anda:{' '}
                        {answers[index] !== ''
                          ? String.fromCharCode(65 + answers[index])
                          : 'Tidak dijawab'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Jawaban Benar:{' '}
                        {String.fromCharCode(65 + question.correctAnswer)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button variant="contained" onClick={() => navigate('/quizzes')}>
              Kembali ke Daftar Kuis
            </Button>
          </Box>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            {currentQuiz.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            {currentQuiz.description}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <TimerIcon sx={{ mr: 1 }} />
            <Typography
              variant="h5"
              color={timeLeft < 300 ? 'error' : 'primary'}
            >
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">
                Pertanyaan {currentQuestion + 1} dari{' '}
                {currentQuiz.questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {Math.round(
                  ((currentQuestion + 1) / currentQuiz.questions.length) * 100
                )}
                % selesai
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {currentQuiz.questions[currentQuestion].question}
            </Typography>

            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                value={answers[currentQuestion]}
                onChange={e =>
                  handleAnswerChange(currentQuestion, parseInt(e.target.value))
                }
              >
                {currentQuiz.questions[currentQuestion].options.map(
                  (option, index) => (
                    <FormControlLabel
                      key={index}
                      value={index}
                      control={<Radio />}
                      label={`${String.fromCharCode(65 + index)}. ${option}`}
                      sx={{ mb: 1, alignItems: 'flex-start' }}
                    />
                  )
                )}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            onClick={handlePrevQuestion}
            disabled={currentQuestion === 0}
          >
            Sebelumnya
          </Button>

          {currentQuestion < currentQuiz.questions.length - 1 ? (
            <Button variant="contained" onClick={handleNextQuestion}>
              Selanjutnya
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={() => setOpenConfirmation(true)}
              disabled={answers.every(answer => answer === '')}
            >
              Kirim Kuis
            </Button>
          )}
        </Box>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
      >
        <DialogTitle>Konfirmasi Pengumpulan</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin mengumpulkan kuis ini? Pastikan Anda telah
            menjawab semua pertanyaan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmation(false)}>Batal</Button>
          <Button
            onClick={handleConfirmSubmit}
            variant="contained"
            color="success"
          >
            Kirim
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Quiz;
