import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: string;
  registration?: Partial<UseFormRegisterReturn>;
  required?: boolean;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, icon, registration, required, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label>
            <b>{label}</b>
            {required && <span className="text-danger"> *</span>}
          </label>
        )}
        <div className="input-group">
          {icon && (
            <span className="input-group-addon">
              <i className="material-icons">{icon}</i>
            </span>
          )}
          <div className={`form-line ${error ? 'error' : ''}`}>
            <select
              ref={ref}
              className={`form-control ${className || ''}`}
              {...registration}
              {...props}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

SelectField.displayName = 'SelectField';
