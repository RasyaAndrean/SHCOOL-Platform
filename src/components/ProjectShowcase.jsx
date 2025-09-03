import {
  Code as CodeIcon,
  DesignServices as DesignIcon,
  School as SchoolIcon,
  Science as ScienceIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ProjectShowcase = ({ projects }) => {
  const navigate = useNavigate();

  // Get project icon based on category
  const getProjectIcon = category => {
    switch (category.toLowerCase()) {
      case 'programming':
        return <CodeIcon />;
      case 'design':
        return <DesignIcon />;
      case 'science':
        return <ScienceIcon />;
      case 'research':
        return <SchoolIcon />;
      default:
        return <WorkIcon />;
    }
  };

  // Get project color based on status
  const getStatusColor = status => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in-progress':
        return 'warning';
      case 'planned':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {projects.map(project => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={() => navigate(`/project/${project.id}`)}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 2,
                  }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: '50%',
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                    }}
                  >
                    {getProjectIcon(project.category)}
                  </Box>
                  <Chip
                    label={project.status}
                    size="small"
                    color={getStatusColor(project.status)}
                  />
                </Box>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  paragraph
                  sx={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {project.description}
                </Typography>
                <Box
                  sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}
                >
                  {project.tags &&
                    project.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem' }}
                      />
                    ))}
                </Box>
              </CardContent>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {project.subject} •{' '}
                  {new Date(project.createdAt).toLocaleDateString('id-ID')}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProjectShowcase;
