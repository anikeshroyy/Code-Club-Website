/**
 * LoadingSpinner — shared spinner + friendly message shown while
 * content is being fetched from the backend.
 *
 * Props:
 *  message  – override the default text
 *  size     – CircularProgress size (default 48)
 *  py       – vertical padding of the wrapper Box (default 8)
 */
import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  py?: number;
}

const DEFAULT_MESSAGES = [
  'Hang tight, loading content for you…',
  'Almost there, fetching the latest data…',
  'Just a moment, getting things ready…',
];

// Cycle through messages so it feels a little less static
const defaultMessage =
  DEFAULT_MESSAGES[Math.floor(Date.now() / 1000) % DEFAULT_MESSAGES.length];

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = defaultMessage,
  size = 48,
  py = 8,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py,
        gap: 2,
      }}
    >
      <CircularProgress size={size} thickness={3.5} />
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontStyle: 'italic', letterSpacing: 0.3 }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;
