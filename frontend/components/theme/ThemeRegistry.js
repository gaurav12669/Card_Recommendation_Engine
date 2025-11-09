'use client';

import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { CssBaseline, GlobalStyles, ThemeProvider } from '@mui/material';
import theme from './theme';

export default function ThemeRegistry({ children }) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              margin: 0,
              minHeight: '100vh',
              backgroundColor: theme.palette.background.default,
            },
            '*': {
              boxSizing: 'border-box',
            },
          }}
        />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}

