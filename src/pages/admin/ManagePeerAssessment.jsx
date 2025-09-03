import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  RateReview as RateReviewIcon,
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
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import { usePeerAssessmentContext } from '../../contexts/PeerAssessmentContext';
import { useStudyGroupContext } from '../../contexts/StudyGroupContext';

const ManagePeerAssessment = ({ darkMode, toggleDarkMode }) => {
  const {
    assessments,
    criteria,
    addCriteria,
    updateCriteria,
    deleteCriteria,
    getAssessmentsByProject,
    calculateAverageScore,
  } = usePeerAssessmentContext();
  const { students } = useDataContext();
  const { studyGroups } = useStudyGroupContext();
  const { addActivity } = useActivityContext();
  const navigate = useNavigate();
  const [openCriteriaDialog, setOpenCriteriaDialog] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState(null);
  const [criteriaFormData, setCriteriaFormData] = useState({
    name: '',
    description: '',
    weight: 0,
  });
  const [selectedProject, setSelectedProject] = useState('');

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Penilaian Teman',
      'User membuka halaman kelola penilaian teman'
    );
  }, [addActivity]);

  const handleOpenCriteriaDialog = (criterion = null) => {
    if (criterion) {
      setEditingCriteria(criterion);
      setCriteriaFormData({
        name: criterion.name,
        description: criterion.description,
        weight: criterion.weight,
      });
    } else {
      setEditingCriteria(null);
      setCriteriaFormData({
        name: '',
        description: '',
        weight: 0,
      });
    }
    setOpenCriteriaDialog(true);
  };

  const handleCloseCriteriaDialog = () => {
    setOpenCriteriaDialog(false);
    setEditingCriteria(null);
  };

  const handleCriteriaInputChange = e => {
    const { name, value } = e.target;
    setCriteriaFormData(prev => ({
      ...prev,
      [name]: name === 'weight' ? parseInt(value) || 0 : value,
    }));
  };

  const handleCriteriaSubmit = () => {
    if (editingCriteria) {
      updateCriteria(editingCriteria.id, criteriaFormData);
      addActivity(
        'Memperbarui Kriteria Penilaian',
        `User memperbarui kriteria penilaian: ${criteriaFormData.name}`
      );
    } else {
      addCriteria(criteriaFormData);
      addActivity(
        'Menambah Kriteria Penilaian',
        `User menambah kriteria penilaian: ${criteriaFormData.name}`
      );
    }
    handleCloseCriteriaDialog();
  };

  const handleDeleteCriteria = criterion => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus kriteria "${criterion.name}"?`
      )
    ) {
      deleteCriteria(criterion.id);
      addActivity(
        'Menghapus Kriteria Penilaian',
        `User menghapus kriteria penilaian: ${criterion.name}`
      );
    }
  };

  const getTotalWeight = () => {
    return criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  };

  const getProjectAssessments = projectId => {
    return assessments.filter(assessment => assessment.projectId === projectId);
  };

  const getStudentAverageScore = (projectId, studentId) => {
    const projectAssessments = getProjectAssessments(projectId);
    const studentAssessments = projectAssessments.filter(
      assessment => assessment.assessedStudentId === studentId
    );
    return calculateAverageScore(studentAssessments);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Penilaian Teman
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Atur kriteria penilaian dan lihat hasil penilaian teman
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Criteria Management */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <RateReviewIcon sx={{ mr: 1 }} />
                    Kriteria Penilaian
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenCriteriaDialog()}
                  >
                    Tambah Kriteria
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Nama Kriteria</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Bobot (%)</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {criteria.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} align="center">
                            <Typography color="text.secondary">
                              Belum ada kriteria penilaian
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        criteria.map(criterion => (
                          <TableRow key={criterion.id}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {criterion.name}
                              </Typography>
                            </TableCell>
                            <TableCell>{criterion.description}</TableCell>
                            <TableCell>
                              <Chip
                                label={`${criterion.weight}%`}
                                color={
                                  criterion.weight > 20 ? 'primary' : 'default'
                                }
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleOpenCriteriaDialog(criterion)
                                }
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteCriteria(criterion)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                      <TableRow>
                        <TableCell colSpan={2} align="right">
                          <Typography variant="subtitle1">
                            Total Bobot:
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${getTotalWeight()}%`}
                            color={
                              getTotalWeight() === 100 ? 'success' : 'warning'
                            }
                          />
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* Assessment Results */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <GroupIcon sx={{ mr: 1 }} />
                  Hasil Penilaian
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Proyek</InputLabel>
                  <Select
                    value={selectedProject}
                    onChange={e => setSelectedProject(e.target.value)}
                    label="Proyek"
                  >
                    {studyGroups.map(group => (
                      <MenuItem key={group.id} value={group.projectId}>
                        {group.projectName || `Proyek ${group.projectId}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {selectedProject ? (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Siswa</TableCell>
                          <TableCell>Jumlah Penilaian</TableCell>
                          <TableCell>Rata-rata Nilai</TableCell>
                          <TableCell>Detail</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {students.map(student => {
                          const studentAssessments = getAssessmentsByProject(
                            selectedProject
                          ).filter(
                            assessment =>
                              assessment.assessedStudentId === student.name
                          );

                          if (studentAssessments.length === 0) return null;

                          const averageScore =
                            calculateAverageScore(studentAssessments);

                          return (
                            <TableRow key={student.id}>
                              <TableCell>
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <IconButton sx={{ mr: 1 }}>
                                    <PersonIcon />
                                  </IconButton>
                                  <Typography variant="subtitle2">
                                    {student.name}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>{studentAssessments.length}</TableCell>
                              <TableCell>
                                <Chip
                                  label={averageScore}
                                  color={
                                    averageScore >= 80
                                      ? 'success'
                                      : averageScore >= 60
                                      ? 'primary'
                                      : 'warning'
                                  }
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    navigate(
                                      `/admin/peer-assessment/detail/${student.id}/${selectedProject}`
                                    )
                                  }
                                >
                                  Lihat Detail
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <RateReviewIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Pilih proyek untuk melihat hasil penilaian
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Penilaian Teman
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Kriteria Penilaian
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tentukan kriteria penilaian yang sesuai dengan kebutuhan
                  pembelajaran. Total bobot harus 100%.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Monitoring Penilaian
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pantau hasil penilaian teman untuk setiap proyek dan siswa
                  untuk mengevaluasi kerjasama tim.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Analisis Hasil
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan hasil penilaian untuk memberikan umpan balik yang
                  konstruktif kepada siswa.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />

      {/* Dialog for Adding/Editing Criteria */}
      <Dialog
        open={openCriteriaDialog}
        onClose={handleCloseCriteriaDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCriteria
            ? 'Edit Kriteria Penilaian'
            : 'Tambah Kriteria Penilaian'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Nama Kriteria"
              name="name"
              value={criteriaFormData.name}
              onChange={handleCriteriaInputChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={criteriaFormData.description}
              onChange={handleCriteriaInputChange}
              margin="normal"
              multiline
              rows={2}
              required
            />

            <TextField
              fullWidth
              label="Bobot (%)"
              type="number"
              name="weight"
              value={criteriaFormData.weight}
              onChange={handleCriteriaInputChange}
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              inputProps={{ min: 0, max: 100 }}
              required
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total bobot semua kriteria: {getTotalWeight()}%
              </Typography>
              {getTotalWeight() > 100 && (
                <Typography variant="body2" color="error">
                  Total bobot melebihi 100%!
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCriteriaDialog}>Batal</Button>
          <Button
            onClick={handleCriteriaSubmit}
            variant="contained"
            disabled={
              !criteriaFormData.name ||
              !criteriaFormData.description ||
              getTotalWeight() > 100
            }
          >
            {editingCriteria ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManagePeerAssessment;
