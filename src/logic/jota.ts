/**
 * The main application logic to process the bible translations.
 *
 * The format of the bible translation content is a three dimensional array,
 * consisting of books, chapters and verses. The apocrypha books are at the end.
 *
 * A passages descriptor is called a fragment and it is a four element int array containing
 * bookIndex, chapterIndex, startVerse and endVerse.
 */

// /* global bcv_parser */

import { osis as osisBooks } from './books'
// import { defaultState } from 'src/store/store-settings'
import { Parser, en, pl } from 'jota-parser'
import { TranslationMeta } from 'src/types'

const parser = new Parser({ locales: [pl, en] })

const jota = {
  bibleLoadingPromise: Promise,

  /**
   * Return fragment with a next or previous chapter adjacent to the given one
   *
   * @param {int[]} fragment [bookIndex, chapterIndex, startVerse, endVerse]
   * @param {int} direction +1 or -1
   */
  adjacentChapter(bible, fragment, direction) {
    const [bi, ci] = fragment
    return direction === -1 ?
      ci === 0 ? bi === 0 ? null : [bi - 1, bible[bi - 1].length - 1] : [bi, ci - 1] :
      ci === bible[bi].length - 1 ? bi === bible.length - 1 ? null : [bi + 1, 0] : [bi, ci + 1]
  },

  /**
   * Fetch the content of bible translation by the given language locale and translation symbol.
   *
   * @param {string} lang Language locale symbol
   * @param {string} symbol Symbol of the translation, e.g. kjv
   * @returns Promise that get resolved when the bible translation content is loaded
   */
  getBible(lang, symbol): Promise<BibleContent> {
    const filePath = `src/assets/data/${lang}/${symbol}.json`
    jota.bibleLoadingPromise = new Promise((resolve) => {
      const request = new XMLHttpRequest()
      request.onload = (event) => {
        const bible = JSON.parse(event.target.response)
        if (process.env.DEV) window.bible = bible // For easy dev tools playground
        resolve(bible)
      }
      request.open('get', filePath, true)
      request.send()
    })
    return jota.bibleLoadingPromise
  },

  /**
   * Formats a title of a chapter of a fragment to be displayed on the screen.
   *
   * @param {int[]} fragment [bookIndex, chapterIndex, startVerse, endVerse]
   * @param {string[]} bookNames The collection of book titles to use
   * @returns {string} Chapter title
   */
  chapterCaption(fragment, bookNames) {
    if (!fragment) return ''
    const [bookIndex, chapter] = fragment
    const book = bookNames[bookIndex]
    return `${book} ${chapter + 1}`
  },

  /**
   * Returns array of verses for the whole chapter containing the given fragment.
   * @param {[]} bible Three dimensional array with the content of the bible translation
   * @param {int[]} fragment [bookIndex, chapterIndex, startVerse, endVerse]
   * @returns Array of verses (strings)
   */
  chapterVerses(bible, fragment) {
    if (!fragment) return []
    const [book, chapter] = fragment
    let content = ''
    try {
      content = bible[book][chapter]
    } catch { /* May fail because the bible is no loaded yet */ }
    if (!content) return []
    return Object.values(content)
  },

  /**
   * Formats a given fragment according to the given template, both reference and the content.
   * Used in formatted search results layout and for copying to the clipboard.
   *
   * @param {[]} bible Three dimensional array with the content of the bible translation
   * @param {int[]} fragment [bookIndex, chapterIndex, startVerse, endVerse]
   * @param {string} template String template replacing the variables reference with the values from this function scope
   * @param {string[]} bookNames Collection of book names to be used
   * @param {string} separator Separator between chapter and verses
   * @param {string} translation Name of the translation
   * @returns {string} Formatted fragment
   */
  format(bible, fragment, template, bookNames, separator, translation) {
    // All the variables used in the template must declared as loca variables here
    const [bi, ci, si, ei] = fragment
    // eslint-disable-next-line no-unused-vars
    const book = bookNames[bi]
    // eslint-disable-next-line no-unused-vars
    const chapter = ci + 1
    const content = bible[bi][ci]
    if (!content) return ''

    const start = isNaN(si) ? 1 : si + 1
    const end = isNaN(ei) ? isNaN(si) ? content.length : si + 1 : ei + 1
    const verses = content.slice(start - 1, end)
    if (start === end) template = template.replace('-${end}', '')

    // eslint-disable-next-line no-unused-vars
    const verse = start
    // eslint-disable-next-line no-unused-vars
    const translationUpperCase = translation ? translation.toUpperCase() : ''
    // eslint-disable-next-line no-unused-vars
    let text, textNumbers, textNewLines, textNumbersNewLines
    const includesNumbers = template.includes('Numbers')
    const includesNewLines = template.includes('NewLines')
    const oneVerse = start === end

    if (includesNumbers && includesNewLines) {
      textNumbersNewLines = oneVerse ? verses.join(' ') : '\n' + (verses.map((v, i) => `(${start + i}) ${v}`).join('\n'))
    } else if (includesNewLines) {
      textNewLines = oneVerse ? verses.join(' ') : '\n' + verses.join('\n')
    } else if (includesNumbers) {
      textNumbers = oneVerse ? verses.join(' ') : verses.map((v, i) => `(${start + i}) ${v}`).join(' ')
    } else {
      text = verses.join(' ')
    }
    // eval is OK, cause everything happens on the client, nevertheless
    // TODO it would be better to do the replacement manually
    // eslint-disable-next-line no-eval
    return eval('`' + template + '`')
  },

  /**
   * Formats the given fragment in predefined fashion to show it one the list of found fragments.
   *
   * @param {int[]} fragment [bookIndex, chapterIndex, startVerse, endVerse]
   * @param {string[]} bookNames Collection of book names to be used
   * @param {string} separator Separator between chapter and verses
   * @returns {string} Formatted fragment reference
   */
  formatReference(fragment, bookNames, separator) {
    const [bookIndex, chapter, start, end] = fragment
    const book = bookNames[bookIndex]
    if (isNaN(start)) {
      return `${book} ${chapter + 1}`
    } else if (isNaN(end) || start === end) {
      return `${book} ${chapter + 1}${separator}${start + 1}`
    } else {
      return `${book} ${chapter + 1}${separator}${start + 1}-${end + 1}`
    }
  },

  /**
   * Formats the given fragment according to the threshold formats
   * depending on the number of verses in the fragment.
   *
   * @param {[]} thresholdFormats Array of formats coupled with the lower and upper limits of verses numbers
   *    they should be applied to
   * @param {int[]} fragment [bookIndex, chapterIndex, startVerse, endVerse]
   * @param {[]} bible Three dimensional array with the content of the bible translation
   * @param {string[]} bookNames Collection of book names to be used
   * @param {string} separator Separator between chapter and verses
   * @param {string} translation Name of the translation
   * @returns {string} Formatted fragment
   * @returns
   */
  formatThreshold(thresholdFormats, fragment, bible, bookNames, separator, translation) {
    const [bi, ci, start, end] = fragment
    const count = isNaN(start) ? bible[bi][ci].length : isNaN(end) ? 1 : end - start + 1
    const [ts1, ts2, ts3] = thresholdFormats
    let template = count < ts2.threshold ? ts1.format : count < ts3.threshold ? ts2.format : ts3.format || ts2.format
    let result
    try {
      result = jota.format(bible, fragment, template, bookNames, separator, translation)
    } catch {
      template = count < ts2.threshold ?
        defaultState.format1 : count < ts3.threshold ? defaultState.format2 : defaultState.format3
      result = jota.format(bible, fragment, template, bookNames, separator, translation)
    }
    return result
  },

  /**
   * Get the list of fragments from the osis string.
   *
   * @param {[]} bible Three dimensional array with the content of the bible translation
   * @param {string} comma separated list of fragment codes like: Deut.25.13-14
   * @param {boolean} shouldSort specifies whether the list should be sorted by indexes of the fragments
   * @returns {[]} Array of fragments (arrays including [bookIndex, chapterIndex, startVerse, endVerse])
   */
  fragments(bible, osis, shouldSort) {
    if (!osis) return []
    const fragments = []
    osis.split(',').forEach(it => {
      let [from, to] = it.split('-')
      const a = this.indexes(from)
      // Handle case of entire book, e.g, osis = "Col"
      if (isNaN(a[1])) {
        a[1] = 0
        to = to || true
      }
      if (to) {
        const b = to === true ? [a[0], bible[a[0]].length - 1] : this.indexes(to)
        // Only scopes within the same chapter are allowed
        if (a[0] !== b[0] || a[1] !== b[1]) {
          a[2] = a[2] || 0
          if (a[2] === 0) {
            a.splice(2, 1)
            fragments.push(a)
          } else {
            push(a, bible[a[0]][a[1]].length - 1)
          }
          if (a[0] < b[0]) {
            // Add the rest of chapters from the starting book
            addChapters(a[0], a[1] + 1, bible[a[0]].length)
          } else {
            // Add all the chapters in between if start end end are in the same book
            addChapters(a[0], a[1] + 1, b[1])
          }
          if (a[0] + 1 < b[0]) {
            // Add books in between, this should be forbidden probably
            for (let bi = a[0] + 1; bi < b[0]; bi++) {
              addChapters(bi, 0, bible[bi].length)
            }
          }
          if (a[0] < b[0]) {
            // Add the starting chapters from the ending book
            addChapters(b[0], 0, isNaN(b[1]) ? bible[b[0]].length : b[1])
          }
          if (!isNaN(b[1])) {
            if (isNaN(b[2]) || b[2] === bible[b[0]][b[1]].length - 1) {
              fragments.push([b[0], b[1]])
            } else {
              fragments.push([b[0], b[1], 0, b[2]])
            }
          }
        } else {
          push(a, b[2])
        }
      } else {
        push(a, a[2])
      }
    })
    return shouldSort ? jota.sortAndDeduplicate(fragments) : fragments

    function addChapters(bi, ci, len) {
      // Add the starting chapters from the ending book
      for (; ci < len; ci++) {
        fragments.push([bi, ci])
      }
    }

    function push(tokens, end) {
      tokens.push(end)
      fragments.push(tokens)
    }
  },

  /**
   * Ensure the regex flag includes "g" so that all instances of the term in the verse are highlighted
   */
  highlightRegex(regex) {
    return regex ? (regex.flags.includes('g') ? regex : new RegExp(regex.source, regex.flags + 'g')) : ''
  },

  /**
   * General search.
   * If text does not start with "/" then try to find passage references.
   * Otherwise or if passage references not found search for the text in the current bible contents.
   *
   * @param {[]} bible Three dimensional array with the content of the bible translation
   * @param {string} text Search input
   * @param {object} opotions Search options such as
   *   words - Should search for whole words or just characters chains
   *   translation - Name of the translation used for the versification system
   *   shouldSort - should the results be sorted by the indexes of book, chapter and verse
   * @param {object} progress A an object that would be updated about the progress
   * @returns {[]} Array of fragments (arrays including [bookIndex, chapterIndex, startVerse, endVerse])
   */
  search(bible, text, options, progress) {
    // If text is a regular expression
    text = text.replace(/[\u202d\u202c]/gm, '') // Those characters happened when copying from iPhone to mac, the source was https://bible.com/bible/138/2sa.24.18-24.UBG
    if (text.startsWith('/')) {
      const end = text.lastIndexOf('/')
      // If there is no regex flags add "gi" automatically
      const flags = end === text.length - 1 ? 'gi' : text.substring(end + 1, text.length)
      let regex
      let error
      try {
        regex = new RegExp(`(${text.substring(1, end)})`, flags)
      } catch (ex) {
        error = ex
      }
      if (error || !regex) {
        throw Error(`Niepoprawne wyrażenie regularne RegExp(${text.substring(1, end)}, ${flags})${error ? ', ' + error : ''}`)
      }
      return jota.searchContent(regex, bible, progress)
    }

    options.apocrypha = options.apocrypha === undefined ? bible.length > 66 : options.apocrypha

    // Otherwise try to find passage references
    // require(`../statics/bcv-parsers/${lang || 'pl'}_bcv_parser`)

    // require('../statics/bcv-parsers/full_bcv_parser')
    // const parser = new bcv_parser()
    const fragments = jota.searchReferences(text, options)
    // const fragments = jota.fragments(bible, refs, options.shouldSort)
    if (fragments.length) return fragments

    // If no fragments found in the given text then search in the bible content for full
    let regex
    if (options.words) {
      const notWord = '[^a-zA-ZąćęłńóśźżĄĘŁŃÓŚŹŻ]'
      regex = new RegExp(`(^|${notWord})(${text})($|${notWord})`, 'i')
    } else {
      regex = new RegExp(`(${text})`, 'i')
    }
    return jota.searchContent(regex, bible, progress)
  },

  /**
   * Parse the given text input to identify reference of bible passages.
   * It is basically a wrapper for a bcv parser that includes a pl and en languages.
   * It normalizes the 'us' and 'eu' chapter-verse separator to be able to work with mixed notations of references in the input text
   *
   * @param {string} input Search input
   * @param {string} parses BCV Parser instance to use
   * @param {object} object Options specifying
   *   apocrypha - should it search in apocrypha books,
   *   translation - name of the translation to use for the versification system,
   *   merge - should it combine consecutive passage references
   * @returns {string} List of passages encoded using osis standard
   */
  searchReferences(input, options) {
    // parser.include_apocrypha(!!options.apocrypha)
    // parser.set_options({
    //   punctuation_strategy: 'eu',
    //   versification_system: options.translation,
    //   consecutive_combination_strategy: JSON.parse(options.merge || false) ? 'combine' : 'separate',
    // })
    // parser.parse(input.replace(/:\s*/gm, ','))
    // return parser.osis()
    return parser.parse(input).map(v => [v[0], v[1] - 1, v[2] ? v[2] - 1 : undefined, v[3] ? v[3] - 1 : undefined])
  },

  /**
   *
   * @param {RegExp} regex Regular expression to search for
   * @param {*} bible
   * @param {*} progress
   * @returns
   */
  async searchContent(regex, bible, progress) {
    const found = []
    // const re = new RegExp(term, 'ig')
    // set timeout to give time for progress animation to paint itself
    await Promise.all(bible.map((book, bi) => new Promise(resolve => setTimeout(() => {
      book.forEach((chapter, ci) =>
        chapter.forEach((verse, vi) => {
          if (regex.test(verse)) {
            const v = vi
            const fragment = [bi, ci, vi, v]
            Object.preventExtensions(fragment)
            Object.freeze(fragment)
            found.push(fragment)
          }
        })
      )
      progress.step(bi + 1)
      resolve()
    }, 100))))
    // Store it so the UI would know which parts to highlight
    progress.regex = regex
    Object.preventExtensions(found)
    Object.freeze(found)
    return found
  },

  /**
   * Sorts in place the given list of fragments by the indexes of the books, chapters and start verses.
   * Also deduplicates them by creating and returning a new array.
   *
   * @param {[]} fragments Array of [bookIndex, chapterIndex, startVerse, endVerse]
   * @returns Sorted and deduplicated list
   */
  sortAndDeduplicate(fragments) {
    // Sort
    fragments.sort((a, b) =>
      a[0] > b[0] ? 1 : a[0] < b[0] ? -1 :
        a[1] > b[1] ? 1 : a[1] < b[1] ? -1 :
          a[2] > b[2] ? 1 : a[2] < b[2] ? -1 : 0
    )

    if (fragments.length < 2) {
      return fragments
    } else {
      // Deduplicate
      let a = fragments[0]
      const arr = [a]
      for (let i = 1; i < fragments.length; i++) {
        const b = fragments[i]
        if (!(a[0] === b[0] && a[1] === b[1] && (a[2] === b[2] || (isNaN(a[2]) && isNaN(b[2]))))) {
          arr.push(b)
        }
        a = b
      }
      return arr
    }
  },

  verses(bible, fragment) {
    const [bi, ci, si, ei] = fragment
    const content = bible[bi][ci]
    if (!content) return []

    const start = isNaN(si) ? 1 : si + 1
    const end = isNaN(ei) ? isNaN(si) ? content.length : si + 1 : ei + 1
    return content.slice(start - 1, end)
  },

  /**
   * Turns an osis code into a fragment (array of indexes).
   *
   * @param {string} osis Osis code of a passage
   * @returns {int[]} [bookIndex, chapterIndex, startVerse, endVerse]
   */
  indexes(osis) {
    const a = [...osis.matchAll(/(\w+)\.(\d+)\.?(\d+)?/g)][0] || [null, osis]
    return [osisBooks.indexOf(a[1]), a[2] - 1, a[3] - 1]
  },

  pattern2template(pattern) {
    // ${book} ${chapter}${separator}${start}-${end} "${textWithNumbers}"
    const { referencePosition, referenceNewLine, separatorChar, quotes, verseNewLine, numbers } = pattern
    const ref = `\${book} \${chapter}${separatorChar}\${start}-\${end}`
    let s = `\${text${numbers ? 'Numbers' : ''}${verseNewLine ? 'NewLines' : ''}}`
    if (quotes) s = `"${s}"`
    if (referencePosition === 'before') {
      s = `${ref}${referenceNewLine === 'new line' ? '\n' : ' '}${s}`
    } else {
      s = `${s}${referenceNewLine === 'new line' ? '\n' : ' '}${ref}`
    }
    return s
  }
}

if (process.env.DEV) window.jota = jota

export default jota
