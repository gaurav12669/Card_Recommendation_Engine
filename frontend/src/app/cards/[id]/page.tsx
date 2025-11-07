'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Grid,
  Rating,
  Snackbar,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircle from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

interface CardFeature {
  feature_title: string;
  feature_description: string;
}

interface Eligibility {
  min_age: number;
  max_age: number;
  min_income: number;
  min_cibil_score: number;
}

interface CategorySavings {
  category_name: string;
  savings_percentage: number;
}

interface CardDetails {
  id: number;
  card_name: string;
  bank_name: string;
  annual_fees: number;
  joining_fees: number;
  reward_points: string;
  rating: number;
  reviews_count: number;
  features: CardFeature[];
  eligibility: Eligibility;
  category_savings: CategorySavings[];
}

export default function CardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const cardId = params?.id as string;

  const [cardDetails, setCardDetails] = useState<CardDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [userSpends, setUserSpends] = useState<Record<string, number>>({});
  const [showToast, setShowToast] = useState(false);
  
  // Use ref to prevent multiple fetches
  const hasFetchedRef = useRef(false);
  const lastCardIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Only fetch if cardId has changed or we haven't fetched yet
    if (cardId === lastCardIdRef.current && hasFetchedRef.current) {
      return;
    }

    if (cardId) {
      lastCardIdRef.current = cardId;
      hasFetchedRef.current = true;
      fetchCardDetails();
      
      // Try to get user spends from localStorage
      const savedSpends = localStorage.getItem('userSpends');
      if (savedSpends) {
        try {
          setUserSpends(JSON.parse(savedSpends));
        } catch (error) {
          console.error('Error parsing saved spends:', error);
        }
      }
    }
  }, [cardId]);

  const fetchCardDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/cards/${cardId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch card details');
      }
      const data = await response.json();
      setCardDetails(data);
    } catch (error) {
      console.error('Error fetching card details:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = () => {
    if (!cardDetails || !userSpends || Object.keys(userSpends).length === 0) {
      return { monthly: 0, annual: 0, net: 0, breakdown: [] };
    }

    let monthlySavings = 0;
    const categoryBreakdown: Array<{ category: string; spent: number; savings: number }> = [];

    // Map category keys to category names
    const categoryMap: Record<string, string> = {
      travel: 'Travel',
      shopping: 'Shopping',
      fuel: 'Fuel',
      food: 'Food',
    };

    Object.entries(userSpends).forEach(([key, spent]) => {
      const categoryName = categoryMap[key] || key;
      const categorySavings = cardDetails.category_savings.find(
        (cs) => cs.category_name.toLowerCase() === categoryName.toLowerCase()
      );
      if (categorySavings && spent > 0) {
        const savings = spent * (categorySavings.savings_percentage / 100);
        monthlySavings += savings;
        categoryBreakdown.push({
          category: categorySavings.category_name,
          spent,
          savings,
        });
      }
    });

    const annualSavings = monthlySavings * 12;
    const netSavings = annualSavings - cardDetails.annual_fees;

    return { monthly: monthlySavings, annual: annualSavings, net: netSavings, breakdown: categoryBreakdown };
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!cardDetails) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          Card not found
        </Typography>
        <Button variant="contained" onClick={() => router.push('/')} sx={{ mt: 2, display: 'block', mx: 'auto' }}>
          Go Home
        </Button>
      </Container>
    );
  }

  const savings = calculateSavings();

  return (
    <Container maxWidth="sm" sx={{ py: 3, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => router.back()} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          Card Details
        </Typography>
      </Box>

      {/* Card Display */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              width: '100%',
              height: 200,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {cardDetails.card_name}
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            {cardDetails.card_name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={cardDetails.rating} readOnly size="small" sx={{ mr: 1 }} />
            <Typography variant="caption" color="text.secondary">
              ({cardDetails.reviews_count.toLocaleString()} reviews)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            <Chip label={`Annual fee ₹${cardDetails.annual_fees.toLocaleString()}`} size="small" />
            <Chip label={`Joining fee ₹${cardDetails.joining_fees.toLocaleString()}`} size="small" />
            <Chip label={`Reward points ${cardDetails.reward_points}`} size="small" color="primary" />
          </Box>
        </CardContent>
      </Card>

      {/* Monthly Savings */}
      <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'white' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Your Monthly Savings
          </Typography>
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            ₹{Math.round(savings.monthly).toLocaleString()}
          </Typography>
          {savings.breakdown && savings.breakdown.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {savings.breakdown.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">{item.category}</Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2">₹{item.spent.toLocaleString()} spent</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      + ₹{Math.round(item.savings).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
              <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.3)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Monthly savings
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ₹{Math.round(savings.monthly).toLocaleString()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Annual fee</Typography>
                <Typography variant="body2">- ₹{cardDetails.annual_fees.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.3)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Net savings
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ₹{Math.round(savings.net).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Key Features */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Key Features
          </Typography>
          <List>
            {cardDetails.features.map((feature, idx) => (
              <ListItem key={idx} sx={{ px: 0 }}>
                <ListItemIcon>
                  <StarIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={feature.feature_title}
                  secondary={feature.feature_description}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Eligibility Criteria */}
      {cardDetails.eligibility && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Eligibility Criteria
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {cardDetails.eligibility.min_age} - {cardDetails.eligibility.max_age} years (Age eligibility)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    ₹{cardDetails.eligibility.min_income.toLocaleString()} per annum (Minimum income)
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle color="success" sx={{ mr: 1 }} />
                  <Typography variant="body2">
                    {cardDetails.eligibility.min_cibil_score}+ (CIBIL score)
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* CTA Button */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        sx={{ py: 1.5 }}
        onClick={() => {
          // Show toast notification
          setShowToast(true);
        }}
      >
        Apply Now
      </Button>

      {/* Toast Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={3000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Your card application has been submitted successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
