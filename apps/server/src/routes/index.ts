import { Router } from 'express';
import employeeRoutes from '../modules/ai-employee/ai-employee.routes';
import authRoutes from '../modules/auth/auth.routes';
import chatsRoutes from '../modules/chat/chat.routes';
import jobRoutes from '../modules/job/job.routes';
import knowledgesRoutes from '../modules/knowledge/knowledge.routes';
import toolSettingsRoutes from '../modules/oAuth2/oAuth2.routes';
import uploadsRoutes from '../modules/uploads/uploads.routes';
import userRoutes from '../modules/user/user.routes';
import workspaceRoutes from '../modules/workspace/workspace.routes';

const router = Router();

router.use('/employees', employeeRoutes);
router.use('/chats', chatsRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/knowledges', knowledgesRoutes);
router.use('/workspaces', workspaceRoutes);
router.use('/tools-settings', toolSettingsRoutes);
router.use('/jobs', jobRoutes);

export default router;
