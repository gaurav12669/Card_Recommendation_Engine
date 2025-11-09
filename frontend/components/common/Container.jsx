'use client';

import { Box } from '@mui/material';
import PropTypes from 'prop-types';

const Container = ({ children, className, sx }) => (
  <Box
    component="section"
    className={className}
    sx={{
      maxWidth: 568,
      mx: 'auto',
      minHeight: '100vh',
      color: '#FFFFFF',
      background: 'linear-gradient(180deg, #242C3B 0%, #3A3F49 100%)',
      // px: 3,
      // py: 3,
      // ...sx,
    }}
  >
    {children}
  </Box>
);

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  sx: PropTypes.object,
};

export default Container;

