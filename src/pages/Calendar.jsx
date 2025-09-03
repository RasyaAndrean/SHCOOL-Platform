import {
  Announcement as AnnouncementIcon,
  CalendarToday as CalendarIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useDataContext } from '../contexts/DataContext';

const Calendar = ({ darkMode, toggleDarkMode }) => {
  const { announcements } = useDataContext();
  const [events, setEvents] = useState([]);

  // Process announcements to extract events
  useEffect(() => {
    const eventList = announcements.map(announcement => ({
      id: announcement.id,
      title: announcement.title,
      date: announcement.date,
      category: announcement.category,
      content: announcement.content,
    }));

    // Sort events by date (this is a simplified version - in a real app, you'd parse dates properly)
    setEvents(eventList.sort((a, b) => a.date.localeCompare(b.date)));
  }, [announcements]);

  // Group events by month
  const groupEventsByMonth = () => {
    const grouped = {};
    events.forEach(event => {
      const month = event.date.split(' ')[1] || 'Bulan Tidak Diketahui';
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByMonth();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kalender Kelas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Jadwal kegiatan dan pengumuman penting
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {Object.keys(groupedEvents).length > 0 ? (
              Object.entries(groupedEvents).map(([month, monthEvents]) => (
                <Card key={month} sx={{ mb: 4 }}>
                  <CardContent>
                    <Typography
                      variant="h5"
                      gutterBottom
                      sx={{ display: 'flex', alignItems: 'center' }}
                    >
                      <CalendarIcon sx={{ mr: 1 }} />
                      {month}
                    </Typography>
                    <List>
                      {monthEvents.map((event, index) => (
                        <Box key={event.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemIcon>
                              <EventIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography variant="h6" component="div">
                                  {event.title}
                                </Typography>
                              }
                              secondary={
                                <>
                                  <Chip
                                    label={event.category}
                                    size="small"
                                    sx={{ mr: 1, mb: 1 }}
                                    color={
                                      event.category === 'Akademik'
                                        ? 'primary'
                                        : event.category === 'Kegiatan'
                                        ? 'secondary'
                                        : event.category === 'Tugas'
                                        ? 'success'
                                        : 'default'
                                    }
                                  />
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {event.date}
                                  </Typography>
                                  <Typography variant="body2" sx={{ mt: 1 }}>
                                    {event.content}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                          {index < monthEvents.length - 1 && <Divider />}
                        </Box>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <EventIcon
                    sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Tidak ada acara terjadwal
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Pengumuman penting akan muncul di sini
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <AnnouncementIcon sx={{ mr: 1 }} />
                  Kategori
                </Typography>
                <List>
                  <ListItem>
                    <Chip label="Akademik" color="primary" variant="outlined" />
                  </ListItem>
                  <ListItem>
                    <Chip
                      label="Kegiatan"
                      color="secondary"
                      variant="outlined"
                    />
                  </ListItem>
                  <ListItem>
                    <Chip label="Tugas" color="success" variant="outlined" />
                  </ListItem>
                  <ListItem>
                    <Chip
                      label="Pengumuman"
                      color="default"
                      variant="outlined"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>

            <Card sx={{ mt: 4 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Panduan Kalender
                </Typography>
                <Typography variant="body2" paragraph>
                  Kalender ini menampilkan semua pengumuman penting yang telah
                  dipublikasikan oleh admin kelas.
                </Typography>
                <Typography variant="body2" paragraph>
                  Setiap pengumuman dikategorikan untuk memudahkan Anda
                  menemukan informasi yang relevan.
                </Typography>
                <Typography variant="body2">
                  Periksa kalender secara berkala untuk tetap update dengan
                  kegiatan kelas.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default Calendar;
