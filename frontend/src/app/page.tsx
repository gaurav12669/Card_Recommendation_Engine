'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface Category {
  id: number;
  key: string;
  name: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  travel: <FlightIcon sx={{ fontSize: 40 }} />,
  shopping: <ShoppingBagIcon sx={{ fontSize: 40 }} />,
  fuel: <LocalGasStationIcon sx={{ fontSize: 40 }} />,
  food: <RestaurantIcon sx={{ fontSize: 40 }} />,
};

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (key: string) => {
    setSelectedCategories((prev: string[]) =>
      prev.includes(key)
        ? prev.filter((cat: string) => cat !== key)
        : [...prev, key]
    );
  };

  const handleContinue = () => {
    if (selectedCategories.length > 0) {
      const queryParams = selectedCategories.join(',');
      router.push(`/spends?categories=${queryParams}`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Find your best Credit card.
        </Typography>
      </Box>

      {/* 3D Card Placeholder */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 6,
          perspective: '1000px',
        }}
      >
        <Box
          sx={{
            width: 280,
            height: 180,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transform: 'rotateY(-15deg) rotateX(5deg)',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'rotateY(0deg) rotateX(0deg) scale(1.05)',
            },
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ zIndex: 1, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              CardGenius
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Credit Card
            </Typography>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 60,
              height: 60,
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
            }}
          />
        </Box>
      </Box>

      {/* Category Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
          Choose one or more categories where you spend the most
        </Typography>
        <Grid container spacing={2}>
          {categories.map((category: Category) => {
            const isSelected = selectedCategories.includes(category.key);
            return (
              <Grid item xs={6} key={category.id}>
                <Card
                  sx={{
                    height: '100%',
                    border: isSelected ? 2 : 1,
                    borderColor: isSelected ? 'primary.main' : 'divider',
                    bgcolor: isSelected ? 'primary.light' : 'background.paper',
                  }}
                >
                  <CardActionArea
                    onClick={() => toggleCategory(category.key)}
                    sx={{
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 120,
                    }}
                  >
                    {categoryIcons[category.key] || <ShoppingBagIcon sx={{ fontSize: 40 }} />}
                    <Typography variant="body1" sx={{ mt: 2, fontWeight: 500 }}>
                      {category.name}
                    </Typography>
                    {isSelected && (
                      <CheckCircleIcon
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          color: 'primary.dark',
                        }}
                      />
                    )}
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* CTA Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={selectedCategories.length === 0}
          onClick={handleContinue}
          sx={{
            py: 1.5,
            fontSize: '1.1rem',
            fontWeight: 600,
          }}
        >
          Add Spends
        </Button>
        {selectedCategories.length === 0 && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Select at least one category to continue
          </Typography>
        )}
      </Box>
    </Container>
  );
}

