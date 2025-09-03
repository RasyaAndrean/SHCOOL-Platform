import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  Event as EventIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Search as SearchIcon,
  Today as TodayIcon,
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
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useCalendarContext } from '../contexts/CalendarContext';

const EnhancedCalendar = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const {
    events,
    addEvent,
    updateEvent,
    // Removed deleteEvent since it's not used
    getTodaysEvents,
    getThisWeeksEvents,
    // Removed getEventsByCategory since it's not used
    // Removed searchEvents since it's not used
    getEventStatistics,
  } = useCalendarContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    category: 'Akademik',
    priority: 'medium',
  });

  useEffect(() => {
    // Set today as selected date by default
    setSelectedDate(new Date());
  }, []);

  const months = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  const categories = [
    { id: 'all', name: 'Semua Kategori' },
    { id: 'Akademik', name: 'Akademik' },
    { id: 'Kegiatan', name: 'Kegiatan' },
    { id: 'Tugas', name: 'Tugas' },
  ];

  const navigateMonth = direction => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const isSameDay = (date1, date2) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const handleDateClick = day => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(clickedDate);
  };

  const handleOpenDialog = (event = null, date = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time,
        description: event.description,
        category: event.category,
        priority: event.priority,
      });
    } else {
      setEditingEvent(null);
      const defaultDate = date
        ? date.toISOString().split('T')[0]
        : selectedDate
        ? selectedDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setFormData({
        title: '',
        date: defaultDate,
        time: '09:00',
        description: '',
        category: 'Akademik',
        priority: 'medium',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.title || !formData.date) {
      addNotification('Harap lengkapi field yang wajib diisi!', 'error');
      return;
    }

    const eventData = {
      ...formData,
    };

    if (editingEvent) {
      // Update existing event
      updateEvent(editingEvent.id, eventData);
      addNotification('Acara berhasil diperbarui!', 'success');
    } else {
      // Add new event
      addEvent(eventData);
      addNotification('Acara berhasil ditambahkan!', 'success');
    }

    handleCloseDialog();
  };

  const getEventsForDay = day => {
    const dateStr = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Filter by search query and category if needed
    let dayEvents = events.filter(event => event.date === dateStr);
    
    if (searchQuery) {
      dayEvents = dayEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      dayEvents = dayEvents.filter(event => event.category === selectedCategory);
    }
    
    return dayEvents;
  };

  const getPriorityColor = priority => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCategoryColor = category => {
    switch (category) {
      case 'Akademik':
        return 'primary';
      case 'Kegiatan':
        return 'secondary';
      case 'Tugas':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  // Get filtered events for today and this week
  const getFilteredTodaysEvents = () => {
    let todaysEvents = getTodaysEvents();
    
    if (searchQuery) {
      todaysEvents = todaysEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      todaysEvents = todaysEvents.filter(event => event.category === selectedCategory);
    }
    
    return todaysEvents;
  };

  const getFilteredThisWeeksEvents = () => {
    let weeksEvents = getThisWeeksEvents();
    
    if (searchQuery) {
      weeksEvents = weeksEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      weeksEvents = weeksEvents.filter(event => event.category === selectedCategory);
    }
    
    return weeksEvents;
  };

  // Get statistics
  const eventStats = getEventStatistics();
  
  // Render calendar days
  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<Grid item key={`empty-${i}`} xs={1.7} />);
    }

    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDay(day);
      const isToday = isSameDay(new Date(year, month, day), new Date());
      const isSelected =
        selectedDate && isSameDay(new Date(year, month, day), selectedDate);

      days.push(
        <Grid item xs={1.7} key={day}>
          <Box
            sx={{
              height: '100%',
              minHeight: 80,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: isSelected
                ? 'primary.light'
                : isToday
                ? 'secondary.light'
                : 'background.paper',
              cursor: 'pointer',
              p: 1,
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => handleDateClick(day)}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: isToday ? 'bold' : 'normal',
                color: isToday ? 'secondary.contrastText' : 'text.primary',
              }}
            >
              {day}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {dayEvents.slice(0, 2).map(event => (
                <Chip
                  key={event.id}
                  size="small"
                  label={event.title}
                  color={getCategoryColor(event.category)}
                  sx={{ mb: 0.5, height: 'auto', fontSize: '0.7rem' }}
                />
              ))}
              {dayEvents.length > 2 && (
                <Typography variant="caption" color="text.secondary">
                  +{dayEvents.length - 2} lainnya
                </Typography>
              )}
            </Box>
          </Box>
        </Grid>
      );
    }

    return days;
  };

  // Removed selectedDateEvents since it's not used

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Kalender Akademik
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kelola jadwal dan acara penting
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Calendar Section */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                {/* Calendar Header */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <IconButton onClick={() => navigateMonth(-1)}>
                    <PrevIcon />
                  </IconButton>
                  <Typography variant="h5">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </Typography>
                  <IconButton onClick={() => navigateMonth(1)}>
                    <NextIcon />
                  </IconButton>
                </Box>

                {/* Day Names */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                  {days.map(day => (
                    <Grid item xs={1.7} key={day}>
                      <Typography
                        variant="body2"
                        align="center"
                        color="text.secondary"
                      >
                        {day}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>

                {/* Calendar Days */}
                <Grid container spacing={1}>
                  {renderCalendarDays()}
                </Grid>

                {/* Add Event Button */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                  >
                    Tambah Acara
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Events Panel */}
          <Grid item xs={12} md={4}>
            {/* Search and Filter */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Cari acara..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />

                <FormControl fullWidth>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    value={selectedCategory}
                    label="Kategori"
                    onChange={e => setSelectedCategory(e.target.value)}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>

            {/* Event Statistics */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BarChartIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Statistik Acara</Typography>
                </Box>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Total Acara: {eventStats.total}
                </Typography>
                
                {Object.entries(eventStats.categories).map(([category, count]) => (
                  <Box key={category} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">{category}</Typography>
                      <Typography variant="body2">{count}</Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(count / eventStats.total) * 100} 
                      color={getCategoryColor(category)} 
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>

            {/* Today's Events */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TodayIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Acara Hari Ini</Typography>
                </Box>

                {getFilteredTodaysEvents().length === 0 ? (
                  <Typography color="text.secondary">
                    Tidak ada acara hari ini
                  </Typography>
                ) : (
                  <List>
                    {getFilteredTodaysEvents().map(event => (
                      <ListItem
                        key={event.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={event.title}
                          secondary={`${event.time} - ${event.category}`}
                        />
                        <Chip
                          label={event.priority}
                          color={getPriorityColor(event.priority)}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>

            {/* This Week's Events */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EventIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Acara Minggu Ini</Typography>
                </Box>

                {getFilteredThisWeeksEvents().length === 0 ? (
                  <Typography color="text.secondary">
                    Tidak ada acara minggu ini
                  </Typography>
                ) : (
                  <List>
                    {getFilteredThisWeeksEvents().map(event => (
                      <ListItem
                        key={event.id}
                        sx={{
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={event.title}
                          secondary={`${formatDate(event.date)} ${
                            event.time
                          } - ${event.category}`}
                        />
                        <Chip
                          label={event.priority}
                          color={getPriorityColor(event.priority)}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Selected Date Events */}
        {selectedDate && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Acara pada {selectedDate.toLocaleDateString('id-ID')}
              </Typography>

              {getEventsForDay(selectedDate.getDate()).length === 0 ? (
                <Typography color="text.secondary">
                  Tidak ada acara pada tanggal ini
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {getEventsForDay(selectedDate.getDate()).map(event => (
                    <Grid item xs={12} key={event.id}>
                      <Card>
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 1,
                            }}
                          >
                            <Typography variant="h6">{event.title}</Typography>
                            <Chip
                              label={event.category}
                              color={getCategoryColor(event.category)}
                              size="small"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {event.description}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mt: 2,
                            }}
                          >
                            <Typography variant="body2">
                              {event.time}
                            </Typography>
                            <Chip
                              label={event.priority}
                              color={getPriorityColor(event.priority)}
                              size="small"
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Add/Edit Event Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
        <DialogTitle>
          {editingEvent ? 'Edit Acara' : 'Tambah Acara Baru'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Judul Acara"
            type="text"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="date"
            label="Tanggal"
            type="date"
            fullWidth
            variant="outlined"
            value={formData.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="time"
            label="Waktu"
            type="time"
            fullWidth
            variant="outlined"
            value={formData.time}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Deskripsi"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Kategori</InputLabel>
            <Select
              name="category"
              value={formData.category}
              label="Kategori"
              onChange={handleChange}
            >
              <MenuItem value="Akademik">Akademik</MenuItem>
              <MenuItem value="Kegiatan">Kegiatan</MenuItem>
              <MenuItem value="Tugas">Tugas</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Prioritas</InputLabel>
            <Select
              name="priority"
              value={formData.priority}
              label="Prioritas"
              onChange={handleChange}
            >
              <MenuItem value="high">Tinggi</MenuItem>
              <MenuItem value="medium">Sedang</MenuItem>
              <MenuItem value="low">Rendah</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingEvent ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EnhancedCalendar;