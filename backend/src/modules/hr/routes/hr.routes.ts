import { Router } from 'express';
import { validateMasterData } from '../../../shared/middleware/validateMasterData';
import employeeController from '../controllers/employee.controller';
import masterDataController from '../controllers/master-data.controller';
import dashboardController from '../controllers/dashboard.controller';
import documentController from '../controllers/document.controller';
import { uploadMultipleDocuments } from '../../../shared/middleware/upload.middleware';

const router = Router();

// Dashboard Routes
router.get('/dashboard/stats', dashboardController.getDashboardStats);
router.get('/dashboard/distribution', dashboardController.getEmployeeDistribution);
router.get('/dashboard/activities', dashboardController.getRecentActivities);
router.get('/dashboard/employment-status', dashboardController.getEmploymentStatus);

import { uploadEmployeePhoto } from '../../../shared/middleware/upload.middleware';
import { validateEmployeeCreate, validateEmployeeUpdate } from '../../../shared/middleware/validateEmployee';

// Employee Routes
// Audit Log Routes
import auditController from '../controllers/audit.controller';
import { auditLogger } from '../../../shared/middleware/auditLog.middleware';

router.get('/audit-logs/stats', auditController.getAuditStats);
router.get('/audit-logs/users', auditController.getAuditUsers);
router.get('/audit-logs/entity/:entityType/:entityId', auditController.getEntityHistory);
router.get('/audit-logs/:id', auditController.getAuditLogDetail);
router.get('/audit-logs', auditController.getAuditLogs);

// Employee Routes
router.get('/employees', (req, res, next) => employeeController.getAll(req, res, next));
router.get('/employees/:id', (req, res, next) => employeeController.getOne(req, res, next));
router.post('/employees', uploadEmployeePhoto.single('foto_karyawan'), validateEmployeeCreate, auditLogger('employees'), (req, res, next) => employeeController.create(req, res, next));
router.put('/employees/:id', uploadEmployeePhoto.single('foto_karyawan'), validateEmployeeUpdate, auditLogger('employees'), (req, res, next) => employeeController.update(req, res, next));
router.delete('/employees/:id', auditLogger('employees'), (req, res, next) => employeeController.delete(req, res, next));

// Master Data Generic Routes
// We need to pass dynamic entity type to auditLogger.
// Since auditLogger returns a middleware, and it expects a string, we can't pass req.params.model directly here at definition time.
// We need a wrapper function or modify auditLogger to handle dynamic param extraction.
// Plan said: "auditLogger(req.params.model)". This implies runtime evaluation.
// So we wrap it:
const dynamicAuditLogger = (req: any, res: any, next: any) => {
    return auditLogger(req.params.model)(req, res, next);
};

router.get('/master/:model', (req, res, next) => masterDataController.getAll(req, res, next));
router.get('/master/:model/:id', (req, res, next) => masterDataController.getOne(req, res, next));
router.post('/master/:model', validateMasterData, dynamicAuditLogger, (req, res, next) => masterDataController.create(req, res, next));
router.put('/master/:model/:id', validateMasterData, dynamicAuditLogger, (req, res, next) => masterDataController.update(req, res, next));
router.delete('/master/:model/:id', dynamicAuditLogger, (req, res, next) => masterDataController.delete(req, res, next));

// QR Code Routes
// ... (rest of the file) ...
import qrcodeController from '../controllers/qrcode.controller';
router.get('/employees/:id/qrcode', (req, res, next) => employeeController.getQRCode(req, res, next));
router.get('/employees/:id/qrcode/download', (req, res, next) => employeeController.downloadQRCode(req, res, next));
router.get('/qrcode/generate', (req, res, next) => qrcodeController.generateQRCode(req, res, next));

// Cascade & Dropdown Routes
router.get('/departments/by-divisi/:divisiId', (req, res, next) => masterDataController.getDepartmentsByDivisi(req, res, next));
router.get('/posisi-jabatan/by-department/:departmentId', (req, res, next) => masterDataController.getPosisiByDepartment(req, res, next));
router.get('/validation/employees/managers', (req, res, next) => masterDataController.getManagers(req, res, next));
router.get('/validation/employees/active', (req, res, next) => masterDataController.getActiveEmployees(req, res, next));

// Import Routes
import importController from '../controllers/import.controller';
import { uploadExcelFile } from '../../../shared/middleware/upload.middleware';

router.post('/import/preview', uploadExcelFile.single('file'), (req, res, next) => importController.uploadAndPreview(req, res, next));
router.post('/import/employees', auditLogger('employees_bulk_import'), (req, res, next) => importController.importEmployees(req, res, next));
router.post('/import/master-data/:type', (req, res, next) => auditLogger(`import_${req.params.type}`)(req, res, next), (req, res, next) => importController.importMasterData(req, res, next));
router.post('/import/error-report', (req, res, next) => importController.downloadErrorReport(req, res, next));

// Export Routes
import exportController from '../controllers/export.controller';

router.get('/employees/export/excel', (req, res, next) => exportController.exportToExcel(req, res, next));
router.get('/employees/:id/export/pdf', (req, res, next) => exportController.exportEmployeeToPDF(req, res, next));



// Document Management
router.post(
    '/employees/:id/documents',
    uploadMultipleDocuments,
    auditLogger('employee_documents'),
    documentController.uploadDocuments
);
router.get('/employees/:id/documents', documentController.getEmployeeDocuments);
router.delete('/employees/:id/documents/:docId', auditLogger('employee_documents'), documentController.deleteDocument);
router.get('/employees/:id/documents/:docId/download', documentController.downloadDocument);
router.get('/employees/:id/documents/:docId/preview', documentController.getDocumentPreview);

export default router;
