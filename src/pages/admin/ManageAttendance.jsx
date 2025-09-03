import {
  Add as AddIcon,
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Error as ErrorIcon,
  Person as PersonIcon,
  Save as SaveIcon,
  Timeline as TimelineIcon,
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
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useAttendanceContext } from '../../contexts/AttendanceContext';
import { useDataContext } from '../../contexts/DataContext';

const ManageAttendance = ({ darkMode, toggleDarkMode }) => {
  const { logout } = useAppContext();
  const { students } = useDataContext();
  const {
    attendanceRecords,
    attendanceSettings,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    updateSettings,
  } = useAttendanceContext();
  const { addActivity } = useActivityContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    date: '',
    session: '',
    status: 'present',
    notes: '',
  });
  const [filterStudent, setFilterStudent] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Kehadiran',
      'User membuka halaman kelola kehadiran siswa'
    );
  }, [addActivity]);

  const handleLogout = () => {
    addActivity('Logout', 'User keluar dari sistem admin');
    logout();
    navigate('/');
  };

  const handleOpenDialog = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        studentId: record.studentId,
        date: record.date,
        session: record.session,
        status: record.status,
        notes: record.notes || '',
      });
    } else {
      setEditingRecord(null);
      setFormData({
        studentId: '',
        date: new Date().toISOString().split('T')[0],
        session: '',
        status: 'present',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingRecord(null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.studentId || !formData.date || !formData.session) {
      return;
    }

    const student = students.find(s => s.id === formData.studentId);
    const studentName = student ? student.name : 'Unknown';

    if (editingRecord) {
      updateAttendanceRecord(editingRecord.id, formData);
      addActivity(
        'Memperbarui Data Kehadiran',
        `Memperbarui kehadiran untuk ${studentName} pada ${formData.date}`
      );
    } else {
      addAttendanceRecord(formData);
      addActivity(
        'Menambah Data Kehadiran',
        `Menambah kehadiran untuk ${studentName} pada ${formData.date}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = (id, studentId, date) => {
    const student = students.find(s => s.id === studentId);
    const studentName = student ? student.name : 'Unknown';

    deleteAttendanceRecord(id);
    addActivity(
      'Menghapus Data Kehadiran',
      `Menghapus kehadiran untuk ${studentName} pada ${date}`
    );
  };

  const getStatusColor = status => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon />;
      case 'absent':
        return <ErrorIcon />;
      case 'late':
        return <TimelineIcon />;
      default:
        return <CalendarTodayIcon />;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'absent':
        return 'Tidak Hadir';
      case 'late':
        return 'Terlambat';
      default:
        return status;
    }
  };

  const filteredRecords = attendanceRecords.filter(record => {
    if (filterStudent && record.studentId !== filterStudent) return false;
    if (filterDate && record.date !== filterDate) return false;
    return true;
  });

  const groupedRecords = {};
  filteredRecords.forEach(record => {
    if (!groupedRecords[record.date]) {
      groupedRecords[record.date] = [];
    }
    groupedRecords[record.date].push(record);
  });

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
          <Box>
            <Typography variant="h3" gutterBottom>
              Kelola Kehadiran
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Kelola data kehadiran siswa kelas XI TKJ 3
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Tambah Kehadiran
            </Button>
          </Box>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filter Data
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Siswa</InputLabel>
                  <Select
                    value={filterStudent}
                    onChange={e => setFilterStudent(e.target.value)}
                    label="Siswa"
                  >
                    <MenuItem value="">Semua Siswa</MenuItem>
                    {students.map(student => (
                      <MenuItem key={student.id} value={student.id}>
                        {student.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tanggal"
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {Object.keys(groupedRecords).length > 0 ? (
          Object.keys(groupedRecords)
            .sort()
            .reverse()
            .map(date => (
              <Card key={date} sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">{date}</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {groupedRecords[date].map((record, index) => {
                      const student = students.find(
                        s => s.id === record.studentId
                      );
                      return (
                        <Box key={record.id}>
                          <ListItem
                            secondaryAction={
                              <>
                                <IconButton
                                  edge="end"
                                  aria-label="edit"
                                  onClick={() => handleOpenDialog(record)}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton
                                  edge="end"
                                  aria-label="delete"
                                  onClick={() =>
                                    handleDelete(
                                      record.id,
                                      record.studentId,
                                      record.date
                                    )
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            }
                          >
                            <ListItemIcon>
                              <PersonIcon />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                student ? student.name : 'Siswa Tidak Dikenal'
                              }
                              secondary={
                                <>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {record.session}
                                  </Typography>
                                  <br />
                                  {record.notes && (
                                    <Typography
                                      component="span"
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Catatan: {record.notes}
                                    </Typography>
                                  )}
                                </>
                              }
                            />
                            <Chip
                              label={getStatusText(record.status)}
                              color={getStatusColor(record.status)}
                              size="small"
                            />
                          </ListItem>
                          {index < groupedRecords[date].length - 1 && (
                            <Divider />
                          )}
                        </Box>
                      );
                    })}
                  </List>
                </CardContent>
              </Card>
            ))
        ) : (
          <Card>
            <CardContent>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ py: 4 }}
              >
                Tidak ada data kehadiran yang sesuai dengan filter
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingRecord ? 'Edit Data Kehadiran' : 'Tambah Data Kehadiran'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Siswa *</InputLabel>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  label="Siswa *"
                >
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tanggal *"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Sesi *"
                name="session"
                value={formData.session}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Status *</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  label="Status *"
                >
                  <MenuItem value="present">Hadir</MenuItem>
                  <MenuItem value="absent">Tidak Hadir</MenuItem>
                  <MenuItem value="late">Terlambat</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Catatan"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            startIcon={<SaveIcon />}
            disabled={
              !formData.studentId || !formData.date || !formData.session
            }
          >
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageAttendance;
