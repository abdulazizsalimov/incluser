# Incluser Blog - Accessibility-Focused Personal Blog

## Overview
Incluser is a personal blog focused on digital accessibility and inclusive design. Its main purpose is to share accessibility knowledge and demonstrate best practices in accessible web development, serving as a platform for accessible content and a showcase of inclusive design. The project aims to provide an accessible user experience and promote digital inclusivity.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture
The application features a full-stack monorepo architecture.
- **Frontend**: React-based SPA using Vite, Wouter for routing, TanStack Query for state, React Hook Form with Zod for forms, and shadcn/ui (built on Radix UI) for components. Key accessibility features include skip links, semantic HTML, ARIA labels, Google Translate integration, and an accessibility widget for font, contrast, and motion. The UI offers light, dark (cosmic-themed with purple-blue gradients), and system themes, with visual thumbnails for theme selection.
- **Backend**: Express.js REST API with TypeScript, using Drizzle ORM with PostgreSQL. Authentication leverages OpenID Connect via Replit Auth (with a local fallback system including bcrypt hashing for admin users "Gomer98"/"12345"). Session management uses Express sessions stored in PostgreSQL. Middleware includes logging, error handling, and CORS.
- **Database Schema**: Includes `users`, `sessions`, `articles` (with rich metadata, featured images, SEO fields), `categories`, and `pages` (e.g., About, Contact, Privacy Policy, resource pages like WCAG guides).
- **Admin Interface**: Provides role-based access control, content management (articles, categories, pages) with a rich text editor, draft/publish workflow, SEO metadata management, password change functionality, and a file upload system for images.
- **Key Features**: Comprehensive text-to-speech functionality (unified system with RHVoice as default and browser fallback, localhost:8081 server integration, voice selection: elena/irina/anna/tatyana, speed presets: 30%/50%/70%/90%, volume presets: 25%/50%/75%/100%, fixed pitch at 50%, and keyboard shortcut), dynamic sharing with Open Graph support, category filtering, RSS feed, contact form with database submission, and an automatic initialization system for basic setup. Homepage features unified "Новости" (News) section displaying articles only (programs removed per user request).

## External Dependencies
- **Database**: PostgreSQL (self-hosted with `pg` driver)
- **Authentication**: Replit Auth (OpenID Connect), supplemented by an internal local authentication system.
- **UI Components**: Radix UI primitives
- **Translation**: Google Translate
- **Text-to-Speech**: RHVoice (optional, with browser fallback)