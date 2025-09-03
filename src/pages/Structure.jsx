import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Structure = ({ darkMode, toggleDarkMode }) => {
  // Sample structure data
  const classStructure = {
    className: 'XI TKJ 3',
    totalStudents: 32,
    homeroomTeacher: 'Bapak Suharto, S.Pd.',
    classCommittee: {
      chairman: 'Andi Prasetyo',
      viceChairman: 'Siti Nurhaliza',
      secretary: 'Budi Santoso',
      treasurer: 'Rina Permata',
    },
    mainSubjects: [
      'Teknik Komputer dan Jaringan',
      'Matematika',
      'Bahasa Indonesia',
      'Bahasa Inggris',
      'Ilmu Pengetahuan Alam',
      'Ilmu Pengetahuan Sosial',
      'Pendidikan Pancasila dan Kewarganegaraan',
      'Pendidikan Agama',
      'Seni Budaya',
      'Pendidikan Jasmani dan Kesehatan',
    ],
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Struktur Kelas
        </Typography>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            {classStructure.className}
          </Typography>
          <Typography variant="h6" align="center" paragraph>
            Jumlah Siswa: {classStructure.totalStudents} | Wali Kelas:{' '}
            {classStructure.homeroomTeacher}
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Struktur Kepengurusan
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="Ketua Kelas"
                      secondary={classStructure.classCommittee.chairman}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Wakil Ketua Kelas"
                      secondary={classStructure.classCommittee.viceChairman}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Sekretaris"
                      secondary={classStructure.classCommittee.secretary}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Bendahara"
                      secondary={classStructure.classCommittee.treasurer}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Mata Pelajaran Utama
                </Typography>
                <List>
                  {classStructure.mainSubjects.map((subject, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={`${index + 1}. ${subject}`} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body1" paragraph>
            Kelas XI TKJ 3 merupakan salah satu kelas jurusan Teknik Komputer
            dan Jaringan di SMK Negeri 1 Kota Bekasi. Kelas ini berisi 32 siswa
            yang dipimpin oleh Bapak Suharto, S.Pd. sebagai wali kelas.
          </Typography>
          <Typography variant="body1">
            Struktur kepengurusan kelas ini bertujuan untuk membantu kelancaran
            kegiatan belajar mengajar dan memfasilitasi berbagai kegiatan
            ekstrakurikuler dan kegiatan lainnya.
          </Typography>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Structure;
