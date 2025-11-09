'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const CardSpend = ({
  category,
  icon,
  initialAmount = 6000,
  maxAmount = 50000,
  quickAddAmounts = [1000, 5000],
  expandedMessage = 'Save ₹5,000 more by increasing shopping spends by ₹1,000',
  index = 0,
  onAmountChange = () => {},
}) => {
  const [amount, setAmount] = useState(initialAmount);
  const [displayAmount, setDisplayAmount] = useState(initialAmount);
  const [isExpanded, setIsExpanded] = useState(false);
  const animationRef = useRef(null);
  const displayAmountRef = useRef(initialAmount);

  useEffect(() => {
    setAmount(initialAmount);
    setDisplayAmount(initialAmount);
    displayAmountRef.current = initialAmount;
  }, [initialAmount]);

  const progressPercentage = useMemo(() => (amount / maxAmount) * 100, [amount, maxAmount]);

  const animationDelay = `${index * 800}ms`;

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startValue = displayAmountRef.current;
    const endValue = amount;
    const duration = 300;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeOutQuad = progress * (2 - progress);

      const currentValue = Math.round(startValue + (endValue - startValue) * easeOutQuad);
      displayAmountRef.current = currentValue;
      setDisplayAmount(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [amount]);

  const handleAmountChange = useCallback(
    (event) => {
      const newAmount = parseInt(event.target.value, 10);
      setAmount(newAmount);
      onAmountChange(newAmount);
    },
    [onAmountChange],
  );

  const handleQuickAdd = useCallback(
    (addAmount) => {
      setAmount((prev) => {
        const newAmount = Math.min(prev + addAmount, maxAmount);
        onAmountChange(newAmount);
        return newAmount;
      });
    },
    [maxAmount, onAmountChange],
  );

  const toggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return (
    <div
      className="rounded-[20px] shadow-[1px_8px_10px_0px_#0000001F] animate-slide-up p-[1px]"
      style={{
        animationDelay,
        animationFillMode: 'both',
        background:
          'linear-gradient(135deg, rgba(180, 180, 180, 0.3) 0%, rgba(100, 100, 100, 0.15) 25%, rgba(60, 60, 60, 0.1) 50%, rgba(100, 100, 100, 0.15) 75%, rgba(180, 180, 180, 0.3) 100%)',
      }}
    >
      <div
        className={`rounded-[19.5px] ${isExpanded ? 'pt-3' : 'py-3'} bg-[linear-gradient(169.98deg,#353F54_27.98%,#222834_81.2%)]`}
      >
        <div className="flex justify-between items-center px-3">
          <div className="flex items-center gap-2">
            <img src={icon} alt={category.toLowerCase()} />
            <div className="font-sf-pro font-[500] text-[17px] leading-[20px] tracking-[-0.002em] text-[#FFFFFF]">{category}</div>
          </div>
          <div className="font-sf-pro font-[400] text-[15px] leading-[20px] tracking-[-0.002em] text-[#FFFFFFCC]">
            ₹{displayAmount.toLocaleString()}
          </div>
        </div>
        <div className="mt-4 ml-9 px-3">
          <div>
            <input
              type="range"
              min="0"
              max={maxAmount}
              step="50"
              value={amount}
              onChange={handleAmountChange}
              className="w-full h-2 appearance-none cursor-pointer outline-none rounded-lg border-[0.5px] border-[#1C202A] shadow-[0px_2px_4px_2px_#0000003D_inset,0px_0.3px_0px_0px_#FFFFFF3D] 
                                 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-100 [&::-webkit-slider-thumb]:mt-[-12px] [&::-webkit-slider-thumb]:shadow-[0.25px_1px_4px_1px_#00000026,0px_4px_4px_0px_#00000040,-4px_-2px_4px_0px_#00000040_inset,2px_2px_1.9px_0px_#71717140_inset]
                                 [&::-webkit-slider-thumb]:hover:scale-105 [&::-webkit-slider-thumb]:active:scale-[0.98]
                                 [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-lg [&::-webkit-slider-runnable-track]:border-[0.5px] [&::-webkit-slider-runnable-track]:border-[#1C202A]
                                 [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-100 [&::-moz-range-thumb]:shadow-[0.25px_1px_4px_1px_#00000026,0px_4px_4px_0px_#00000040,-4px_-2px_4px_0px_#00000040_inset,2px_2px_1.9px_0px_#71717140_inset]
                                 [&::-moz-range-track]:h-2 [&::-moz-range-track]:border-[0.5px] [&::-moz-range-track]:border-[#1C202A] [&::-moz-range-track]:rounded-lg [&::-moz-range-track]:shadow-[0px_2px_4px_2px_#0000003D_inset,0px_0.3px_0px_0px_#FFFFFF3D]
                                 [&::-moz-range-progress]:h-2 [&::-moz-range-progress]:bg-[linear-gradient(90deg,#0165C6_0%,#0060B8_100%)] [&::-moz-range-progress]:shadow-[0px_2px_2.5px_0px_#0000003D_inset,0px_0.3px_0px_0px_#FFFFFF99] [&::-moz-range-progress]:rounded-lg"
              style={{
                background: `linear-gradient(to right, #0165C6 0%, #0060B8 ${progressPercentage}%, #222835 ${progressPercentage}%, #222835 100%)`,
              }}
            />
            <style>
              {`
                             input[type="range"]::-webkit-slider-thumb {
                                 background: radial-gradient(circle at center, #222835 0%, #222835 calc(100% - 1px), transparent calc(100% - 1px)), linear-gradient(314.13deg, rgba(54, 63, 84, 0.2) 12.86%, #788CBA 87.81%) !important;
                             }
                             input[type="range"]::-moz-range-thumb {
                                 background: radial-gradient(circle at center, #222835 0%, #222835 calc(100% - 1px), transparent calc(100% - 1px)), linear-gradient(314.13deg, rgba(54, 63, 84, 0.2) 12.86%, #788CBA 87.81%) !important;
                             }
                             
                             @keyframes shineMove {
                                 0% {
                                     transform: translateX(-100%);
                                 }
                                 100% {
                                     transform: translateX(200%);
                                 }
                             }
                            `}
            </style>
          </div>
          <div className="mt-4 flex justify-between">
            <div className="flex gap-2 items-center">
              {quickAddAmounts.map((addAmount, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickAdd(addAmount)}
                  className="border-[0.5px] cursor-pointer rounded-[8px] bg-[#DDDDDD1A] font-sf-pro font-semibold text-[13px] leading-[18px] text-center text-[#FFFFFFE5] px-3 py-2 hover:bg-[#DDDDDD33] transition-colors"
                  style={{
                    borderImageSource: 'linear-gradient(113.84deg, rgba(153, 153, 153, 0.1) -39.29%, #2F384A 65.56%, rgba(204, 204, 204, 0.3) 166%)',
                    borderImageSlice: 1,
                  }}
                >
                  + ₹{addAmount >= 1000 ? `${addAmount / 1000}k` : addAmount}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={toggleExpanded}>
              <div className="font-sf-pro font-normal text-[13px] leading-[18px] tracking-[0.01em] text-center text-[#999999]">Expand</div>
              <img
                src="/down_arrow.svg"
                alt="arrow"
                className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </div>
          </div>
        </div>
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out border-t-[0.2px] border-t-[#FFFFFF26] relative ${
            isExpanded ? 'max-h-20 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          {isExpanded && (
            <div className="absolute pointer-events-none overflow-hidden">
              <div
                className="absolute "
                style={{
                  background:
                    'linear-gradient(80deg, transparent 0%, transparent 42%, rgba(255, 255, 255, 0.08) 58%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.08) 0%, transparent 0%, transparent 0%)',
                  animation: 'shineMove 6s ease-in-out infinite',
                  width: '140%',
                  height: '150%',
                  top: '-25%',
                }}
              />
            </div>
          )}
          <div className="flex items-center gap-2 pt-[16px] pb-[16px] px-3">
            <div className="relative inline-flex items-start">
              <img
                src="/star_icon.svg"
                alt="info"
                className="w-[40px] h-[40px]"
              />
            </div>
            <div className="font-sf-pro font-normal text-[13px] leading-[18px] text-[#FFFFFFCC] px-3">{expandedMessage}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

CardSpend.propTypes = {
  category: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  initialAmount: PropTypes.number,
  maxAmount: PropTypes.number,
  quickAddAmounts: PropTypes.arrayOf(PropTypes.number),
  expandedMessage: PropTypes.string,
  index: PropTypes.number,
  onAmountChange: PropTypes.func,
};

export default CardSpend;

