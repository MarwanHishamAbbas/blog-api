import { Router } from 'express';

/* Controllers */
import register from '@/controllers/register';

/* Middlewares */
/* Models */

const router = Router();

router.post('/register', register);

export default router;
