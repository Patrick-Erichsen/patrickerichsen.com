# AGENTS.md

This file tracks significant changes and updates made to the patrickerichsen.com repository through agent-assisted development sessions and automated dependency updates.

## 2025-11-19 - Astro Security and Feature Updates (PR #11)

### Summary
Updated Astro from version 5.11.1 to 5.15.9, incorporating several critical security fixes and feature improvements.

### Key Changes

#### Security Improvements
- **Server Islands Security**: Enhanced encryption for Server Islands slots to prevent injection attacks and improve content integrity
- **Middleware Path Normalization**: Fixed URL-encoded path handling (e.g., `/%61dmin` now properly decodes to `/admin`) to prevent middleware bypass
- **Data URI Authorization**: Data URIs for remote images now require explicit authorization in `astro.config.mjs`:
  ```js
  images: {
    remotePatterns: [
      { protocol: 'data' }
    ]
  }
  ```
- **Wildcard Hostname Matching**: Corrected pattern matching to properly reject single-part hostnames (e.g., `localhost`) from matching wildcard patterns like `*.example.com`
- **Invalid Encrypted Props Handling**: Added proper error handling for invalid encrypted props and slots in server islands

#### Bug Fixes
- Fixed `passthroughImageService` to prevent unwanted WebP generation

#### Features
- Improved experimental Fonts API build logging to display the number of downloaded files, helping identify configuration issues

### Version History
- 5.15.9 (current)
- 5.15.8 - Server Islands slot encryption improvements
- 5.15.7 - Middleware pathname normalization
- Previous: 5.11.1

### Dependencies Updated
- `@astrojs/internal-helpers@0.7.5`
- `@astrojs/markdown-remark@6.3.9`

### Related
- PR: [#11](https://github.com/Patrick-Erichsen/patrickerichsen.com/pull/11)
- Type: Security update (Dependabot)
- Status: Open

---

## Repository Information

**Tech Stack:**
- Astro 5.x (Static Site Generator)
- TypeScript
- Tailwind CSS 4.x
- MDX for content
- Pagefind for search
- Expressive Code for syntax highlighting

**Key Features:**
- Personal blog with markdown/MDX support
- RSS feed generation
- Social card generation (OG images)
- Dark/light/auto theme support
- GitHub activity calendar integration
- Giscus comments integration
- Tag-based navigation
- Full-text search

**Build Process:**
- Astro build + Pagefind post-build indexing
- GitHub Actions deployment workflow
- Automated dependency updates via Dependabot

---

## Agent Session Guidelines

When updating this file:
1. Focus on significant changes (features, security updates, major refactors)
2. Include version numbers and PR references
3. Highlight breaking changes or configuration requirements
4. Keep entries concise and scannable
5. Maintain chronological order (newest first)
