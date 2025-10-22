import { Router } from 'express';

/* Routes */
import authRoutes from '@/routes/v1/auth';
import blogRoutes from '@/routes/v1/blog';
import userRoutes from '@/routes/v1/user';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is Live ',
    status: 'ok',
    version: '1.0.0',
    docs: 'https://docs.blog-api.codewithsadee.com',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

export default router;
