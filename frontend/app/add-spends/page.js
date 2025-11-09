'use client';

import { useEffect, useMemo, useState } from 'react';
import { CircularProgress, useMediaQuery } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '../../components/common/Container';
import Header from '../../components/common/Header';
import Drawer from '../../components/common/Drawer';
import Carousel from '../../components/common/Carousel';
import CardSpend from '../../components/add-spends/CardSpend';
import PrimaryButton from '../../components/common/Button';
import { CARD_IMAGES, CATEGORIES } from '../../data/cards';

const CATEGORY_INDEX = CATEGORIES.reduce((acc, item) => {
  acc[item.id] = item;
  return acc;
}, {});

const CATEGORY_ICONS = {
  travel: '/airplane_icon.svg',
  shopping: '/shopping_icon.svg',
  fuel: '/fuel_icon.svg',
  food: '/star_icon.svg',
};

const formatCurrency = (value = 0) =>
  `₹${Number(value || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;

export default function AddSpendsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery('(max-width:640px)');
  const drawerMaxHeight = isMobile ? 650 : 750;
  const selectedKeys = useMemo(() => {
    const param = searchParams.get('categories');
    if (!param) return [];
    return param
      .split(',')
      .map((key) => key.trim())
      .filter((key) => key.length > 0);
  }, [searchParams]);

  const enabledCategories = useMemo(
    () => selectedKeys.map((key) => CATEGORY_INDEX[key]).filter(Boolean),
    [selectedKeys],
  );

  useEffect(() => {
    if (!selectedKeys.length) {
      router.replace('/');
    }
  }, [router, selectedKeys]);

  const initialAmounts = useMemo(() => {
    const base = {};
    enabledCategories.forEach((category) => {
      base[category.id] = category.initialAmount ?? 0;
    });
    return base;
  }, [enabledCategories]);

  const [categoryAmounts, setCategoryAmounts] = useState(initialAmounts);
  const [drawerHeight, setDrawerHeight] = useState(200);
  const [activeSlide, setActiveSlide] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCategoryAmounts(initialAmounts);
  }, [initialAmounts]);

  const totalSpend = useMemo(
    () => selectedKeys.reduce((sum, key) => sum + (categoryAmounts[key] || 0), 0),
    [selectedKeys, categoryAmounts],
  );

  useEffect(() => {
    if (!selectedKeys.length) return undefined;

    const payload = {};
    selectedKeys.forEach((key) => {
      payload[key] = categoryAmounts[key] ?? 0;
    });

    const controller = new AbortController();
    // Debounce API call by 1000ms (1 second) when user changes category values
    const timer = setTimeout(async () => {
      setIsCalculating(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/calculate-list`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(Array.isArray(data) ? data : []);
        setActiveSlide(0);
        setError(null);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setRecommendations([]);
          setError('Unable to fetch recommendations right now.');
        }
      } finally {
        setIsCalculating(false);
      }
    }, 1000); // 1000ms = 1 second debounce delay

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [categoryAmounts, selectedKeys]);

  const carouselCards = useMemo(() => {
    if (!recommendations.length) {
      return CARD_IMAGES;
    }
    return recommendations.map((card) => ({
      id: card.id,
      url: '/visa_cred_card.png',
      alt: card.card_name,
      name: card.card_name,
      shortName: card.card_name,
    }));
  }, [recommendations]);

  const activeCard = recommendations[activeSlide] || recommendations[0] || null;
  const savingsBreakdown = activeCard?.categories || [];
  const totalSavingsValue = activeCard ? Number(activeCard.total_savings || 0) : 0;
  const recommendedCount = recommendations.length;
  const rating = activeCard?.rating || 'N/A';
  const reviews = activeCard?.reviews_count || 0;
  const bestFor = activeCard?.best_for || 'Best for your spends';
  const totalSavingsPercent =
    savingsBreakdown.length && activeCard && totalSpend
      ? ((totalSavingsValue / totalSpend) * 100).toFixed(2)
      : null;

  const handleAmountChange = (categoryId, newAmount) => {
    setCategoryAmounts((prev) => ({
      ...prev,
      [categoryId]: newAmount,
    }));
  };

  const handleViewDetails = () => {
    const selectedCard = recommendations[activeSlide] || recommendations[0];
    const fallbackCard = carouselCards[activeSlide] ?? carouselCards[0];
    const navigateTarget = selectedCard?.id || fallbackCard?.id;

    if (navigateTarget && typeof window !== 'undefined') {
      const userSpends = selectedKeys.reduce((acc, key) => {
        acc[key] = categoryAmounts[key] ?? 0;
        return acc;
      }, {});

      const contextPayload = {
        recommendation: selectedCard || null,
        userSpends,
        storedAt: new Date().toISOString(),
      };

      window.sessionStorage.setItem(
        `card-context:${navigateTarget}`,
        JSON.stringify(contextPayload),
      );
    }

    if (selectedCard?.id) {
      router.push(`/card-details?cardId=${encodeURIComponent(selectedCard.id)}`);
      return;
    }

    if (fallbackCard?.id) {
      router.push(`/card-details?cardId=${encodeURIComponent(fallbackCard.id)}`);
    }
  };

  const formatPercent = (saved, spent) => {
    if (!spent) return 'N/A';
    return `${((Number(saved || 0) / Number(spent)) * 100).toFixed(2)}%`;
  };

  return (
    <div className="relative">
      <Container sx={{ px: { xs: 2, sm: 3 }, py: 0 }}>
        <Header text="Add Spends" />
        <div className="px-3 py-3 space-y-4 pb-80">
          {enabledCategories?.map((categoryData, index) => (
            <CardSpend
              key={categoryData.id}
              category={categoryData.category}
              icon={categoryData.icon}
              initialAmount={categoryAmounts[categoryData.id] ?? categoryData.initialAmount}
              maxAmount={categoryData.maxAmount}
              quickAddAmounts={categoryData.quickAddAmounts}
              expandedMessage={categoryData.expandedMessage}
              index={index}
              onAmountChange={(newAmount) => handleAmountChange(categoryData.id, newAmount)}
            />
          ))}
        </div>
        <Drawer
          initialHeight={drawerHeight}
          minHeight={200}
          maxHeight={drawerMaxHeight}
          onHeightChange={setDrawerHeight}
          className="from-[#1a1f2e] to-[#0f1419] border-t border-gray-700"
        >
          <div className="flex justify-between items-center px-[16px] pb-[10px]">
            <div className="font-sf-pro font-[400] text-[15px] leading-[20px] text-[rgba(255, 255, 255, 0.8)]">Total Spends</div>
            <div className="font-sf-pro font-[700] text-[17px] leading-[22px]  text-[rgba(255, 255, 255, 1)]">
              {formatCurrency(totalSpend)}
            </div>
          </div>
          <div className="pt-[12px] pb-[100px] bg-[#3e6584]">
            <div className="flex justify-between items-center px-[16px]">
              <div>
                <div
                  className="font-sf-pro font-[400] text-[17px] leading-[22px] text-[#FFFFFF] flex items-center gap-2"
                  style={{
                    opacity: drawerHeight > 200 ? 0 : 1,
                    height: drawerHeight > 200 ? 0 : 'auto',
                    overflow: 'hidden',
                  }}
                >
                  <span>Save monthly upto:</span>
                  {isCalculating ? (
                    <CircularProgress size={18} sx={{ color: '#11FF00' }} />
                  ) : (
                    <span className="text-[#11FF00]">{formatCurrency(totalSavingsValue)}</span>
                  )}
                </div>
                <div className="font-sf-pro font-[400] text-[13px] leading-[18px] text-[#ffffff80]">
                  {isCalculating
                    ? 'Calculating recommendations...'
                    : `${recommendedCount} recommended cards`}
                </div>
              </div>
              <div>
                {drawerHeight > 200 ? (
                  <div className="flex gap-1 items-center">
                    {carouselCards.map((_, index) => (
                      <div
                        key={index}
                        className="rounded-full transition-all duration-300"
                        style={{
                          width: activeSlide === index ? '8px' : '6px',
                          height: activeSlide === index ? '8px' : '6px',
                          backgroundColor:
                            activeSlide === index ? 'rgba(65, 61, 71, 1)' : 'rgba(217, 217, 217, 1)',
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <img src="/up_arrow_icon.svg" alt="up arrow" />
                )}
              </div>
            </div>
            <div className="mt-4 relative z-0">
              <div
                className="transition-opacity duration-300"
                style={{
                  opacity: drawerHeight > 200 ? 1 : 0,
                  display: drawerHeight > 200 ? 'block' : 'none',
                }}
              >
                <Carousel images={carouselCards} onSlideChange={(index) => setActiveSlide(index)} />
              </div>
              <div
                className="flex justify-center transition-opacity duration-300"
                style={{
                  opacity: drawerHeight > 200 ? 0 : 1,
                  display: drawerHeight > 200 ? 'none' : 'flex',
                }}
              >
                <img src="/drawer_card_img.svg" alt="card" />
              </div>
            </div>
            <div
              className="max-h-[370px] bg-[#222834] rounded-t-2xl relative z-10 mt-[-35px] transition-all duration-300 scrollbar-hide flex flex-col"
              style={{
                opacity: drawerHeight > 200 ? 1 : 0,
                maxHeight: drawerHeight > 200 ? '400px' : '0px',
                overflow: drawerHeight > 200 ? 'visible' : 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                marginTop: '-15px',
              }}
            >
              <div className="flex-1 overflow-y-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="py-[16px] border-b border-[#99999938]">
                  <div className="text-center text-[#ffffff]  text-[20px] leading-[26px] font-sf-pro font-[600] tracking-[-0.002em]">
                    {activeCard?.card_name || carouselCards[activeSlide]?.name || 'Recommended Card'}
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="flex items-center justify-between gap-[30px]">
                      <div className="flex items-center gap-1">
                        <div className="font-sf-pro font-[500] text-[11px] text-[#FFFFFFCC]">
                          {rating} ({reviews.toLocaleString()} reviews)
                        </div>
                        <img src="/rating.svg" alt="rating" />
                      </div>
                      {activeCard && (
                        <div
                          className="font-sf-pro font-[500] text-[11px] underline decoration-dotted cursor-pointer  text-[#999999]"
                          onClick={handleViewDetails}
                        >
                          View Details
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-[14px] py-[12px]">
                  <div
                    className="relative rounded-xl p-[0.5px] gradient-border-animate overflow-hidden"
                  >
                    <div className="px-[14px] py-[12px] flex rounded-xl bg-[#222834]">
                      <div className="relative inline-flex items-start mr-2">
                        <img
                          src="/star_icon.svg"
                          alt="highlight"
                          className="w-[24px] h-[24px]"
                        />
                                        </div>
                      <div className="font-sf-pro font-[400] text-[13px] leading-[18px] tracking-[0.01em] text-[rgba(255,255,255,1)]">
                        {bestFor}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-[14px] py-[12px]">
                  <div
                    className="relative rounded-xl p-[0.5px] overflow-hidden"
                    style={{
                      background:
                        'linear-gradient(135.66deg, rgba(255, 255, 255, 0.18) -23.01%, rgba(16, 26, 45, 0.6) 40.85%, rgba(255, 255, 255, 0.18) 104.72%)',
                      boxShadow: '1px 8px 10px 0px rgba(0, 0, 0, 0.12)',
                    }}
                  >
                    <div
                      className="rounded-xl"
                      style={{
                        background: 'linear-gradient(169.98deg, #353F54 27.98%, #222834 81.2%)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-4 border-b border-[rgba(255,255,255,0.1)] px-[16px] py-[14px]">
                        <div className="font-sf-pro font-[600] text-[15px] leading-[20px] tracking-[-0.002em] text-[rgba(204,204,204,1)]">
                          Savings breakdown
                        </div>
                        <div
                          className="font-sf-pro font-[400] text-[11px] leading-[14px] tracking-[0.02em] text-[rgba(153,153,153,1)] underline decoration-dotted cursor-pointer"
                          style={{
                            textDecorationOffset: '25%',
                            textDecorationThickness: '7.5%',
                          }}
                        >
                          Expand
                        </div>
                      </div>

                      <div className="space-y-4">
                        {savingsBreakdown.length ? (
                          savingsBreakdown.map((entry) => {
                            const icon = CATEGORY_ICONS[entry.category?.toLowerCase()] || '/star_icon.svg';
                            return (
                              <div className="flex items-center gap-3 px-[16px]" key={entry.category}>
                                <div>
                                  <img src={icon} alt={entry.category} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-sf-pro font-[600] text-[15px] leading-[20px] text-[rgba(255,255,255,1)]">
                                    {entry.category}
                                  </div>
                                  <div className="font-sf-pro font-[400] text-[13px] leading-[18px] text-[rgba(153,153,153,1)]">
                                    {formatCurrency(entry.spent)} spent
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-sf-pro font-[600] text-[17px] leading-[22px] text-[rgba(255,255,255,1)]">
                                    +{formatCurrency(entry.savings)}
                                  </div>
                                  <div className="font-sf-pro font-[400] text-[13px] leading-[18px] text-[rgba(153,153,153,1)]">
                                    {formatPercent(entry.savings, entry.spent)}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-[16px] pb-[12px] text-sm text-[#ffffff80]">
                            Adjust your spends to see category-wise savings.
                          </div>
                        )}
                      </div>

                      <div className="mt-4 py-[13px] px-[16px] border-t border-dashed border-[rgba(255,255,255,0.1)] flex items-center justify-between">
                        <div>
                          <div className="font-sf-pro font-[600] text-[17px] leading-[22px] text-[rgba(255,255,255,1)]">Total savings</div>
                          <div className="font-sf-pro font-[400] text-[13px] leading-[18px] text-[rgba(153,153,153,1)]">
                            {formatCurrency(totalSpend)} spent
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-sf-pro font-[600] text-[24px] leading-[29px] text-[#11FF00]">
                            {formatCurrency(totalSavingsValue)}
                          </div>
                          <div className="font-sf-pro font-[400] text-[13px] leading-[18px] text-[rgba(153,153,153,1)]">
                            {totalSavingsPercent ? `${totalSavingsPercent}% avg` : 'N/A'}
                          </div>
                        </div>
                      </div>
                      {error && <div className="px-[16px] pb-[12px] text-sm text-red-400">{error}</div>}
                    </div>
                  </div>
                </div>
                <div className="pb_[88px]" />
              </div>
              <div className="sticky bottom-0 left-0 right-0 bg-[#222834] border-t border-[rgba(255,255,255,0.15)] rounded-t-[20px] shadow-[0px_-4px_16px_rgba(0,0,0,0.3)]">
                <div className="flex justify-center px_[14px] py_[16px]">
                  <PrimaryButton
                    onClick={handleViewDetails}
                    sx={{
                      mt: 0,
                      width: '100%',
                      px: 0,
                      fontFamily: '"SF Pro Display", var(--font-inter), sans-serif',
                      fontWeight: 500,
                      fontSize: '17px',
                    }}
                  >
                    <span className="inline-block">
                      Apply for {carouselCards[activeSlide]?.shortName || 'Card'}
                    </span>
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </div>
        </Drawer>
      </Container>
    </div>
  );
}