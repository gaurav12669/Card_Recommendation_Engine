import PropTypes from 'prop-types';

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  if (numeric >= 100000) {
    return `₹${(numeric / 100000).toFixed(1).replace(/\.0$/, '')} Lakh+`;
  }
  return `₹${numeric.toLocaleString('en-IN')}`;
};

const Eligibility = ({ eligibility }) => {
  const items = [
    {
      title:
        eligibility?.min_age || eligibility?.max_age
          ? `${eligibility?.min_age || '--'} - ${eligibility?.max_age || '--'} years`
          : 'Age details unavailable',
      subtitle: 'Age eligibility',
    },
    {
      title: eligibility?.min_income ? formatCurrency(eligibility.min_income) : 'Income details unavailable',
      subtitle: 'Minimum income',
    },
    {
      title: eligibility?.min_cibil_score ? `${eligibility.min_cibil_score}+` : 'CIBIL score details unavailable',
      subtitle: 'CIBIL score',
      isLast: true,
    },
  ];

  return (
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
              Eligibility Criteria
            </div>

            {items.map((item) => (
              <div
                key={`${item.subtitle}-${item.title}`}
                className={`flex px-[16px] py-[14px] items-start gap-3 ${item.isLast ? '' : 'border-b border-white/10 border-dashed'}`}
              >
                <div className="flex items-center justify-center">
                  <img className="w-[30px] h-[30px]" src="/tick_circle_icon.svg" alt="tick_icon" />
                </div>
                <div className="flex-1">
                  <div className="font-[SF_Pro_Text] font-[400] text-[15px] leading-[20px] text-[#FFFFFF]">{item.title}</div>
                  <div className="font-[SF_Pro_Text] font-[400] text-[13px] leading-[18px] text-[#999999] mt-1">{item.subtitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Eligibility.propTypes = {
  eligibility: PropTypes.shape({
    min_age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    max_age: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min_income: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min_cibil_score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

export default Eligibility;

