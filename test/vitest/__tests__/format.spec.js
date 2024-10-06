import { describe, expect, it } from 'vitest'
import jota from 'src/logic/jota'

const format = jota.format
const bible = [
  [
    ['a', 'b', 'c']
  ]
]
const bookNames = ['Gen']
const separator = ':'

describe('Jota', () => {
  it('formats with verse numbers', () => {
    const template = '${book} ${chapter} "${textNumbers}"'
    expect(format(bible, [0, 0], template, bookNames)).toBe('Gen 1 "(1) a (2) b (3) c"')
    expect(format(bible, [0, 0, 0], template, bookNames)).toBe('Gen 1 "a"')
    expect(format(bible, [0, 0, 0, 1], template, bookNames)).toBe('Gen 1 "(1) a (2) b"')
    expect(format(bible, [0, 0, 1, 2], template, bookNames)).toBe('Gen 1 "(2) b (3) c"')
  })

  it('formats with verse numbers and new lines', () => {
    const template = '${book} ${chapter}${separator}${start}-${end} "${textNumbersNewLines}"'
    expect(format(bible, [0, 0, 1, 2], template, bookNames, separator)).toBe('Gen 1:2-3 "\n(2) b\n(3) c"')
  })

  it('formats verse ranges', () => {
    const template = '${book} ${chapter}${separator}${start}-${end} "${text}"'
    expect(format(bible, [0, 0], template, bookNames, separator)).toBe('Gen 1:1-3 "a b c"')
    expect(format(bible, [0, 0, 0], template, bookNames, separator)).toBe('Gen 1:1 "a"')
    expect(format(bible, [0, 0, 0, 1], template, bookNames, separator)).toBe('Gen 1:1-2 "a b"')
  })

  it('formats single verse', () => {
    const template = '${book} ${chapter}${separator}${verse} "${text}"'
    expect(format(bible, [0, 0, 0], template, bookNames, separator)).toBe('Gen 1:1 "a"')
    expect(format(bible, [0, 0, 0, 1], template, bookNames, separator)).toBe('Gen 1:1 "a b"')
  })

  it('formats with edition', () => {
    const template = '"${text}" (${book} ${chapter}@${verse} ${edition})'
    expect(format(bible, [0, 0, 1, 1], template, bookNames, separator, 'bw')).toBe('"b" (Gen 1@2 bw)')
    const template2 = '"${text}" (${book} ${chapter}@${verse} ${editionUpperCase})'
    expect(format(bible, [0, 0, 1, 1], template2, bookNames, separator, 'bw')).toBe('"b" (Gen 1@2 BW)')
  })
})
