import {
  Clear as ClearIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useClassroomContext } from '../../contexts/ClassroomContext';
import { useDataContext } from '../../contexts/DataContext';
import { useLibraryContext } from '../../contexts/LibraryContext';

const Statistics = ({ darkMode, toggleDarkMode }) => {
  const { announcements, students, gallery, resources } = useDataContext();
  const { activities, clearActivities } = useActivityContext();
  const { classrooms, reservations } = useClassroomContext();
  const { libraryItems, bookmarks } = useLibraryContext();
  const { addNotification } = useAppContext();

  // Log statistics access activity
  useEffect(() => {
    addNotification('Mengakses halaman statistik', 'info');
  }, [addNotification]);

  // Sample data for charts (in a real app, this would come from actual data)
  const assignmentData = [
    { name: 'Jaringan Komputer', count: 5 },
    { name: 'Pemrograman Web', count: 3 },
    { name: 'Sistem Operasi', count: 2 },
    { name: 'Desain Grafis', count: 4 },
  ];

  const libraryData = [
    {
      name: 'Buku',
      count: libraryItems.filter(item => item.type === 'book').length,
    },
    {
      name: 'Dokumen',
      count: libraryItems.filter(item => item.type === 'document').length,
    },
    {
      name: 'Video',
      count: libraryItems.filter(item => item.type === 'video').length,
    },
    {
      name: 'Audio',
      count: libraryItems.filter(item => item.type === 'audio').length,
    },
  ];

  const announcementData = [
    {
      name: 'Akademik',
      count: announcements.filter(a => a.category === 'Akademik').length,
    },
    {
      name: 'Kegiatan',
      count: announcements.filter(a => a.category === 'Kegiatan').length,
    },
    {
      name: 'Tugas',
      count: announcements.filter(a => a.category === 'Tugas').length,
    },
    {
      name: 'Pengumuman',
      count: announcements.filter(a => a.category === 'Pengumuman').length,
    },
  ];

  const studentRolesData = [
    {
      name: 'Ketua Kelas',
      count: students.filter(s => s.role === 'Ketua Kelas').length,
    },
    {
      name: 'Wakil Ketua',
      count: students.filter(s => s.role === 'Wakil Ketua').length,
    },
    {
      name: 'Sekretaris',
      count: students.filter(s => s.role === 'Sekretaris').length,
    },
    {
      name: 'Bendahara',
      count: students.filter(s => s.role === 'Bendahara').length,
    },
    { name: 'Siswa', count: students.filter(s => s.role === 'Siswa').length },
  ];

  const resourceTypesData = [
    {
      name: 'Dokumen',
      count: resources.filter(r => r.type === 'document').length,
    },
    { name: 'Video', count: resources.filter(r => r.type === 'video').length },
    { name: 'Kode', count: resources.filter(r => r.type === 'code').length },
    { name: 'Tautan', count: resources.filter(r => r.type === 'link').length },
  ];

  // Timeline data for activity
  const activityTimeline = [
    { date: '1 Jun', announcements: 2, students: 5, gallery: 3, resources: 4 },
    { date: '8 Jun', announcements: 4, students: 3, gallery: 2, resources: 6 },
    { date: '15 Jun', announcements: 1, students: 7, gallery: 5, resources: 2 },
    { date: '22 Jun', announcements: 3, students: 2, gallery: 4, resources: 5 },
    { date: '29 Jun', announcements: 5, students: 4, gallery: 6, resources: 3 },
  ];

  // Additional statistics
  const totalActivities = activities.length;

  // Calculate activities by type
  const activityTypes = activities.reduce((acc, activity) => {
    const action = activity.action;
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});

  const activityTypeData = Object.entries(activityTypes).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  // New statistics for assignments and library
  const assignmentStats = [
    { name: 'Total Tugas', value: 15 },
    { name: 'Tugas Terkumpul', value: 12 },
    { name: 'Tugas Terlambat', value: 2 },
  ];

  const libraryStats = [
    { name: 'Total Item', value: libraryItems.length },
    {
      name: 'Item Terunduh',
      value: libraryItems.reduce((sum, item) => sum + (item.downloads || 0), 0),
    },
    {
      name: 'Kategori',
      value: [...new Set(libraryItems.map(item => item.category))].length,
    },
    { name: 'Bookmark', value: bookmarks.length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Statistics cards data
  const statsData = [
    {
      title: 'Total Pengumuman',
      value: announcements.length,
      color: 'primary',
      icon: '📢',
    },
    {
      title: 'Total Siswa',
      value: students.length,
      color: 'secondary',
      icon: '👥',
    },
    {
      title: 'Item Galeri',
      value: gallery.length,
      color: 'success',
      icon: '📸',
    },
    {
      title: 'Sumber Belajar',
      value: resources.length,
      color: 'info',
      icon: '📚',
    },
    {
      title: 'Aktivitas',
      value: totalActivities,
      color: 'warning',
      icon: '📈',
    },
    {
      title: 'Total Tugas',
      value: 15,
      color: 'error',
      icon: '📝',
    },
    {
      title: 'Item Perpustakaan',
      value: libraryItems.length,
      color: 'primary',
      icon: '📖',
    },
    {
      title: 'Ruang Kelas',
      value: classrooms.length,
      color: 'secondary',
      icon: '🏫',
    },
    {
      title: 'Reservasi',
      value: reservations.length,
      color: 'success',
      icon: '📅',
    },
  ];

  const handleExportData = () => {
    addNotification('Data statistik diekspor', 'success');
    // In a real app, this would export the data
  };

  const handleClearActivities = () => {
    clearActivities();
    addNotification('Riwayat aktivitas dihapus', 'info');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            Statistik dan Analitik
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Lihat performa dan aktivitas website kelas Anda
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExportData}
              sx={{ mr: 2 }}
            >
              Ekspor Data
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<ClearIcon />}
              onClick={handleClearActivities}
            >
              Hapus Aktivitas
            </Button>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {statsData.map((stat, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h4">{stat.value}</Typography>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: `${stat.color}.main`,
                        color: 'white',
                      }}
                    >
                      <Typography variant="h4">{stat.icon}</Typography>
                    </Avatar>
                  </Box>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4}>
          {/* Activity Type Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Aktivitas Berdasarkan Tipe
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {activityTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Assignment Categories Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tugas Berdasarkan Mata Pelajaran
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={assignmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8">
                        {assignmentData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Library Resources Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Item Perpustakaan Berdasarkan Tipe
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={libraryData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Resource Types Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Sumber Belajar Berdasarkan Tipe
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={resourceTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {resourceTypesData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Classroom Reservations Chart */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Status Reservasi Ruang Kelas
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: 'Dikonfirmasi',
                          count: reservations.filter(
                            r => r.status === 'confirmed'
                          ).length,
                        },
                        {
                          name: 'Menunggu',
                          count: reservations.filter(
                            r => r.status === 'pending'
                          ).length,
                        },
                        {
                          name: 'Ditolak',
                          count: reservations.filter(
                            r => r.status === 'rejected'
                          ).length,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Library Bookmark Statistics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Statistik Perpustakaan
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Total Item', count: libraryItems.length },
                        { name: 'Total Bookmark', count: bookmarks.length },
                        {
                          name: 'Unduhan',
                          count: libraryItems.reduce(
                            (sum, item) => sum + (item.downloads || 0),
                            0
                          ),
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Activity Timeline */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Timeline Aktivitas
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activityTimeline}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="announcements"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                  />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                  />
                  <Area
                    type="monotone"
                    dataKey="gallery"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                  />
                  <Area
                    type="monotone"
                    dataKey="resources"
                    stackId="1"
                    stroke="#ff7300"
                    fill="#ff7300"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Aktivitas Terbaru
            </Typography>
            <List>
              {activities.slice(0, 5).map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem>
                    <ListItemText
                      primary={activity.action}
                      secondary={`${activity.details} - ${activity.timestamp}`}
                    />
                  </ListItem>
                  {index < Math.min(5, activities.length) - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Statistics;
