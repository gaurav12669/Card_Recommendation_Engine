'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const Drawer = ({
  children,
  initialHeight = 200,
  minHeight = 100,
  maxHeight = 500,
  className = '',
  onHeightChange = () => {},
}) => {
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const drawerRef = useRef(null);
  const lastMoveTimeRef = useRef(0);
  const lastYRef = useRef(0);
  const velocityRef = useRef(0);

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setIsAnimating(false);
    setStartY(e.touches[0].clientY);
    setStartHeight(height);
    lastYRef.current = e.touches[0].clientY;
    lastMoveTimeRef.current = Date.now();
    velocityRef.current = 0;
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAnimating(false);
    setStartY(e.clientY);
    setStartHeight(height);
    lastYRef.current = e.clientY;
    lastMoveTimeRef.current = Date.now();
    velocityRef.current = 0;
  };

  const snapToPosition = useCallback(
    (targetHeight) => {
      setIsAnimating(true);
      setHeight(targetHeight);
      onHeightChange(targetHeight);
      setTimeout(() => setIsAnimating(false), 300);
    },
    [onHeightChange],
  );

  const handleEnd = useCallback(() => {
    setIsDragging(false);

    const threshold = minHeight + (maxHeight - minHeight) * 0.4;
    const velocityThreshold = 0.5;

    if (Math.abs(velocityRef.current) > velocityThreshold) {
      if (velocityRef.current > 0) {
        snapToPosition(maxHeight);
      } else {
        snapToPosition(initialHeight);
      }
    } else if (height > threshold) {
      snapToPosition(maxHeight);
    } else {
      snapToPosition(initialHeight);
    }

    velocityRef.current = 0;
  }, [minHeight, maxHeight, initialHeight, height, snapToPosition]);

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const currentY = e.touches[0].clientY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastMoveTimeRef.current;

      if (timeDelta > 0) {
        const yDelta = lastYRef.current - currentY;
        velocityRef.current = yDelta / timeDelta;
      }

      lastYRef.current = currentY;
      lastMoveTimeRef.current = currentTime;

      const deltaY = startY - currentY;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));

      setHeight(newHeight);
      onHeightChange(newHeight);
    },
    [isDragging, startY, startHeight, minHeight, maxHeight, onHeightChange],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;

      const currentY = e.clientY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastMoveTimeRef.current;

      if (timeDelta > 0) {
        const yDelta = lastYRef.current - currentY;
        velocityRef.current = yDelta / timeDelta;
      }

      lastYRef.current = currentY;
      lastMoveTimeRef.current = currentTime;

      const deltaY = startY - currentY;
      const newHeight = Math.max(minHeight, Math.min(maxHeight, startHeight + deltaY));

      setHeight(newHeight);
      onHeightChange(newHeight);
    },
    [isDragging, startY, startHeight, minHeight, maxHeight, onHeightChange],
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
    }

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
    };
  }, [isDragging, handleTouchMove, handleEnd, handleMouseMove]);

  useEffect(() => {
    if (height > 200) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [height]);

  const handleTouchMovePrevent = (e) => {
    e.preventDefault();
    handleTouchMove(e);
  };

  const handleWholeDrawerTouchStart = (e) => {
    if (!e.target.closest('.swiper') && !e.target.closest('.swiper-slide')) {
      e.stopPropagation();
    }
  };

  const handleWholeDrawerTouchMove = (e) => {
    if (!e.target.closest('.swiper') && !e.target.closest('.swiper-slide')) {
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={drawerRef}
      className={`max-w-[568px] mx-auto fixed bottom-0 left-0 right-0 rounded-t-3xl shadow-2xl ${className}`}
      style={{
        height: `${height}px`,
        transform: 'translateY(0)',
        backgroundColor: 'rgba(34, 40, 52, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(16px) saturate(180%)',
        WebkitBackdropFilter: 'blur(16px) saturate(180%)',
        transition: isAnimating ? 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
      }}
      onTouchStart={handleWholeDrawerTouchStart}
      onTouchMove={handleWholeDrawerTouchMove}
    >
      <div
        className="absolute rounded-t-3xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="w-full max-w-[568px] mx-auto relative z-10"
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
      >
        <div className="w-full flex justify-center py-3 cursor-grab active:cursor-grabbing" onTouchMove={handleTouchMovePrevent}>
          <div className="w-12 h-1.5 bg-gray-400 rounded-full" />
        </div>

        <div
          className="flex-1 overflow-y-auto pb-4"
          style={{
            overscrollBehavior: 'contain',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Drawer.propTypes = {
  children: PropTypes.node,
  initialHeight: PropTypes.number,
  minHeight: PropTypes.number,
  maxHeight: PropTypes.number,
  className: PropTypes.string,
  onHeightChange: PropTypes.func,
};

export default Drawer;

