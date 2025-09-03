import { Box, CircularProgress, Typography } from '@mui/material';
import { memo } from 'react';

const Loading = ({ message = 'Memuat konten...', fullScreen = false }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullScreen ? '100vh' : '200px',
        width: '100%',
        p: 4,
        position: fullScreen ? 'fixed' : 'relative',
        top: 0,
        left: 0,
        zIndex: fullScreen ? 9999 : 1,
        backgroundColor: fullScreen ? 'rgba(255,255,255,0.9)' : 'transparent',
      }}
    >
      <CircularProgress size={60} thickness={4} sx={{ mb: 2 }} disableShrink />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(Loading);
