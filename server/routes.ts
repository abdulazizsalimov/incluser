import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./localAuth";
import { loginSchema, changePasswordSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertArticleSchema, insertCategorySchema, insertPageSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/images';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded images
  app.use('/uploads', express.static('uploads'));

  // Image upload endpoint
  app.post('/api/admin/upload-image', isAdmin, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const imageUrl = `/uploads/images/${req.file.filename}`;
      res.json({ 
        message: 'Image uploaded successfully',
        imageUrl: imageUrl,
        filename: req.file.filename 
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ message: 'Failed to upload image' });
    }
  });

  // Open Graph meta tags for articles - must be before frontend routes
  app.get('/articles/:slug', async (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    const isBot = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent);
    
    if (!isBot) {
      return next(); // Let frontend handle regular users
    }

    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return next(); // Article not found, let frontend handle 404
      }

      const escapeHtml = (text: string) => {
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;');
      };

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const articleUrl = `${baseUrl}/articles/${article.slug}`;
      const imageUrl = article.featuredImage 
        ? (article.featuredImage.startsWith('http') ? article.featuredImage : `${baseUrl}${article.featuredImage}`)
        : `${baseUrl}/favicon.png`;

      const title = escapeHtml(article.title);
      const description = escapeHtml(article.excerpt || article.title);
      const authorName = escapeHtml(`${article.author?.firstName || ''} ${article.author?.lastName || ''}`.trim());
      const categoryName = article.category ? escapeHtml(article.category.name) : '';

      const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} | Incluser</title>
    <meta name="description" content="${description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}?v=${Date.now()}" />
    <meta property="og:url" content="${articleUrl}" />
    <meta property="og:site_name" content="Incluser" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:updated_time" content="${new Date().toISOString()}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${imageUrl}" />
    
    <!-- Article specific -->
    ${authorName ? `<meta property="article:author" content="${authorName}" />` : ''}
    ${article.publishedAt ? `<meta property="article:published_time" content="${new Date(article.publishedAt).toISOString()}" />` : ''}
    ${categoryName ? `<meta property="article:section" content="${categoryName}" />` : ''}
    
    <link rel="canonical" href="${articleUrl}" />
    <meta http-equiv="refresh" content="0; url=${articleUrl}" />
  </head>
  <body>
    <h1>${title}</h1>
    <p>${description}</p>
    <a href="${articleUrl}">Читать статью полностью</a>
    <script>window.location.href = "${articleUrl}";</script>
  </body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(html);
    } catch (error) {
      console.error("Error generating meta tags for article:", error);
      next(); // Let frontend handle on error
    }
  });

  // RSS feed - must be before other routes to avoid frontend routing conflicts
  app.get('/rss.xml', async (req, res) => {
    try {
      const articles = await storage.getArticles({
        published: true,
        limit: 20,
        offset: 0,
      });

      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const buildDate = new Date().toUTCString();
      
      const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Incluser - Блог о цифровой доступности</title>
    <link>${baseUrl}</link>
    <description>Блог о цифровой доступности и инклюзивном дизайне. Делаем интернет доступнее для всех.</description>
    <language>ru</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>Incluser Blog</generator>
    <webMaster>contact@incluser.uz (Incluser Team)</webMaster>
    <managingEditor>contact@incluser.uz (Incluser Team)</managingEditor>
    <copyright>© ${new Date().getFullYear()} Incluser. Все права защищены.</copyright>
    <category>Технологии/Доступность</category>
    <ttl>1440</ttl>
    
${articles.map(article => {
  const articleUrl = `${baseUrl}/articles/${article.slug}`;
  const pubDate = (article.createdAt || new Date()).toUTCString();
  const description = article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
  
  return `    <item>
      <title><![CDATA[${article.title}]]></title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description><![CDATA[${description}]]></description>
      <pubDate>${pubDate}</pubDate>
      <author>contact@incluser.uz (${article.author.email})</author>
      <category><![CDATA[${article.category?.name || 'Общее'}]]></category>
    </item>`;
}).join('\n')}
  </channel>
</rss>`;

      res.set({
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      });
      
      res.send(rssXml);
    } catch (error) {
      console.error("Error generating RSS feed:", error);
      res.status(500).send('Error generating RSS feed');
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Change password route
  app.post('/api/auth/change-password', isAuthenticated, async (req: any, res) => {
    try {
      const result = changePasswordSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.issues });
      }

      const { currentPassword, newPassword } = result.data;
      const user = req.user;

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await storage.updateUserPassword(user.id, hashedPassword);

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Public article routes
  app.get('/api/articles', async (req, res) => {
    try {
      const { page = '1', limit = '10', search, categoryId, published = 'true' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const articles = await storage.getArticles({
        published: published === 'true',
        limit: parseInt(limit as string),
        offset,
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      });

      const totalCount = await storage.getArticlesCount({
        published: published === 'true',
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      });

      res.json({
        articles,
        totalCount,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(totalCount / parseInt(limit as string)),
      });
    } catch (error) {
      console.error("Error fetching articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get('/api/articles/:slug', async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article || !article.isPublished) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  // Public category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Public page routes
  app.get('/api/pages/:slug', async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.slug);
      if (!page || !page.isPublished) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Admin article management
  app.get('/api/admin/articles', isAdmin, async (req, res) => {
    try {
      const { page = '1', limit = '20', search, categoryId } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const articles = await storage.getArticles({
        limit: parseInt(limit as string),
        offset,
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      });

      const totalCount = await storage.getArticlesCount({
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      });

      res.json({
        articles,
        totalCount,
        currentPage: parseInt(page as string),
        totalPages: Math.ceil(totalCount / parseInt(limit as string)),
      });
    } catch (error) {
      console.error("Error fetching admin articles:", error);
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get('/api/admin/articles/:id', isAdmin, async (req, res) => {
    try {
      const article = await storage.getArticleById(parseInt(req.params.id));
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post('/api/admin/articles', isAdmin, async (req: any, res) => {
    try {
      const validatedData = insertArticleSchema.parse({
        ...req.body,
        authorId: req.user.id,
      });
      
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put('/api/admin/articles/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertArticleSchema.partial().parse(req.body);
      
      const article = await storage.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Failed to update article" });
    }
  });

  app.delete('/api/admin/articles/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteArticle(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Admin category management
  app.get('/api/admin/categories', isAdmin, async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/admin/categories', isAdmin, async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put('/api/admin/categories/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCategorySchema.partial().parse(req.body);
      
      const category = await storage.updateCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete('/api/admin/categories/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteCategory(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Admin page management
  app.get('/api/admin/pages', isAdmin, async (req, res) => {
    try {
      const pages = await storage.getPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.get('/api/admin/pages/:id', isAdmin, async (req, res) => {
    try {
      const page = await storage.getPageBySlug(req.params.id);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  app.post('/api/admin/pages', isAdmin, async (req, res) => {
    try {
      const validatedData = insertPageSchema.parse(req.body);
      const page = await storage.createPage(validatedData);
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.put('/api/admin/pages/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPageSchema.partial().parse(req.body);
      
      const page = await storage.updatePage(id, validatedData);
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete('/api/admin/pages/:id', isAdmin, async (req, res) => {
    try {
      await storage.deletePage(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
