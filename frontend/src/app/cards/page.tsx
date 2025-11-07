'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface CardResult {
  id: number;
  card_name: string;
  bank_name: string;
  rating: number;
  reviews_count: number;
  best_for: string;
  total_savings: number;
  annual_fees: number;
  net_savings: number;
  categories: Array<{
    category: string;
    savings: number;
    spent?: number;
  }>;
}

export default function CardsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get categories and spendsParam from URL
  const categoriesParam = searchParams.get('categories');
  const spendsParam = searchParams.get('spends');
  
  // Memoize categories to prevent recreation on every render
  const categories = useMemo(() => {
    return categoriesParam?.split(',') || [];
  }, [categoriesParam]);
  
  // Use ref to track if we've already fetched to prevent multiple calls
  const hasFetchedRef = useRef(false);
  const lastSpendsParamRef = useRef<string | null>(null);

  const [cards, setCards] = useState<CardResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  const fetchCards = async (spends: Record<string, number>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/calculate-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spends),
      });
      const data = await response.json();
      setCards(data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if spendsParam has changed or we haven't fetched yet
    if (spendsParam === lastSpendsParamRef.current && hasFetchedRef.current) {
      return;
    }

    lastSpendsParamRef.current = spendsParam;
    hasFetchedRef.current = true;

    if (spendsParam) {
      try {
        const spends = JSON.parse(spendsParam);
        fetchCards(spends);
      } catch (error) {
        console.error('Error parsing spends:', error);
        // Fallback to default values
        const defaultSpends: Record<string, number> = {};
        categories.forEach((cat) => {
          defaultSpends[cat] = 6000;
        });
        fetchCards(defaultSpends);
      }
    } else {
      // Fallback: use default values
      const defaultSpends: Record<string, number> = {};
      categories.forEach((cat) => {
        defaultSpends[cat] = 6000;
      });
      fetchCards(defaultSpends);
    }
  }, [spendsParam, categories]);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleViewDetails = () => {
    if (cards[selectedIndex]) {
      // Store spends in localStorage for card details page
      if (spendsParam) {
        localStorage.setItem('userSpends', spendsParam);
      }
      router.push(`/cards/${cards[selectedIndex].id}`);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (cards.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          No cards found. Please go back and add your spends.
        </Typography>
        <Button variant="contained" onClick={() => router.push('/')} sx={{ mt: 2, display: 'block', mx: 'auto' }}>
          Go Back
        </Button>
      </Container>
    );
  }

  const selectedCard = cards[selectedIndex];

  return (
    <Container maxWidth="sm" sx={{ py: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Recommended Cards
        </Typography>
      </Box>

      {/* Total Spends Display */}
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Total spends
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          ₹{selectedCard.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0).toLocaleString()}
        </Typography>
      </Box>

      {/* Card Carousel */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          mb: 3,
          pb: 2,
          scrollSnapType: 'x mandatory',
          '& > *': {
            scrollSnapAlign: 'start',
            flexShrink: 0,
          },
        }}
      >
        {cards.map((card, index) => (
          <Card
            key={card.id}
            onClick={() => handleCardClick(index)}
            sx={{
              minWidth: 280,
              cursor: 'pointer',
              border: selectedIndex === index ? 2 : 1,
              borderColor: selectedIndex === index ? 'primary.main' : 'divider',
              transform: selectedIndex === index ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  width: '100%',
                  height: 160,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 2,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Typography variant="body2">VISA</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {card.card_name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={card.rating} readOnly size="small" sx={{ mr: 1 }} />
                <Typography variant="caption" color="text.secondary">
                  ({card.reviews_count.toLocaleString()} reviews)
                </Typography>
              </Box>
              <Chip
                label={card.best_for}
                size="small"
                color="primary"
                icon={<TrendingUpIcon />}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Total Savings
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                ₹{card.total_savings.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Savings Breakdown */}
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">Savings breakdown</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            {selectedCard.categories.map((cat, idx) => (
              <Grid item xs={12} key={idx}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{cat.category}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" color="text.secondary">
                      ₹{cat.spent?.toLocaleString() || 0} spent
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                      + ₹{cat.savings.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2, mt: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    Total savings
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    ₹{selectedCard.total_savings.toLocaleString()}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    ({(selectedCard.total_savings / selectedCard.categories.reduce((sum, cat) => sum + (cat.spent || 0), 0) * 100).toFixed(2)}% avg)
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* CTA Button */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleViewDetails}
        sx={{ py: 1.5, mt: 3 }}
      >
        View Details for {selectedCard.card_name}
      </Button>
    </Container>
  );
}
