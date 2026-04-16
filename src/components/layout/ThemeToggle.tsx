import React from 'react';
import { IconButton, IconButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useTheme as useCustomTheme } from '../../theme/ThemeContext';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  // color intentionally not set here so the `sx` prop passed from Navbar can override it
  '&:hover': {
    backgroundColor: theme.palette.mode === 'light' 
      ? 'rgba(0, 0, 0, 0.04)' 
      : 'rgba(255, 255, 255, 0.04)',
  },
}));

interface ThemeToggleProps extends Omit<IconButtonProps, 'onClick'> {}

const ThemeToggle: React.FC<ThemeToggleProps> = (props) => {
  const { mode, toggleTheme } = useCustomTheme();

  return (
    <StyledIconButton
      onClick={toggleTheme}
      aria-label="toggle theme"
      {...props}
    >
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </StyledIconButton>
  );
};

export default ThemeToggle; 