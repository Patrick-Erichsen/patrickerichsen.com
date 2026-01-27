import { describe, it, expect } from 'vitest'
import { dateString, pick } from './utils'

describe('utils', () => {
  describe('dateString', () => {
    it('formats date correctly', () => {
      const date = new Date('2026-01-27')
      const result = dateString(date)
      expect(result).toMatch(/^1\/27\/26$/)
    })

    it('handles single digit months and days', () => {
      const date = new Date('2026-03-05')
      const result = dateString(date)
      expect(result).toMatch(/^3\/5\/26$/)
    })
  })

  describe('pick', () => {
    it('picks specified keys from object', () => {
      const obj = { a: 1, b: 2, c: 3 }
      const result = pick(obj, ['a', 'c'])
      expect(result).toEqual({ a: 1, c: 3 })
    })

    it('ignores non-existent keys', () => {
      const obj = { a: 1, b: 2 }
      const result = pick(obj, ['a', 'z'])
      expect(result).toEqual({ a: 1 })
    })

    it('returns empty object when no keys match', () => {
      const obj = { a: 1, b: 2 }
      const result = pick(obj, ['x', 'y'])
      expect(result).toEqual({})
    })
  })
})
