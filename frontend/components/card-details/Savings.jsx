import PropTypes from 'prop-types';

const Savings = ({ categorySavings = [], annualFee }) => {
  const sortedSavings = [...categorySavings].sort(
    (a, b) => Number(b.savings_percentage || 0) - Number(a.savings_percentage || 0),
  );

  const totalPercentage = sortedSavings.reduce((sum, entry) => sum + Number(entry.savings_percentage || 0), 0);

  const formatPercentage = (value) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return value || 'N/A';
    }
    return `${numeric.toFixed(2).replace(/\.00$/, '')}%`;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return value;
    }
    return `₹${numeric.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="mt-4 w-full">
      <div className="flex justify-center w-full">
        <div
          className="max-w-[350px] w-full rounded-[16px] border-[0.5px] border-solid"
          style={{
            background: 'linear-gradient(180deg, #3E6584 -0.08%, #2C5364 40.41%, #0F2027 80.9%)',
            borderImageSource:
              'linear-gradient(135.66deg, rgba(255, 255, 255, 0.18) -23.01%, rgba(16, 26, 45, 0.6) 40.85%, rgba(255, 255, 255, 0.18) 104.72%)',
            boxShadow: '1px 8px 10px 0px #0000001F',
          }}
        >
          <div className="flex justify-between items-center p-[12px]">
            <div className="font-[SF_Pro_Text] font-[400] text-[13px] leading-[18px] text-[#FFFFFF]">Category savings potential</div>
            <div className="font-[SF_Pro_Text] font-[400] text-[11px] leading-[14px] text-[#FFFFFFB3]">
              Annual fee: {formatCurrency(annualFee)}
            </div>
          </div>

          <div>
            {sortedSavings.length ? (
              sortedSavings.map((entry, index) => (
                <div
                  key={`${entry.category_name || 'category'}-${index}`}
                  className={`flex px-[16px] py-[12px] items-center justify-between ${
                    index === sortedSavings.length - 1 ? '' : 'border-b border-white/20 border-dashed'
                  }`}
                >
                  <div>
                    <div className="font-[SF_Pro_Text] font-[600] text-[15px] leading-[20px] text-[#FFFFFF]">
                      {entry.category_name || 'Category'}
                    </div>
                    <div className="font-[SF_Pro_Text] font-[400] text-[12px] leading-[16px] text-[#BBBBBB]">Savings percentage</div>
                  </div>
                  <div className="text-right">
                    <div className="font-[SF_Pro_Text] font-[600] text-[17px] leading-[22px] text-[#FFFFFF]">
                      {formatPercentage(entry.savings_percentage)}
                    </div>
                    <div className="font-[SF_Pro_Text] font-[400] text-[12px] leading-[16px] text-[#BBBBBB]">per spend</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-[16px] py-[20px] text-center font-[SF_Pro_Text] text-[13px] leading-[18px] text-[#FFFFFFB3]">
                Savings data is not available for this card.
              </div>
            )}
          </div>

          {sortedSavings.length ? (
            <div className="px-[16px] py-[14px] border-t border-white/10 flex items-center justify-between">
              <div className="font-[SF_Pro_Text] font-[400] text-[13px] leading-[18px] text-[#BBBBBB]">Combined potential</div>
              <div className="font-[SF_Pro_Text] font-[600] text-[18px] leading-[24px] text-[#11FF00]">
                {formatPercentage(totalPercentage)}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

Savings.propTypes = {
  categorySavings: PropTypes.arrayOf(
    PropTypes.shape({
      category_name: PropTypes.string,
      savings_percentage: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  annualFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Savings;

