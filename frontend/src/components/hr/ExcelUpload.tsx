
import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx'; // Check if clsx installed, package.json says yes

interface ExcelUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number; // bytes
    templateUrl?: string;
}

export const ExcelUpload: React.FC<ExcelUploadProps> = ({
    onFileSelect,
    // accept = '.xlsx, .xls', // Unused as we hardcode specific mimes below
    maxSize = 10 * 1024 * 1024, // 10MB
    templateUrl
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setError(null);
        if (fileRejections.length > 0) {
            const currentRejection = fileRejections[0];
            if (currentRejection.errors[0].code === 'file-too-large') {
                setError(`Ukuran file terlalu besar. Maksimal ${(maxSize / 1024 / 1024).toFixed(0)}MB.`);
            } else if (currentRejection.errors[0].code === 'file-invalid-type') {
                setError('Tipe file tidak valid. Harap unggah file Excel (.xlsx).');
            } else {
                setError(currentRejection.errors[0].message);
            }
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [maxSize, onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        maxSize,
        multiple: false
    });

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedFile(null);
        setError(null);
    };

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={clsx(
                    "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out",
                    isDragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-400 hover:bg-gray-50",
                    error && "border-red-300 bg-red-50 hover:bg-red-50"
                )}
            >
                <input {...getInputProps()} />

                {selectedFile ? (
                    <div className="flex flex-col items-center">
                        <DocumentIcon className="h-12 w-12 text-primary-600 mb-3" />
                        <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        <button
                            onClick={removeFile}
                            className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Ganti File
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <CloudArrowUpIcon className={clsx("h-12 w-12 mb-3", error ? "text-red-400" : "text-gray-400")} />
                        <p className="text-sm font-medium text-gray-900">
                            Drop file Excel di sini, atau klik untuk memilih
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Format yang didukung: XLSX, XLS (Maks 10MB)
                        </p>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-2 text-sm text-red-600 font-medium">
                    Error: {error}
                </p>
            )}

            {templateUrl && !selectedFile && (
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        Belum punya template?{' '}
                        <a href={templateUrl} className="font-medium text-primary-600 hover:text-primary-500">
                            Download Template Excel
                        </a>
                    </p>
                </div>
            )}
        </div>
    );
};
