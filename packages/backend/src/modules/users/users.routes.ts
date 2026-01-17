import { Router } from 'express';
import { usersController } from './users.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', usersController.getProfile.bind(usersController));
router.put('/profile', usersController.updateProfile.bind(usersController));
router.get('/photos', usersController.getPhotos.bind(usersController));
router.delete('/account', usersController.deleteAccount.bind(usersController));

export default router;
