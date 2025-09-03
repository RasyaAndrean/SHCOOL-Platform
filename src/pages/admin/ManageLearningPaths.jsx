import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  Book as BookIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useLearningPathContext } from '../../contexts/LearningPathContext';

const ManageLearningPaths = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { learningPaths, generateLearningPaths, studentPaths } =
    useLearningPathContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingPath, setEditingPath] = useState(null);
  const [pathData, setPathData] = useState({
    name: '',
    description: '',
    careerField: '',
    duration: '',
    difficulty: 'Beginner',
    subjects: '',
    skills: '',
    prerequisites: '',
  });

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Calculate statistics using new functions
  const totalPaths = learningPaths.length;

  // Count students with assigned paths
  const studentsWithPaths = Object.keys(studentPaths).filter(
    studentId => studentPaths[studentId].assignedPaths?.length > 0
  ).length;

  // Count students with current paths
  const studentsWithCurrentPaths = Object.keys(studentPaths).filter(
    studentId => studentPaths[studentId].currentPath
  ).length;

  // Calculate overall completion rate
  let totalModules = 0;
  let completedModules = 0;

  Object.keys(studentPaths).forEach(studentId => {
    const studentPathData = studentPaths[studentId];
    if (studentPathData.currentPath && studentPathData.progress) {
      const currentPathProgress =
        studentPathData.progress[studentPathData.currentPath];
      if (currentPathProgress) {
        Object.keys(currentPathProgress).forEach(moduleId => {
          totalModules++;
          if (currentPathProgress[moduleId] >= 100) {
            completedModules++;
          }
        });
      }
    }
  });

  const completionRate =
    totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

  // Get path completion stats for the first few paths
  const pathStats = learningPaths.slice(0, 3).map(path => {
    // Calculate stats for each path
    const students = Object.keys(studentPaths).filter(studentId =>
      studentPaths[studentId].assignedPaths?.includes(path.id)
    );

    if (students.length === 0) {
      return {
        ...path,
        totalStudents: 0,
        completedStudents: 0,
        averageProgress: 0,
        completionRate: 0,
      };
    }

    let totalProgress = 0;
    let completedStudents = 0;

    students.forEach(studentId => {
      const progress = studentPaths[studentId].progress?.[path.id] || {};
      const moduleIds = path.modules.map(m => m.id);
      const completedModules = moduleIds.filter(
        id => progress[id] >= 100
      ).length;

      if (completedModules === moduleIds.length) {
        completedStudents++;
      }

      const studentProgress =
        moduleIds.length > 0
          ? Math.round((completedModules / moduleIds.length) * 100)
          : 0;
      totalProgress += studentProgress;
    });

    const averageProgress = Math.round(totalProgress / students.length);
    const completionRate = Math.round(
      (completedStudents / students.length) * 100
    );

    return {
      ...path,
      totalStudents: students.length,
      completedStudents,
      averageProgress,
      completionRate,
    };
  });

  // Get popular paths (most assigned)
  const popularPaths = learningPaths
    .map(path => {
      const assignedCount = Object.keys(studentPaths).filter(studentId =>
        studentPaths[studentId].assignedPaths?.includes(path.id)
      ).length;

      return {
        ...path,
        assignedCount,
      };
    })
    .sort((a, b) => b.assignedCount - a.assignedCount)
    .slice(0, 3);

  const handleOpenDialog = (path = null) => {
    if (path) {
      setEditingPath(path);
      setPathData({
        name: path.name,
        description: path.description,
        careerField: path.careerField,
        duration: path.duration,
        difficulty: path.difficulty,
        subjects: path.subjects.join(', '),
        skills: path.skills.join(', '),
        prerequisites: path.prerequisites.join(', '),
      });
    } else {
      setEditingPath(null);
      setPathData({
        name: '',
        description: '',
        careerField: '',
        duration: '',
        difficulty: 'Beginner',
        subjects: '',
        skills: '',
        prerequisites: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPath(null);
    setPathData({
      name: '',
      description: '',
      careerField: '',
      duration: '',
      difficulty: 'Beginner',
      subjects: '',
      skills: '',
      prerequisites: '',
    });
  };

  const handleInputChange = (field, value) => {
    setPathData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitPath = () => {
    // In a real implementation, this would save to the backend
    // For now, we'll just show a notification
    if (pathData.name.trim() && pathData.description.trim()) {
      const action = editingPath ? 'Memperbarui' : 'Menambahkan';
      addActivity(
        `${action} jalur belajar`,
        `${action} jalur belajar "${pathData.name}"`
      );
      addNotification(
        `Jalur belajar "${pathData.name}" berhasil ${
          editingPath ? 'diperbarui' : 'ditambahkan'
        }!`,
        'success'
      );
      handleCloseDialog();
    } else {
      addNotification('Harap isi nama dan deskripsi jalur belajar!', 'error');
    }
  };

  const handleDeletePath = (pathId, pathName) => {
    // In a real implementation, this would delete from the backend
    addActivity(
      'Menghapus jalur belajar',
      `Menghapus jalur belajar "${pathName}"`
    );
    addNotification(`Jalur belajar "${pathName}" berhasil dihapus!`, 'success');
  };

  const handleGeneratePaths = () => {
    generateLearningPaths();
    addActivity(
      'Menghasilkan jalur belajar',
      'Menghasilkan jalur belajar berdasarkan data terbaru'
    );
    addNotification('Jalur belajar berhasil dihasilkan!', 'success');
  };

  const getDifficultyColor = difficulty => {
    switch (difficulty) {
      case 'Beginner':
        return 'success';
      case 'Intermediate':
        return 'warning';
      case 'Advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">Kelola Jalur Belajar</Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{ mr: 1 }}
              >
                Tambah Jalur
              </Button>
              <Button variant="outlined" onClick={handleGeneratePaths}>
                Hasilkan Otomatis
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Path Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BookIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Jalur</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalPaths}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Siswa dengan Jalur</Typography>
                </Box>
                <Typography variant="h4" align="center" color="secondary">
                  {studentsWithPaths}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Jalur Aktif</Typography>
                </Box>
                <Typography variant="h4" align="center" color="success.main">
                  {studentsWithCurrentPaths}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Penyelesaian</Typography>
                </Box>
                <Typography variant="h4" align="center" color="info.main">
                  {completionRate}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={completionRate}
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Popular Paths */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Jalur Paling Populer
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama Jalur</TableCell>
                    <TableCell>Bidang Karir</TableCell>
                    <TableCell>Siswa yang Mengambil</TableCell>
                    <TableCell>Tingkat Penyelesaian</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {popularPaths.map(path => (
                    <TableRow key={path.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{path.name}</Typography>
                      </TableCell>
                      <TableCell>{path.careerField}</TableCell>
                      <TableCell>{path.assignedCount} siswa</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {path.completionRate || 0}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={path.completionRate || 0}
                            sx={{ flexGrow: 1 }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Path Completion Stats */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Statistik Penyelesaian Jalur
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama Jalur</TableCell>
                    <TableCell>Siswa Terdaftar</TableCell>
                    <TableCell>Siswa Selesai</TableCell>
                    <TableCell>Progress Rata-rata</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pathStats.map(path => (
                    <TableRow key={path.id}>
                      <TableCell>
                        <Typography variant="subtitle2">{path.name}</Typography>
                      </TableCell>
                      <TableCell>{path.totalStudents} siswa</TableCell>
                      <TableCell>{path.completedStudents} siswa</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            {path.averageProgress}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={path.averageProgress}
                            sx={{ flexGrow: 1 }}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {learningPaths.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <BookIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Belum ada jalur belajar
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Mulai dengan menambahkan jalur belajar pertama
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Tambah Jalur Belajar
            </Button>
          </Box>
        ) : (
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
                <Typography variant="h6">Daftar Jalur Belajar</Typography>
                <Chip label={`${learningPaths.length} jalur`} color="primary" />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama</TableCell>
                      <TableCell>Deskripsi</TableCell>
                      <TableCell>Bidang Karir</TableCell>
                      <TableCell>Durasi</TableCell>
                      <TableCell>Tingkat Kesulitan</TableCell>
                      <TableCell>Modul</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {learningPaths.map(path => (
                      <TableRow key={path.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {path.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {path.description}
                          </Typography>
                        </TableCell>
                        <TableCell>{path.careerField}</TableCell>
                        <TableCell>{path.duration}</TableCell>
                        <TableCell>
                          <Chip
                            label={path.difficulty}
                            size="small"
                            color={getDifficultyColor(path.difficulty)}
                          />
                        </TableCell>
                        <TableCell>{path.modules.length} modul</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(path)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeletePath(path.id, path.name)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Dialog for adding/editing path */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingPath ? 'Edit Jalur Belajar' : 'Tambah Jalur Belajar'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nama Jalur Belajar"
                value={pathData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Deskripsi"
                value={pathData.description}
                onChange={e => handleInputChange('description', e.target.value)}
                multiline
                rows={3}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Bidang Karir"
                value={pathData.careerField}
                onChange={e => handleInputChange('careerField', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Durasi (contoh: 24 minggu)"
                value={pathData.duration}
                onChange={e => handleInputChange('duration', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Tingkat Kesulitan</InputLabel>
                <Select
                  value={pathData.difficulty}
                  onChange={e =>
                    handleInputChange('difficulty', e.target.value)
                  }
                  label="Tingkat Kesulitan"
                >
                  {difficulties.map(difficulty => (
                    <MenuItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mata Pelajaran (pisahkan dengan koma)"
                value={pathData.subjects}
                onChange={e => handleInputChange('subjects', e.target.value)}
                helperText="Contoh: Matematika, Fisika, Kimia"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Keterampilan (pisahkan dengan koma)"
                value={pathData.skills}
                onChange={e => handleInputChange('skills', e.target.value)}
                helperText="Contoh: Programming, Networking, Database"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Prasyarat (pisahkan dengan koma)"
                value={pathData.prerequisites}
                onChange={e =>
                  handleInputChange('prerequisites', e.target.value)
                }
                helperText="Contoh: Dasar Komputer, Matematika"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitPath} variant="contained">
            {editingPath ? 'Simpan Perubahan' : 'Tambah Jalur'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageLearningPaths;
