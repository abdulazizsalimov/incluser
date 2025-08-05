import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./localAuth";
import { loginSchema, changePasswordSchema, updateUserRoleSchema } from "@shared/schema";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import fs from "fs";
import { insertArticleSchema, insertCategorySchema, insertPageSchema, insertContactMessageSchema, insertProgramSchema, insertProgramCategorySchema, insertArticleReactionSchema, insertArticleCommentSchema } from "@shared/schema";
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
    console.log('File upload attempt:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname
    });
    
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const allowedMimeTypes = /image\/(jpeg|jpg|png|gif|webp)/;
    
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.test(file.mimetype.toLowerCase());
    
    if (mimetype && extname) {
      console.log('File upload accepted');
      return cb(null, true);
    } else {
      console.log('File upload rejected:', { extname, mimetype, originalMimeType: file.mimetype });
      cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Body parser middleware
  app.use(express.json());

  // Middleware для нормализации URL (удаление trailing slash)
  app.use((req, res, next) => {
    if (req.path !== '/' && req.path.endsWith('/')) {
      const redirectUrl = req.path.slice(0, -1) + (req.url.includes('?') ? req.url.substring(req.path.length) : '');
      return res.redirect(301, redirectUrl);
    }
    next();
  });

  // Serve uploaded images
  app.use('/uploads', express.static('uploads'));
  
  // Serve attached assets (PDF files, etc.)
  // In development: serve from attached_assets folder
  // In production: serve from dist/public/assets folder (after build)
  if (app.get("env") === "development") {
    app.use('/attached_assets', express.static('attached_assets'));
    app.use('/assets', express.static('attached_assets'));
  } else {
    // In production, files are built into dist/public/assets
    const assetsPath = path.resolve(process.cwd(), 'dist', 'public', 'assets');
    app.use('/attached_assets', express.static(assetsPath));
    app.use('/assets', express.static(assetsPath));
  }

  // Bot meta tags for programs - for SEO optimization
  app.get('/programs/:categorySlug/:slug', async (req, res, next) => {
    const userAgent = req.get('User-Agent') || '';
    const isBot = /bot|crawler|spider|crawling|facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent);
    
    if (!isBot) {
      return next(); // Let frontend handle regular users
    }

    try {
      const program = await storage.getProgramBySlug(req.params.slug);
      if (!program || !program.isPublished) {
        return next(); // Program not found, let frontend handle 404
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
      const programUrl = `${baseUrl}/programs/${program.category?.slug}/${program.slug}`;
      const imageUrl = program.logo 
        ? (program.logo.startsWith('http') ? program.logo : `${baseUrl}${program.logo}`)
        : `${baseUrl}/favicon.png`;

      const title = escapeHtml(program.title);
      const description = escapeHtml(program.description || program.title);
      const categoryName = program.category ? escapeHtml(program.category.name) : '';
      const developer = program.developer ? escapeHtml(program.developer) : '';

      const html = `<!DOCTYPE html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title} - Программы | Incluser</title>
    <meta name="description" content="${description}" />
    <meta name="keywords" content="${title}, ${categoryName}, ${developer}, программа, доступность" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title} - Программы" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}?v=${Date.now()}" />
    <meta property="og:url" content="${programUrl}" />
    <meta property="og:site_name" content="Incluser" />
    <meta property="og:locale" content="ru_RU" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:title" content="${title} - Программы" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${imageUrl}" />
    
    <link rel="canonical" href="${programUrl}" />
    <meta http-equiv="refresh" content="0; url=${programUrl}" />
  </head>
  <body>
    <h1>${title}</h1>
    <p>${description}</p>
    <a href="${programUrl}">Смотреть программу полностью</a>
    <script>window.location.href = "${programUrl}";</script>
  </body>
</html>`;

      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.send(html);
    } catch (error) {
      console.error("Error generating meta tags for program:", error);
      next(); // Let frontend handle on error
    }
  });

  // Dynamic sitemap.xml generation
  app.get('/sitemap.xml', async (req, res) => {
    try {
      // Auto-detect domain from request headers
      const protocol = req.get('x-forwarded-proto') || (req.secure ? 'https' : 'http');
      const host = req.get('host');
      const baseUrl = `${protocol}://${host}`;
      
      // Get all published articles
      const articles = await storage.getArticles();
      const publishedArticles = articles.filter(article => article.isPublished);
      
      // Get all program categories and programs
      const programCategories = await storage.getProgramCategories();
      const allPrograms = await storage.getPrograms({ published: true });
      
      // Generate XML sitemap
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/articles</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/programs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy-policy</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Resource pages -->
  <url>
    <loc>${baseUrl}/wcag-guides</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/testing-tools</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/resources</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Articles -->
${publishedArticles.map(article => `  <url>
    <loc>${baseUrl}/articles/${article.slug}</loc>
    <lastmod>${new Date(article.updatedAt || article.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
  
  <!-- Programs -->
${allPrograms.map(program => {
  const categorySlug = program.category?.slug || 'uncategorized';
  return `  <url>
    <loc>${baseUrl}/programs/${categorySlug}/${program.slug}</loc>
    <lastmod>${new Date(program.updatedAt || program.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
}).join('\n')}
</urlset>`;

      res.set('Content-Type', 'application/xml');
      res.end(sitemap);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  });

  // Robots.txt generation for SEO
  app.get('/robots.txt', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const robotsTxt = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Important pages for crawlers
Allow: /articles/
Allow: /programs/
Allow: /about
Allow: /contact
Allow: /privacy-policy
Allow: /wcag-guides
Allow: /testing-tools
Allow: /resources

# Admin pages (no crawling)
Disallow: /admin/
Disallow: /api/
Disallow: /login

# Static assets
Allow: /uploads/
Allow: /assets/
Allow: /_next/static/

# Crawl delay for polite crawling
Crawl-delay: 1`;

    res.setHeader('Content-Type', 'text/plain');
    res.send(robotsTxt);
  });

  // Image upload endpoint
  app.post('/api/admin/upload-image', isAdmin, (req, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: err.message });
      }
      
      try {
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }

        const imageUrl = `/uploads/images/${req.file.filename}`;
        console.log('Image uploaded successfully:', imageUrl);
        res.json({ 
          message: 'Image uploaded successfully',
          imageUrl: imageUrl,
          filename: req.file.filename 
        });
      } catch (error) {
        console.error('Error processing uploaded image:', error);
        res.status(500).json({ message: 'Failed to process uploaded image' });
      }
    });
  });

  // Admin password change
  app.post('/api/admin/change-password', isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Текущий и новый пароли обязательны' });
      }

      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Неверный текущий пароль' });
      }

      // Update password
      await storage.updateUserPassword(userId, newPassword);
      
      res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Ошибка при изменении пароля' });
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

  // User Management Routes (Admin only)
  app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
      const googleUsers = await storage.getAllGoogleUsers();
      res.json(googleUsers);
    } catch (error) {
      console.error("Error fetching Google users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch('/api/admin/users/:id/role', isAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const result = updateUserRoleSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid data", errors: result.error.issues });
      }

      const updatedUser = await storage.updateUserRole(userId, result.data);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Universal Search API
  app.get('/api/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query || query.trim().length < 2) {
        return res.json({
          articles: [],
          programs: [],
          pages: [],
          totalResults: 0
        });
      }

      const searchTerm = query.trim().toLowerCase();

      // Search articles by title and content
      const articles = await storage.searchArticles(searchTerm);
      const articleResults = articles.map(article => {
        let description = '';
        
        // Always try to show context around search term, even if excerpt exists
        if (article.content) {
          // Remove HTML tags
          const cleanContent = article.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          
          // Find the search term in content
          const searchIndex = cleanContent.toLowerCase().indexOf(searchTerm.toLowerCase());
          
          if (searchIndex !== -1) {
            // Extract text around the found term
            const start = Math.max(0, searchIndex - 75);
            const end = Math.min(cleanContent.length, searchIndex + searchTerm.length + 75);
            const excerpt = cleanContent.substring(start, end);
            
            // Add ellipsis if we cut text
            description = (start > 0 ? '...' : '') + excerpt + (end < cleanContent.length ? '...' : '');
          } else if (article.title.toLowerCase().includes(searchTerm.toLowerCase())) {
            // If found in title, show excerpt or beginning of content
            description = article.excerpt || cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');
          } else {
            // Fallback to beginning of content
            description = cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');
          }
        } else if (article.excerpt) {
          description = article.excerpt;
        }
        
        return {
          type: 'article' as const,
          id: article.id.toString(),
          title: article.title,
          description: description || 'Статья без описания',
          url: `/articles/${article.slug}`,
          category: article.category?.name
        };
      });

      // Search programs by title and description
      const programs = await storage.searchPrograms(searchTerm);
      const programResults = programs.map(program => ({
        type: 'program' as const,
        id: program.id.toString(),
        title: program.title,
        description: program.description || '',
        url: `/programs/${program.category?.slug}/${program.slug}`,
        category: program.category?.name
      }));

      // Search pages by title and content
      const pages = await storage.searchPages(searchTerm);
      const pageResults = pages.map(page => {
        let description = '';
        
        if (page.content) {
          // Remove HTML tags
          const cleanContent = page.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
          
          // Find the search term in content
          const searchIndex = cleanContent.toLowerCase().indexOf(searchTerm.toLowerCase());
          
          if (searchIndex !== -1) {
            // Extract text around the found term
            const start = Math.max(0, searchIndex - 75);
            const end = Math.min(cleanContent.length, searchIndex + searchTerm.length + 75);
            const excerpt = cleanContent.substring(start, end);
            
            // Add ellipsis if we cut text
            description = (start > 0 ? '...' : '') + excerpt + (end < cleanContent.length ? '...' : '');
          } else {
            // Fallback to beginning of content
            description = cleanContent.substring(0, 150) + (cleanContent.length > 150 ? '...' : '');
          }
        }
        
        return {
          type: 'page' as const,
          id: page.id.toString(),
          title: page.title,
          description: description || 'Страница без описания',
          url: getPageUrl(page.slug)
        };
      });

      const totalResults = articleResults.length + programResults.length + pageResults.length;

      res.json({
        articles: articleResults,
        programs: programResults,
        pages: pageResults,
        totalResults
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: 'Search failed' });
    }
  });

  // Helper function to get page URL
  function getPageUrl(slug: string): string {
    switch (slug) {
      case 'about':
        return '/about';
      case 'wcag-guides':
        return '/wcag-guides';
      case 'testing-tools':
        return '/testing-tools';
      case 'resources':
        return '/resources';
      default:
        return `/${slug}`;
    }
  }

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
      console.log('Creating article with data:', {
        body: req.body,
        userId: req.user.id,
        userEmail: req.user.email
      });
      
      const dataToValidate = {
        ...req.body,
        authorId: req.user.id,
      };
      
      console.log('Data to validate:', dataToValidate);
      
      const validatedData = insertArticleSchema.parse(dataToValidate);
      
      console.log('Validated data:', validatedData);
      
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error details:", error.errors);
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Failed to create article" });
    }
  });

  app.put('/api/admin/articles/:id', isAdmin, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      // При редактировании статьи, автором становится текущий пользователь (последний редактор)
      const validatedData = insertArticleSchema.partial().parse({
        ...req.body,
        authorId: req.user.id
      });
      
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
      const categoryId = parseInt(req.params.id);
      
      // Получаем категорию для проверки
      const category = await storage.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      // Защищенные категории нельзя удалять
      const protectedSlugs = ['accessibility', 'best-practices', 'screen-readers', 'mobile-apps', 'education'];
      if (protectedSlugs.includes(category.slug)) {
        return res.status(403).json({ 
          message: "Эта категория является системной и не может быть удалена" 
        });
      }
      
      await storage.deleteCategory(categoryId);
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

  // Contact form endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);
      res.json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // Admin contact messages
  app.get('/api/admin/messages', isAdmin, async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.patch('/api/admin/messages/:id/read', isAdmin, async (req, res) => {
    try {
      const message = await storage.markMessageAsRead(parseInt(req.params.id));
      res.json(message);
    } catch (error) {
      console.error("Error marking message as read:", error);
      res.status(500).json({ message: "Failed to mark message as read" });
    }
  });

  app.delete('/api/admin/messages/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteContactMessage(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting message:", error);
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // RHVoice TTS endpoint
  app.post('/api/rhvoice/speak', async (req, res) => {
    try {
      const { text, voice = 'anna', rate = 1.0, format = 'wav' } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // RHVoice API call (replace with actual RHVoice server URL)
      const rhvoiceUrl = process.env.RHVOICE_URL || 'http://localhost:8080';
      
      const response = await fetch(`${rhvoiceUrl}/say`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          voice: voice,
          rate: rate,
          format: format
        }),
      });

      if (!response.ok) {
        throw new Error(`RHVoice server error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      res.setHeader('Content-Type', 'audio/wav');
      res.setHeader('Content-Length', audioBuffer.byteLength);
      res.send(Buffer.from(audioBuffer));
      
    } catch (error) {
      console.error('RHVoice TTS error:', error);
      res.status(503).json({ 
        error: 'Text-to-speech service unavailable',
        message: 'Please try the browser synthesizer instead'
      });
    }
  });

  // Special endpoint to update About page content (for production deployment)
  app.post('/api/admin/update-about-page', isAdmin, async (req, res) => {
    try {
      const correctAboutContent = `
        <img src="/author-photo.png" alt="Абдулазиз Салимов" style="float: left; width: 300px; height: auto; margin: 0 2rem 1rem 0; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
        
        <h2>Абдулазиз Салимов</h2>
        <p><strong>Эксперт по цифровой доступности</strong></p>
        <p>Меня зовут Абдулазиз Салимов. Я являюсь человеком с инвалидностью по зрению I группы и специалистом в области цифровой доступности.</p>
        
        <p>Работаю в Центре управления проектами цифрового правительства при Министерстве цифровых технологий Республики Узбекистан. Основное направление моей деятельности — аудит цифровых сервисов на доступность для людей с различными формами инвалидности.</p>
        
        <p>В рамках профессиональной деятельности работаю с Единым порталом интерактивных государственных услуг my.gov.uz: выявляю барьеры в использовании сервисов, консультирую команды разработчиков, участвую в разработке и внедрении решений, которые делают цифровую среду доступнее для всех пользователей.</p>
        
        <h3>Миссия</h3>
        <p>Я убежден, что технологии должны служить всем людям, независимо от их физических, сенсорных или когнитивных способностей. Цифровая доступность — это не просто соблюдение стандартов, это создание инклюзивного мира, где каждый может полноценно участвовать в цифровой жизни общества.</p>
        
        <h3>Экспертиза</h3>
        <ul>
          <li>Аудит веб-сайтов и мобильных приложений на соответствие стандартам WCAG 2.1</li>
          <li>Консультирование по вопросам инклюзивного дизайна</li>
          <li>Тестирование интерфейсов с использованием вспомогательных технологий</li>
          <li>Разработка рекомендаций по устранению барьеров доступности</li>
          <li>Обучение команд разработки принципам универсального дизайна</li>
        </ul>
        
        <h3>О блоге</h3>
        <p>Этот блог создан для того, чтобы делиться знаниями и опытом в области цифровой доступности. Здесь вы найдете практические руководства, обзоры инструментов, разборы реальных кейсов и рекомендации по созданию более инклюзивных цифровых продуктов.</p>
        
        <p>Моя цель — сделать информацию о веб-доступности понятной и применимой для всех: разработчиков, дизайнеров, продакт-менеджеров и всех, кто создает цифровые решения. Доступность — это не препятствие для креативности, а возможность создавать продукты, которыми могут пользоваться все люди, независимо от их способностей.</p>
        
        <h3>Контакты</h3>
        <ul>
          <li><strong>Email:</strong> salimov.abdulaziz.98@gmail.com</li>
          <li><strong>Телефон:</strong> +998 (99) 831-69-83</li>
          <li><strong>Местоположение:</strong> Ташкент, Узбекистан (UTC+5)</li>
        </ul>
        `;

      // Find and update the about page
      const existingPage = await storage.getPageBySlug("about");
      if (existingPage) {
        await storage.updatePage(existingPage.id, {
          content: correctAboutContent,
          metaDescription: "Абдулазиз Салимов — эксперт по цифровой доступности, специалист в области инклюзивного дизайна и веб-доступности."
        });
        res.json({ message: "About page updated successfully with correct layout" });
      } else {
        // Create the page if it doesn't exist
        await storage.createPage({
          title: "Об авторе",
          slug: "about",
          content: correctAboutContent,
          metaDescription: "Абдулазиз Салимов — эксперт по цифровой доступности, специалист в области инклюзивного дизайна и веб-доступности.",
          isPublished: true
        });
        res.json({ message: "About page created successfully with correct layout" });
      }
    } catch (error) {
      console.error("Error updating about page:", error);
      res.status(500).json({ message: "Failed to update about page" });
    }
  });

  // Program routes
  app.get('/api/programs', async (req, res) => {
    try {
      const { page = '1', limit = '12', search, categoryId } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const programs = await storage.getPrograms({
        published: true,
        limit: parseInt(limit as string),
        offset,
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      });

      const totalCount = await storage.getProgramsCount({
        published: true,
        search: search as string,
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
      });

      res.json({
        programs,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          totalPages: Math.ceil(totalCount / parseInt(limit as string)),
        }
      });
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get('/api/programs/:slug', async (req, res) => {
    try {
      const program = await storage.getProgramBySlug(req.params.slug);
      if (!program || !program.isPublished) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  // News endpoint - shows only articles (as requested by user)
  app.get('/api/news', async (req, res) => {
    try {
      const { limit = '6' } = req.query;
      const newsLimit = parseInt(limit as string);
      
      // Get latest articles only
      const articles = await storage.getArticles({
        published: true,
        limit: newsLimit,
        offset: 0,
      });
      
      // Format as news items
      const newsItems = (articles || []).map((article: any) => ({
        type: 'article' as const,
        data: article,
        createdAt: article.publishedAt ? new Date(article.publishedAt) : (article.createdAt ? new Date(article.createdAt) : new Date()),
      }));
      
      res.json({ items: newsItems });
    } catch (error) {
      console.error("Error fetching news:", error);
      res.status(500).json({ message: "Failed to fetch news" });
    }
  });

  // Program category routes
  app.get('/api/program-categories', async (req, res) => {
    try {
      const categories = await storage.getProgramCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching program categories:", error);
      res.status(500).json({ message: "Failed to fetch program categories" });
    }
  });

  app.get('/api/program-categories/:slug', async (req, res) => {
    try {
      const category = await storage.getProgramCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Program category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching program category:", error);
      res.status(500).json({ message: "Failed to fetch program category" });
    }
  });

  // Admin program category management
  app.get('/api/admin/program-categories', isAdmin, async (req, res) => {
    try {
      const categories = await storage.getProgramCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching program categories:", error);
      res.status(500).json({ message: "Failed to fetch program categories" });
    }
  });

  app.post('/api/admin/program-categories', isAdmin, async (req, res) => {
    try {
      const validatedData = insertProgramCategorySchema.parse(req.body);
      const category = await storage.createProgramCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating program category:", error);
      res.status(500).json({ message: "Failed to create program category" });
    }
  });

  app.put('/api/admin/program-categories/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProgramCategorySchema.partial().parse(req.body);
      
      const category = await storage.updateProgramCategory(id, validatedData);
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating program category:", error);
      res.status(500).json({ message: "Failed to update program category" });
    }
  });

  app.delete('/api/admin/program-categories/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteProgramCategory(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting program category:", error);
      res.status(500).json({ message: "Failed to delete program category" });
    }
  });



  // Admin program management
  app.get('/api/admin/programs', isAdmin, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const search = req.query.search as string;
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const offset = (page - 1) * limit;

      const programs = await storage.getPrograms({
        published: undefined, // Show all programs for admin
        limit,
        offset,
        search,
        categoryId
      });

      const total = await storage.getProgramsCount({
        published: undefined,
        search,
        categoryId
      });

      res.json({
        programs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get('/api/admin/programs/:id', isAdmin, async (req, res) => {
    try {
      const program = await storage.getProgramById(parseInt(req.params.id));
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.post('/api/admin/programs', isAdmin, async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating program:", error);
      res.status(500).json({ message: "Failed to create program" });
    }
  });

  app.put('/api/admin/programs/:id', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProgramSchema.partial().parse(req.body);
      
      const program = await storage.updateProgram(id, validatedData);
      res.json(program);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error updating program:", error);
      res.status(500).json({ message: "Failed to update program" });
    }
  });

  app.delete('/api/admin/programs/:id', isAdmin, async (req, res) => {
    try {
      await storage.deleteProgram(parseInt(req.params.id));
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ message: "Failed to delete program" });
    }
  });

  // Article Reactions API
  app.post('/api/articles/:id/reactions', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { reactionType, userEmail } = req.body;
      
      if (!reactionType || !['like', 'dislike'].includes(reactionType)) {
        return res.status(400).json({ message: "Invalid reaction type" });
      }

      const userId = req.user?.id;
      if (!userId && !userEmail) {
        return res.status(400).json({ message: "User ID or email required" });
      }

      const reactionData = insertArticleReactionSchema.parse({
        articleId,
        userId,
        userEmail,
        reactionType
      });

      const reaction = await storage.addReaction(reactionData);
      res.status(201).json(reaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error adding reaction:", error);
      res.status(500).json({ message: "Failed to add reaction" });
    }
  });

  app.delete('/api/articles/:id/reactions', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { userEmail } = req.body;
      const userId = req.user?.id;

      if (!userId && !userEmail) {
        return res.status(400).json({ message: "User ID or email required" });
      }

      await storage.removeReaction(articleId, userId, userEmail);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing reaction:", error);
      res.status(500).json({ message: "Failed to remove reaction" });
    }
  });

  app.get('/api/articles/:id/reactions', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { userEmail } = req.query;
      const userId = req.user?.id;

      const reactions = await storage.getArticleReactions(articleId);
      const userReaction = await storage.getUserReaction(articleId, userId, userEmail as string);

      const counts = {
        likes: reactions.filter(r => r.reactionType === 'like').length,
        dislikes: reactions.filter(r => r.reactionType === 'dislike').length
      };

      res.json({
        counts,
        userReaction: userReaction?.reactionType || null
      });
    } catch (error) {
      console.error("Error fetching reactions:", error);
      res.status(500).json({ message: "Failed to fetch reactions" });
    }
  });

  // Article Comments API
  app.get('/api/articles/:id/comments', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const comments = await storage.getArticleComments(articleId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/articles/:id/comments', async (req, res) => {
    try {
      const articleId = parseInt(req.params.id);
      const { authorName, authorEmail, content, parentId } = req.body;
      const userId = req.user?.id;

      // Клиентская антиспам защита реализована на фронтенде

      const commentData = insertArticleCommentSchema.parse({
        articleId,
        userId,
        authorName,
        authorEmail,
        content,
        parentId
      });

      const comment = await storage.addComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error adding comment:", error);
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Admin comment management
  app.patch('/api/admin/comments/:id/approve', isAdmin, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      const comment = await storage.approveComment(commentId);
      res.json(comment);
    } catch (error) {
      console.error("Error approving comment:", error);
      res.status(500).json({ message: "Failed to approve comment" });
    }
  });

  app.delete('/api/admin/comments/:id', isAdmin, async (req, res) => {
    try {
      const commentId = parseInt(req.params.id);
      await storage.deleteComment(commentId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting comment:", error);
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // RHVoice proxy endpoint
  app.get('/api/rhvoice/say', async (req, res) => {
    try {
      const { text, voice = 'elena', format = 'mp3', rate = '50', pitch = '50', volume = '100' } = req.query;
      
      if (!text) {
        return res.status(400).json({ error: 'Text parameter is required' });
      }

      // Encode text properly for URL
      const rhvoiceUrl = `http://localhost:8081/say?text=${encodeURIComponent(text as string)}&voice=${voice}&format=${format}&rate=${rate}&pitch=${pitch}&volume=${volume}`;
      
      console.log('RHVoice URL:', rhvoiceUrl);
      
      // Forward request to RHVoice server with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(rhvoiceUrl, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('RHVoice response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('RHVoice error response:', errorText);
        return res.status(response.status).json({ 
          error: `RHVoice server error: ${response.status}`,
          details: errorText
        });
      }

      // Set appropriate headers
      const contentType = response.headers.get('content-type') || 'audio/mpeg';
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      // Get audio buffer and send it
      const audioBuffer = await response.arrayBuffer();
      res.send(Buffer.from(audioBuffer));
      
    } catch (error: any) {
      console.error('RHVoice proxy error:', error);
      
      let statusCode = 500;
      let errorMessage = 'RHVoice service unavailable';
      
      if (error.name === 'AbortError') {
        statusCode = 504;
        errorMessage = 'RHVoice server timeout';
      } else if (error.code === 'ECONNREFUSED') {
        statusCode = 503;
        errorMessage = 'RHVoice server not running';
      }
      
      res.status(statusCode).json({ 
        error: errorMessage,
        message: error.message || 'Unknown error',
        details: 'Make sure RHVoice server is running on localhost:8081'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
