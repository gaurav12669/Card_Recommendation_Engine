'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Typography,
  Box,
  Slider,
  Button,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Category {
  id: number;
  key: string;
  name: string;
}

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

export default function SpendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategories = searchParams.get('categories')?.split(',') || [];

  const [categories, setCategories] = useState<Category[]>([]);
  const [spends, setSpends] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CardResult[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showCardPreview, setShowCardPreview] = useState(false);
  
  // Use ref to store timeout for debouncing
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  // Use ref to track if we've initialized spends
  const initializedRef = useRef(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Initialize spends only once when categories are selected
  useEffect(() => {
    if (selectedCategories.length > 0 && !initializedRef.current) {
      const initialSpends: Record<string, number> = {};
      selectedCategories.forEach((cat) => {
        initialSpends[cat] = 6000; // Default value
      });
      setSpends(initialSpends);
      initializedRef.current = true;
    }
  }, [selectedCategories]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const calculateSavings = useCallback(async (spendsData: Record<string, number>) => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/calculate-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(spendsData),
      });
      const data = await response.json();
      setResults(data);
      if (data.length > 0) {
        setShowCardPreview(true);
      }
    } catch (error) {
      console.error('Error calculating savings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to trigger debounced calculation when spends change
  useEffect(() => {
    // Skip if no spends
    if (Object.keys(spends).length === 0) {
      return;
    }

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set new timeout with current spends value
    debounceTimeoutRef.current = setTimeout(() => {
      calculateSavings(spends);
    }, 500);
    
    // Cleanup timeout on unmount or when spends change
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [spends, calculateSavings]);

  const handleSpendChange = (category: string, value: number) => {
    setSpends((prev) => ({
      ...prev,
      [category]: Math.max(0, value),
    }));
  };

  const adjustSpend = (category: string, amount: number) => {
    setSpends((prev) => ({
      ...prev,
      [category]: Math.max(0, (prev[category] || 0) + amount),
    }));
  };

  const getCategoryName = (key: string) => {
    return categories.find((cat) => cat.key === key)?.name || key;
  };

  const totalSpends = Object.values(spends).reduce((sum, val) => sum + val, 0);
  const totalSavings = results[0]?.total_savings || 0;

  const handleViewCards = () => {
    // Store spends in localStorage as well
    localStorage.setItem('userSpends', JSON.stringify(spends));
    router.push(`/cards?categories=${selectedCategories.join(',')}&spends=${encodeURIComponent(JSON.stringify(spends))}`);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Add Spends
        </Typography>
      </Box>

      {/* Spending Sliders */}
      <Box sx={{ mb: 4 }}>
        {selectedCategories.map((catKey) => {
          const category = categories.find((c) => c.key === catKey);
          const spendValue = spends[catKey] || 0;
          const isExpanded = expandedCategory === catKey;

          return (
            <Card key={catKey} sx={{ mb: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">{category?.name || catKey}</Typography>
                  <IconButton
                    size="small"
                    onClick={() => setExpandedCategory(isExpanded ? null : catKey)}
                  >
                    {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </IconButton>
                </Box>

                <Typography variant="h5" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                  ₹{spendValue.toLocaleString()}
                </Typography>

                <Slider
                  value={spendValue}
                  onChange={(_, value) => handleSpendChange(catKey, value as number)}
                  min={0}
                  max={100000}
                  step={1000}
                  marks={[
                    { value: 0, label: '₹0' },
                    { value: 50000, label: '₹50k' },
                    { value: 100000, label: '₹100k' },
                  ]}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<RemoveIcon />}
                    label="- ₹1k"
                    onClick={() => adjustSpend(catKey, -1000)}
                    variant="outlined"
                  />
                  <Chip
                    icon={<AddIcon />}
                    label="+ ₹1k"
                    onClick={() => adjustSpend(catKey, 1000)}
                    variant="outlined"
                  />
                  <Chip
                    icon={<AddIcon />}
                    label="+ ₹5k"
                    onClick={() => adjustSpend(catKey, 5000)}
                    variant="outlined"
                  />
                  <Chip
                    icon={<AddIcon />}
                    label="+ ₹10k"
                    onClick={() => adjustSpend(catKey, 10000)}
                    variant="outlined"
                  />
                </Box>

                {isExpanded && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Expand for merchant-specific spends = power users
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Live Savings Update */}
      <Card sx={{ mb: 2, bgcolor: 'primary.light', color: 'white' }}>
        <CardContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Total Spends
          </Typography>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            ₹{totalSpends.toLocaleString()}
          </Typography>
          {loading ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Save monthly upto
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                ₹{totalSavings.toLocaleString()}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Collapsed Card Preview */}
      {showCardPreview && results.length > 0 && (
        <Card
          sx={{
            mb: 2,
            cursor: 'pointer',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.02)' },
          }}
          onClick={handleViewCards}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Recommended Card
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {results[0].card_name}
                </Typography>
              </Box>
              <Box
                sx={{
                  width: 60,
                  height: 40,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.7rem',
                }}
              >
                VISA
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* View Recommended Cards Button */}
      {results.length > 0 && (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleViewCards}
          sx={{ py: 1.5, mt: 2 }}
        >
          View Recommended Cards
        </Button>
      )}
    </Container>
  );
}

