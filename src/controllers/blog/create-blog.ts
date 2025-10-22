import { Request, Response } from 'express';

import { logger } from '@/lib/winston';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

import Blog, { type IBlog } from '@/models/blog';

const window = new JSDOM('').window;

const purify = DOMPurify(window);

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const createBlog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const { banner, content, status, title } = req.body as BlogData;
    const cleanContent = purify.sanitize(content);

    const newBlog = await Blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId,
    });

    logger.info('New blog created', {
      newBlog,
    });
    res.status(201).json({
      newBlog,
    });
  } catch (error) {
    res.status(500).json({
      code: 'ServerError',
      message: 'Internal server error',
      error,
    });
    logger.error('Error creating new blog', error);
  }
};

export default createBlog;
