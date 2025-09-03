import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useMentoringContext } from '../contexts/MentoringContext';

const MentorAvailability = ({ mentorId, darkMode }) => {
  const {
    mentorAvailability,
    addMentorAvailability,
    updateMentorAvailability,
    removeMentorAvailability,
    getAvailabilityForMentor,
  } = useMentoringContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [availabilityData, setAvailabilityData] = useState({
    days: [],
    timeSlots: [{ start: '', end: '' }],
  });

  const daysOfWeek = [
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
    'Minggu',
  ];

  const mentorAvail = getAvailabilityForMentor(mentorId);
  const availability = mentorAvail || { days: [], timeSlots: [] };

  const handleAddTimeSlot = () => {
    setAvailabilityData({
      ...availabilityData,
      timeSlots: [...availabilityData.timeSlots, { start: '', end: '' }],
    });
  };

  const handleRemoveTimeSlot = index => {
    const newTimeSlots = [...availabilityData.timeSlots];
    newTimeSlots.splice(index, 1);
    setAvailabilityData({
      ...availabilityData,
      timeSlots: newTimeSlots,
    });
  };

  const handleTimeSlotChange = (index, field, value) => {
    const newTimeSlots = [...availabilityData.timeSlots];
    newTimeSlots[index][field] = value;
    setAvailabilityData({
      ...availabilityData,
      timeSlots: newTimeSlots,
    });
  };

  const handleDayToggle = day => {
    const newDays = availabilityData.days.includes(day)
      ? availabilityData.days.filter(d => d !== day)
      : [...availabilityData.days, day];

    setAvailabilityData({
      ...availabilityData,
      days: newDays,
    });
  };

  const handleSaveAvailability = () => {
    // Filter out empty time slots
    const validTimeSlots = availabilityData.timeSlots.filter(
      slot => slot.start && slot.end
    );

    if (validTimeSlots.length === 0) {
      alert('Harap tambahkan setidaknya satu slot waktu yang valid');
      return;
    }

    if (mentorAvail) {
      updateMentorAvailability(mentorAvail.id, {
        ...availabilityData,
        timeSlots: validTimeSlots,
      });
    } else {
      addMentorAvailability({
        mentorId,
        ...availabilityData,
        timeSlots: validTimeSlots,
      });
    }

    setOpenDialog(false);
    setAvailabilityData({
      days: [],
      timeSlots: [{ start: '', end: '' }],
    });
  };

  const handleOpenDialog = () => {
    if (mentorAvail) {
      setAvailabilityData({
        days: [...mentorAvail.days],
        timeSlots: mentorAvail.timeSlots.map(slot => ({ ...slot })),
      });
    }
    setOpenDialog(true);
  };

  return (
    <Box>
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
            <Typography variant="h6">
              <CalendarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Ketersediaan Mentor
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              {mentorAvail ? 'Edit' : 'Tambah'} Ketersediaan
            </Button>
          </Box>

          {availability.days.length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Hari Tersedia:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {availability.days.map((day, index) => (
                    <Box
                      key={index}
                      sx={{
                        px: 2,
                        py: 1,
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                        borderRadius: 1,
                      }}
                    >
                      {day}
                    </Box>
                  ))}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                  Slot Waktu:
                </Typography>
                {availability.timeSlots.map((slot, index) => (
                  <Box
                    key={index}
                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  >
                    <TimeIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {slot.start} - {slot.end}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          ) : (
            <Typography color="text.secondary">
              Belum ada informasi ketersediaan. Klik tombol "Tambah
              Ketersediaan" untuk menambahkan.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {mentorAvail ? 'Edit' : 'Tambah'} Ketersediaan Mentor
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Pilih Hari Tersedia:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {daysOfWeek.map((day, index) => (
                <Button
                  key={index}
                  variant={
                    availabilityData.days.includes(day)
                      ? 'contained'
                      : 'outlined'
                  }
                  onClick={() => handleDayToggle(day)}
                  size="small"
                >
                  {day}
                </Button>
              ))}
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              Slot Waktu:
            </Typography>
            {availabilityData.timeSlots.map((slot, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
              >
                <TextField
                  label="Mulai"
                  type="time"
                  value={slot.start}
                  onChange={e =>
                    handleTimeSlotChange(index, 'start', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ mr: 2, width: 120 }}
                />
                <TextField
                  label="Selesai"
                  type="time"
                  value={slot.end}
                  onChange={e =>
                    handleTimeSlotChange(index, 'end', e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  sx={{ mr: 2, width: 120 }}
                />
                {availabilityData.timeSlots.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveTimeSlot(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddTimeSlot}
              size="small"
            >
              Tambah Slot Waktu
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
          <Button onClick={handleSaveAvailability} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MentorAvailability;
