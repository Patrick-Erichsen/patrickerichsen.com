import type { MarkdownHeading } from 'astro'
import type { BundledShikiTheme } from 'astro-expressive-code'

export interface FrontmatterImage {
  alt: string
  src: {
    height: number
    src: string
    width: number
    format: 'avif' | 'png' | 'webp' | 'jpeg' | 'jpg' | 'svg' | 'tiff' | 'gif'
  }
}

export type NavLink = {
  name: string
  url: string
  external?: boolean
}

export interface ThemesConfig {
  default: BundledShikiTheme | 'auto'
  mode: 'single' | 'light-dark-auto' | 'select'
  include: BundledShikiTheme[]
}

export type SocialLinks = {
  github?: string
  twitter?: string
  mastodon?: string
  bluesky?: string
  linkedin?: string
  email?: string
  rss?: boolean
}

export type GiscusConfig = {
  repo: string
  repoId: string
  category: string
  categoryId: string
  reactionsEnabled: boolean
}

export interface SiteConfig {
  site: string
  font: string
  title: string
  description: string
  author: string
  socialCardAvatarImage: string
  tags: string[]
  pageSize: number
  themes: ThemesConfig
  socialLinks: SocialLinks
  navLinks: NavLink[]
  giscus: GiscusConfig | undefined
}
