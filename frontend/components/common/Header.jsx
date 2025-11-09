'use client';

import { Box, IconButton, Typography } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';

const Header = ({ text }) => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#222834',
        px: 2,
        py: 1.75,
        borderBottom: '1px solid rgba(229, 231, 235, 0.12)',
      }}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          edge="start"
          onClick={handleBack}
          aria-label="Go back"
          sx={{
            color: '#FFFFFF',
          }}
        >
          <Image src="/back_arrow.svg" alt="Back" width={16} height={16} />
        </IconButton>
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            textAlign: 'center',
            fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
            fontWeight: 600,
            fontSize: '20px',
            lineHeight: '26px',
            letterSpacing: '-0.004em',
            color: '#FFFFFF',
            mr: 5,
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

Header.propTypes = {
  text: PropTypes.string.isRequired,
};

export default Header;

