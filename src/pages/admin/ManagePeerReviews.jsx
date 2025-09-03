import {
  BarChart as BarChartIcon,
  RateReview as RateReviewIcon,
  Work as WorkIcon,
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
import { useDataContext } from '../../contexts/DataContext';
import { useProjectContext } from '../../contexts/ProjectContext';

const ManagePeerReviews = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const { getAllProjects, getPeerReviews } = useProjectContext();

  const [statistics, setStatistics] = useState({
    totalProjects: 0,
    totalReviews: 0,
    averageRating: 0,
    mostReviewedProject: null,
  });

  const [reviewData, setReviewData] = useState([]);
  const [projectReviewData, setProjectReviewData] = useState([]);

  // Calculate statistics
  useEffect(() => {
    const projects = getAllProjects();
    const allReviews = projects.flatMap(project =>
      getPeerReviews(project.id).map(review => ({
        ...review,
        projectTitle: project.title,
        projectStudentId: project.studentId,
      }))
    );

    // Calculate statistics
    const totalProjects = projects.length;
    const totalReviews = allReviews.length;
    const averageRating =
      totalReviews > 0
        ? (
            allReviews.reduce((sum, review) => sum + review.rating, 0) /
            totalReviews
          ).toFixed(1)
        : 0;

    // Find most reviewed project
    const projectReviewCounts = {};
    projects.forEach(project => {
      projectReviewCounts[project.id] = getPeerReviews(project.id).length;
    });

    const mostReviewedProjectId = Object.keys(projectReviewCounts).sort(
      (a, b) => projectReviewCounts[b] - projectReviewCounts[a]
    )[0];

    const mostReviewedProject = mostReviewedProjectId
      ? projects.find(p => p.id === parseInt(mostReviewedProjectId))
      : null;

    setStatistics({
      totalProjects,
      totalReviews,
      averageRating,
      mostReviewedProject,
    });

    // Prepare review data by rating
    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    allReviews.forEach(review => {
      ratingCounts[review.rating]++;
    });

    const reviewChartData = Object.keys(ratingCounts).map(rating => ({
      name: `${rating} Bintang`,
      reviews: ratingCounts[rating],
    }));
    setReviewData(reviewChartData);

    // Prepare project review data
    const projectReviewChartData = projects
      .map(project => ({
        name:
          project.title.length > 50
            ? `${project.title.substring(0, 50)}...`
            : project.title,
        reviews: getPeerReviews(project.id).length,
      }))
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 10); // Top 10 projects
    setProjectReviewData(projectReviewChartData);

    addActivity(
      'Mengakses Manajemen Peer Review',
      'Admin membuka halaman manajemen peer review proyek'
    );
  }, [getAllProjects, getPeerReviews, addActivity]);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Typography variant="h4">Manajemen Peer Review</Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <WorkIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4">{statistics.totalProjects}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Proyek
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <RateReviewIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">{statistics.totalReviews}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Review
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChartIcon
                  sx={{ fontSize: 40, color: 'info.main', mb: 1 }}
                />
                <Typography variant="h4">{statistics.averageRating}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Rata-rata Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Proyek Paling Direview
                </Typography>
                {statistics.mostReviewedProject ? (
                  <>
                    <Typography variant="body1">
                      {statistics.mostReviewedProject.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      oleh{' '}
                      {getStudentName(statistics.mostReviewedProject.studentId)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {getPeerReviews(statistics.mostReviewedProject.id).length}{' '}
                      review
                    </Typography>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Tidak ada review
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Reviews by Rating */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribusi Review berdasarkan Rating
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reviewData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="reviews"
                      >
                        {reviewData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => [value, 'Review']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Reviewed Projects */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  10 Proyek Paling Banyak Direview
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={projectReviewData}
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
                        dataKey="reviews"
                        fill="#82ca9d"
                        name="Jumlah Review"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Reviews */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Review Terbaru
            </Typography>
            <Grid container spacing={2}>
              {getAllProjects()
                .slice(-5)
                .map(project => {
                  const reviews = getPeerReviews(project.id);
                  const latestReview =
                    reviews.length > 0 ? reviews[reviews.length - 1] : null;

                  return latestReview ? (
                    <Grid item xs={12} key={project.id}>
                      <Box
                        sx={{
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1">
                            {project.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            oleh {getStudentName(project.studentId)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <Typography variant="body2" sx={{ mr: 2 }}>
                            Reviewer: {getStudentName(latestReview.reviewerId)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {[...Array(5)].map((_, i) => (
                              <RateReviewIcon
                                key={i}
                                sx={{
                                  color:
                                    i < latestReview.rating
                                      ? 'gold'
                                      : 'grey.300',
                                  fontSize: '1rem',
                                }}
                              />
                            ))}
                            <Typography variant="body2" sx={{ ml: 1 }}>
                              {latestReview.rating}/5
                            </Typography>
                          </Box>
                        </Box>
                        {latestReview.comment && (
                          <Typography variant="body2" color="text.secondary">
                            "{latestReview.comment}"
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {new Date(latestReview.timestamp).toLocaleString(
                            'id-ID'
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null;
                })}
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Manajemen Peer Review
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Memantau Keterlibatan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan statistik untuk memantau seberapa aktif siswa dalam
                  memberikan review terhadap proyek teman sekelasnya.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Meningkatkan Kualitas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analisis distribusi rating untuk mengidentifikasi proyek yang
                  membutuhkan perbaikan atau yang menjadi contoh baik.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Mendorong Kolaborasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan data untuk mendorong kolaborasi yang lebih baik dengan
                  mengenali proyek-proyek yang mendapat banyak perhatian.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ManagePeerReviews;
