'use client';

import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import styles from './Carousel.module.css';

const defaultImages = [
  {
    id: 1,
    url: '/carousel1.png',
    alt: 'Image 1',
  },
  {
    id: 2,
    url: '/carousel1.png',
    alt: 'Image 2',
  },
  {
    id: 3,
    url: '/carousel1.png',
    alt: 'Image 3',
  },
];

const Carousel = ({ images = [], onSlideChange }) => {
  const carouselImages = images.length ? images : defaultImages;

  const handleSlideChange = (swiper) => {
    if (onSlideChange) {
      onSlideChange(swiper.activeIndex);
    }
  };

  return (
    <div className={styles.carouselContainer}>
      <Swiper
        modules={[Navigation]}
        grabCursor
        centeredSlides
        slidesPerView={1.5}
        spaceBetween={30}
        loop={false}
        autoplay={{
          delay: 2000,
        }}
        initialSlide={1}
        onSlideChange={handleSlideChange}
        className={styles.swiperRoot}
      >
        {carouselImages.map((image) => (
          <SwiperSlide key={image.id} className={styles.slide}>
            <img src={image.url} alt={image.alt || `Slide ${image.id}`} loading="lazy" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

Carousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      url: PropTypes.string.isRequired,
      alt: PropTypes.string,
      name: PropTypes.string,
      shortName: PropTypes.string,
    }),
  ),
  onSlideChange: PropTypes.func,
};

export default Carousel;

