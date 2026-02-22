/// <reference types="jest" />
import {
  truncateText,
  getTodayFormatDate,
  getLastWeekFormatDate,
  isNotEmpty,
  isEmpty,
} from './utils'
import dayjs from 'dayjs'

describe('Utility Functions', () => {
  // ============================================
  // Set 1.1: truncateText() function
  // ============================================
  describe('truncateText', () => {
    it('truncates text longer than maxLength', () => {
      const longText = 'This is a very long text that should be truncated'
      const maxLength = 20
      const result = truncateText(longText, maxLength)
      
      expect(result).toBe('This is a very long ...')
      expect(result.length).toBe(maxLength + 3) // maxLength + '...'
    })

    it('returns original text if shorter than maxLength', () => {
      const shortText = 'Short text'
      const maxLength = 20
      const result = truncateText(shortText, maxLength)
      
      expect(result).toBe(shortText)
    })

    it('returns original text if equal to maxLength', () => {
      const text = 'Exactly twenty chars' // Exactly 20 characters
      const maxLength = 20
      const result = truncateText(text, maxLength)
      
      expect(result).toBe(text)
      expect(result).not.toContain('...')
    })

    it('handles empty string', () => {
      const result = truncateText('', 10)
      
      expect(result).toBe('')
    })

    it('handles null', () => {
      const result = truncateText(null as any, 10)
      
      expect(result).toBe('')
    })

    it('handles undefined', () => {
      const result = truncateText(undefined as any, 10)
      
      expect(result).toBe('')
    })

    it('truncates to exact maxLength when text is one character longer', () => {
      const text = '1234567890' // 10 chars
      const maxLength = 9
      const result = truncateText(text, maxLength)
      
      expect(result).toBe('123456789...')
      expect(result.length).toBe(12) // 9 + '...'
    })

    it('handles very long maxLength', () => {
      const text = 'Short'
      const maxLength = 1000
      const result = truncateText(text, maxLength)
      
      expect(result).toBe(text)
    })

    it('handles zero maxLength', () => {
      const text = 'Test'
      const result = truncateText(text, 0)
      
      expect(result).toBe('...')
    })
  })

  // ============================================
  // Set 1.2: getTodayFormatDate() function
  // ============================================
  describe('getTodayFormatDate', () => {
    it('returns today\'s date in correct format (YYYY-MM-DD)', () => {
      const result = getTodayFormatDate()
      
      // Should match YYYY-MM-DD format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('returns string type', () => {
      const result = getTodayFormatDate()
      
      expect(typeof result).toBe('string')
    })

    it('format is consistent', () => {
      const result1 = getTodayFormatDate()
      const result2 = getTodayFormatDate()
      
      // Should be the same format (same day)
      expect(result1).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(result2).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('returns today\'s actual date', () => {
      const result = getTodayFormatDate()
      const today = dayjs().format('YYYY-MM-DD')
      
      expect(result).toBe(today)
    })

    it('has correct date parts (year-month-day)', () => {
      const result = getTodayFormatDate()
      const parts = result.split('-')
      
      expect(parts.length).toBe(3)
      expect(parts[0].length).toBe(4) // Year
      expect(parts[1].length).toBe(2) // Month
      expect(parts[2].length).toBe(2) // Day
      
      // Validate numeric parts
      expect(Number(parts[0])).toBeGreaterThanOrEqual(2020) // Reasonable year
      expect(Number(parts[1])).toBeGreaterThanOrEqual(1)
      expect(Number(parts[1])).toBeLessThanOrEqual(12)
      expect(Number(parts[2])).toBeGreaterThanOrEqual(1)
      expect(Number(parts[2])).toBeLessThanOrEqual(31)
    })
  })

  // ============================================
  // Set 1.3: getLastWeekFormatDate() function
  // ============================================
  describe('getLastWeekFormatDate', () => {
    it('returns date 7 days ago', () => {
      const result = getLastWeekFormatDate()
      const expected = dayjs().subtract(7, 'day').format('YYYY-MM-DD')
      
      expect(result).toBe(expected)
    })

    it('returns correct format (YYYY-MM-DD)', () => {
      const result = getLastWeekFormatDate()
      
      // Should match YYYY-MM-DD format
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('calculates correctly (exactly 7 days difference)', () => {
      const today = dayjs()
      const lastWeek = dayjs(getLastWeekFormatDate())
      const diffInDays = today.diff(lastWeek, 'day')
      
      expect(diffInDays).toBe(7)
    })

    it('returns string type', () => {
      const result = getLastWeekFormatDate()
      
      expect(typeof result).toBe('string')
    })

    it('is different from today\'s date', () => {
      const today = getTodayFormatDate()
      const lastWeek = getLastWeekFormatDate()
      
      expect(lastWeek).not.toBe(today)
    })

    it('has correct date parts (year-month-day)', () => {
      const result = getLastWeekFormatDate()
      const parts = result.split('-')
      
      expect(parts.length).toBe(3)
      expect(parts[0].length).toBe(4) // Year
      expect(parts[1].length).toBe(2) // Month
      expect(parts[2].length).toBe(2) // Day
      
      // Validate numeric parts
      expect(Number(parts[0])).toBeGreaterThanOrEqual(2020) // Reasonable year
      expect(Number(parts[1])).toBeGreaterThanOrEqual(1)
      expect(Number(parts[1])).toBeLessThanOrEqual(12)
      expect(Number(parts[2])).toBeGreaterThanOrEqual(1)
      expect(Number(parts[2])).toBeLessThanOrEqual(31)
    })
  })

  // ============================================
  // Bonus: isNotEmpty() function
  // ============================================
  describe('isNotEmpty', () => {
    it('returns false for null', () => {
      expect(isNotEmpty(null)).toBe(false)
    })

    it('returns false for undefined', () => {
      expect(isNotEmpty(undefined)).toBe(false)
    })

    it('returns false for empty string', () => {
      expect(isNotEmpty('')).toBe(false)
    })

    it('returns false for whitespace-only string', () => {
      expect(isNotEmpty('   ')).toBe(false)
      expect(isNotEmpty('\t\n')).toBe(false)
    })

    it('returns true for non-empty string', () => {
      expect(isNotEmpty('hello')).toBe(true)
      expect(isNotEmpty('  hello  ')).toBe(true)
    })

    it('returns false for empty array', () => {
      expect(isNotEmpty([])).toBe(false)
    })

    it('returns true for non-empty array', () => {
      expect(isNotEmpty([1, 2, 3])).toBe(true)
      expect(isNotEmpty(['a'])).toBe(true)
    })

    it('returns false for empty object', () => {
      expect(isNotEmpty({})).toBe(false)
    })

    it('returns true for non-empty object', () => {
      expect(isNotEmpty({ key: 'value' })).toBe(true)
      expect(isNotEmpty({ a: 1, b: 2 })).toBe(true)
    })

    it('returns true for numbers', () => {
      expect(isNotEmpty(0)).toBe(true)
      expect(isNotEmpty(1)).toBe(true)
      expect(isNotEmpty(-1)).toBe(true)
    })

    it('returns true for boolean values', () => {
      expect(isNotEmpty(true)).toBe(true)
      expect(isNotEmpty(false)).toBe(true)
    })
  })

  // ============================================
  // Bonus: isEmpty() function
  // ============================================
  describe('isEmpty', () => {
    it('returns true for null', () => {
      expect(isEmpty(null)).toBe(true)
    })

    it('returns true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true)
    })

    it('returns true for empty string', () => {
      expect(isEmpty('')).toBe(true)
    })

    it('returns true for whitespace-only string', () => {
      expect(isEmpty('   ')).toBe(true)
      expect(isEmpty('\t\n')).toBe(true)
    })

    it('returns false for non-empty string', () => {
      expect(isEmpty('hello')).toBe(false)
      expect(isEmpty('  hello  ')).toBe(false)
    })

    it('returns true for empty array', () => {
      expect(isEmpty([])).toBe(true)
    })

    it('returns false for non-empty array', () => {
      expect(isEmpty([1, 2, 3])).toBe(false)
      expect(isEmpty(['a'])).toBe(false)
    })

    it('returns true for empty object', () => {
      expect(isEmpty({})).toBe(true)
    })

    it('returns false for non-empty object', () => {
      expect(isEmpty({ key: 'value' })).toBe(false)
      expect(isEmpty({ a: 1, b: 2 })).toBe(false)
    })

    it('is the inverse of isNotEmpty', () => {
      const testValues = [
        null,
        undefined,
        '',
        '   ',
        'hello',
        [],
        [1, 2, 3],
        {},
        { key: 'value' },
        0,
        1,
        true,
        false,
      ]

      testValues.forEach((value) => {
        expect(isEmpty(value)).toBe(!isNotEmpty(value))
      })
    })
  })
})
