import {
  Add as AddIcon,
  EmojiEvents as EmojiEventsIcon,
  Group as GroupIcon,
  MilitaryTech as MilitaryTechIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import useAchievementContext from '../../hooks/useAchievementContext';

const ManageAchievements = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const {
    achievements,
    badges,
    addAchievement,
    getAchievementsByStudent,
    getBadgesByStudent,
  } = useAchievementContext();

  const [openAddAchievementDialog, setOpenAddAchievementDialog] =
    useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [achievementTitle, setAchievementTitle] = useState('');
  const [achievementDescription, setAchievementDescription] = useState('');
  const [achievementCategory, setAchievementCategory] = useState('');
  const [statistics, setStatistics] = useState({
    totalAchievements: 0,
    totalBadges: 0,
    studentsWithAchievements: 0,
    mostAchievementsStudent: '',
  });

  // Calculate statistics
  useEffect(() => {
    const totalAchievements = achievements.length;
    const totalBadges = badges.length;

    // Count students with achievements
    const studentsWithAchievements = students.filter(
      student => getAchievementsByStudent(student.id).length > 0
    ).length;

    // Find student with most achievements
    let maxAchievements = 0;
    let topStudent = '';
    students.forEach(student => {
      const studentAchievements = getAchievementsByStudent(student.id);
      if (studentAchievements.length > maxAchievements) {
        maxAchievements = studentAchievements.length;
        topStudent = student.name;
      }
    });

    setStatistics({
      totalAchievements,
      totalBadges,
      studentsWithAchievements,
      mostAchievementsStudent: topStudent,
    });
  }, [achievements, badges, students, getAchievementsByStudent]);

  const handleAddAchievement = () => {
    if (
      selectedStudent &&
      achievementTitle &&
      achievementDescription &&
      achievementCategory
    ) {
      addAchievement({
        studentId: parseInt(selectedStudent),
        title: achievementTitle,
        description: achievementDescription,
        category: achievementCategory,
      });

      // Log activity
      const studentName =
        students.find(s => s.id === parseInt(selectedStudent))?.name ||
        'Unknown';
      addActivity(
        'Menambah Prestasi',
        `Admin menambahkan prestasi "${achievementTitle}" untuk ${studentName}`
      );

      // Reset form and close dialog
      setSelectedStudent('');
      setAchievementTitle('');
      setAchievementDescription('');
      setAchievementCategory('');
      setOpenAddAchievementDialog(false);
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Typography variant="h4">Manajemen Prestasi & Lencana</Typography>
          <Typography variant="h6" color="text.secondary">
            Kelola prestasi siswa dan sistem lencana
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <EmojiEventsIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.totalAchievements}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Prestasi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <MilitaryTechIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">{statistics.totalBadges}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Lencana
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <GroupIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4">
                  {statistics.studentsWithAchievements}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Siswa dengan Prestasi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon
                  sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h6">
                  {statistics.mostAchievementsStudent || 'Tidak ada data'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Siswa dengan Prestasi Terbanyak
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddAchievementDialog(true)}
            sx={{ mr: 2 }}
          >
            Tambah Prestasi
          </Button>
          <Button
            variant="outlined"
            startIcon={<MilitaryTechIcon />}
            onClick={() => navigate('/admin/manage-badges')}
          >
            Kelola Lencana
          </Button>
        </Box>

        {/* Student Achievements Overview */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <EmojiEventsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Ringkasan Prestasi Siswa</Typography>
            </Box>

            <Grid container spacing={3}>
              {students.map(student => {
                const studentAchievements = getAchievementsByStudent(
                  student.id
                );
                const studentBadges = getBadgesByStudent(student.id);

                return (
                  <Grid item xs={12} md={6} key={student.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {student.photo ? (
                              <img
                                src={student.photo}
                                alt={student.name}
                                style={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  marginRight: 12,
                                }}
                              />
                            ) : (
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: '50%',
                                  backgroundColor: 'primary.light',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  marginRight: 12,
                                  color: 'primary.main',
                                }}
                              >
                                {student.name.charAt(0)}
                              </Box>
                            )}
                            <Box>
                              <Typography variant="h6">
                                {student.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {student.role}
                              </Typography>
                            </Box>
                          </Box>
                          <Chip
                            label={`${studentAchievements.length} prestasi`}
                            color="primary"
                            size="small"
                          />
                        </Box>

                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          <MilitaryTechIcon sx={{ mr: 1, fontSize: '1rem' }} />
                          <Typography variant="body2">
                            Lencana: {studentBadges.length}
                          </Typography>
                        </Box>

                        {studentAchievements.length > 0 && (
                          <Box>
                            <Typography variant="subtitle2" gutterBottom>
                              Prestasi Terbaru:
                            </Typography>
                            <Grid container spacing={1}>
                              {studentAchievements
                                .slice(0, 3)
                                .map(achievement => (
                                  <Grid item xs={12} key={achievement.id}>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        p: 1,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        borderRadius: 1,
                                      }}
                                    >
                                      <EmojiEventsIcon
                                        sx={{
                                          mr: 1,
                                          fontSize: '1rem',
                                          color: 'gold',
                                        }}
                                      />
                                      <Typography variant="body2" noWrap>
                                        {achievement.title}
                                      </Typography>
                                    </Box>
                                  </Grid>
                                ))}
                            </Grid>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Panduan Manajemen Prestasi</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Tambah Prestasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tombol "Tambah Prestasi" untuk memberikan penghargaan
                  kepada siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Kelola Lencana
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Buat dan kelola sistem lencana untuk mendorong partisipasi
                  siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Pantau Kemajuan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan data prestasi untuk mengidentifikasi siswa berprestasi
                  dan memberikan penghargaan.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Add Achievement Dialog */}
      <Dialog
        open={openAddAchievementDialog}
        onClose={() => setOpenAddAchievementDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ mr: 1 }} />
            Tambah Prestasi Baru
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Pilih Siswa</InputLabel>
              <Select
                value={selectedStudent}
                onChange={e => setSelectedStudent(e.target.value)}
                label="Pilih Siswa"
              >
                {students.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Judul Prestasi"
              value={achievementTitle}
              onChange={e => setAchievementTitle(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Deskripsi"
              multiline
              rows={3}
              value={achievementDescription}
              onChange={e => setAchievementDescription(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Kategori"
              value={achievementCategory}
              onChange={e => setAchievementCategory(e.target.value)}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAchievementDialog(false)}>
            Batal
          </Button>
          <Button
            onClick={handleAddAchievement}
            variant="contained"
            disabled={
              !selectedStudent ||
              !achievementTitle ||
              !achievementDescription ||
              !achievementCategory
            }
          >
            Tambah Prestasi
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAchievements;
