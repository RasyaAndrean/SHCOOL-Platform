import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';

const ManageSchedule = ({ darkMode, toggleDarkMode }) => {
  const { schedule, updateSchedule } = useDataContext();
  const { addNotification } = useAppContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    subjects: '',
  });

  const handleOpenDialog = (daySchedule = null) => {
    if (daySchedule) {
      setEditingDay(daySchedule.day);
      setFormData({
        day: daySchedule.day,
        subjects: daySchedule.subjects.join(', '),
      });
    } else {
      setEditingDay(null);
      setFormData({
        day: '',
        subjects: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingDay(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const updatedSchedule = schedule.map(day => {
      if (day.day === editingDay) {
        return {
          ...day,
          subjects: formData.subjects
            .split(',')
            .map(subject => subject.trim())
            .filter(subject => subject),
        };
      }
      return day;
    });

    updateSchedule(updatedSchedule);
    addNotification('Jadwal berhasil diperbarui!', 'success');
    handleCloseDialog();
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
            Kelola Jadwal Pelajaran
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            disabled
          >
            Tambah Hari
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="jadwal pelajaran">
            <TableHead>
              <TableRow>
                <TableCell>Hari</TableCell>
                <TableCell>Mata Pelajaran</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.map(day => (
                <TableRow
                  key={day.day}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <strong>{day.day}</strong>
                  </TableCell>
                  <TableCell>{day.subjects.join(', ')}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(day)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Jadwal {editingDay}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Hari"
              name="day"
              value={formData.day}
              onChange={handleChange}
              margin="normal"
              disabled
            />
            <TextField
              fullWidth
              label="Mata Pelajaran (pisahkan dengan koma)"
              name="subjects"
              value={formData.subjects}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              helperText="Contoh: Matematika, Bahasa Indonesia, IPA, IPS, Olahraga"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageSchedule;
