import {
  users,
  articles,
  categories,
  pages,
  type User,
  type UpsertUser,
  type Article,
  type InsertArticle,
  type ArticleWithRelations,
  type Category,
  type InsertCategory,
  type Page,
  type InsertPage,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, count } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Article operations
  getArticles(options?: {
    published?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
    categoryId?: number;
  }): Promise<ArticleWithRelations[]>;
  getArticleBySlug(slug: string): Promise<ArticleWithRelations | undefined>;
  getArticleById(id: number): Promise<ArticleWithRelations | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;
  getArticlesCount(options?: { published?: boolean; search?: string; categoryId?: number }): Promise<number>;

  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Page operations
  getPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page>;
  deletePage(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Article operations
  async getArticles(options: {
    published?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
    categoryId?: number;
  } = {}): Promise<ArticleWithRelations[]> {
    const { published, limit = 50, offset = 0, search, categoryId } = options;
    
    let query = db
      .select()
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .orderBy(desc(articles.publishedAt));

    const conditions = [];
    if (published !== undefined) {
      conditions.push(eq(articles.isPublished, published));
    }
    if (search) {
      conditions.push(like(articles.title, `%${search}%`));
    }
    if (categoryId) {
      conditions.push(eq(articles.categoryId, categoryId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.limit(limit).offset(offset);
    
    return results.map(result => ({
      ...result.articles,
      author: result.users!,
      category: result.categories,
    }));
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithRelations | undefined> {
    const [result] = await db
      .select()
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.slug, slug));

    if (!result) return undefined;

    return {
      ...result.articles,
      author: result.users!,
      category: result.categories,
    };
  }

  async getArticleById(id: number): Promise<ArticleWithRelations | undefined> {
    const [result] = await db
      .select()
      .from(articles)
      .leftJoin(users, eq(articles.authorId, users.id))
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id));

    if (!result) return undefined;

    return {
      ...result.articles,
      author: result.users!,
      category: result.categories,
    };
  }

  async createArticle(article: InsertArticle): Promise<Article> {
    const [newArticle] = await db
      .insert(articles)
      .values({
        ...article,
        publishedAt: article.isPublished ? new Date() : null,
      })
      .returning();
    return newArticle;
  }

  async updateArticle(id: number, articleData: Partial<InsertArticle>): Promise<Article> {
    const [updatedArticle] = await db
      .update(articles)
      .set({
        ...articleData,
        updatedAt: new Date(),
        publishedAt: articleData.isPublished ? new Date() : undefined,
      })
      .where(eq(articles.id, id))
      .returning();
    return updatedArticle;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getArticlesCount(options: { published?: boolean; search?: string; categoryId?: number } = {}): Promise<number> {
    const { published, search, categoryId } = options;
    
    let query = db.select({ count: count() }).from(articles);

    const conditions = [];
    if (published !== undefined) {
      conditions.push(eq(articles.isPublished, published));
    }
    if (search) {
      conditions.push(like(articles.title, `%${search}%`));
    }
    if (categoryId) {
      conditions.push(eq(articles.categoryId, categoryId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const [result] = await query;
    return result.count;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  async updateCategory(id: number, categoryData: Partial<InsertCategory>): Promise<Category> {
    const [updatedCategory] = await db
      .update(categories)
      .set(categoryData)
      .where(eq(categories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Page operations
  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(pages.title);
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async createPage(page: InsertPage): Promise<Page> {
    const [newPage] = await db.insert(pages).values(page).returning();
    return newPage;
  }

  async updatePage(id: number, pageData: Partial<InsertPage>): Promise<Page> {
    const [updatedPage] = await db
      .update(pages)
      .set({ ...pageData, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updatedPage;
  }

  async deletePage(id: number): Promise<void> {
    await db.delete(pages).where(eq(pages.id, id));
  }
}

export const storage = new DatabaseStorage();
