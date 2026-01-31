import { Router } from 'express';
import { validateMasterData } from '../../../shared/middleware/validateMasterData';
import employeeController from '../controllers/employee.controller';
import masterDataController from '../controllers/master-data.controller';
import { authenticate } from '../../../shared/middleware/auth.middleware';

import dashboardController from '../controllers/dashboard.controller';

const router = Router();

// Dashboard Routes
router.get('/dashboard/stats', dashboardController.getDashboardStats);
router.get('/dashboard/distribution', dashboardController.getEmployeeDistribution);
router.get('/dashboard/activities', dashboardController.getRecentActivities);
router.get('/dashboard/employment-status', dashboardController.getEmploymentStatus);

import { uploadEmployeePhoto } from '../../../shared/middleware/upload.middleware';
import { validateEmployeeCreate, validateEmployeeUpdate } from '../../../shared/middleware/validateEmployee';

// Employee Routes
router.get('/employees', (req, res, next) => employeeController.getAll(req, res, next));
router.get('/employees/:id', (req, res, next) => employeeController.getOne(req, res, next));
router.post('/employees', uploadEmployeePhoto.single('foto_karyawan'), validateEmployeeCreate, (req, res, next) => employeeController.create(req, res, next));
router.put('/employees/:id', uploadEmployeePhoto.single('foto_karyawan'), validateEmployeeUpdate, (req, res, next) => employeeController.update(req, res, next));
router.delete('/employees/:id', (req, res, next) => employeeController.delete(req, res, next));

// Master Data Generic Routes
router.get('/master/:model', (req, res, next) => masterDataController.getAll(req, res, next));
router.get('/master/:model/:id', (req, res, next) => masterDataController.getOne(req, res, next));
router.post('/master/:model', validateMasterData, (req, res, next) => masterDataController.create(req, res, next));
router.put('/master/:model/:id', validateMasterData, (req, res, next) => masterDataController.update(req, res, next));
router.delete('/master/:model/:id', (req, res, next) => masterDataController.delete(req, res, next));

// QR Code Routes
// QR Code Routes
import qrcodeController from '../controllers/qrcode.controller';
router.get('/employees/:id/qrcode', (req, res, next) => employeeController.getQRCode(req, res, next));
router.get('/employees/:id/qrcode/download', (req, res, next) => employeeController.downloadQRCode(req, res, next));
router.get('/qrcode/generate', (req, res, next) => qrcodeController.generateQRCode(req, res, next)); // Generic NIK generation

// Import Routes
import importController from '../controllers/import.controller';
import { uploadExcelFile } from '../../../shared/middleware/upload.middleware';

router.post('/import/preview', uploadExcelFile.single('file'), (req, res, next) => importController.uploadAndPreview(req, res, next));
router.post('/import/employees', (req, res, next) => importController.importEmployees(req, res, next));
router.post('/import/master-data/:type', (req, res, next) => importController.importMasterData(req, res, next));
router.post('/import/error-report', (req, res, next) => importController.downloadErrorReport(req, res, next));


export default router;
