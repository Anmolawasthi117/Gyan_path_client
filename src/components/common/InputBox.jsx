import PropTypes from 'prop-types';

const InputBox = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  className = '',
  onKeyDown,
  autoComplete = 'on',
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          w-full p-2 border focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'} 
          ${className}
        `}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

InputBox.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  onKeyDown: PropTypes.func,
  autoComplete: PropTypes.string,
};

export default InputBox;
