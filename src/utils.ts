import { getCollection } from 'astro:content'

export function dateString(date: Date) {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear().toString().slice(-2)
  return `${month}/${day}/${year}`
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
