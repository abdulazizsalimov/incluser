# Incluser Blog - Accessibility-Focused Personal Blog

## Overview

Incluser is a personal blog focused on digital accessibility and inclusive design, built with a modern full-stack architecture. The application is designed to be fully accessible and serves as both a platform for sharing accessibility knowledge and a demonstration of best practices in accessible web development.

## System Architecture

The application follows a full-stack monorepo architecture with clear separation between client and server components:

- **Frontend**: React-based SPA using Vite for build tooling
- **Backend**: Express.js REST API server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with session management
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Deployment**: Configured for Replit's autoscale deployment target

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state and caching
- **Forms**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Accessibility Features**: 
  - Skip links for keyboard navigation
  - Semantic HTML structure
  - ARIA labels and roles
  - Google Translate integration
  - Accessibility widget for font size, contrast, and motion preferences

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with proper HTTP status codes
- **Database ORM**: Drizzle with PostgreSQL dialect
- **Session Management**: Express sessions with PostgreSQL storage
- **Authentication**: OpenID Connect (OIDC) via Replit Auth
- **Middleware**: Request logging, error handling, CORS support

### Database Schema
The database includes tables for:
- **users**: User profiles with Replit Auth integration
- **sessions**: Session storage for authentication
- **articles**: Blog articles with rich metadata (title, content, excerpt, featured images, SEO fields)
- **categories**: Article categorization system
- **pages**: Static pages (About, Contact)

### Admin Interface
- Role-based access control for admin users
- Content management for articles, categories, and pages
- Rich text editor for content creation
- Draft/publish workflow
- SEO metadata management

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth (OpenID Connect)
2. **Content Retrieval**: Public articles are accessible without authentication
3. **Admin Operations**: Authenticated admin users can create/edit content
4. **Session Management**: Sessions stored in PostgreSQL with automatic cleanup
5. **Asset Handling**: Static assets served from build directory in production

## External Dependencies

- **Database**: PostgreSQL via Neon Database (@neondatabase/serverless)
- **Authentication**: Replit Auth using OpenID Connect
- **UI Components**: Radix UI primitives for accessibility
- **Translation**: Google Translate integration
- **Development**: Vite with HMR and error overlay

## Deployment Strategy

- **Development**: `npm run dev` - runs both client and server with hot reload
- **Build**: `npm run build` - creates optimized production build
- **Production**: `npm run start` - serves built application
- **Database**: Automatic migrations via Drizzle (`npm run db:push`)
- **Environment**: Configured for Replit's infrastructure with autoscale deployment

The application is optimized for Replit's development environment with integrated database provisioning, authentication, and deployment pipelines.

## Changelog

```
Changelog:
- June 30, 2025. Added file upload system for article images - created multer-based image upload API endpoint, updated ArticleEditor with tabbed interface for URL and file upload options, configured 5MB file size limit and image-only restrictions, files stored in uploads/images directory with automatic static serving
- June 30, 2025. Replaced Replit authentication with local authentication system - created admin user "Gomer98" with password "12345", removed registration functionality, implemented secure login/logout flow with bcrypt password hashing, fixed article creation routes to work with new authentication structure
- June 30, 2025. Fixed mobile menu accessibility and responsiveness - added adaptive icon-only buttons for narrow screens, implemented proper vertical scrolling, ensured all navigation elements (accessibility widget, login/registration) remain visible on all screen sizes
- June 30, 2025. Implemented comprehensive sharing functionality with Open Graph support - added share buttons to articles with social media integration (Telegram, Facebook, VK, WhatsApp), created dynamic server-side meta tag rendering for proper link previews in social networks
- June 30, 2025. Fixed banner display issues for unauthenticated users, improved photo positioning to prevent cropping, enhanced button styling for better contrast and readability
- June 30, 2025. Added category filtering system with URL-based navigation, dropdown menu in header for filtering articles by category
- June 30, 2025. Enhanced hero banner with author photo integration - full-height image on desktop with smooth gradient blending, responsive mobile design with text overlay on photo
- June 30, 2025. Fixed resource pages routing issues by correcting React Query configuration, all three resource pages (WCAG guides, testing tools, resources) now display properly
- June 30, 2025. Created comprehensive resource pages (WCAG guides, testing tools, useful resources) with rich content, made editable through admin panel
- June 30, 2025. Added RSS feed functionality, replaced social media buttons with Facebook/Telegram/VK, enhanced accessibility widget with collapsible advanced settings, improved screen reader support for sliders
- June 30, 2025. Added professional author page with photo, improved language detection for browsers, implemented favicon
- June 26, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```