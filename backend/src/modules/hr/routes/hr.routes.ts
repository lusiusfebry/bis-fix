import { Router } from 'express';
import employeeController from '../controllers/employee.controller';

const router = Router();

// Employee Routes
router.get('/employees', (req, res, next) => employeeController.getAll(req, res, next));
router.get('/employees/:id', (req, res, next) => employeeController.getOne(req, res, next));
router.post('/employees', (req, res, next) => employeeController.create(req, res, next));
router.put('/employees/:id', (req, res, next) => employeeController.update(req, res, next));
router.delete('/employees/:id', (req, res, next) => employeeController.delete(req, res, next));

export default router;
