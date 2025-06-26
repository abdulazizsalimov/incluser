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
- June 26, 2025. Initial setup and complete implementation
  - Built full-stack accessible blog with WCAG AA compliance
  - Implemented authentication with Replit Auth
  - Created complete database schema with PostgreSQL
  - Added sample content about digital accessibility
  - Fixed all runtime errors and console warnings
  - Implemented accessibility features (skip links, ARIA labels, keyboard navigation)
  - Added accessibility widget with font size and contrast controls
  - Integrated Google Translate for multi-language support
  - Created admin panel for content management
  - Added error boundary and overlay blocking for clean UX
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```