import { Router } from 'express';

import { body } from 'express-validator';
import multer from 'multer';

import createBlog from '@/controllers/blog/create-blog';

import authenticate from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import uploadBlogBanner from '@/middlewares/upload-blog-banner';
import validationError from '@/middlewares/validation-error';

const router = Router();
const upload = multer();

router.post(
  '/',
  authenticate,
  authorize(['admin']),
  upload.single('banner_image'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 180 })
    .withMessage('Title must be less than 180 character'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('status')
    .optional()
    .isIn(['draft', 'published'])
    .withMessage('Status must be either draft or published'),
  validationError,
  uploadBlogBanner('post'),
  createBlog,
);

export default router;
