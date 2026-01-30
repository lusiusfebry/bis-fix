import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                {label && <label htmlFor={props.id} className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>}
                <input
                    ref={ref}
                    className={twMerge(
                        clsx(
                            'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100',
                            error && 'border-red-500 focus:ring-red-500',
                            className
                        )
                    )}
                    {...props}
                />
                {error && <span className="text-sm text-red-500">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
