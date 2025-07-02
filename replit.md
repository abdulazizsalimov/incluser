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
- July 1, 2025. Fixed content styling issues in dark theme - added comprehensive prose styles for proper text rendering in dark mode, fixed emphasized text (em/i tags) visibility with dedicated CSS rules, ensured all article content displays correctly with proper contrast
- July 1, 2025. Improved text readability in dark theme - increased muted-foreground contrast from 65% to 80% brightness for better text visibility, updated high contrast mode settings for enhanced accessibility
- July 1, 2025. Fixed light background artifacts in dark theme - removed white/gray backgrounds from article cards and other components that were causing visual inconsistencies in dark mode, updated all page backgrounds to use semantic CSS variables for proper theme adaptation
- July 1, 2025. Implemented cosmic-themed dark mode - redesigned dark theme with purple-blue gradients inspired by modern space/tech aesthetics, added animated starfield background, updated hero banner gradients to adapt between light (blue-cyan-teal) and dark (purple-blue-indigo) themes, improved visual consistency across all pages
- July 1, 2025. Enhanced article page banners with responsive design - created dedicated mobile and desktop layouts for article banners, positioned text at bottom with proper mobile centering, improved share button readability with white background and dark text, fixed image display without cropping on main page mobile version
- July 1, 2025. Added comprehensive text-to-speech functionality with RHVoice integration - created speech synthesis system with both browser and RHVoice options, keyboard shortcut Ctrl+Shift+S for selected text, configurable speech speed, automatic fallback from RHVoice to browser speech, complete accessibility widget integration with settings panel
- June 30, 2025. Added automatic initialization system - created seed functions that automatically generate admin user (Gomer98/12345), basic category, welcome article, and resource pages on first startup, making deployment much easier with zero manual setup required
- June 30, 2025. Fixed JavaScript errors in author display - simplified author name rendering to use only username, eliminated complex conditional logic that was causing runtime errors, ensured all article views work properly
- June 30, 2025. Added admin password change functionality - created settings page with secure password change form, API endpoint with current password verification, proper form validation, integrated into admin panel navigation
- June 30, 2025. Completed file upload system for article images - fully functional multer-based API endpoint with admin authentication, ArticleEditor with tabbed interface for URL/file upload, 5MB size limit, image-only validation, files stored in uploads/images with static serving, fixed form validation for uploaded image paths
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