import {
  CheckCircle as CheckCircleIcon,
  Clear as ClearIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  MarkEmailRead as MarkEmailReadIcon,
  NotificationsActive as NotificationsActiveIcon,
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useNotificationContext } from '../contexts/NotificationContext';

const NotificationCenter = ({ darkMode }) => {
  const {
    notifications: appNotifications,
    clearAllNotifications,
    removeNotification,
  } = useAppContext();
  const notificationContext = useNotificationContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClearAll = () => {
    clearAllNotifications();
    handleClose();
  };

  const handleRemoveNotification = id => {
    removeNotification(id);
  };

  const handleMarkAsRead = id => {
    if (notificationContext) {
      notificationContext.markAsRead(id);
    }
  };

  const handleViewAll = () => {
    handleClose();
    navigate('/notifications');
  };

  const getNotificationIcon = severity => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon sx={{ color: 'success.main' }} />;
      case 'error':
        return <ErrorIcon sx={{ color: 'error.main' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: 'warning.main' }} />;
      default:
        return <InfoIcon sx={{ color: 'info.main' }} />;
    }
  };

  const formatTime = timestamp => {
    const now = new Date();
    const diff = now - new Date(timestamp);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam yang lalu`;

    const days = Math.floor(hours / 24);
    return `${days} hari yang lalu`;
  };

  // Use notifications from NotificationContext if available, otherwise fallback to AppContext
  const allNotifications =
    notificationContext?.notifications?.length > 0
      ? notificationContext.notifications
      : appNotifications;

  const unreadCount = notificationContext
    ? notificationContext.getUnreadCount
      ? notificationContext.getUnreadCount()
      : 0
    : allNotifications.length;

  return (
    <>
      <Tooltip title="Pusat Notifikasi">
        <IconButton color="inherit" onClick={handleClick} sx={{ mr: 1 }}>
          <Badge
            badgeContent={unreadCount}
            color="error"
            invisible={unreadCount === 0}
          >
            {unreadCount > 0 ? (
              <NotificationsActiveIcon />
            ) : (
              <NotificationsNoneIcon />
            )}
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: { width: 360, maxHeight: 400 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 2,
          }}
        >
          <Typography variant="h6">Notifikasi</Typography>
          <Box>
            {allNotifications.length > 0 && (
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={handleClearAll}
                sx={{ mr: 1 }}
              >
                Hapus Semua
              </Button>
            )}
            <Button size="small" onClick={handleViewAll}>
              Lihat Semua
            </Button>
          </Box>
        </Box>

        <Divider />

        {allNotifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <NotificationsIcon
              sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
            />
            <Typography color="text.secondary">Tidak ada notifikasi</Typography>
          </Box>
        ) : (
          <List sx={{ maxHeight: 300, overflow: 'auto' }}>
            {[...allNotifications].slice(0, 5).map(notification => (
              <MenuItem
                key={notification.id}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  py: 1,
                  px: 2,
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                  {getNotificationIcon(notification.severity)}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: 'normal',
                          wordBreak: 'break-word',
                          fontWeight: notification.read ? 'normal' : 'bold',
                          mr: 1,
                        }}
                      >
                        {notification.message}
                      </Typography>
                      {!notification.read && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          mt: 0.5,
                        }}
                      >
                        {formatTime(notification.timestamp)}
                      </Typography>
                      {notification.category && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            mt: 0.5,
                            color: 'primary.main',
                          }}
                        >
                          {notification.category}
                        </Typography>
                      )}
                    </>
                  }
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {!notification.read && (
                    <IconButton
                      size="small"
                      onClick={() => handleMarkAsRead(notification.id)}
                      sx={{ mb: 0.5 }}
                    >
                      <MarkEmailReadIcon fontSize="small" />
                    </IconButton>
                  )}
                  <IconButton
                    size="small"
                    onClick={() => handleRemoveNotification(notification.id)}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationCenter;
