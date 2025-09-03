import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
  School as SchoolIcon,
  Work as WorkIcon,
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
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useStudyGroupContext } from '../../contexts/StudyGroupContext';

const ManageStudyGroups = ({ darkMode, toggleDarkMode }) => {
  const {
    studyGroups,
    groupMemberships,
    createStudyGroup,
    updateStudyGroup,
    deleteStudyGroup,
    getGroupMembers,
  } = useStudyGroupContext();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    description: '',
    createdBy: 'Admin',
  });

  // Mock subjects data
  const subjects = [
    'Pemrograman Web',
    'Jaringan Komputer',
    'Sistem Operasi',
    'Desain Grafis',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
  ];

  // Calculate statistics
  const totalGroups = studyGroups.length;
  const totalMemberships = groupMemberships.length;

  // Calculate total materials, discussions, meetings, and progress items
  const totalMaterials = studyGroups.reduce(
    (sum, group) => sum + (group.materials ? group.materials.length : 0),
    0
  );

  const totalDiscussions = studyGroups.reduce(
    (sum, group) => sum + (group.discussions ? group.discussions.length : 0),
    0
  );

  const totalMeetings = studyGroups.reduce(
    (sum, group) => sum + (group.meetings ? group.meetings.length : 0),
    0
  );

  const totalProgressItems = studyGroups.reduce(
    (sum, group) => sum + (group.progress ? group.progress.length : 0),
    0
  );

  const handleOpenDialog = (group = null) => {
    if (group) {
      setEditingGroup(group);
      setFormData({
        name: group.name,
        subject: group.subject,
        description: group.description,
        createdBy: group.createdBy || 'Admin',
      });
    } else {
      setEditingGroup(null);
      setFormData({
        name: '',
        subject: '',
        description: '',
        createdBy: 'Admin',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingGroup(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingGroup) {
      // Update existing group
      updateStudyGroup(editingGroup.id, formData);
      addNotification('Grup belajar berhasil diperbarui!', 'success');
      addActivity(
        'Memperbarui grup belajar',
        `Memperbarui grup belajar: ${formData.name}`
      );
    } else {
      // Create new group
      createStudyGroup(formData);
      addNotification('Grup belajar berhasil dibuat!', 'success');
      addActivity(
        'Membuat grup belajar',
        `Membuat grup belajar baru: ${formData.name}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus grup "${name}"?`)) {
      deleteStudyGroup(id);
      addNotification('Grup belajar berhasil dihapus!', 'success');
      addActivity('Menghapus grup belajar', `Menghapus grup belajar: ${name}`);
    }
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
            Kelola Grup Belajar
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<GroupIcon />}
          >
            Tambah Grup
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GroupIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Grup</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalGroups}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Anggota</Typography>
                </Box>
                <Typography variant="h4" align="center" color="secondary">
                  {totalMemberships}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Materi</Typography>
                </Box>
                <Typography variant="h4" align="center" color="success.main">
                  {totalMaterials}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ForumIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Diskusi</Typography>
                </Box>
                <Typography variant="h4" align="center" color="warning.main">
                  {totalDiscussions}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CalendarToday sx={{ mr: 1 }} />
                  <Typography variant="h6">Pertemuan</Typography>
                </Box>
                <Typography variant="h4" align="center" color="info.main">
                  {totalMeetings}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Progress Items Card */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Progress Proyek</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalProgressItems}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {studyGroups.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <GroupIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Belum ada grup belajar
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Buat grup belajar pertama untuk memulai
              </Typography>
              <Button
                variant="contained"
                startIcon={<GroupIcon />}
                onClick={() => handleOpenDialog()}
              >
                Buat Grup Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {studyGroups.map(group => (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
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
                      <Box>
                        <Typography gutterBottom variant="h6" component="h2">
                          {group.name}
                        </Typography>
                        <Chip
                          label={group.subject}
                          color="primary"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      <Chip
                        label={`${getGroupMembers(group.id).length} anggota`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {group.description || 'Tidak ada deskripsi'}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      Dibuat oleh: {group.createdBy || 'Admin'}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(group)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(group.id, group.name)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Add/Edit Group Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingGroup ? 'Edit Grup Belajar' : 'Tambah Grup Belajar'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Nama Grup"
              name="name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
              required
            />
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
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Dibuat Oleh"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!formData.name || !formData.subject}
          >
            {editingGroup ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageStudyGroups;
