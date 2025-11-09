import PropTypes from 'prop-types';

const formatNumber = (value) => {
  if (!value && value !== 0) {
    return null;
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  return numeric.toFixed(2).replace(/\.00$/, '');
};

const CardHero = ({ cardName, bankName, rating, reviewsCount }) => {
  const formattedRating = formatNumber(rating);
  const formattedReviews = reviewsCount ? reviewsCount.toLocaleString() : null;

  return (
    <div className="flex justify-center mt-5">
      <div>
        <div
          className="flex flex-col justify-between w-[280px] p-[22px] h-[170px] rounded-[20px] shadow-[-7px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[20.655px] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/card_bg.png')" }}
        >
          <div className="flex justify-between items-center">
            <div className="font-[Space_Grotesk] font-bold text-[12.24px] leading-[100%] tracking-[0%]">{bankName || 'Bank'}</div>
            <div className="flex items-center gap-1">
              <img src="/visa_icon.svg" alt="card_network_primary" />
              <img src="/visa_img.svg" alt="card_network_secondary" />
            </div>
          </div>
          <div>
            <div className="font-[Space_Grotesk] font-[400] text-[13.77px] leading-[100%]" style={{ letterSpacing: '0.05em' }}>
              <span className="mr-3">4802</span> <span className="mr-3">2215</span> <span className="mr-3">1183</span> <span className="mr-3">4289</span>
            </div>
            <div
              className="font-[Space_Grotesk] font-[400] text-[10.71px] leading-[100%] uppercase mt-2"
              style={{ letterSpacing: '0.3em' }}
            >
              {bankName ? `${bankName} User` : 'Card Holder'}
            </div>
          </div>
        </div>
        <div className="font-[SF_Pro_Text] font-semibold text-[17px] text-center leading-[22px] tracking-[-0.3%] mt-5">
          {cardName || 'Credit Card'}
        </div>
        <div className="flex items-center justify-center gap-1 mt-1">
          <div className="font-[SF_Pro_Text] font-normal text-[11px] leading-[14px] tracking-[2%] text-white/80">
            {formattedRating ? `${formattedRating} ${formattedReviews ? `(${formattedReviews} reviews)` : ''}` : 'Rating unavailable'}
          </div>
          <img src="/rating.svg" alt="rating" />
        </div>
      </div>
    </div>
  );
};

CardHero.propTypes = {
  cardName: PropTypes.string,
  bankName: PropTypes.string,
  rating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  reviewsCount: PropTypes.number,
};

export default CardHero;

