import { Router } from 'express';
import { validateMasterData } from '../../../shared/middleware/validateMasterData';
import employeeController from '../controllers/employee.controller';
import masterDataController from '../controllers/master-data.controller';
import dashboardController from '../controllers/dashboard.controller';
import documentController from '../controllers/document.controller';
import { uploadMultipleDocuments } from '../../../shared/middleware/upload.middleware';
import { checkPermission, checkDepartmentAccess, checkResourceOwnership } from '../../../shared/middleware/permission.middleware';
import { authenticate } from '../../../shared/middleware/auth.middleware';
import { RESOURCES, ACTIONS } from '../../../shared/constants/permissions';
import { cacheMiddleware } from '../../../shared/middleware/cache.middleware';

const router = Router();

// Apply authentication to all HR routes
router.use(authenticate);

// Dashboard Routes
router.get(
    '/dashboard/stats',
    checkPermission(RESOURCES.DASHBOARD, ACTIONS.READ),
    checkDepartmentAccess(),
    dashboardController.getDashboardStats
);
router.get(
    '/dashboard/distribution',
    checkPermission(RESOURCES.DASHBOARD, ACTIONS.READ),
    checkDepartmentAccess(),
    dashboardController.getEmployeeDistribution
);
router.get(
    '/dashboard/activities',
    checkPermission(RESOURCES.DASHBOARD, ACTIONS.READ),
    checkDepartmentAccess(),
    dashboardController.getRecentActivities
);
router.get(
    '/dashboard/employment-status',
    checkPermission(RESOURCES.DASHBOARD, ACTIONS.READ),
    checkDepartmentAccess(),
    dashboardController.getEmploymentStatus
);

import { uploadEmployeePhoto } from '../../../shared/middleware/upload.middleware';
import { validateEmployeeCreate, validateEmployeeUpdate } from '../../../shared/middleware/validateEmployee';

// Audit Log Routes
import auditController from '../controllers/audit.controller';
import { auditLogger } from '../../../shared/middleware/auditLog.middleware';

router.get('/audit-logs/stats', checkPermission(RESOURCES.AUDIT_LOGS, ACTIONS.READ), auditController.getAuditStats);
router.get('/audit-logs/users', checkPermission(RESOURCES.AUDIT_LOGS, ACTIONS.READ), auditController.getAuditUsers);
router.get('/audit-logs/entity/:entityType/:entityId', checkPermission(RESOURCES.AUDIT_LOGS, ACTIONS.READ), auditController.getEntityHistory);
router.get('/audit-logs/:id', checkPermission(RESOURCES.AUDIT_LOGS, ACTIONS.READ), auditController.getAuditLogDetail);
router.get('/audit-logs', checkPermission(RESOURCES.AUDIT_LOGS, ACTIONS.READ), auditController.getAuditLogs);

// Employee Routes
router.get(
    '/employees',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkDepartmentAccess(),
    (req, res, next) => employeeController.getAll(req, res, next)
);

router.get(
    '/employees/:id',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkResourceOwnership('employee'),
    (req, res, next) => employeeController.getOne(req, res, next)
);

router.get(
    '/employees/:id/base',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkResourceOwnership('employee'),
    (req, res, next) => employeeController.getBase(req, res, next)
);

router.get(
    '/employees/:id/personal',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkResourceOwnership('employee'),
    (req, res, next) => employeeController.getPersonal(req, res, next)
);

router.get(
    '/employees/:id/employment',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkResourceOwnership('employee'),
    (req, res, next) => employeeController.getEmployment(req, res, next)
);

router.get(
    '/employees/:id/family',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkResourceOwnership('employee'),
    (req, res, next) => employeeController.getFamily(req, res, next)
);

router.post(
    '/employees',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.CREATE),
    uploadEmployeePhoto.single('foto_karyawan'),
    validateEmployeeCreate,
    auditLogger('employees'),
    (req, res, next) => employeeController.create(req, res, next)
);

router.put(
    '/employees/:id',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.UPDATE),
    uploadEmployeePhoto.single('foto_karyawan'),
    validateEmployeeUpdate,
    auditLogger('employees'),
    (req, res, next) => employeeController.update(req, res, next)
);

router.delete(
    '/employees/:id',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.DELETE),
    auditLogger('employees'),
    (req, res, next) => employeeController.delete(req, res, next)
);

// Master Data Generic Routes
const dynamicAuditLogger = (req: any, res: any, next: any) => {
    return auditLogger(req.params.model)(req, res, next);
};

router.get(
    '/master/:model',
    checkPermission(RESOURCES.MASTER_DATA, ACTIONS.READ),
    cacheMiddleware(3600),
    (req, res, next) => masterDataController.getAll(req, res, next)
);

router.get(
    '/master/:model/:id',
    checkPermission(RESOURCES.MASTER_DATA, ACTIONS.READ),
    (req, res, next) => masterDataController.getOne(req, res, next)
);

router.post(
    '/master/:model',
    checkPermission(RESOURCES.MASTER_DATA, ACTIONS.CREATE),
    validateMasterData,
    dynamicAuditLogger,
    (req, res, next) => masterDataController.create(req, res, next)
);

router.put(
    '/master/:model/:id',
    checkPermission(RESOURCES.MASTER_DATA, ACTIONS.UPDATE),
    validateMasterData,
    dynamicAuditLogger,
    (req, res, next) => masterDataController.update(req, res, next)
);

router.delete(
    '/master/:model/:id',
    checkPermission(RESOURCES.MASTER_DATA, ACTIONS.DELETE),
    dynamicAuditLogger,
    (req, res, next) => masterDataController.delete(req, res, next)
);

// QR Code Routes
import qrcodeController from '../controllers/qrcode.controller';
router.get(
    '/employees/:id/qrcode',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkResourceOwnership('employee'),
    (req, res, next) => employeeController.getQRCode(req, res, next)
);

router.get(
    '/employees/:id/qrcode/download',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ),
    checkResourceOwnership('employee'),
    (req, res, next) => employeeController.downloadQRCode(req, res, next)
);

router.get(
    '/qrcode/generate',
    checkPermission(RESOURCES.EMPLOYEES, ACTIONS.READ), // Assuming employee create/read context? or specific permission?
    (req, res, next) => qrcodeController.generateQRCode(req, res, next)
);

// Cascade & Dropdown Routes
// Public or Read-only for authenticated users generally needed for forms
// We use MASTER_DATA READ as base.
router.get('/departments/by-divisi/:divisiId', checkPermission(RESOURCES.MASTER_DATA, ACTIONS.READ), (req, res, next) => masterDataController.getDepartmentsByDivisi(req, res, next));
router.get('/posisi-jabatan/by-department/:departmentId', checkPermission(RESOURCES.MASTER_DATA, ACTIONS.READ), (req, res, next) => masterDataController.getPosisiByDepartment(req, res, next));
router.get('/validation/employees/managers', checkPermission(RESOURCES.MASTER_DATA, ACTIONS.READ), (req, res, next) => masterDataController.getManagers(req, res, next));
router.get('/validation/employees/active', checkPermission(RESOURCES.MASTER_DATA, ACTIONS.READ), (req, res, next) => masterDataController.getActiveEmployees(req, res, next));

// Import Routes
import importController from '../controllers/import.controller';
import { uploadExcelFile } from '../../../shared/middleware/upload.middleware';

router.post(
    '/import/preview',
    checkPermission(RESOURCES.IMPORT, ACTIONS.IMPORT),
    uploadExcelFile.single('file'),
    (req, res, next) => importController.uploadAndPreview(req, res, next)
);

router.post(
    '/import/employees',
    checkPermission(RESOURCES.IMPORT, ACTIONS.IMPORT),
    auditLogger('employees_bulk_import'),
    (req, res, next) => importController.importEmployees(req, res, next)
);

router.post(
    '/import/master-data/:type',
    checkPermission(RESOURCES.IMPORT, ACTIONS.IMPORT),
    (req, res, next) => auditLogger(`import_${req.params.type}`)(req, res, next),
    (req, res, next) => importController.importMasterData(req, res, next)
);

router.post(
    '/import/error-report',
    checkPermission(RESOURCES.IMPORT, ACTIONS.IMPORT),
    (req, res, next) => importController.downloadErrorReport(req, res, next)
);

// Export Routes
import exportController from '../controllers/export.controller';

router.get(
    '/employees/export/excel',
    checkPermission(RESOURCES.EXPORT, ACTIONS.EXPORT),
    (req, res, next) => exportController.exportToExcel(req, res, next)
);

router.get(
    '/employees/:id/export/pdf',
    checkPermission(RESOURCES.EXPORT, ACTIONS.EXPORT),
    checkResourceOwnership('employee'),
    (req, res, next) => exportController.exportEmployeeToPDF(req, res, next)
);


// Document Management
router.post(
    '/employees/:id/documents',
    checkPermission(RESOURCES.DOCUMENTS, ACTIONS.CREATE),
    checkResourceOwnership('employee'), // Maybe user can upload own docs? or only HR? Let's say HR or Self.
    uploadMultipleDocuments,
    auditLogger('employee_documents'),
    documentController.uploadDocuments
);
router.get(
    '/employees/:id/documents',
    checkPermission(RESOURCES.DOCUMENTS, ACTIONS.READ),
    checkResourceOwnership('employee'),
    documentController.getEmployeeDocuments
);
router.delete(
    '/employees/:id/documents/:docId',
    checkPermission(RESOURCES.DOCUMENTS, ACTIONS.DELETE),
    auditLogger('employee_documents'),
    documentController.deleteDocument
);
router.get(
    '/employees/:id/documents/:docId/download',
    checkPermission(RESOURCES.DOCUMENTS, ACTIONS.READ),
    checkResourceOwnership('employee'),
    documentController.downloadDocument
);
router.get(
    '/employees/:id/documents/:docId/preview',
    checkPermission(RESOURCES.DOCUMENTS, ACTIONS.READ),
    checkResourceOwnership('employee'),
    documentController.getDocumentPreview
);

export default router;
