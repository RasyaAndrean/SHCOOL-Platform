import {
  CheckCircle as CheckCircleIcon,
  ClearAll as ClearAllIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MarkEmailRead as MarkEmailReadIcon,
  Notifications as NotificationsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useNotificationContext } from '../contexts/NotificationContext';

const NotificationCenter = ({ darkMode, toggleDarkMode }) => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
  } = useNotificationContext();
  const { addNotification } = useAppContext();

  // Mark all notifications as read when the page is loaded
  useEffect(() => {
    // In a real app, we might not want to auto-mark all as read
    // For now, we'll leave this commented out
    // markAllAsRead();
  }, []);

  const handleMarkAsRead = id => {
    markAsRead(id);
    addNotification('Notifikasi ditandai sebagai sudah dibaca', 'success');
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    addNotification(
      'Semua notifikasi ditandai sebagai sudah dibaca',
      'success'
    );
  };

  const handleDelete = id => {
    removeNotification(id);
    addNotification('Notifikasi dihapus', 'info');
  };

  const handleClearAll = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua notifikasi?')) {
      clearAllNotifications();
      addNotification('Semua notifikasi telah dihapus', 'info');
    }
  };

  const getIconBySeverity = severity => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getColorBySeverity = severity => {
    switch (severity) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatTime = timestamp => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Baru saja';
    } else if (diffInHours < 24) {
      return `${diffInHours} jam yang lalu`;
    } else {
      return date.toLocaleDateString('id-ID');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h3" gutterBottom>
                Pusat Notifikasi
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {unreadCount > 0
                  ? `Anda memiliki ${unreadCount} notifikasi belum dibaca`
                  : 'Tidak ada notifikasi baru'}
              </Typography>
            </Box>
            <NotificationsIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          </Box>

          {notifications.length > 0 && (
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button
                variant="outlined"
                startIcon={<MarkEmailReadIcon />}
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0}
              >
                Tandai Semua Dibaca
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<ClearAllIcon />}
                onClick={handleClearAll}
              >
                Hapus Semua
              </Button>
            </Box>
          )}
        </Box>

        <Card>
          <CardContent>
            {notifications.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <EmailIcon
                  sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Tidak ada notifikasi
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Anda akan melihat notifikasi di sini saat ada aktivitas baru
                </Typography>
              </Box>
            ) : (
              <List>
                {notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        {getIconBySeverity(notification.severity)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: notification.read
                                  ? 'normal'
                                  : 'bold',
                                mr: 1,
                              }}
                            >
                              {notification.title || 'Notifikasi'}
                            </Typography>
                            {!notification.read && (
                              <Chip
                                label="Baru"
                                color="primary"
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              sx={{ display: 'block' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {notification.message}
                            </Typography>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 1,
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {formatTime(notification.timestamp)}
                              </Typography>
                              {notification.category && (
                                <Chip
                                  label={notification.category}
                                  size="small"
                                  color={getColorBySeverity(
                                    notification.severity
                                  )}
                                  variant="outlined"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </Box>
                          </>
                        }
                      />
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                        }}
                      >
                        {!notification.read && (
                          <Button
                            size="small"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            Tandai Dibaca
                          </Button>
                        )}
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDelete(notification.id)}
                          startIcon={<DeleteIcon fontSize="small" />}
                        >
                          Hapus
                        </Button>
                      </Box>
                    </ListItem>
                    {index < notifications.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default NotificationCenter;
