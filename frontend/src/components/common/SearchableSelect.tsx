import React from 'react';

interface Option {
    value: string | number;
    label: string;
}

interface SearchableSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
    label?: string;
    options: Option[];
    value?: string | number;
    onChange: (value: string | number) => void;
    error?: string;
    placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    options,
    value,
    onChange,
    error,
    placeholder = 'Pilih...',
    className = '',
    ...props
}) => {
    // Using native select for simplicity as per plan, enhanced with basic styling.
    // For "Searchable", native select on desktop often supports typing to jump.
    // For true filterable behavior, we'd need a custom implementation or library like react-select / headless UI combo.
    // Given requirements say "Native select with datalist or library", let's use a nice styled native select first.
    // If we want true "Search" (filtering), standard select doesn't do it visibly, but typing works.

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label} {props.required && <span className="text-red-500">*</span>}
                </label>
            )}
            <select
                value={value ?? ''}
                onChange={(e) => onChange(e.target.value)}
                className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${error ? 'border-red-500' : ''} ${className}`}
                {...props}
            >
                <option value="" disabled>{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};
