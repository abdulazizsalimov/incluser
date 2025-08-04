import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username").unique(),
  email: varchar("email").unique(),
  password: varchar("password"), // Optional for Google OAuth users
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: varchar("google_id").unique(), // For Google OAuth
  authProvider: varchar("auth_provider").default("local"), // 'local' or 'google'
  isAdmin: boolean("is_admin").default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Articles table
export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image"),
  featuredImageAlt: varchar("featured_image_alt"),
  isPublished: boolean("is_published").default(false),
  publishedAt: timestamp("published_at"),
  readingTime: integer("reading_time"), // in minutes
  authorId: integer("author_id").notNull(),
  categoryId: integer("category_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pages table (for static content like About, Contact)
export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  content: text("content").notNull(),
  metaDescription: varchar("meta_description", { length: 160 }),
  isPublished: boolean("is_published").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Contact messages table
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 200 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type", { length: 50 }).default("contact"), // 'contact' or 'problem_report'
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Program categories table
export const programCategories = pgTable("program_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Programs table (for software and apps)
export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  version: varchar("version", { length: 50 }),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description").notNull(),
  whatsNew: text("whats_new"),
  detailedDescription: text("detailed_description"),
  logo: varchar("logo"), // Logo/screenshot image path
  developer: varchar("developer", { length: 200 }),
  officialWebsite: varchar("official_website"),
  releaseYear: integer("release_year"),
  license: varchar("license", { length: 100 }),
  platforms: text("platforms").array(), // Array of platforms
  pricing: varchar("pricing", { length: 20 }).default("free"), // free, paid, freemium
  price: varchar("price", { length: 100 }), // Price description if paid
  downloadUrl: varchar("download_url"),
  googlePlayUrl: varchar("google_play_url"),
  appStoreUrl: varchar("app_store_url"),
  isPublished: boolean("is_published").default(false),
  categoryId: integer("category_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  articles: many(articles),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [articles.categoryId],
    references: [categories.id],
  }),
}));

export const programCategoriesRelations = relations(programCategories, ({ many }) => ({
  programs: many(programs),
}));

export const programsRelations = relations(programs, ({ one }) => ({
  category: one(programCategories, {
    fields: [programs.categoryId],
    references: [programCategories.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});
export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  updatedAt: true,
});
export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});
export const insertProgramCategorySchema = createInsertSchema(programCategories).omit({
  id: true,
  createdAt: true,
});
export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(4, "New password must be at least 4 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type ChangePasswordData = z.infer<typeof changePasswordSchema>;

// User role update schema
export const updateUserRoleSchema = z.object({
  isAdmin: z.boolean(),
});

export type UpdateUserRoleData = z.infer<typeof updateUserRoleSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
export type ArticleWithRelations = Article & {
  author: User;
  category: Category | null;
};
export type InsertPage = z.infer<typeof insertPageSchema>;
export type Page = typeof pages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertProgramCategory = z.infer<typeof insertProgramCategorySchema>;
export type ProgramCategory = typeof programCategories.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Program = typeof programs.$inferSelect;
export type ProgramWithRelations = Program & {
  category: ProgramCategory | null;
};
