'use client';

import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export const CategoryCard = ({
  icon,
  label,
  selected,
  onClick,
  background,
  animationScale,
  animationRotate,
  translateY = 0,
  translateX = 0,
  transformOrigin,
  IconComponent,
}) => (
  <button type="button" className="relative cursor-pointer" onClick={onClick}>
    <div className="w-full flex flex-col items-center justify-center absolute top-[-15px] left-1/2 -translate-x-1/2 z-20 text-white text-center">
      {IconComponent ? (
        <IconComponent selected={selected} />
      ) : (
        <img
          src={icon}
          alt={label}
          width={86}
          height={86}
          loading="lazy"
          className={twMerge(
            'aspect-square object-none transition-all',
            transformOrigin === 'bottom-right' ? 'origin-bottom-right' : 'origin-center',
          )}
          style={{
            transform: selected ? `scale(${animationScale}) translate(${translateX}px,${translateY}px)` : 'scale(1)',
            rotate: selected ? `${animationRotate}deg` : '0deg',
          }}
        />
      )}
      <div className="font-medium text-[15px] mt-[3px]">{label}</div>
    </div>

    <div
      style={{
        background: `url(${background || icon})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: '70%',
        backgroundPosition: 'center',
        minHeight: '102px',
        minWidth: '123px',
      }}
    >
      <div
        className="glass-card transition-all"
        style={{
          background: selected ? '#0263BE33' : 'rgba(255, 255, 255, 0.1)',
          boxShadow: 'rgba(255, 255, 255, 0.063) 0px 1px 0px inset, rgba(255, 255, 255, 0.03) 0px -1px 0px inset',
          backdropFilter: 'blur(8px) saturate(1)',
        }}
      />
    </div>

    {selected && (
      <img
        src="/card_check.svg"
        alt="Selected card"
        width="14"
        height="14"
        className="absolute top-0 right-0 z-10"
        style={{ width: '14px', height: '14px', aspectRatio: '1 / 1' }}
      />
    )}
  </button>
);

CategoryCard.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  background: PropTypes.string,
  animationScale: PropTypes.number,
  animationRotate: PropTypes.number,
  translateY: PropTypes.number,
  translateX: PropTypes.number,
  transformOrigin: PropTypes.string,
  IconComponent: PropTypes.elementType,
};

export default CategoryCard;

