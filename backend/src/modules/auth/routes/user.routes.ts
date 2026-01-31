import { Router } from 'express';
import userController from '../controllers/user.controller';
import { authenticate } from '../../../shared/middleware/auth.middleware';
import { checkPermission } from '../../../shared/middleware/permission.middleware';
import { RESOURCES, ACTIONS } from '../../../shared/constants/permissions';

const router = Router();

// Get all users
router.get(
    '/users',
    authenticate,
    checkPermission(RESOURCES.USERS, ACTIONS.READ),
    userController.getAllUsers
);

// Update user role
router.put(
    '/users/:id/role',
    authenticate,
    checkPermission(RESOURCES.USERS, ACTIONS.UPDATE),
    userController.updateUserRole
);

// Update user status
router.put(
    '/users/:id/status',
    authenticate,
    checkPermission(RESOURCES.USERS, ACTIONS.UPDATE),
    userController.toggleUserStatus
);

export default router;
