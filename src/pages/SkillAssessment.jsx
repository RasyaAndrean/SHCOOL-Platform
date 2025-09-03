import {
  Assessment as AssessmentIcon,
  School as SchoolIcon,
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
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useSkillContext } from '../contexts/SkillContext';

const SkillAssessment = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { skills, assessSkill, getUserSkillLevels } = useSkillContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const [score, setScore] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [userId] = useState('Andi Prasetyo'); // In a real app, this would come from auth

  const userSkills = getUserSkillLevels(userId);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSkill('');
    setScore(5);
    setFeedback('');
  };

  const handleSubmitAssessment = () => {
    if (selectedSkill) {
      assessSkill(selectedSkill, userId, score, feedback);
      addNotification('Penilaian skill berhasil disimpan!', 'success');
      handleCloseDialog();
    } else {
      addNotification('Harap pilih skill terlebih dahulu!', 'error');
    }
  };

  const getSkillCategoryColor = category => {
    switch (category) {
      case 'Teknologi':
        return 'primary';
      case 'Kreatif':
        return 'secondary';
      case 'Akademik':
        return 'success';
      case 'Bahasa':
        return 'warning';
      case 'Soft Skills':
        return 'info';
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
            Penilaian Skill
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Evaluasi kemampuanmu dan dapatkan rekomendasi belajar
          </Typography>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={handleOpenDialog}
          >
            Nilai Skill Baru
          </Button>
        </Box>

        {/* User Skills Overview */}
        {userSkills.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AssessmentIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Belum ada penilaian skill
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Mulai dengan menilai skill pertamamu
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {userSkills.map((skillData, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
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
                      <Typography variant="h6" gutterBottom>
                        {skillData.skill.name}
                      </Typography>
                      <IconButton
                        size="small"
                        color={getSkillCategoryColor(skillData.skill.category)}
                      >
                        <SchoolIcon />
                      </IconButton>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {skillData.skill.category}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {skillData.skill.description}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Tingkat Kemampuan: {skillData.score}/10
                      </Typography>
                      <Slider
                        value={skillData.score}
                        disabled
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={0}
                        max={10}
                        sx={{ mr: 2 }}
                      />
                    </Box>

                    {skillData.feedback && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          Catatan:
                        </Typography>
                        <Typography variant="body2">
                          {skillData.feedback}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* All Skills List */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daftar Semua Skill
            </Typography>
            <Grid container spacing={2}>
              {skills.map(skill => (
                <Grid item xs={12} sm={6} md={4} key={skill.id}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      height: '100%',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1">{skill.name}</Typography>
                      <Box
                        sx={{
                          bgcolor: `${getSkillCategoryColor(
                            skill.category
                          )}.main`,
                          color: `${getSkillCategoryColor(
                            skill.category
                          )}.contrastText`,
                          borderRadius: 1,
                          px: 1,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="caption">
                          {skill.category}
                        </Typography>
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {skill.description}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Cara Menilai Skill
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Pilih Skill
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pilih skill yang ingin kamu nilai dari daftar yang tersedia.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Beri Penilaian
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Beri penilaian dari 1-10 berdasarkan kemampuanmu saat ini.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Tambahkan Catatan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tambahkan catatan atau komentar untuk membantumu mengingat
                  perkembangan.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Dialog for skill assessment */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Nilai Skill</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Pilih Skill</InputLabel>
            <Select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              label="Pilih Skill"
            >
              {skills.map(skill => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name} ({skill.category})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Tingkat Kemampuan: {score}/10</Typography>
            <Slider
              value={score}
              onChange={(e, newValue) => setScore(newValue)}
              valueLabelDisplay="auto"
              step={1}
              marks
              min={0}
              max={10}
            />
          </Box>

          <TextField
            fullWidth
            label="Catatan (Opsional)"
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            sx={{ mt: 2 }}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitAssessment} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SkillAssessment;
