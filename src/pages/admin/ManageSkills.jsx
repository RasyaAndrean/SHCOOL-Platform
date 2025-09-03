import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
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
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useSkillContext } from '../../contexts/SkillContext';

const ManageSkills = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { skills, addSkill, updateSkill, deleteSkill, getSkillAverageScore } =
    useSkillContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSkill, setCurrentSkill] = useState({
    name: '',
    category: 'Teknologi',
    description: '',
  });
  const [editingSkillId, setEditingSkillId] = useState(null);

  const categories = [
    'Teknologi',
    'Kreatif',
    'Akademik',
    'Bahasa',
    'Soft Skills',
  ];

  const handleOpenDialog = (skill = null) => {
    if (skill) {
      setIsEditing(true);
      setEditingSkillId(skill.id);
      setCurrentSkill({
        name: skill.name,
        category: skill.category,
        description: skill.description,
      });
    } else {
      setIsEditing(false);
      setEditingSkillId(null);
      setCurrentSkill({
        name: '',
        category: 'Teknologi',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setIsEditing(false);
    setEditingSkillId(null);
    setCurrentSkill({
      name: '',
      category: 'Teknologi',
      description: '',
    });
  };

  const handleInputChange = (field, value) => {
    setCurrentSkill(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitSkill = () => {
    if (currentSkill.name.trim() && currentSkill.description.trim()) {
      if (isEditing) {
        updateSkill(editingSkillId, currentSkill);
        addActivity(
          'Memperbarui skill',
          `Memperbarui skill: ${currentSkill.name}`
        );
        addNotification('Skill berhasil diperbarui!', 'success');
      } else {
        addSkill(currentSkill);
        addActivity(
          'Menambahkan skill',
          `Menambahkan skill: ${currentSkill.name}`
        );
        addNotification('Skill berhasil ditambahkan!', 'success');
      }
      handleCloseDialog();
    } else {
      addNotification('Harap isi semua field!', 'error');
    }
  };

  const handleDeleteSkill = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus skill "${name}"?`)) {
      deleteSkill(id);
      addActivity('Menghapus skill', `Menghapus skill: ${name}`);
      addNotification('Skill berhasil dihapus!', 'success');
    }
  };

  // Calculate statistics
  const totalSkills = skills.length;
  const skillsByCategory = skills.reduce((acc, skill) => {
    acc[skill.category] = (acc[skill.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className={darkMode ? 'dark' : ''}>
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
            <Typography variant="h4">Kelola Skill</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Tambah Skill
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Skill</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {totalSkills}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Skill
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="secondary">
                      {Object.keys(skillsByCategory).length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Kategori
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="success.main"
                    >
                      {skillsByCategory['Teknologi'] || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Teknologi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="warning.main"
                    >
                      {skillsByCategory['Akademik'] || 0}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Akademik
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {skills.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AssessmentIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Belum ada skill
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Mulai dengan menambahkan skill pertama
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Tambah Skill
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
                <Typography variant="h6">Daftar Skill</Typography>
                <Chip label={`${totalSkills} skill`} color="primary" />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nama Skill</TableCell>
                      <TableCell>Kategori</TableCell>
                      <TableCell>Deskripsi</TableCell>
                      <TableCell>Nilai Rata-rata</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {skills.map(skill => (
                      <TableRow key={skill.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {skill.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={skill.category}
                            size="small"
                            color={
                              skill.category === 'Teknologi'
                                ? 'primary'
                                : skill.category === 'Kreatif'
                                ? 'secondary'
                                : skill.category === 'Akademik'
                                ? 'success'
                                : skill.category === 'Bahasa'
                                ? 'warning'
                                : 'info'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {skill.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getSkillAverageScore(skill.id)}/10
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleOpenDialog(skill)}
                            color="primary"
                            size="small"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() =>
                              handleDeleteSkill(skill.id, skill.name)
                            }
                            color="error"
                            size="small"
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

      {/* Dialog for adding/editing skill */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{isEditing ? 'Edit Skill' : 'Tambah Skill'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nama Skill"
            value={currentSkill.name}
            onChange={e => handleInputChange('name', e.target.value)}
            sx={{ mt: 2 }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Kategori</InputLabel>
            <Select
              value={currentSkill.category}
              onChange={e => handleInputChange('category', e.target.value)}
              label="Kategori"
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Deskripsi"
            value={currentSkill.description}
            onChange={e => handleInputChange('description', e.target.value)}
            sx={{ mt: 2 }}
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitSkill} variant="contained">
            {isEditing ? 'Perbarui' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageSkills;
