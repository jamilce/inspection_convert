import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  registration?: Partial<UseFormRegisterReturn>;
}

export const CheckboxField = forwardRef<HTMLInputElement, CheckboxFieldProps>(
  ({ label, error, registration, className, ...props }, ref) => {
    return (
      <div className="form-group">
        <input
          ref={ref}
          type="checkbox"
          id={props.id || props.name}
          className={className}
          {...registration}
          {...props}
        />
        <label htmlFor={props.id || props.name}>
          {label}
        </label>
        {error && <span className="error-message">{error}</span>}
      </div>
    );
  }
);

CheckboxField.displayName = 'CheckboxField';
