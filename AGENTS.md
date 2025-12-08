# AGENTS.md

This document provides essential information for AI coding agents working with this codebase.

## Project Overview

**MultiTerm Astro** - A personal blog built with the MultiTerm Astro theme. This is an Astro-based static site generator that allows theming with editor color schemes (Shiki themes).

- **Framework**: Astro 5.x with TypeScript
- **Styling**: Tailwind CSS v4
- **Content**: Markdown/MDX with extensive plugin support
- **Build Output**: Static site (default)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:4321)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format
```

## Project Structure

```
src/
├── components/       # Astro components (Header, Footer, etc.)
├── content/         # Blog posts (markdown/mdx) and content collections
│   ├── posts/       # Individual blog posts
│   └── config.ts    # Content collection schemas
├── layouts/         # Page layouts
├── pages/           # Route pages (index, posts, tags, RSS, etc.)
├── plugins/         # Custom remark/rehype plugins
├── styles/          # Global CSS
├── icons/           # SVG icons
├── site.config.ts   # Main site configuration
└── utils.ts         # Utility functions
```

## Key Configuration Files

### `src/site.config.ts`
Central configuration for:
- Site metadata (title, description, author)
- Theme settings (mode, default theme, Shiki themes)
- Social links
- Navigation
- Pagination
- Giscus comments integration

### `astro.config.mjs`
Astro framework configuration:
- Markdown/MDX processing pipelines
- Remark plugins (GitHub cards, admonitions, emoji, math)
- Rehype plugins (autolink headings, external links, KaTeX)
- Integrations (sitemap, expressive-code, icon)
- Tailwind CSS via Vite

### `tsconfig.json`
TypeScript configuration with path aliases:
- `@components/*` → `src/components/*`
- `@layouts/*` → `src/layouts/*`
- `@types` → `src/types`
- `@content` → `src/content.config`
- `@utils` → `src/utils`

## Build Process

1. **Development**: `npm run dev` - Starts Astro dev server with hot reload
2. **Production Build**: 
   - `npm run build` - Builds static site to `dist/`
   - `postbuild` hook runs `pagefind` for search indexing
3. **Preview**: `npm run preview` - Serves production build locally

## Code Style

### Prettier Configuration
- **No semicolons** (`semi: false`)
- **Single quotes** (`singleQuote: true`)
- **Trailing commas** (`trailingComma: 'all'`)
- **Print width**: 90 characters
- **Indentation**: 2 spaces (no tabs)
- **Plugins**: `prettier-plugin-astro` for `.astro` files

Run `npm run format` before committing changes.

## Content Management

### Blog Posts
- Location: `src/content/posts/`
- Format: Markdown (`.md`) or MDX (`.mdx`)
- Frontmatter schema defined in `src/content.config.ts`
- Required fields: title, publishDate
- Optional fields: description, tags, draft, updatedDate

### Adding New Posts
1. Create a new `.md` or `.mdx` file in `src/content/posts/`
2. Add frontmatter with required fields
3. Write content using supported markdown extensions

### Markdown Extensions
- **Admonitions**: `:::note`, `:::warning`, `:::tip`, etc.
- **Math**: KaTeX support via `remark-math` and `rehype-katex`
- **Emoji**: Shortcodes like `:smile:` via `remark-gemoji`
- **GitHub Cards**: Custom plugin for embedding GitHub repo info
- **Code Blocks**: Expressive Code with syntax highlighting and line numbers
- **TOC**: Auto-generated table of contents for posts

## Custom Plugins

### Remark Plugins (Markdown AST)
- `remark-github-card.ts` - Embed GitHub repository cards
- `remark-admonitions.ts` - Add note/warning/tip blocks
- `remark-gemoji.ts` - Convert emoji shortcodes to Unicode

### Rehype Plugins (HTML AST)
- `rehype-pixelated.ts` - Handle pixelated image rendering

## Theming System

Three theming modes available:
1. **Single**: One theme for entire site
2. **Light-Dark-Auto**: Two themes that switch based on system preference
3. **Select**: Multiple themes with user selection dropdown

Themes use **Shiki color schemes** and CSS variables for dynamic switching.

## Testing

Currently no automated tests configured. Manual testing via:
- Development server (`npm run dev`)
- Production build preview (`npm run build && npm run preview`)

## Deployment

Configured for GitHub Pages via `.github/workflows/astro.yml`:
- Triggers on push to `main` branch
- Builds and deploys to GitHub Pages
- Uses Node.js 20

## Common Tasks

### Adding a New Social Link
Edit `src/site.config.ts` → `socialLinks` object.

### Changing Theme
Edit `src/site.config.ts` → `themes` object:
- Set `mode` (single/select/light-dark-auto)
- Configure `include` array with Shiki theme names
- Set `default` theme

### Modifying Navigation
Edit `src/site.config.ts` → `navLinks` array.

### Customizing Styling
- Global styles: `src/styles/global.css`
- Tailwind utilities: Use Tailwind v4 classes in components
- Component-specific: Add styles in component files

## Dependencies

### Key Production Dependencies
- `astro` - Core framework
- `astro-expressive-code` - Code block highlighting
- `@astrojs/mdx` - MDX support
- `@astrojs/rss` - RSS feed generation
- `@astrojs/sitemap` - Sitemap generation
- `tailwindcss` - Utility-first CSS
- `rehype-*` / `remark-*` - Markdown processing plugins
- `satori` / `satori-html` - Social card generation
- `@pagefind/default-ui` - Search functionality

### Dev Dependencies
- `prettier` + `prettier-plugin-astro` - Code formatting
- `pagefind` - Search indexing
- `typescript` - Type checking

## Architecture Decisions

1. **Static Site Generation**: Default mode for optimal performance and SEO
2. **Content Collections**: Astro's built-in content management for type-safe blog posts
3. **Plugin Pipeline**: Extensive remark/rehype plugins for rich markdown support
4. **CSS Variables**: Dynamic theming without JavaScript hydration overhead
5. **Tailwind v4**: Modern utility-first CSS with new features
6. **Path Aliases**: Cleaner imports via TypeScript path mapping
7. **Single Config File**: All user configuration in `site.config.ts` for simplicity

## Troubleshooting

### Build Failures
- Check Node.js version (requires compatible version for Astro 5.x)
- Clear `.astro` cache: `rm -rf .astro`
- Reinstall dependencies: `rm -rf node_modules package-lock.json && npm install`

### Styling Issues
- Ensure Tailwind plugin is loaded in `astro.config.mjs`
- Check for conflicting global styles
- Verify theme configuration in `site.config.ts`

### Content Not Appearing
- Verify frontmatter schema matches `src/content.config.ts`
- Check for `draft: true` in frontmatter
- Ensure proper file location in `src/content/posts/`

## Git Workflow

- Main branch: `main`
- Dependabot creates PRs for dependency updates
- GitHub Actions automatically builds and deploys on merge to `main`

## Additional Resources

- [Astro Documentation](https://docs.astro.build)
- [MultiTerm Theme Docs](https://multiterm.stelclementine.com)
- [Shiki Themes](https://expressive-code.com/guides/themes/#available-themes)
- [Tailwind CSS v4](https://tailwindcss.com/)
