import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import chatsRoutes from '../modules/chat/chat.routes';
import companyRoutes from '../modules/company/company.routes';
import dataSourcesRoutes from '../modules/data-sources/data-sources.routes';
import messagesRoutes from '../modules/message/message.routes';
import userRoutes from '../modules/user/user.routes';

const router = Router();

router.use('/companies', companyRoutes);
router.use('/chats', chatsRoutes);
router.use('/messages', messagesRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/data-sources', dataSourcesRoutes);

export default router;
