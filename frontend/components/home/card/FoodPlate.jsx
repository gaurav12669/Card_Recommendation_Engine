'use client';

import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export const FoodPlate = ({ selected }) => (
  <div className="relative w-full h-[86px] -top-6">
    <img
      className={twMerge(
        'absolute left-1/2 -translate-x-1/2 z-10 transition-all origin-bottom-left',
        selected && '-rotate-[10deg] scale-110',
      )}
      src="/food_cap.png"
      alt="food_cap"
    />
    <img
      className={twMerge(
        'absolute left-1/2 -translate-x-1/2 top-6 transition-all',
        selected && 'translate-y-1 scale-110',
      )}
      src="/food_plate.svg"
      alt="food_plate"
      width={86}
      height={86}
      loading="lazy"
    />
  </div>
);

FoodPlate.propTypes = {
  selected: PropTypes.bool,
};

export default FoodPlate;

