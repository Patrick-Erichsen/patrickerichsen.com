import siteConfig from '../../site.config'
import { Resvg } from '@resvg/resvg-js'
import type { APIContext, InferGetStaticPropsType } from 'astro'
import satori, { type SatoriOptions } from 'satori'
import { html } from 'satori-html'
import { dateString, getSortedPosts } from '@utils'
import path from 'path'
import fs from 'fs'
import type { ReactNode } from 'react'

// Load Berkeley Mono OTF for social cards (satori requires TTF/OTF, not woff2)
const fontPath = path.resolve('./public/fonts/BerkeleyMono-Regular.otf')
const fontData = fs.readFileSync(fontPath)

const bg = '#FAF9F6'
const fg = '#2B2B2B'
const muted = '#5A5A5A'

const ogOptions: SatoriOptions = {
  fonts: [
    {
      data: fontData,
      name: 'Berkeley Mono',
      style: 'normal',
      weight: 400,
    },
  ],
  height: 630,
  width: 1200,
}

const markup = (title: string, pubDate: string | undefined, author: string) =>
  html(`<div tw="flex flex-col max-w-full justify-center h-full bg-[${bg}] text-[${fg}] p-16">
    <div tw="flex flex-col max-w-full justify-center items-center flex-1">
      ${pubDate ? `<p tw="text-3xl text-[${muted}]">${pubDate}</p>` : ''}
      <h1 tw="text-6xl my-8 text-center leading-snug">${title}</h1>
      ${author !== title ? `<p tw="text-3xl text-[${muted}]">${author}</p>` : ''}
    </div>
  </div>`)

type Props = InferGetStaticPropsType<typeof getStaticPaths>

export async function GET(context: APIContext) {
  const { pubDate, title, author } = context.props as Props
  const svg = await satori(markup(title, pubDate, author) as ReactNode, ogOptions)
  const png = new Resvg(svg).render().asPng()
  return new Response(png, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/png',
    },
  })
}

export async function getStaticPaths() {
  const posts = await getSortedPosts()
  return posts
    .map((post) => ({
      params: { slug: post.id },
      props: {
        pubDate: post.data.published ? dateString(post.data.published) : undefined,
        title: post.data.title,
        author: post.data.author || siteConfig.author,
      },
    }))
    .concat([
      {
        params: { slug: '__default' },
        props: { pubDate: undefined, title: siteConfig.title, author: siteConfig.author },
      },
    ])
}
