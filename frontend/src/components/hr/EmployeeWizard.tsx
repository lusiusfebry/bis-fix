import React, { useState } from 'react';
import { Employee } from '../../types/hr';
import { EmployeeStep1Form } from './EmployeeStep1Form';
import { CheckIcon } from '@heroicons/react/24/solid';

interface EmployeeWizardProps {
    initialData?: Employee;
    onComplete: (data: FormData) => void;
    onCancel: () => void;
}

export const EmployeeWizard: React.FC<EmployeeWizardProps> = ({ initialData, onComplete, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // We store partial data for each step. 
    // Step 1 returns structured values + optional file.
    // For simplicity, we can store the Step 1 values in state.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<any>(initialData || {});

    const steps = [
        { id: 1, name: 'Data Personal' },
        { id: 2, name: 'Informasi HR' },
        { id: 3, name: 'Data Keluarga' }
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleStep1Next = (data: any) => {
        // Merge data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData((prev: any) => ({ ...prev, ...data }));
        // For Step 1 implementation per plan, we might stop here or simulate next.
        // The plan says "Implement Step 1". 
        // But the Wizard needs to handle navigation.
        // Let's assume we move to step 2.

        // HOWEVER, since we are only strictly implementing Step 1 in this session (as per "Employee Wizard Step 1 Implementation" title often implies, but the plan says "Create Wizard... Create Step 1...").
        // The plan actually mentions "Step 2: Informasi HR" in the Wizard description.
        // It doesn't explicitly say "Implement Step 2 Form".
        // It says "Create Employee Step 1 Form Component".
        // So Step 2 and 3 might be placeholders for now.

        setCurrentStep(2);
    };

    // Placeholder for final submission (temporary until step 2/3 built)
    // If user wants to save just Step 1? Usually wizard requires all steps.
    // But for this task, maybe we just verify step 1 works.

    // Check if we can submit from later steps.
    // Let's implement basic render logic.

    // Important: The plan "Update Employee Create Page" says "Handle wizard completion... Convert form data... Call service".
    // This implies the Wizard calls onComplete when ALL steps are done.

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Steps Indicator */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
                <nav aria-label="Progress">
                    <ol role="list" className="flex items-center">
                        {steps.map((step, stepIdx) => (
                            <li key={step.name} className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}>
                                <div className="flex items-center">
                                    <div
                                        className={`${step.id < currentStep
                                            ? 'bg-primary-600 hover:bg-primary-900 w-8 h-8 flex items-center justify-center rounded-full'
                                            : step.id === currentStep
                                                ? 'border-2 border-primary-600 w-8 h-8 flex items-center justify-center rounded-full bg-white'
                                                : 'border-2 border-gray-300 w-8 h-8 flex items-center justify-center rounded-full bg-white'
                                            }`}
                                    >
                                        {step.id < currentStep ? (
                                            <CheckIcon className="w-5 h-5 text-white" aria-hidden="true" />
                                        ) : (
                                            <span
                                                className={`${step.id === currentStep ? 'text-primary-600' : 'text-gray-500'
                                                    } text-sm font-medium`}
                                            >
                                                {step.id}
                                            </span>
                                        )}
                                    </div>
                                    <span className={`ml-4 text-sm font-medium ${step.id === currentStep ? 'text-primary-800' : 'text-gray-500'}`}>
                                        {step.name}
                                    </span>
                                </div>
                                {stepIdx !== steps.length - 1 && (
                                    <div className="absolute top-4 w-full h-0.5 bg-gray-200 left-0 -ml-px mt-0.5 hidden sm:block" style={{ left: '2rem', width: 'calc(100% - 2rem)' }} />
                                )}
                            </li>
                        ))}
                    </ol>
                </nav>
            </div>

            {/* Content */}
            <div className="p-6">
                {currentStep === 1 && (
                    <EmployeeStep1Form
                        initialData={initialData}
                        onNext={handleStep1Next}
                        onCancel={onCancel}
                    />
                )}
                {currentStep === 2 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Step 2 (Informasi HR) Coming Soon...</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button onClick={() => setCurrentStep(1)} className="px-4 py-2 border rounded">Back</button>
                            <button onClick={() => setCurrentStep(3)} className="px-4 py-2 bg-primary-600 text-white rounded">Next</button>
                        </div>
                    </div>
                )}
                {currentStep === 3 && (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Step 3 (Data Keluarga) Coming Soon...</p>
                        <div className="mt-4 flex justify-center space-x-4">
                            <button onClick={() => setCurrentStep(2)} className="px-4 py-2 border rounded">Back</button>
                            <button
                                onClick={() => {
                                    // Construct FormData
                                    const payload = new FormData();
                                    // Append all fields manually or flatten
                                    // Note: JSON stringify complicated nested objects if backend expects structured
                                    // But based on controller `req.body` usage, it expects flat fields logic or we need to align.
                                    // Let's assume flat fields for now based on Schema.
                                    Object.keys(formData).forEach(key => {
                                        if (key === 'foto_karyawan' && formData[key] instanceof File) {
                                            payload.append('foto_karyawan', formData[key]);
                                        } else if (formData[key] !== undefined && formData[key] !== null) {
                                            payload.append(key, String(formData[key]));
                                        }
                                    });
                                    onComplete(payload);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
