import { Router } from 'express';
import employeeController from '../controllers/employee.controller';
import masterDataController from '../controllers/master-data.controller';
import { authenticate } from '../../../shared/middleware/auth.middleware';

const router = Router();

// Employee Routes
router.get('/employees', (req, res, next) => employeeController.getAll(req, res, next));
router.get('/employees/:id', (req, res, next) => employeeController.getOne(req, res, next));
router.post('/employees', (req, res, next) => employeeController.create(req, res, next));
router.put('/employees/:id', (req, res, next) => employeeController.update(req, res, next));
router.delete('/employees/:id', (req, res, next) => employeeController.delete(req, res, next));

// Master Data Generic Routes
router.get('/master/:model', (req, res, next) => masterDataController.getAll(req, res, next));
router.get('/master/:model/:id', (req, res, next) => masterDataController.getOne(req, res, next));
router.post('/master/:model', (req, res, next) => masterDataController.create(req, res, next));
router.put('/master/:model/:id', (req, res, next) => masterDataController.update(req, res, next));
router.delete('/master/:model/:id', (req, res, next) => masterDataController.delete(req, res, next));

export default router;
