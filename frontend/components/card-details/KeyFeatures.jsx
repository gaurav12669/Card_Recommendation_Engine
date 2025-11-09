import PropTypes from 'prop-types';

const KeyFeatures = ({ features = [] }) => (
  <div className="mt-4 w-full">
    <div className="flex justify-center w-full">
      <div
        className="max-w-[350px] w-full rounded-[16px] border-[0.5px] border-solid"
        style={{
          background: 'linear-gradient(169.98deg, #353F54 27.98%, #222834 81.2%)',
          borderImageSource:
            'linear-gradient(135.66deg, rgba(255, 255, 255, 0.18) -23.01%, rgba(16, 26, 45, 0.6) 40.85%, rgba(255, 255, 255, 0.18) 104.72%)',
          boxShadow: '1px 8px 10px 0px #0000001F',
        }}
      >
        <div>
          <div className="px-[16px] py-[14px] font-[SF_Pro_Text] font-[600] text-[15px] leading-[20px] text-[#FFFFFF] border-b border-white/10 pb-4">
            Key Features
          </div>
          {features.length ? (
            features.map((feature, index) => (
              <div
                key={`${feature.feature_title || 'feature'}-${index}`}
                className={`flex items-start gap-3 px-[16px] py-[14px] ${
                  index === features.length - 1 ? '' : 'border-b border-white/10 border-dashed'
                }`}
              >
                <div className="flex items-center justify-center">
                  <img className="w-[30px] h-[30px]" src="/star_icon.svg" alt="feature_icon" />
                </div>
                <div className="flex-1">
                  <div className="font-[SF_Pro_Text] font-[400] text-[15px] leading-[20px] text-[#FFFFFF]">
                    {feature.feature_title || 'Exclusive benefit'}
                  </div>
                  {feature.feature_description ? (
                    <div className="font-[SF_Pro_Text] font-[400] text-[13px] leading-[18px] text-[#999999] mt-1">
                      {feature.feature_description}
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          ) : (
            <div className="px-[16px] py-[20px] text-center font-[SF_Pro_Text] text-[13px] leading-[18px] text-[#FFFFFFB3]">
              Feature information is not available for this card.
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

KeyFeatures.propTypes = {
  features: PropTypes.arrayOf(
    PropTypes.shape({
      feature_title: PropTypes.string,
      feature_description: PropTypes.string,
    }),
  ),
};

export default KeyFeatures;

