'use client';

import CategoryCard from './card/Card';
import FoodPlate from './card/FoodPlate';

const CATEGORY_META = {
  travel: {
    icon: '/airplane.svg',
    iconClass: 'absolute top-[-25px]',
    animationScale: 1.15,
    animationRotate: 20,
  },
  shopping: {
    icon: '/straight_bag.png',
    iconClass: 'absolute top-[-20px] w-[86px]',
    background: '/straight_bag.png',
    animationScale: 1.15,
    animationRotate: 20,
  },
  food: {
    IconComponent: FoodPlate,
  },
  fuel: {
    icon: '/fuel.svg',
    background: '/station.png',
    iconClass: 'absolute top-[-12px]',
    animationScale: 1.2,
    translateY: -1,
    transformOrigin: 'bottom-right',
    animationRotate: -5,
  },
};

const FALLBACK_META = {
  icon: '/card-image.svg',
};

const CardSection = ({ categories, selectedKeys, onToggle, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center mt-6">
        <div className="loader h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle empty or invalid categories gracefully
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    // Return empty div so page doesn't break, but don't show anything
    return <div className="mt-6" />;
  }

  return (
    <div className="flex justify-center mt-6 gap-[27px] flex-wrap max-w-[336px] mx-auto">
      {categories.map(({ id, key, name }) => {
        const meta = CATEGORY_META[key] || FALLBACK_META;
        const selected = selectedKeys.includes(key);

        return (
          <CategoryCard
            key={id}
            selected={selected}
            onClick={() => onToggle(key)}
            label={name}
            {...meta}
          />
        );
      })}
    </div>
  );
};

export default CardSection;

