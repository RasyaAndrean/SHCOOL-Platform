import {
  MilitaryTech as MedalIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

const AchievementShowcase = ({ achievements, badges }) => {
  // Combine achievements and badges for display
  const allAchievements = [
    ...achievements.map(a => ({ ...a, type: 'achievement' })),
    ...badges.map(b => ({ ...b, type: 'badge' })),
  ].sort(
    (a, b) =>
      new Date(b.earnedAt || new Date()) - new Date(a.earnedAt || new Date())
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {allAchievements.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: item.type === 'badge' ? '2px solid gold' : 'none',
                position: 'relative',
              }}
            >
              {item.type === 'badge' && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    bgcolor: 'gold',
                    color: 'black',
                    borderRadius: '50%',
                    width: 30,
                    height: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <StarIcon sx={{ fontSize: 16 }} />
                </Box>
              )}
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    bgcolor: item.type === 'badge' ? 'gold' : 'primary.light',
                    color:
                      item.type === 'badge' ? 'black' : 'primary.contrastText',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  {item.type === 'badge' ? (
                    <MedalIcon sx={{ fontSize: 30 }} />
                  ) : (
                    <TrophyIcon sx={{ fontSize: 30 }} />
                  )}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {item.name || item.title}
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
                    minHeight: 60,
                  }}
                >
                  {item.description}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Diperoleh:{' '}
                  {item.earnedAt
                    ? new Date(item.earnedAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : 'Tanggal tidak tersedia'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {allAchievements.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <TrophyIcon
                  sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Belum ada pencapaian
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Terus belajar dan berprestasi untuk mendapatkan penghargaan!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default AchievementShowcase;
