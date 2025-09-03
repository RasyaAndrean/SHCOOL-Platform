import {
  Add as AddIcon,
  Book as BookIcon,
  Business as BusinessIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  EmojiEvents as EmojiEventsIcon,
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
  Divider,
  Grid,
  IconButton,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAlumniContext } from '../../contexts/AlumniContext';

const ManageAlumniCareers = ({ darkMode, toggleDarkMode }) => {
  const {
    careerResources,
    successStories,
    jobOpportunities,
    addCareerResource,
    updateCareerResource,
    deleteCareerResource,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    addJobOpportunity,
    updateJobOpportunity,
    deleteJobOpportunity,
  } = useAlumniContext();
  const { addActivity } = useActivityContext();
  const [activeTab, setActiveTab] = useState(0);

  // Career Resources states
  const [openResourceDialog, setOpenResourceDialog] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [resourceFormData, setResourceFormData] = useState({
    title: '',
    category: '',
    description: '',
    link: '',
  });

  // Success Stories states
  const [openStoryDialog, setOpenStoryDialog] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyFormData, setStoryFormData] = useState({
    alumniId: '',
    title: '',
    content: '',
    image: '',
  });

  // Job Opportunities states
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: '',
    deadline: '',
  });

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Karir Alumni',
      'User membuka halaman kelola karir alumni'
    );
  }, [addActivity]);

  // Career Resources handlers
  const handleOpenResourceDialog = (resource = null) => {
    if (resource) {
      setEditingResource(resource);
      setResourceFormData({
        title: resource.title,
        category: resource.category,
        description: resource.description,
        link: resource.link,
      });
    } else {
      setEditingResource(null);
      setResourceFormData({
        title: '',
        category: '',
        description: '',
        link: '',
      });
    }
    setOpenResourceDialog(true);
  };

  const handleCloseResourceDialog = () => {
    setOpenResourceDialog(false);
    setEditingResource(null);
  };

  const handleResourceInputChange = e => {
    const { name, value } = e.target;
    setResourceFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResourceSubmit = () => {
    const resourceData = {
      ...resourceFormData,
    };

    if (editingResource) {
      updateCareerResource(editingResource.id, resourceData);
      addActivity(
        'Memperbarui Sumber Daya Karir',
        `User memperbarui sumber daya karir: ${resourceFormData.title}`
      );
    } else {
      addCareerResource(resourceData);
      addActivity(
        'Menambah Sumber Daya Karir',
        `User menambah sumber daya karir: ${resourceFormData.title}`
      );
    }
    handleCloseResourceDialog();
  };

  const handleDeleteResource = resource => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus sumber daya "${resource.title}"?`
      )
    ) {
      deleteCareerResource(resource.id);
      addActivity(
        'Menghapus Sumber Daya Karir',
        `User menghapus sumber daya karir: ${resource.title}`
      );
    }
  };

  // Success Stories handlers
  const handleOpenStoryDialog = (story = null) => {
    if (story) {
      setEditingStory(story);
      setStoryFormData({
        alumniId: story.alumniId,
        title: story.title,
        content: story.content,
        image: story.image,
      });
    } else {
      setEditingStory(null);
      setStoryFormData({
        alumniId: '',
        title: '',
        content: '',
        image: '',
      });
    }
    setOpenStoryDialog(true);
  };

  const handleCloseStoryDialog = () => {
    setOpenStoryDialog(false);
    setEditingStory(null);
  };

  const handleStoryInputChange = e => {
    const { name, value } = e.target;
    setStoryFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStorySubmit = () => {
    const storyData = {
      ...storyFormData,
      alumniId: parseInt(storyFormData.alumniId),
    };

    if (editingStory) {
      updateSuccessStory(editingStory.id, storyData);
      addActivity(
        'Memperbarui Kisah Sukses',
        `User memperbarui kisah sukses: ${storyFormData.title}`
      );
    } else {
      addSuccessStory(storyData);
      addActivity(
        'Menambah Kisah Sukses',
        `User menambah kisah sukses: ${storyFormData.title}`
      );
    }
    handleCloseStoryDialog();
  };

  const handleDeleteStory = story => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus kisah sukses "${story.title}"?`
      )
    ) {
      deleteSuccessStory(story.id);
      addActivity(
        'Menghapus Kisah Sukses',
        `User menghapus kisah sukses: ${story.title}`
      );
    }
  };

  // Job Opportunities handlers
  const handleOpenJobDialog = (job = null) => {
    if (job) {
      setEditingJob(job);
      setJobFormData({
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements.join(', '),
        deadline: job.deadline,
      });
    } else {
      setEditingJob(null);
      setJobFormData({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        requirements: '',
        deadline: '',
      });
    }
    setOpenJobDialog(true);
  };

  const handleCloseJobDialog = () => {
    setOpenJobDialog(false);
    setEditingJob(null);
  };

  const handleJobInputChange = e => {
    const { name, value } = e.target;
    setJobFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleJobSubmit = () => {
    const jobData = {
      ...jobFormData,
      requirements: jobFormData.requirements
        .split(',')
        .map(r => r.trim())
        .filter(r => r),
    };

    if (editingJob) {
      updateJobOpportunity(editingJob.id, jobData);
      addActivity(
        'Memperbarui Kesempatan Kerja',
        `User memperbarui kesempatan kerja: ${jobFormData.title}`
      );
    } else {
      addJobOpportunity(jobData);
      addActivity(
        'Menambah Kesempatan Kerja',
        `User menambah kesempatan kerja: ${jobFormData.title}`
      );
    }
    handleCloseJobDialog();
  };

  const handleDeleteJob = job => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus kesempatan kerja "${job.title}"?`
      )
    ) {
      deleteJobOpportunity(job.id);
      addActivity(
        'Menghapus Kesempatan Kerja',
        `User menghapus kesempatan kerja: ${job.title}`
      );
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Karir Alumni
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Atur sumber daya karir, kisah sukses, dan kesempatan kerja alumni
          </Typography>
        </Box>

        <Card>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
          >
            <Tab icon={<BookIcon />} label="Sumber Daya" />
            <Tab icon={<EmojiEventsIcon />} label="Kisah Sukses" />
            <Tab icon={<BusinessIcon />} label="Kesempatan Kerja" />
          </Tabs>

          <Divider />

          <CardContent>
            {activeTab === 0 && (
              <>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenResourceDialog()}
                  >
                    Tambah Sumber Daya
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Judul</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {careerResources.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography color="text.secondary">
                              Belum ada sumber daya karir
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        careerResources.map(resource => (
                          <TableRow key={resource.id}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {resource.title}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={resource.category}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {resource.description.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>{resource.createdAt}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleOpenResourceDialog(resource)
                                }
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteResource(resource)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {activeTab === 1 && (
              <>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenStoryDialog()}
                  >
                    Tambah Kisah Sukses
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Judul</TableCell>
                        <TableCell>Alumni</TableCell>
                        <TableCell>Isi</TableCell>
                        <TableCell>Tanggal</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {successStories.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} align="center">
                            <Typography color="text.secondary">
                              Belum ada kisah sukses alumni
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        successStories.map(story => (
                          <TableRow key={story.id}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {story.title}
                              </Typography>
                            </TableCell>
                            <TableCell>Alumni ID: {story.alumniId}</TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {story.content.substring(0, 50)}...
                              </Typography>
                            </TableCell>
                            <TableCell>{story.date}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenStoryDialog(story)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteStory(story)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}

            {activeTab === 2 && (
              <>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}
                >
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenJobDialog()}
                  >
                    Tambah Kesempatan Kerja
                  </Button>
                </Box>

                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Posisi</TableCell>
                        <TableCell>Perusahaan</TableCell>
                        <TableCell>Lokasi</TableCell>
                        <TableCell>Gaji</TableCell>
                        <TableCell>Deadline</TableCell>
                        <TableCell>Aksi</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {jobOpportunities.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} align="center">
                            <Typography color="text.secondary">
                              Belum ada kesempatan kerja
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        jobOpportunities.map(job => (
                          <TableRow key={job.id}>
                            <TableCell>
                              <Typography variant="subtitle2">
                                {job.title}
                              </Typography>
                            </TableCell>
                            <TableCell>{job.company}</TableCell>
                            <TableCell>{job.location}</TableCell>
                            <TableCell>
                              <Chip
                                label={job.salary}
                                size="small"
                                color="success"
                              />
                            </TableCell>
                            <TableCell>{job.deadline}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => handleOpenJobDialog(job)}
                                sx={{ mr: 1 }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteJob(job)}
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Karir Alumni
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Sumber Daya Karir
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tambahkan artikel, panduan, dan sumber daya yang membantu
                  siswa dalam pengembangan karir mereka.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Kisah Sukses Alumni
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bagikan kisah inspiratif dari alumni yang telah meraih
                  kesuksesan di bidang karir mereka.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Kesempatan Kerja
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publikasikan lowongan pekerjaan yang relevan untuk alumni dan
                  siswa yang akan lulus.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />

      {/* Dialog for Adding/Editing Career Resources */}
      <Dialog
        open={openResourceDialog}
        onClose={handleCloseResourceDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingResource
            ? 'Edit Sumber Daya Karir'
            : 'Tambah Sumber Daya Karir'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Judul"
                  name="title"
                  value={resourceFormData.title}
                  onChange={handleResourceInputChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kategori"
                  name="category"
                  value={resourceFormData.category}
                  onChange={handleResourceInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Link"
                  name="link"
                  value={resourceFormData.link}
                  onChange={handleResourceInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deskripsi"
                  name="description"
                  value={resourceFormData.description}
                  onChange={handleResourceInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResourceDialog}>Batal</Button>
          <Button
            onClick={handleResourceSubmit}
            variant="contained"
            disabled={!resourceFormData.title}
          >
            {editingResource ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding/Editing Success Stories */}
      <Dialog
        open={openStoryDialog}
        onClose={handleCloseStoryDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingStory ? 'Edit Kisah Sukses' : 'Tambah Kisah Sukses'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ID Alumni"
                  name="alumniId"
                  value={storyFormData.alumniId}
                  onChange={handleStoryInputChange}
                  margin="normal"
                  type="number"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Judul"
                  name="title"
                  value={storyFormData.title}
                  onChange={handleStoryInputChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Isi Kisah"
                  name="content"
                  value={storyFormData.content}
                  onChange={handleStoryInputChange}
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL Gambar"
                  name="image"
                  value={storyFormData.image}
                  onChange={handleStoryInputChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStoryDialog}>Batal</Button>
          <Button
            onClick={handleStorySubmit}
            variant="contained"
            disabled={!storyFormData.title || !storyFormData.alumniId}
          >
            {editingStory ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Adding/Editing Job Opportunities */}
      <Dialog
        open={openJobDialog}
        onClose={handleCloseJobDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingJob ? 'Edit Kesempatan Kerja' : 'Tambah Kesempatan Kerja'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Posisi"
                  name="title"
                  value={jobFormData.title}
                  onChange={handleJobInputChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Perusahaan"
                  name="company"
                  value={jobFormData.company}
                  onChange={handleJobInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Lokasi"
                  name="location"
                  value={jobFormData.location}
                  onChange={handleJobInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Gaji"
                  name="salary"
                  value={jobFormData.salary}
                  onChange={handleJobInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Deadline"
                  type="date"
                  name="deadline"
                  value={jobFormData.deadline}
                  onChange={handleJobInputChange}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deskripsi"
                  name="description"
                  value={jobFormData.description}
                  onChange={handleJobInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Persyaratan (pisahkan dengan koma)"
                  name="requirements"
                  value={jobFormData.requirements}
                  onChange={handleJobInputChange}
                  margin="normal"
                  helperText="Contoh: Sertifikasi CCNA, Pengalaman Linux, Bahasa Inggris aktif"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseJobDialog}>Batal</Button>
          <Button
            onClick={handleJobSubmit}
            variant="contained"
            disabled={!jobFormData.title || !jobFormData.company}
          >
            {editingJob ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAlumniCareers;
