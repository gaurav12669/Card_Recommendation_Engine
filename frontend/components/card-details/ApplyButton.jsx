'use client';

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const buildAnalyticsPayload = ({ cardId, cardName, bankName, analyticsContext }) => {
  const recommendation = analyticsContext?.recommendation || {};
  const userSpends = analyticsContext?.userSpends || {};

  const parseNumber = (value, fallback = 0) => {
    if (value === null || value === undefined || value === '') {
      return fallback;
    }
    const numeric = Number(value);
    return Number.isNaN(numeric) ? fallback : numeric;
  };

  const categories =
    recommendation?.categories?.map((entry) => ({
      category: entry.category,
      savings: parseNumber(entry.savings),
      spent: parseNumber(entry.spent),
    })) || [];

  return {
    cardId: parseNumber(cardId, null),
    cardName: cardName || recommendation.card_name || 'Unknown card',
    bankName: bankName || recommendation.bank_name || 'Unknown bank',
    userSpends,
    savings: {
      totalSavings: parseNumber(recommendation.total_savings),
      netSavings: parseNumber(recommendation.net_savings),
      categories,
    },
    metadata: {
      source: 'card-details',
      storedAt: analyticsContext?.storedAt,
    },
  };
};

const ApplyButton = ({ cardId, cardName = 'this card', bankName, analyticsContext }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleApply = async () => {
    if (isSubmitting) {
      return;
    }
    setIsSubmitting(true);
    setError(null);
    setIsSuccess(false);

    try {
      const analyticsPayload = buildAnalyticsPayload({ cardId, cardName, bankName, analyticsContext });
      if (!analyticsPayload.cardId) {
        throw new Error('Missing card identifier for analytics logging.');
      }

      const response = await fetch(`${API_BASE_URL}/analytics/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analyticsPayload),
      });

      if (!response.ok) {
        throw new Error(`Analytics API returned ${response.status}`);
      }

      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 650));
      router.replace('/');
    } catch (err) {
      console.error('Failed to log card application analytics:', err);
      setError('Unable to submit right now. Please try again.');
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 max-w-[568px] mx-auto bg-[#222834] border-t border-[rgba(255,255,255,0.15)] rounded-t-[20px] shadow-[0px_-4px_16px_rgba(0,0,0,0.3)]">
      <div className="flex justify-center px-[16px] py-[16px] flex-col gap-2">
        {error ? (
          <div className="text-sm text-[#ffb4b4] text-center font-sf-pro">{error}</div>
        ) : null}
        <button
          type="button"
          onClick={handleApply}
          disabled={isSubmitting}
          className="w-full h-[56px] bg-[#1E5752] text-white font-sf-pro font-medium text-[17px] leading-[20px] tracking-[-0.002em] text-center rounded-[14px] hover:bg-[#245f59] transition-colors disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSuccess ? (
            <span>Success! Redirecting…</span>
          ) : isSubmitting ? (
            <>
              <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              <span>Submitting application…</span>
            </>
          ) : (
            <span>Apply for {cardName}</span>
          )}
        </button>
      </div>
    </div>
  );
};

ApplyButton.propTypes = {
  cardId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  cardName: PropTypes.string,
  bankName: PropTypes.string,
  analyticsContext: PropTypes.shape({
    recommendation: PropTypes.shape({
      card_name: PropTypes.string,
      bank_name: PropTypes.string,
      total_savings: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      net_savings: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      categories: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string,
          savings: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
          spent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        }),
      ),
    }),
    userSpends: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
    storedAt: PropTypes.string,
  }),
};

export default ApplyButton;

