import type { SiteConfig } from '@types'

const config: SiteConfig = {
  site: 'https://patrickerichsen.com',
  title: 'Patrick Erichsen',
  description: 'Software engineer and occasional blogger.',
  author: 'Patrick Erichsen',
  tags: ['Software Engineer', 'Blog', 'Programming', 'Technology'],
  socialCardAvatarImage: './src/content/avatar.jpg',
  font: 'Berkeley Mono',
  pageSize: 10,
  navLinks: [
    { name: 'About', url: '/about' },
  ],
  themes: {
    mode: 'light-dark-auto',
    default: 'auto',
    include: [
      'github-light',
      'github-dark',
    ],
  },
  socialLinks: {
    github: 'https://github.com/Patrick-Erichsen',
    twitter: 'https://x.com/pat_erichsen',
    mastodon: undefined,
    email: undefined,
    linkedin: undefined,
    bluesky: undefined,
    rss: false,
  },
  giscus: undefined,
}

export default config
