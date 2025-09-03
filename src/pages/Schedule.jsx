import {
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Schedule = ({ darkMode, toggleDarkMode }) => {
  // Sample schedule data
  const scheduleData = [
    {
      day: 'Senin',
      subjects: ['Matematika', 'Bahasa Indonesia', 'IPA', 'IPS', 'Olahraga'],
    },
    {
      day: 'Selasa',
      subjects: [
        'Bahasa Inggris',
        'PKn',
        'Matematika',
        'Seni Budaya',
        'Prakarya',
      ],
    },
    {
      day: 'Rabu',
      subjects: ['IPA', 'IPS', 'Bahasa Indonesia', 'Bahasa Inggris', 'Agama'],
    },
    {
      day: 'Kamis',
      subjects: ['PKn', 'Matematika', 'Olahraga', 'TIK', 'Bimbingan Konseling'],
    },
    {
      day: 'Jumat',
      subjects: ['Agama', 'Seni Budaya', 'Prakarya', 'Matematika', 'Eskul'],
    },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Jadwal Pelajaran
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Jadwal Harian Kelas XI TKJ 3
          </Typography>
          <Typography variant="body1" paragraph>
            Berikut adalah jadwal pelajaran harian untuk kelas XI TKJ 3. Jadwal
            ini berlaku untuk setiap minggu selama semester ganjil tahun ajaran
            2025/2026.
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="jadwal pelajaran">
            <TableHead>
              <TableRow>
                <TableCell>Hari</TableCell>
                <TableCell align="center">Jam 1</TableCell>
                <TableCell align="center">Jam 2</TableCell>
                <TableCell align="center">Jam 3</TableCell>
                <TableCell align="center">Jam 4</TableCell>
                <TableCell align="center">Jam 5</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleData.map(row => (
                <TableRow
                  key={row.day}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.day}
                  </TableCell>
                  {row.subjects.map((subject, index) => (
                    <TableCell align="center" key={index}>
                      {subject}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Keterangan:
          </Typography>
          <Typography variant="body2">
            - Jam pelajaran dimulai pukul 07.00 WIB
            <br />
            - Istirahat pertama pukul 09.30-10.00 WIB
            <br />
            - Istirahat kedua pukul 12.30-13.00 WIB
            <br />- Pulang sekolah pukul 15.30 WIB
          </Typography>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Schedule;
