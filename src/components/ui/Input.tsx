"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-1)] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3
            bg-[var(--input-bg)] text-[var(--text-1)]
            border border-[var(--input-border)] rounded-[var(--radius-md)]
            placeholder:text-[var(--placeholder)]
            transition-all duration-150 ease-out
            focus:outline-none focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-red-100" : ""}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[var(--error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1.5 text-sm text-[var(--text-3)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
