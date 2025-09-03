import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Typography,
} from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Announcements = ({ darkMode, toggleDarkMode }) => {
  // Sample announcements data
  const announcements = [
    {
      id: 1,
      title: 'Ujian Tengah Semester',
      date: '15 Agustus 2025',
      category: 'Akademik',
      content:
        'Ujian tengah semester akan dilaksanakan pada tanggal 20-25 Agustus 2025. Silakan mempersiapkan diri dengan belajar sesuai jadwal yang telah ditentukan.',
      image: 'https://source.unsplash.com/random/800x400/?exam',
    },
    {
      id: 2,
      title: 'Kegiatan Study Tour',
      date: '10 Agustus 2025',
      category: 'Kegiatan',
      content:
        'Study tour ke Museum Teknologi akan dilaksanakan pada hari Jumat, 22 Agustus 2025. Siswa diwajibkan membawa bekal dan pakaian yang nyaman.',
      image: 'https://source.unsplash.com/random/800x400/?museum',
    },
    {
      id: 3,
      title: 'Pengumpulan Tugas Proyek',
      date: '5 Agustus 2025',
      category: 'Tugas',
      content:
        'Batas akhir pengumpulan tugas proyek akhir semester adalah 30 Agustus 2025. Tugas dikumpulkan secara digital melalui Google Classroom.',
      image: 'https://source.unsplash.com/random/800x400/?project',
    },
    {
      id: 4,
      title: 'Libur Hari Kemerdekaan',
      date: '1 Agustus 2025',
      category: 'Pengumuman',
      content:
        'Sekolah diliburkan pada hari Senin, 17 Agustus 2025 dalam rangka memperingati Hari Kemerdekaan Republik Indonesia ke-79.',
      image: 'https://source.unsplash.com/random/800x400/?flag',
    },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Pengumuman Kelas
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Informasi Terkini
          </Typography>
          <Typography variant="body1" paragraph>
            Temukan pengumuman penting, jadwal ujian, kegiatan sekolah, dan
            informasi lainnya di sini.
          </Typography>
        </Box>

        {announcements.map(announcement => (
          <Card
            key={announcement.id}
            sx={{
              mb: 4,
              boxShadow: 3,
              borderRadius: 2,
            }}
          >
            <CardMedia
              component="img"
              height="200"
              image={announcement.image}
              alt={announcement.title}
            />
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h5" component="h2">
                  {announcement.title}
                </Typography>
                <Chip
                  label={announcement.category}
                  color={
                    announcement.category === 'Akademik'
                      ? 'primary'
                      : announcement.category === 'Kegiatan'
                      ? 'secondary'
                      : announcement.category === 'Tugas'
                      ? 'success'
                      : 'info'
                  }
                />
              </Box>
              <Typography variant="body2" color="text.secondary" paragraph>
                {announcement.date}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body1" paragraph>
                {announcement.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Container>

      <Footer />
    </div>
  );
};

export default Announcements;
