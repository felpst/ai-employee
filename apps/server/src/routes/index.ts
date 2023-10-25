import { Router } from 'express';
import employeeRoutes from '../modules/ai-employee/ai-employee.routes';
import authRoutes from '../modules/auth/auth.routes';
import chatsRoutes from '../modules/chat/chat.routes';
import knowledgesRoutes from '../modules/knowledge/knowledge.routes';
import messagesRoutes from '../modules/message/message.routes';
import userRoutes from '../modules/user/user.routes';
import workspaceRoutes from '../modules/workspace/workspace.routes';

const router = Router();

router.use('/employees', employeeRoutes);
router.use('/chats', chatsRoutes);
router.use('/messages', messagesRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/knowledges', knowledgesRoutes);
router.use('/workspaces', workspaceRoutes);

export default router;
