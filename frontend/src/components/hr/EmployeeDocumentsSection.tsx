import React from 'react';
import { useEmployeeDocuments } from '../../hooks/useDocuments';
import { DocumentUpload } from './DocumentUpload';
import { DocumentList } from './DocumentList';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import { DocumentType, EmployeeDocument } from '../../types/hr';

interface EmployeeDocumentsSectionProps {
    employeeId: number;
}

const DOCUMENT_CATEGORIES: { id: string; label: string; types: DocumentType[] }[] = [
    {
        id: 'identitas',
        label: 'Identitas',
        types: ['foto_ktp', 'foto_npwp', 'foto_kartu_keluarga', 'foto_bpjs_kesehatan', 'foto_bpjs_ketenagakerjaan']
    },
    {
        id: 'kontrak',
        label: 'Kontrak & Kepegawaian',
        types: ['surat_kontrak']
    },
    {
        id: 'sertifikat',
        label: 'Sertifikat & Pendidikan',
        types: ['sertifikat']
    },
    {
        id: 'lainnya',
        label: 'Lainnya',
        types: ['dokumen_lainnya']
    }
];

export const EmployeeDocumentsSection: React.FC<EmployeeDocumentsSectionProps> = ({ employeeId }) => {
    const { data: documents, isLoading } = useEmployeeDocuments(employeeId);

    const getDocsByType = (type: string) => {
        return documents?.filter((d: EmployeeDocument) => d.document_type === type) || [];
    };

    const getDocsByCategory = (types: string[]) => {
        return documents?.filter((d: EmployeeDocument) => types.includes(d.document_type)) || [];
    };

    if (isLoading) return <div>Loading documents...</div>;

    return (
        <div className="w-full px-2 py-4 sm:px-0">
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mb-6 overflow-x-auto">
                    {DOCUMENT_CATEGORIES.map((category) => (
                        <Tab
                            key={category.id}
                            className={({ selected }: { selected: boolean }) =>
                                clsx(
                                    'w-full rounded-lg py-2.5 text-sm font-medium leading-5 whitespace-nowrap px-4',
                                    'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                    selected
                                        ? 'bg-white text-blue-700 shadow'
                                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-blue-800'
                                )
                            }
                        >
                            {category.label}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels>
                    {DOCUMENT_CATEGORIES.map((category, idx) => (
                        <Tab.Panel
                            key={idx}
                            className={clsx(
                                'rounded-xl bg-white p-3',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
                            )}
                        >
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {category.types.map(type => (
                                        <div key={type} className="bg-gray-50 p-4 rounded-lg border">
                                            <h3 className="font-semibold text-gray-700 mb-4 capitalize">
                                                {type.replace(/_/g, ' ')}
                                            </h3>
                                            <DocumentUpload
                                                employeeId={employeeId}
                                                documentType={type}
                                                label={`Upload ${type.replace(/_/g, ' ')}`}
                                            />
                                            <div className="mt-4">
                                                <DocumentList
                                                    documents={getDocsByType(type)}
                                                    employeeId={employeeId}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Semua Dokumen {category.label}</h3>
                                    <DocumentList
                                        documents={getDocsByCategory(category.types)}
                                        employeeId={employeeId}
                                    />
                                </div>
                            </div>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};
