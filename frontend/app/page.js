'use client';

import { useEffect, useState } from 'react';
import { Box, Snackbar, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import Container from '../components/common/Container';
import PrimaryButton from '../components/common/Button';
import CardSection from '../components/home/CardSection';
import { CATEGORIES as FALLBACK_CATEGORIES } from '../data/cards';

// Transform fallback categories to match API format
const transformFallbackCategories = () => {
  return FALLBACK_CATEGORIES.map((cat, index) => ({
    id: index + 1,
    key: cat.id,
    name: cat.category,
  }));
};

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/categories`,
        );
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate data is an array
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          setError(null);
        } else {
          // If API returns empty or invalid data, use fallback
          console.warn('API returned empty or invalid data, using fallback categories');
          setCategories(transformFallbackCategories());
          setError(null);
        }
      } catch (error) {
        // If API fails, use fallback categories instead of showing error
        console.error('Error fetching categories, using fallback:', error.message);
        setCategories(transformFallbackCategories());
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleAddSpends = () => {
    if (selectedCategories.length === 0) {
      setShowToast(true);
      return;
    }
    const query = encodeURIComponent(selectedCategories.join(','));
    router.push(`/add-spends?categories=${query}`);
  };

  return (
    <Container sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
      <Box className="py-[18px]">
        <Box display="flex" justifyContent="center">
          <Box display="flex" gap={1} alignItems="baseline">
            <img src="/card-genius.svg" alt="CardGenius" />
            <Typography
              sx={{
                fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
                fontWeight: 600,
                fontSize: '13px',
                lineHeight: '18px',
              }}
            >
              CardGenius
            </Typography>
            <Typography
              sx={{
                fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
                fontWeight: 400,
                fontSize: '11px',
                lineHeight: '14px',
                letterSpacing: '0.02em',
                color: 'rgba(255, 255, 255, 0.75)',
              }}
            >
              by BankKaro
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
            fontWeight: 600,
            fontSize: '28px',
            lineHeight: '34px',
            letterSpacing: '-0.005em',
            textAlign: 'center',
            mt: 5,
          }}
        >
          <span className="block">Find your best</span>
          <span className="block">Credit card</span>
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        sx={{
          mt: -2.5,
          perspective: '2000px',
          perspectiveOrigin: 'center center',
        }}
      >
        <img
          src="/card-image.svg"
          alt="credit-card"
          width="335"
          height="216"
          className="card-rotate-animation"
          style={{
            transformOrigin: 'center center',
            animation: 'rotateCard 0.6s ease-in-out',
            transformStyle: 'preserve-3d',
            width: '335px',
            height: '216px',
            aspectRatio: '335 / 216',
          }}
        />
      </Box>

      <Typography
        sx={{
          fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
          fontWeight: 400,
          fontSize: '13px',
          lineHeight: '18px',
          letterSpacing: '0.01em',
          textAlign: 'center',
          mt: 1,
        }}
      >
        <span className="block">Choose one or more categories where</span>
        <span>you spend the most</span>
      </Typography>

      <CardSection
        categories={categories}
        selectedKeys={selectedCategories}
        onToggle={(key) =>
          setSelectedCategories((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
          )
        }
        loading={loading}
      />

      <Box display="flex" justifyContent="center">
        <Box sx={{ maxWidth: 336, width: '100%' }}>
          <PrimaryButton onClick={handleAddSpends}>Add Spends</PrimaryButton>
        </Box>
      </Box>
      <Typography
        sx={{
          mt: 2,
          fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
          fontWeight: 500,
          fontSize: '11px',
          lineHeight: '14px',
          letterSpacing: '-0.002em',
          textAlign: 'center',
          color: '#FFFFFF99',
        }}
      >
        Select at least one category to continue
      </Typography>

      <Snackbar
        open={showToast}
        autoHideDuration={2500}
        onClose={() => setShowToast(false)}
        message="Select at least one category to continue"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

