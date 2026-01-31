
import React, { useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import { QrCodeIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';


interface EmployeeQRCodeProps {
    nik: string;
    employeeName: string;
    showDownload?: boolean;
    showPrint?: boolean;
}

export const EmployeeQRCode: React.FC<EmployeeQRCodeProps> = ({
    nik,
    employeeName,
    showDownload = true,
    showPrint = true
}) => {
    const qrRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        setIsLoading(true);
        try {
            // Because react-qr-code renders an SVG, we need to convert it to canvas/image for download
            const svg = qrRef.current?.querySelector('svg');
            if (svg) {
                const svgData = new XMLSerializer().serializeToString(svg);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();

                // Add some padding/margin to SVG data if needed or handle in canvas size
                // Simple version:
                img.onload = () => {
                    canvas.width = img.width + 40; // Add padding
                    canvas.height = img.height + 60; // Add padding + text space

                    if (ctx) {
                        // Draw white background
                        ctx.fillStyle = 'white';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        // Draw Image centered
                        ctx.drawImage(img, 20, 20);

                        // Draw Text
                        ctx.font = '14px Arial';
                        ctx.fillStyle = 'black';
                        ctx.textAlign = 'center';
                        ctx.fillText(employeeName, canvas.width / 2, canvas.height - 25);
                        ctx.fillText(nik, canvas.width / 2, canvas.height - 10);

                        // Download
                        const pngFile = canvas.toDataURL('image/png');
                        const downloadLink = document.createElement('a');
                        downloadLink.download = `qr-${nik}.png`;
                        downloadLink.href = pngFile;
                        downloadLink.click();
                    }
                    setIsLoading(false);
                };
                img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
            } else {
                // Fallback to backend download if SVG manipulation fails or preferred
                // window.location.href = `${API_URL}/employees/${id}/qrcode/download`;
                // But component props doesn't have ID. Let's stick to client side as props requested.
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error downloading QR Code:', error);
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm border border-gray-100 print:shadow-none print:border-none print:p-0">
            <div className="flex items-center gap-2 mb-4 text-gray-700 print:hidden">
                <QrCodeIcon className="w-5 h-5" />
                <h3 className="font-semibold text-sm">QR Code Karyawan</h3>
            </div>

            <div
                ref={qrRef}
                className="bg-white p-4 rounded-lg border border-gray-200 mb-4 print:border-none print:p-0 print:mb-0"
            >
                <QRCode
                    value={nik}
                    size={200}
                    level="M"
                    className="w-full h-auto print:w-[300px]" // Responsive size
                />
            </div>

            <div className="text-center mb-6 print:block">
                <p className="font-bold text-gray-900 text-sm">{employeeName}</p>
                <p className="text-gray-500 text-xs font-mono mt-1">{nik}</p>
            </div>

            <div className="flex gap-3 w-full print:hidden">
                {showDownload && (
                    <button
                        onClick={handleDownload}
                        disabled={isLoading}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-primary-700 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
                    >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        {isLoading ? 'Processing...' : 'Download'}
                    </button>
                )}

                {showPrint && (
                    <button
                        onClick={handlePrint}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                        <PrinterIcon className="w-4 h-4" />
                        Print
                    </button>
                )}
            </div>
        </div>
    );
};
