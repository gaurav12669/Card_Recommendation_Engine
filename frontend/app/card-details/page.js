'use client';

import { useEffect, useMemo, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '../../components/common/Container';
import Header from '../../components/common/Header';
import CardHero from '../../components/card-details/CardHero';
import Fees from '../../components/card-details/Fees';
import Savings from '../../components/card-details/Savings';
import KeyFeatures from '../../components/card-details/KeyFeatures';
import Eligibility from '../../components/card-details/Eligibility';
import ApplyButton from '../../components/card-details/ApplyButton';

export default function CardDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cardIdParam = searchParams.get('cardId');
  const cardId = useMemo(() => {
    if (!cardIdParam) {
      return null;
    }
    const parsed = Number(cardIdParam);
    return Number.isNaN(parsed) ? null : parsed;
  }, [cardIdParam]);

  const [cardDetails, setCardDetails] = useState(null);
  const [analyticsContext, setAnalyticsContext] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cardId) {
      setError('Card not found.');
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const fetchCardDetails = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/cards/${cardId}`,
          {
            method: 'GET',
            signal: controller.signal,
          },
        );

        if (response.status === 404) {
          setError('We could not find details for this card.');
          setCardDetails(null);
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch card details');
        }

        const data = await response.json();
        setCardDetails(data);
        setError(null);
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message || 'Something went wrong while loading card details.');
        setCardDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardDetails();

    return () => {
      controller.abort();
    };
  }, [cardId]);

  useEffect(() => {
    if (!cardId || typeof window === 'undefined') {
      setAnalyticsContext(null);
      return;
    }
    const storageKey = `card-context:${cardId}`;
    const stored = window.sessionStorage.getItem(storageKey);
    if (stored) {
      try {
        setAnalyticsContext(JSON.parse(stored));
      } catch (err) {
        console.warn('Failed to parse card context:', err);
        setAnalyticsContext(null);
      } finally {
        window.sessionStorage.removeItem(storageKey);
      }
    } else {
      setAnalyticsContext(null);
    }
  }, [cardId]);

  useEffect(() => {
    if (error === 'Card not found.') {
      router.replace('/');
    }
  }, [error, router]);

  return (
    <div>
      <Container sx={{ px: { xs: 2, sm: 3 }, py: 0, pb: 12 }}>
        <Header text="Card Details" />
        <div className="pb-[120px] min-h-[60vh] flex flex-col items-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3">
              <CircularProgress size={32} sx={{ color: '#11FF00' }} />
              <div className="text-sm text-white/70 font-sf-pro">Fetching latest benefits…</div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-6">
              <div className="text-base font-sf-pro text-white/90">{error}</div>
              <button
                type="button"
                onClick={() => router.back()}
                className="mt-2 px-4 py-2 rounded-md border border-white/20 text-white/80 hover:bg-white/10 transition-colors text-sm"
              >
                Go back
              </button>
            </div>
          ) : cardDetails ? (
            <>
              <CardHero
                cardName={cardDetails.card_name}
                bankName={cardDetails.bank_name}
                rating={cardDetails.rating}
                reviewsCount={cardDetails.reviews_count}
              />
              <Fees
                annualFee={cardDetails.annual_fees}
                joiningFee={cardDetails.joining_fees}
                rewardPoints={cardDetails.reward_points}
              />
              <Savings categorySavings={cardDetails.category_savings} annualFee={cardDetails.annual_fees} />
              <KeyFeatures features={cardDetails.features} />
              <Eligibility eligibility={cardDetails.eligibility} />
            </>
          ) : null}
        </div>
        <ApplyButton
          cardId={cardDetails?.id}
          cardName={cardDetails?.card_name}
          bankName={cardDetails?.bank_name}
          analyticsContext={analyticsContext}
        />
      </Container>
    </div>
  );
}

