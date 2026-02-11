import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
  registration?: Partial<UseFormRegisterReturn>;
  required?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon, registration, required, className, ...props }, ref) => {
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
            <input
              ref={ref}
              className={`form-control ${className || ''}`}
              {...registration}
              {...props}
            />
          </div>
        </div>
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
