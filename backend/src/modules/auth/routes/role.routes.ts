import { Router } from 'express';
import roleController from '../controllers/role.controller';
import { authenticate } from '../../../shared/middleware/auth.middleware';
import { checkPermission } from '../../../shared/middleware/permission.middleware';
import { RESOURCES, ACTIONS } from '../../../shared/constants/permissions';

const router = Router();

// Get all roles
router.get(
    '/roles',
    authenticate,
    checkPermission(RESOURCES.ROLES, ACTIONS.READ),
    roleController.getAllRoles
);

// Get permissions list (for UI dropdowns)
router.get(
    '/permissions',
    authenticate,
    checkPermission(RESOURCES.ROLES, ACTIONS.READ),
    roleController.getPermissions
);

// Get role by ID
router.get(
    '/roles/:id',
    authenticate,
    checkPermission(RESOURCES.ROLES, ACTIONS.READ),
    roleController.getRoleById
);

// Create role
router.post(
    '/roles',
    authenticate,
    checkPermission(RESOURCES.ROLES, ACTIONS.CREATE),
    roleController.createRole
);

// Update role
router.put(
    '/roles/:id',
    authenticate,
    checkPermission(RESOURCES.ROLES, ACTIONS.UPDATE),
    roleController.updateRole
);

// Delete role
router.delete(
    '/roles/:id',
    authenticate,
    checkPermission(RESOURCES.ROLES, ACTIONS.DELETE),
    roleController.deleteRole
);

export default router;
