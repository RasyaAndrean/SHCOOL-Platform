import {
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';

const SkillVisualization = ({ skillLevels }) => {
  // Sort skills by score and take top 6
  const topSkills = [...skillLevels]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  // Categorize skills by proficiency level
  const beginnerSkills = skillLevels.filter(skill => skill.score < 40);
  const intermediateSkills = skillLevels.filter(
    skill => skill.score >= 40 && skill.score < 70
  );
  const advancedSkills = skillLevels.filter(skill => skill.score >= 70);

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Skill Progress Visualization */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <PsychologyIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Visualisasi Skill</Typography>
              </Box>
              <Grid container spacing={2}>
                {topSkills.map(skillLevel => (
                  <Grid item xs={12} sm={6} md={4} key={skillLevel.skill.id}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box
                        sx={{ position: 'relative', display: 'inline-flex' }}
                      >
                        <CircularProgress
                          variant="determinate"
                          value={skillLevel.score}
                          size={100}
                          thickness={4}
                          color={
                            skillLevel.score >= 70
                              ? 'success'
                              : skillLevel.score >= 40
                              ? 'warning'
                              : 'error'
                          }
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            component="div"
                            color="text.secondary"
                          >
                            {`${Math.round(skillLevel.score)}%`}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle1" sx={{ mt: 1 }}>
                        {skillLevel.skill.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {skillLevel.skill.category}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Skill Distribution */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Distribusi Tingkat Skill</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'error.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" color="error.contrastText">
                      {beginnerSkills.length}
                    </Typography>
                    <Typography variant="body1" color="error.contrastText">
                      Beginner
                    </Typography>
                    <Typography variant="caption" color="error.contrastText">
                      &lt; 40%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'warning.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" color="warning.contrastText">
                      {intermediateSkills.length}
                    </Typography>
                    <Typography variant="body1" color="warning.contrastText">
                      Intermediate
                    </Typography>
                    <Typography variant="caption" color="warning.contrastText">
                      40% - 70%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box
                    sx={{
                      p: 3,
                      textAlign: 'center',
                      bgcolor: 'success.light',
                      borderRadius: 1,
                    }}
                  >
                    <Typography variant="h4" color="success.contrastText">
                      {advancedSkills.length}
                    </Typography>
                    <Typography variant="body1" color="success.contrastText">
                      Advanced
                    </Typography>
                    <Typography variant="caption" color="success.contrastText">
                      &gt; 70%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SkillVisualization;
