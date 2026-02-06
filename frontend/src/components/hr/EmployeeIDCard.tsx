import React from 'react';
import QRCode from 'react-qr-code';
import { Employee } from '../../types/hr';

interface EmployeeIDCardProps {
    employee: Employee;
}

export const EmployeeIDCard: React.FC<EmployeeIDCardProps> = ({ employee }) => {
    return (
        <div className="w-[85.6mm] h-[53.98mm] bg-white relative overflow-hidden shadow-xl print:shadow-none font-sans select-none border border-gray-200">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-slate-50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-900 rounded-bl-[100px] opacity-90 z-0"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500 rounded-tr-[80px] opacity-90 z-0"></div>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-900 via-blue-600 to-orange-500"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 p-4 h-full flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-black text-blue-900 tracking-tighter leading-none">PT BMI</h1>
                        <p className="text-[7px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-0.5">Berkat Manna Indonesia</p>
                    </div>
                    <div className="text-right">
                        <div className="px-2 py-0.5 bg-blue-900 text-white text-[8px] font-bold tracking-wider rounded-sm shadow-sm">
                            MINE PERMIT
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex gap-4 items-center mt-2 flex-1">
                    {/* Photo */}
                    <div className="relative shrink-0">
                        <div className="w-20 h-24 bg-slate-200 rounded-lg overflow-hidden border-2 border-white shadow-md">
                            {employee.foto_karyawan ? (
                                <img
                                    src={`http://localhost:3000${employee.foto_karyawan}`}
                                    alt={employee.nama_lengkap}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        {/* Status Dot */}
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 border-2 border-white rounded-full ${employee.status_karyawan?.nama === 'Aktif' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-bold text-slate-800 leading-tight uppercase truncate">
                            {employee.nama_lengkap || 'EMPLOYEE NAME'}
                        </h2>
                        <p className="text-[9px] text-blue-600 font-bold mb-1 truncate">
                            {employee.posisi_jabatan?.nama || 'POSITION'}
                        </p>

                        <div className="space-y-0.5 mt-2">
                            <div className="flex items-center gap-1">
                                <span className="text-[8px] text-slate-400 font-semibold w-8">NIK</span>
                                <span className="text-[9px] text-slate-700 font-mono font-bold">: {employee.nomor_induk_karyawan}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[8px] text-slate-400 font-semibold w-8">DIV</span>
                                <span className="text-[8px] text-slate-700 font-bold truncate">: {employee.divisi?.nama || '-'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[8px] text-slate-400 font-semibold w-8">DEPT</span>
                                <span className="text-[8px] text-slate-700 font-bold truncate">: {employee.department?.nama || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-1">
                        <div className="p-1 bg-white rounded border border-slate-100 shadow-sm">
                            <QRCode
                                value={`Employee:${employee.nomor_induk_karyawan}`}
                                size={48}
                                level="M"
                            />
                        </div>
                        <span className="text-[6px] text-slate-400 font-mono tracking-wider">{employee.nomor_induk_karyawan}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-2 pt-2 border-t border-slate-200 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[6px] text-slate-400 uppercase">Blood / Join Date</span>
                        <span className="text-[8px] text-slate-700 font-bold">
                            {employee.personal_info?.golongan_darah || '-'} / {employee.hr_info?.tanggal_masuk || '-'}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="w-20 h-0.5 bg-slate-300 mb-1 mx-auto"></div>
                        <p className="text-[6px] text-slate-400 font-bold uppercase tracking-wider text-center">Authorized Signature</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
