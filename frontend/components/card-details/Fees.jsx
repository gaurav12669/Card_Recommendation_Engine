import PropTypes from 'prop-types';

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return value;
  }
  return `₹${numeric.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

const Fees = ({ annualFee, joiningFee, rewardPoints }) => (
  <div className="mt-[28px] w-full">
    <div className="flex justify-center w-full">
      <div
        className="max-w-[350px] w-full flex items-center justify-between p-[12px] rounded-[16px] border-[0.5px] border-solid"
        style={{
          borderImageSource:
            'linear-gradient(135.66deg, rgba(255, 255, 255, 0.18) -23.01%, rgba(16, 26, 45, 0.6) 40.85%, rgba(255, 255, 255, 0.18) 104.72%)',
          boxShadow: '1px 8px 10px 0px #0000001F',
          background: 'linear-gradient(169.98deg, #353F54 27.98%, #222834 81.2%)',
        }}
      >
        <div className="flex flex-col items-center">
          <div className="font-[SF_Pro_Text] font-normal text-[11px] leading-[14px] tracking-[2%] text-white/60">Annual fee</div>
          <div>{formatCurrency(annualFee)}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-[SF_Pro_Text] font-normal text-[11px] leading-[14px] tracking-[2%] text-white/60">Joining fee</div>
          <div>{formatCurrency(joiningFee)}</div>
        </div>
        <div className="flex flex-col items-center">
          <div className="font-[SF_Pro_Text] font-normal text-[11px] leading-[14px] tracking-[2%] text-white/60">Reward points</div>
          <div>{rewardPoints || 'N/A'}</div>
        </div>
      </div>
    </div>
  </div>
);

Fees.propTypes = {
  annualFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  joiningFee: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rewardPoints: PropTypes.string,
};

export default Fees;

