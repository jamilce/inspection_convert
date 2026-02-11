import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: string;
  registration?: Partial<UseFormRegisterReturn>;
  required?: boolean;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
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
            <textarea
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

TextAreaField.displayName = 'TextAreaField';
