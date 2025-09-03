import {
  Forum as ForumIcon,
  Group as GroupIcon,
  Lightbulb as LightbulbIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';
import usePeerCollaborationContext from '../../hooks/usePeerCollaboration';

const ManagePeerCollaboration = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const {
    connections,
    collaborations,
    knowledgeSharing,
    mentorshipRequests,
    collaborationForums, // Add forums data
    getConnections,
    getCollaborationsByStudent,
    getKnowledgeByStudent,
    getMentorshipRequestsByStudent,
  } = usePeerCollaborationContext();

  const [statistics, setStatistics] = useState({
    totalConnections: 0,
    totalCollaborations: 0,
    totalKnowledgeShared: 0,
    totalMentorshipRequests: 0,
    activeCollaborations: 0,
    acceptedMentorships: 0,
    totalForums: 0, // Add forum statistics
    totalForumPosts: 0, // Add post statistics
  });

  const [collaborationData, setCollaborationData] = useState([]);
  const [knowledgeData, setKnowledgeData] = useState([]);
  const [connectionData, setConnectionData] = useState([]);
  const [forumData, setForumData] = useState([]); // Add forum data state

  // Calculate statistics
  useEffect(() => {
    const totalConnections = connections.length;
    const totalCollaborations = collaborations.length;
    const totalKnowledgeShared = knowledgeSharing.length;
    const totalMentorshipRequests = mentorshipRequests.length;
    const activeCollaborations = collaborations.filter(
      c => c.status === 'active'
    ).length;
    const acceptedMentorships = mentorshipRequests.filter(
      r => r.status === 'accepted'
    ).length;

    // Forum statistics
    const totalForums = collaborationForums.length;
    let totalForumPosts = 0;
    collaborationForums.forEach(forum => {
      totalForumPosts += forum.posts.length;
    });

    setStatistics({
      totalConnections,
      totalCollaborations,
      totalKnowledgeShared,
      totalMentorshipRequests,
      activeCollaborations,
      acceptedMentorships,
      totalForums,
      totalForumPosts,
    });

    // Prepare collaboration data by subject
    const subjectCollaborations = {};
    collaborations.forEach(collab => {
      if (!subjectCollaborations[collab.subject]) {
        subjectCollaborations[collab.subject] = 0;
      }
      subjectCollaborations[collab.subject]++;
    });

    const collaborationChartData = Object.keys(subjectCollaborations).map(
      subject => ({
        name: subject,
        collaborations: subjectCollaborations[subject],
      })
    );
    setCollaborationData(collaborationChartData);

    // Prepare knowledge sharing data by subject
    const subjectKnowledge = {};
    knowledgeSharing.forEach(knowledge => {
      if (!subjectKnowledge[knowledge.subject]) {
        subjectKnowledge[knowledge.subject] = 0;
      }
      subjectKnowledge[knowledge.subject]++;
    });

    const knowledgeChartData = Object.keys(subjectKnowledge).map(subject => ({
      name: subject,
      knowledge: subjectKnowledge[subject],
    }));
    setKnowledgeData(knowledgeChartData);

    // Prepare connection data by student
    const studentConnections = {};
    connections.forEach(conn => {
      const studentId = conn.studentId;
      if (!studentConnections[studentId]) {
        studentConnections[studentId] = 0;
      }
      studentConnections[studentId]++;
    });

    const connectionChartData = Object.keys(studentConnections)
      .map(studentId => {
        const student = students.find(s => s.id === parseInt(studentId));
        return {
          name: student ? student.name : `Student ${studentId}`,
          connections: studentConnections[studentId],
        };
      })
      .sort((a, b) => b.connections - a.connections)
      .slice(0, 10); // Top 10 students
    setConnectionData(connectionChartData);

    // Prepare forum data by collaboration
    const collaborationForumCount = {};
    collaborationForums.forEach(forum => {
      const collaboration = collaborations.find(
        c => c.id === forum.collaborationId
      );
      const collaborationName = collaboration
        ? collaboration.title
        : 'Unknown Collaboration';
      if (!collaborationForumCount[collaborationName]) {
        collaborationForumCount[collaborationName] = 0;
      }
      collaborationForumCount[collaborationName]++;
    });

    const forumChartData = Object.keys(collaborationForumCount).map(name => ({
      name,
      forums: collaborationForumCount[name],
    }));
    setForumData(forumChartData);

    addActivity(
      'Mengakses Manajemen Kolaborasi Teman',
      'Admin membuka halaman manajemen kolaborasi teman'
    );
  }, [
    connections,
    collaborations,
    knowledgeSharing,
    mentorshipRequests,
    collaborationForums, // Add to dependency array
    students,
    addActivity,
  ]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Typography variant="h4">Manajemen Kolaborasi Teman</Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.totalConnections}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Koneksi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <GroupIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.totalCollaborations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Kolaborasi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <LightbulbIcon
                  sx={{ fontSize: 40, color: 'info.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.totalKnowledgeShared}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pengetahuan Dibagikan
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon
                  sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.totalMentorshipRequests}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permintaan Mentor
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <GroupIcon
                  sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.activeCollaborations}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kolaborasi Aktif
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon
                  sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.acceptedMentorships}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mentorship Diterima
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ForumIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4">{statistics.totalForums}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Forum
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ForumIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.totalForumPosts}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Posting Forum
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Collaboration by Subject */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kolaborasi per Mata Pelajaran
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={collaborationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="collaborations"
                        fill="#8884d8"
                        name="Jumlah Kolaborasi"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Knowledge Sharing by Subject */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Pengetahuan Dibagikan per Mata Pelajaran
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={knowledgeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="knowledge"
                      >
                        {knowledgeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => [value, 'Pengetahuan']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Connected Students */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  10 Siswa dengan Koneksi Terbanyak
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={connectionData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="connections"
                        fill="#00C49F"
                        name="Jumlah Koneksi"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Forum Activity Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Forum per Kolaborasi
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={forumData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="forums"
                        fill="#FF8042"
                        name="Jumlah Forum"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Aktivitas Terbaru
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Kolaborasi Terbaru
                </Typography>
                {collaborations.slice(-5).map((collab, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>{collab.title}</strong> - {collab.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(collab.createdAt).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Pengetahuan Terbaru
                </Typography>
                {knowledgeSharing.slice(-5).map((knowledge, index) => (
                  <Box
                    key={index}
                    sx={{
                      mb: 1,
                      p: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="body2">
                      <strong>{knowledge.title}</strong> - {knowledge.subject}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(knowledge.sharedAt).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Manajemen Kolaborasi Teman
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Memantau Koneksi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan statistik koneksi untuk mengidentifikasi siswa yang
                  aktif berinteraksi dengan teman sekelasnya.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mendorong Kolaborasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dorong siswa untuk membuat kolaborasi berdasarkan mata
                  pelajaran dengan melihat data kolaborasi per subjek.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Meningkatkan Pengetahuan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan data pengetahuan yang dibagikan untuk mengidentifikasi
                  topik yang paling banyak dibahas oleh siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  4. Mendorong Diskusi Forum
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pantau aktivitas forum untuk memastikan siswa berdiskusi
                  secara aktif dalam kolaborasi mereka.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  5. Meningkatkan Partisipasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Identifikasi kolaborasi dengan forum aktif dan dorong
                  partisipasi lebih banyak dari siswa lainnya.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ManagePeerCollaboration;
