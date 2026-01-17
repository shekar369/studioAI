import { Router } from 'express';
import { adminController } from './admin.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { requireAdmin, requireSuperAdmin } from '../../middleware/rbac.middleware.js';

const router = Router();

// All routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Dashboard
router.get('/dashboard', adminController.getDashboard.bind(adminController));

// User management
router.get('/users', adminController.getUsers.bind(adminController));
router.get('/users/:id', adminController.getUserById.bind(adminController));
router.put('/users/:id', adminController.updateUser.bind(adminController));
router.delete('/users/:id', requireSuperAdmin, adminController.deleteUser.bind(adminController));

// API keys management
router.get('/api-keys', adminController.getAPIKeys.bind(adminController));
router.post('/api-keys', adminController.createAPIKey.bind(adminController));
router.put('/api-keys/:id', adminController.updateAPIKey.bind(adminController));
router.delete('/api-keys/:id', adminController.deleteAPIKey.bind(adminController));

// Audit logs
router.get('/audit-logs', adminController.getAuditLogs.bind(adminController));

export default router;
