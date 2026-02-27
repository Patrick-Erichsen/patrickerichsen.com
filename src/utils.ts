import { getCollection } from 'astro:content'

export function dateString(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  }).format(date)
}

export function pick(obj: Record<string, any>, keys: string[]) {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]]),
  )
}

export async function getSortedPosts() {
  const allPosts = await getCollection('posts', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })
  const sortedPosts = allPosts.sort((a, b) => {
    return a.data.published > b.data.published ? -1 : 1
  })
  return sortedPosts
}
