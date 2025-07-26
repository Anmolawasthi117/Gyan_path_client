import PropTypes from 'prop-types';

const RouteStep = ({ step, index, isActive, totalSteps }) => {
  return (
    <div className={`p-2 ${isActive ? 'bg-blue-100' : 'bg-white'} border-b`}>
      <p className="text-sm font-medium">{step.name}</p>
      <p className="text-xs text-gray-500">
        Step {index + 1} of {totalSteps}
      </p>
    </div>
  );
};

RouteStep.propTypes = {
  step: PropTypes.shape({
    name: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    floor: PropTypes.number,
  }).isRequired,
  index: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  totalSteps: PropTypes.number.isRequired,
};

export default RouteStep;