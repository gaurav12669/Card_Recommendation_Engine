'use client';

import { forwardRef } from 'react';
import { Button as MuiButton } from '@mui/material';
import PropTypes from 'prop-types';

const PrimaryButton = forwardRef(function PrimaryButton(
  { text, children, sx, className, ...props },
  ref,
) {
  const content = children ?? text;

  return (
    <MuiButton
      ref={ref}
      variant="contained"
      color="primary"
      className={className}
      sx={{
        height: 56,
        borderRadius: '14px',
        fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
        fontWeight: 500,
        fontSize: '17px',
        lineHeight: '20px',
        letterSpacing: '-0.002em',
        textAlign: 'center',
        width: '100%',
        mt: 6,
        ...sx,
      }}
      {...props}
    >
      {content}
    </MuiButton>
  );
});

PrimaryButton.propTypes = {
  text: PropTypes.string,
  children: PropTypes.node,
  sx: PropTypes.object,
  className: PropTypes.string,
};

export default PrimaryButton;

