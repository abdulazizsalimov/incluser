import {
  users,
  articles,
  categories,
  pages,
  contactMessages,
  programs,
  programCategories,
  type User,
  type InsertUser,
  type LoginData,
  type ChangePasswordData,
  type Article,
  type InsertArticle,
  type ArticleWithRelations,
  type Category,
  type InsertCategory,
  type Page,
  type InsertPage,
  type ContactMessage,
  type InsertContactMessage,
  type Program,
  type InsertProgram,
  type ProgramWithRelations,
  type ProgramCategory,
  type InsertProgramCategory,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, count, or, ilike } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: number, newPassword: string): Promise<User>;

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
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Page operations
  getPages(): Promise<Page[]>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: number, page: Partial<InsertPage>): Promise<Page>;
  deletePage(id: number): Promise<void>;

  // Contact message operations
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: number): Promise<ContactMessage>;
  deleteContactMessage(id: number): Promise<void>;

  // Program category operations
  getProgramCategories(): Promise<ProgramCategory[]>;
  getProgramCategoryBySlug(slug: string): Promise<ProgramCategory | undefined>;
  getProgramCategoryById(id: number): Promise<ProgramCategory | undefined>;
  createProgramCategory(category: InsertProgramCategory): Promise<ProgramCategory>;
  updateProgramCategory(id: number, category: Partial<InsertProgramCategory>): Promise<ProgramCategory>;
  deleteProgramCategory(id: number): Promise<void>;

  // Program operations
  getPrograms(options?: {
    published?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
    categoryId?: number;
  }): Promise<ProgramWithRelations[]>;
  getProgramBySlug(slug: string): Promise<ProgramWithRelations | undefined>;
  getProgramById(id: number): Promise<ProgramWithRelations | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program>;
  deleteProgram(id: number): Promise<void>;
  getProgramsCount(options?: { published?: boolean; search?: string; categoryId?: number }): Promise<number>;

  // Search operations
  searchArticles(searchTerm: string): Promise<ArticleWithRelations[]>;
  searchPrograms(searchTerm: string): Promise<ProgramWithRelations[]>;
  searchPages(searchTerm: string): Promise<Page[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUserPassword(id: number, newPassword: string): Promise<User> {
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const [user] = await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, id))
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
      conditions.push(
        or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.content, `%${search}%`),
          ilike(articles.excerpt, `%${search}%`)
        )
      );
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
      conditions.push(
        or(
          ilike(articles.title, `%${search}%`),
          ilike(articles.content, `%${search}%`),
          ilike(articles.excerpt, `%${search}%`)
        )
      );
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

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
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

  // Contact message operations
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(messageData: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db.insert(contactMessages).values(messageData).returning();
    return message;
  }

  async markMessageAsRead(id: number): Promise<ContactMessage> {
    const [updatedMessage] = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return updatedMessage;
  }

  async deleteContactMessage(id: number): Promise<void> {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  }

  // Program category operations
  async getProgramCategories(): Promise<ProgramCategory[]> {
    return await db.select().from(programCategories).orderBy(programCategories.name);
  }

  async getProgramCategoryBySlug(slug: string): Promise<ProgramCategory | undefined> {
    const [category] = await db.select().from(programCategories).where(eq(programCategories.slug, slug));
    return category;
  }

  async getProgramCategoryById(id: number): Promise<ProgramCategory | undefined> {
    const [category] = await db.select().from(programCategories).where(eq(programCategories.id, id));
    return category;
  }

  async createProgramCategory(categoryData: InsertProgramCategory): Promise<ProgramCategory> {
    const [category] = await db.insert(programCategories).values(categoryData).returning();
    return category;
  }

  async updateProgramCategory(id: number, categoryData: Partial<InsertProgramCategory>): Promise<ProgramCategory> {
    const [updatedCategory] = await db
      .update(programCategories)
      .set(categoryData)
      .where(eq(programCategories.id, id))
      .returning();
    return updatedCategory;
  }

  async deleteProgramCategory(id: number): Promise<void> {
    await db.delete(programCategories).where(eq(programCategories.id, id));
  }

  // Program operations
  async getPrograms(options: {
    published?: boolean;
    limit?: number;
    offset?: number;
    search?: string;
    categoryId?: number;
  } = {}): Promise<ProgramWithRelations[]> {
    const { published = true, limit = 20, offset = 0, search, categoryId } = options;

    let query = db
      .select({
        id: programs.id,
        title: programs.title,
        version: programs.version,
        slug: programs.slug,
        description: programs.description,
        whatsNew: programs.whatsNew,
        detailedDescription: programs.detailedDescription,
        logo: programs.logo,
        developer: programs.developer,
        officialWebsite: programs.officialWebsite,
        releaseYear: programs.releaseYear,
        license: programs.license,
        platforms: programs.platforms,
        downloadUrl: programs.downloadUrl,
        googlePlayUrl: programs.googlePlayUrl,
        appStoreUrl: programs.appStoreUrl,
        isPublished: programs.isPublished,
        categoryId: programs.categoryId,
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
        category: programCategories,
      })
      .from(programs)
      .leftJoin(programCategories, eq(programs.categoryId, programCategories.id));

    const whereConditions = [];
    if (published !== undefined) {
      whereConditions.push(eq(programs.isPublished, published));
    }
    if (search) {
      whereConditions.push(
        or(
          ilike(programs.title, `%${search}%`),
          ilike(programs.description, `%${search}%`),
          ilike(programs.developer, `%${search}%`)
        )
      );
    }
    if (categoryId) {
      whereConditions.push(eq(programs.categoryId, categoryId));
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    return await query
      .orderBy(desc(programs.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getProgramBySlug(slug: string): Promise<ProgramWithRelations | undefined> {
    const [program] = await db
      .select({
        id: programs.id,
        title: programs.title,
        version: programs.version,
        slug: programs.slug,
        description: programs.description,
        whatsNew: programs.whatsNew,
        detailedDescription: programs.detailedDescription,
        logo: programs.logo,
        developer: programs.developer,
        officialWebsite: programs.officialWebsite,
        releaseYear: programs.releaseYear,
        license: programs.license,
        platforms: programs.platforms,
        pricing: programs.pricing,
        price: programs.price,
        downloadUrl: programs.downloadUrl,
        googlePlayUrl: programs.googlePlayUrl,
        appStoreUrl: programs.appStoreUrl,
        isPublished: programs.isPublished,
        categoryId: programs.categoryId,
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
        category: programCategories,
      })
      .from(programs)
      .leftJoin(programCategories, eq(programs.categoryId, programCategories.id))
      .where(eq(programs.slug, slug));
    return program;
  }

  async getProgramById(id: number): Promise<ProgramWithRelations | undefined> {
    const [program] = await db
      .select({
        id: programs.id,
        title: programs.title,
        version: programs.version,
        slug: programs.slug,
        description: programs.description,
        whatsNew: programs.whatsNew,
        detailedDescription: programs.detailedDescription,
        logo: programs.logo,
        developer: programs.developer,
        officialWebsite: programs.officialWebsite,
        releaseYear: programs.releaseYear,
        license: programs.license,
        platforms: programs.platforms,
        pricing: programs.pricing,
        price: programs.price,
        downloadUrl: programs.downloadUrl,
        googlePlayUrl: programs.googlePlayUrl,
        appStoreUrl: programs.appStoreUrl,
        isPublished: programs.isPublished,
        categoryId: programs.categoryId,
        createdAt: programs.createdAt,
        updatedAt: programs.updatedAt,
        category: programCategories,
      })
      .from(programs)
      .leftJoin(programCategories, eq(programs.categoryId, programCategories.id))
      .where(eq(programs.id, id));
    return program;
  }

  async createProgram(programData: InsertProgram): Promise<Program> {
    const [program] = await db.insert(programs).values(programData).returning();
    return program;
  }

  async updateProgram(id: number, programData: Partial<InsertProgram>): Promise<Program> {
    const [updatedProgram] = await db
      .update(programs)
      .set({ ...programData, updatedAt: new Date() })
      .where(eq(programs.id, id))
      .returning();
    return updatedProgram;
  }

  async deleteProgram(id: number): Promise<void> {
    await db.delete(programs).where(eq(programs.id, id));
  }

  async getProgramsCount(options: { published?: boolean; search?: string; categoryId?: number } = {}): Promise<number> {
    const { published = true, search, categoryId } = options;

    let query = db.select({ count: count() }).from(programs);

    const whereConditions = [];
    if (published !== undefined) {
      whereConditions.push(eq(programs.isPublished, published));
    }
    if (search) {
      whereConditions.push(
        or(
          ilike(programs.title, `%${search}%`),
          ilike(programs.description, `%${search}%`),
          ilike(programs.developer, `%${search}%`)
        )
      );
    }
    if (categoryId) {
      whereConditions.push(eq(programs.categoryId, categoryId));
    }

    if (whereConditions.length > 0) {
      query = query.where(and(...whereConditions));
    }

    const [result] = await query;
    return result.count;
  }

  // Search operations
  async searchArticles(searchTerm: string): Promise<ArticleWithRelations[]> {
    return await this.getArticles({
      published: true,
      search: searchTerm,
      limit: 10,
      offset: 0
    });
  }

  async searchPrograms(searchTerm: string): Promise<ProgramWithRelations[]> {
    return await this.getPrograms({
      published: true,
      search: searchTerm,
      limit: 10,
      offset: 0
    });
  }

  async searchPages(searchTerm: string): Promise<Page[]> {
    return await db
      .select()
      .from(pages)
      .where(
        or(
          ilike(pages.title, `%${searchTerm}%`),
          ilike(pages.content, `%${searchTerm}%`)
        )
      )
      .orderBy(desc(pages.updatedAt))
      .limit(10);
  }
}

export const storage = new DatabaseStorage();
