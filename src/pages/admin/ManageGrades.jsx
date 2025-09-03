import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
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
  MenuItem,
  Paper,
  Select,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';
import { useGradesContext } from '../../contexts/GradesContext';

const ManageGrades = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const {
    grades,
    subjects,
    addGrade,
    updateGrade,
    deleteGrade,
    getStudentGrades,
  } = useGradesContext();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGrade, setEditingGrade] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [formData, setFormData] = useState({
    studentId: '',
    subject: subjects[0],
    description: '',
    score: '',
  });

  // Log access activity
  useEffect(() => {
    addActivity('Mengakses Kelola Nilai', 'User membuka halaman kelola nilai');
  }, [addActivity]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (grade = null) => {
    if (grade) {
      setEditingGrade(grade);
      setFormData({
        studentId: grade.studentId,
        subject: grade.subject,
        description: grade.description,
        score: grade.score,
      });
    } else {
      setEditingGrade(null);
      setFormData({
        studentId: '',
        subject: subjects[0],
        description: '',
        score: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGrade(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (
      !formData.studentId ||
      !formData.subject ||
      !formData.description ||
      !formData.score
    ) {
      addNotification('Harap lengkapi semua field!', 'error');
      return;
    }

    const gradeData = {
      ...formData,
      score: parseInt(formData.score),
      studentId: parseInt(formData.studentId),
    };

    if (editingGrade) {
      // Update existing grade
      updateGrade(editingGrade.id, gradeData);
      addNotification('Nilai berhasil diperbarui!', 'success');
      addActivity(
        'Memperbarui nilai',
        `Nilai diperbarui untuk siswa ID: ${formData.studentId}`
      );
    } else {
      // Add new grade
      addGrade(gradeData);
      addNotification('Nilai berhasil ditambahkan!', 'success');
      addActivity(
        'Menambah nilai',
        `Nilai baru ditambahkan untuk siswa ID: ${formData.studentId}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = id => {
    if (window.confirm('Apakah Anda yakin ingin menghapus nilai ini?')) {
      deleteGrade(id);
      addNotification('Nilai berhasil dihapus!', 'success');
      addActivity('Menghapus nilai', 'Nilai dihapus oleh admin');
    }
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const getGradeColor = score => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getGradeLabel = score => {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h3" gutterBottom>
            Kelola Nilai
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Tambah Nilai
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Semua Nilai" />
          <Tab label="Per Siswa" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Semua Nilai
            </Typography>

            {grades.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <SchoolIcon
                    sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary">
                    Belum ada nilai yang ditambahkan
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                  >
                    Mulai dengan menambahkan nilai pertama
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Tambah Nilai Pertama
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Siswa</TableCell>
                      <TableCell>Mata Pelajaran</TableCell>
                      <TableCell>Deskripsi</TableCell>
                      <TableCell align="right">Nilai</TableCell>
                      <TableCell align="center">Grade</TableCell>
                      <TableCell align="center">Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {grades.map(grade => (
                      <TableRow key={grade.id}>
                        <TableCell>{getStudentName(grade.studentId)}</TableCell>
                        <TableCell>{grade.subject}</TableCell>
                        <TableCell>{grade.description}</TableCell>
                        <TableCell align="right">
                          <Typography variant="h6">{grade.score}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={getGradeLabel(grade.score)}
                            color={getGradeColor(grade.score)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenDialog(grade)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(grade.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Nilai Per Siswa
            </Typography>

            {students.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Belum ada data siswa
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {students.map(student => {
                  const studentGrades = getStudentGrades(student.id);
                  const average =
                    studentGrades.length > 0
                      ? Math.round(
                          studentGrades.reduce(
                            (sum, grade) => sum + grade.score,
                            0
                          ) / studentGrades.length
                        )
                      : 0;

                  return (
                    <Grid item xs={12} key={student.id}>
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
                            <Typography variant="h6" component="h2">
                              {student.name}
                            </Typography>
                            <Chip
                              label={`Rata-rata: ${average}`}
                              color={getGradeColor(average)}
                              size="small"
                            />
                          </Box>

                          {studentGrades.length === 0 ? (
                            <Typography color="text.secondary">
                              Belum ada nilai untuk siswa ini
                            </Typography>
                          ) : (
                            <TableContainer component={Paper}>
                              <Table size="small">
                                <TableHead>
                                  <TableRow>
                                    <TableCell>Mata Pelajaran</TableCell>
                                    <TableCell>Deskripsi</TableCell>
                                    <TableCell align="right">Nilai</TableCell>
                                    <TableCell align="center">Grade</TableCell>
                                    <TableCell align="center">Aksi</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {studentGrades.map(grade => (
                                    <TableRow key={grade.id}>
                                      <TableCell>{grade.subject}</TableCell>
                                      <TableCell>{grade.description}</TableCell>
                                      <TableCell align="right">
                                        {grade.score}
                                      </TableCell>
                                      <TableCell align="center">
                                        <Chip
                                          label={getGradeLabel(grade.score)}
                                          color={getGradeColor(grade.score)}
                                          size="small"
                                        />
                                      </TableCell>
                                      <TableCell align="center">
                                        <IconButton
                                          color="primary"
                                          onClick={() =>
                                            handleOpenDialog(grade)
                                          }
                                          size="small"
                                          sx={{ mr: 1 }}
                                        >
                                          <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                          color="error"
                                          onClick={() => handleDelete(grade.id)}
                                          size="small"
                                        >
                                          <DeleteIcon fontSize="small" />
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </CardContent>
                        <CardActions sx={{ justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                studentId: student.id.toString(),
                              }));
                              handleOpenDialog();
                            }}
                          >
                            Tambah Nilai
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </Box>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingGrade ? 'Edit Nilai' : 'Tambah Nilai'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            {!editingGrade && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Pilih Siswa</InputLabel>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  label="Pilih Siswa"
                  required
                >
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Mata Pelajaran</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                label="Mata Pelajaran"
                required
              >
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Nilai"
              name="score"
              type="number"
              value={formData.score}
              onChange={handleChange}
              margin="normal"
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={
              !formData.studentId ||
              !formData.subject ||
              !formData.description ||
              !formData.score
            }
          >
            {editingGrade ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageGrades;
