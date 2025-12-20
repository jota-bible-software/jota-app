import { describe, expect, it } from 'vitest'
import jota from 'src/logic/jota'

const bookNames = ['Gen', 'Exo', 'Lev', 'Num']
const bible = [
  [
    ['a', 'b', 'c'],
    ['d', 'e'],
  ],
  [
    ['f'],
    ['g'],
  ]
]
const bible2 = new Array(3).fill([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
])
const bible3 = [
  [['a']], // single chapter
  [['b']], // single chapter
]

describe('Jota', () => {
  it('formats passage caption', () => {
    expect(jota.formatReference([0, 0], bookNames, ':')).toBe('Gen 1')
    expect(jota.formatReference([0, 0, 0], bookNames, ':')).toBe('Gen 1:1')
    expect(jota.formatReference([0, 0, 0], bookNames, '/')).toBe('Gen 1/1')
    expect(jota.formatReference([0, 0, 1, 2], bookNames, ':')).toBe('Gen 1:2-3')
  })

  it('get adjacent chapter', () => {
    expect(jota.adjacentChapter(bible, [0, 0], -1)).toBe(null)
    expect(jota.adjacentChapter(bible, [0, 1], -1)).toStrictEqual([0, 0])
    expect(jota.adjacentChapter(bible, [1, 0], -1)).toStrictEqual([0, 1])
    expect(jota.adjacentChapter(bible, [1, 1], -1)).toStrictEqual([1, 0])
    expect(jota.adjacentChapter(bible, [1, 1], 1)).toBe(null)
    expect(jota.adjacentChapter(bible, [1, 0], 1)).toStrictEqual([1, 1])
    expect(jota.adjacentChapter(bible, [0, 1], 1)).toStrictEqual([1, 0])
    expect(jota.adjacentChapter(bible, [0, 0], 1)).toStrictEqual([0, 1])
  })

  it('interprets osis', () => {
    // console.log(jota.fragments(bible2, 'Gen.1.2-Lev.2.2'))
    expect(jota.fragments(bible2, 'Gen.1.2-Gen.2.1')).toEqual([
      [0, 0, 1, 2],
      [0, 1, 0, 0]
    ])
    expect(jota.fragments(bible2, 'Gen.1.2-Gen.3.2')).toEqual([
      [0, 0, 1, 2],
      [0, 1],
      [0, 2, 0, 1]
    ])
    expect(jota.fragments(bible2, 'Gen.1.2-Exod.2.2')).toEqual([
      [0, 0, 1, 2],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1, 0, 1]
    ])
    expect(jota.fragments(bible2, 'Gen.1.2-Lev.2.2')).toEqual([
      [0, 0, 1, 2],
      [0, 1],
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 0],
      [2, 1, 0, 1]
    ])
    expect(jota.fragments(bible2, 'Gen.1-Gen.3')).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ])
    expect(jota.fragments(bible2, 'Gen')).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ])
    expect(jota.fragments(bible3, 'Gen.1-Exod.1')).toEqual([
      [0, 0],
      [1, 0],
    ])
  })

  it('search', async () => {
    // expect(jota.search([0, 0], bookNames, ':')).toBe('Gen 1')
    const progress = { step: () => { /* */ } }
    const options = { apocrypha: false, translation: '' }
    expect(await jota.search([[['abc de']]], 'b', options, progress)).toStrictEqual([[0, 0, 0, 0]])
  })
})

// function formatReference(indexes) {
//   return jota.formatReference(indexes, ['Gen'],':')
// }
