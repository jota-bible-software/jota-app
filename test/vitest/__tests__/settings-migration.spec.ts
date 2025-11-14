import { migrateV2ToV3, migrateV3ToV4, migrateV6ToV7, migrateV9ToV10 } from 'src/stores/settings-migration'
import { FormatTemplateData, SettingsPersist, SettingsPersistV2 } from 'src/types'
import { LOCAL_STORAGE_KEY } from 'src/util'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

describe('settings-migration', () => {
  describe('migrateV2ToV3', () => {
    it('should correctly migrate settings from v2 to v3', () => {
      // Sample version 2 settings
      const v2Settings: SettingsPersistV2 = {
        'version': '2',
        'appearance': {
          'locale': 'pl-PL',
          'fontSize': 16,
          'screenMode': 'dark',
          'primaryColor': ''
        },
        'localized': {
          'en-US': {
            'appBookNaming': 'Standard',
            'bookNamings': [
              {
                'locale': 'en-US',
                'name': 'OSIS abbreviations',
                'books': [
                  'Gen',
                  'Exod'
                  // more books here
                ]
              }
              // more namings here
            ],
            'copyTemplates': [
              {
                'name': 'Presentation',
                'formatTemplate': 'English presentation',
                'bookNaming': 'Standard'
              }
              // more templates here
            ],
            'defaultCopyTemplate': 'Presentation',
            'selectedTranslations': [
              'AVD'
            ],
            'defaultTranslation': 'AVD'
          },
          'pl-PL': {
            'appBookNaming': 'Standard',
            'bookNamings': [],
            'copyTemplates': [],
            'defaultCopyTemplate': '',
            'selectedTranslations': [],
            'defaultTranslation': ''
          }
          // more localized data here
        },
        'formatTemplates': [
          {
            'name': 'App format',
            'referencePosition': 'before',
            'referenceLine': 'same line',
            'translationAbbreviation': 'none',
            'numbers': false,
            'verseNewLine': false,
            'referenceWithoutContent': false,
            'separatorChar': ':',
            'rangeChar': '-',
            'referenceCharsBefore': '',
            'referenceCharsAfter': '',
            'quoteCharsBefore': '',
            'quoteCharsAfter': '',
            'verseNumberCharsBefore': '',
            'verseNumberCharsAfter': '',
            'translationAbbreviationCharsBefore': '',
            'translationAbbreviationCharsAfter': ''
          }
          // more templates here
        ],
        'appFormatTemplateName': 'App format',
        'defaultCopyTemplate': 'Studium',
        'defaultSearchResultLayout': 'split',
        'referencePickerOnStart': true
      }

      // Migrate settings
      const v3Settings = migrateV2ToV3(v2Settings)

      // Assert basic structure
      expect(v3Settings.version).toBe('3')

      // Verify app settings
      expect(v3Settings.app).toBeDefined()
      expect(v3Settings.app.defaultLocale).toBe('pl-PL')
      expect(v3Settings.app.fontSize).toBe(16)
      expect(v3Settings.app.screenMode).toBe('dark')
      expect(v3Settings.app.appFormatTemplateName).toBe('App format')
      expect(v3Settings.app.defaultSearchResultLayout).toBe('split')
      expect(v3Settings.app.referencePickerOnStart).toBe(true)

      // Verify locales
      expect(v3Settings.locales).toEqual(['en-US', 'pl-PL'])

      // Verify locale data for ar-SA
      const enData = v3Settings.localeData['en-US']
      expect(enData).toBeDefined()

      // Verify naming data
      expect(enData.naming.default).toBe('Standard')
      expect(enData.naming.available).toHaveLength(1)
      expect(enData.naming.available[0].name).toBe('OSIS abbreviations')
      expect(enData.naming.available[0].locale).toBe('en-US')
      expect(enData.naming.available[0].books).toEqual(['Gen', 'Exod'])
      expect(enData.naming.available[0].booksText).toBe('Gen, Exod')

      // Verify translations data
      expect(enData.translations.available).toEqual(['AVD'])
      expect(enData.translations.selected).toEqual(['AVD'])
      expect(enData.translations.default).toBe('AVD')

      // Verify copy templates
      expect(enData.copyTemplates).toHaveLength(1)
      expect(enData.copyTemplates[0].name).toBe('Presentation')
      expect(enData.copyTemplates[0].formatTemplate).toBe('English presentation')
      expect(enData.copyTemplates[0].bookNaming).toBe('Standard')
      expect(enData.defaultCopyTemplate).toBe('Presentation')

      // Verify format templates
      expect(v3Settings.formatTemplates).toHaveLength(1)
      expect(v3Settings.formatTemplates[0].name).toBe('App format')
      expect(v3Settings.formatTemplates[0].referencePosition).toBe('before')
      expect(v3Settings.formatTemplates[0].referenceLine).toBe('same line')
      expect(v3Settings.formatTemplates[0].referenceWithoutContent).toBe(false)
    })

    it('should handle missing or partial v2 settings gracefully', () => {
      // Partial v2 settings with minimal data
      const partialV2Settings = {
        'version': '2',
        'localized': {}
      }

      // Migrate settings
      const v3Settings = migrateV2ToV3(partialV2Settings as SettingsPersistV2)

      // Assert basic structure
      expect(v3Settings.version).toBe('3')

      // Verify app settings with defaults
      expect(v3Settings.app).toBeDefined()
      expect(v3Settings.app.defaultLocale).toBe('en-US')
      expect(v3Settings.app.fontSize).toBe(16)
      expect(v3Settings.app.screenMode).toBe('dark')
      expect(v3Settings.app.appFormatTemplateName).toBe('App format')
      expect(v3Settings.app.defaultSearchResultLayout).toBe('split')
      expect(v3Settings.app.referencePickerOnStart).toBe(true)

      // Verify empty locales
      expect(v3Settings.locales).toEqual([])

      // Verify format templates is an empty array
      expect(v3Settings.formatTemplates).toEqual([])
    })
  })

  // Duplicate test block removed: it contained an unused sample settings object

  describe('migrateV3ToV4', () => {
    it('should migrate editionAbbreviation properties to translationAbbreviation', () => {
      // Sample v3 settings with old editionAbbreviation properties
      const v3Settings: SettingsPersist = {
        version: '3',
        app: {
          defaultLocale: 'en-US',
          fontSize: 16,
          screenMode: 'dark',
          appFormatTemplateName: 'Test format',
          defaultSearchResultLayout: 'split',
          referencePickerOnStart: true,
          inlineVerseNumbers: false,
          superscriptVerseNumbers: false,
          underlineVerseHighlight: false,
          continuousVerses: false,
        },
        locales: ['en-US'],
        localeData: {
          'en-US': {
            naming: { available: [], default: '' },
            translations: { available: [], selected: [], default: '' },
            copyTemplates: [],
            defaultCopyTemplate: ''
          }
        },
        formatTemplates: [
          {
            name: 'Test format',
            referencePosition: 'before',
            referenceLine: 'same line',
            translationAbbreviation: 'uppercase',
            numbers: true,
            verseNewLine: false,
            referenceWithoutContent: false,
            separatorChar: ':',
            rangeChar: '-',
            referenceCharsBefore: '',
            referenceCharsAfter: '',
            quoteCharsBefore: '',
            quoteCharsAfter: '',
            verseNumberCharsBefore: '(',
            verseNumberCharsAfter: ')',
            translationAbbreviationCharsBefore: '[',
            translationAbbreviationCharsAfter: ']',
            // Add old properties that should be migrated
            editionAbbreviationCharsBefore: '<<',
            editionAbbreviationCharsAfter: '>>'
          } as FormatTemplateData & {
            editionAbbreviationCharsBefore: string
            editionAbbreviationCharsAfter: string
          }
        ]
      }

      // Migrate
      migrateV3ToV4(v3Settings)

      // Verify migration
      const template = v3Settings.formatTemplates[0]
      const templateWithOldProps = template as FormatTemplateData & {
        editionAbbreviationCharsBefore?: string
        editionAbbreviationCharsAfter?: string
      }

      // Check that new properties have the migrated values
      expect(template.translationAbbreviationCharsBefore).toBe('<<')
      expect(template.translationAbbreviationCharsAfter).toBe('>>')

      // Check that old properties are removed
      expect('editionAbbreviationCharsBefore' in templateWithOldProps).toBe(false)
      expect('editionAbbreviationCharsAfter' in templateWithOldProps).toBe(false)
    })

    it('should handle templates without old editionAbbreviation properties', () => {
      // Sample v3 settings without old properties
      const v3Settings: SettingsPersist = {
        version: '3',
        app: {
          defaultLocale: 'en-US',
          fontSize: 16,
          screenMode: 'dark',
          appFormatTemplateName: 'Test format',
          defaultSearchResultLayout: 'split',
          referencePickerOnStart: true,
          inlineVerseNumbers: false,
          superscriptVerseNumbers: false,
          underlineVerseHighlight: false,
          continuousVerses: false,
        },
        locales: ['en-US'],
        localeData: {
          'en-US': {
            naming: { available: [], default: '' },
            translations: { available: [], selected: [], default: '' },
            copyTemplates: [],
            defaultCopyTemplate: ''
          }
        },
        formatTemplates: [
          {
            name: 'Test format',
            referencePosition: 'before',
            referenceLine: 'same line',
            translationAbbreviation: 'uppercase',
            numbers: true,
            verseNewLine: false,
            referenceWithoutContent: false,
            separatorChar: ':',
            rangeChar: '-',
            referenceCharsBefore: '',
            referenceCharsAfter: '',
            quoteCharsBefore: '',
            quoteCharsAfter: '',
            verseNumberCharsBefore: '(',
            verseNumberCharsAfter: ')',
            translationAbbreviationCharsBefore: '[',
            translationAbbreviationCharsAfter: ']'
          }
        ]
      }

      // Store original values
      const originalCharsBefore = v3Settings.formatTemplates[0].translationAbbreviationCharsBefore
      const originalCharsAfter = v3Settings.formatTemplates[0].translationAbbreviationCharsAfter

      // Migrate
      migrateV3ToV4(v3Settings)

      // Verify that existing values are preserved
      expect(v3Settings.formatTemplates[0].translationAbbreviationCharsBefore).toBe(originalCharsBefore)
      expect(v3Settings.formatTemplates[0].translationAbbreviationCharsAfter).toBe(originalCharsAfter)
    })

    it('should handle settings without formatTemplates', () => {
      // Sample v3 settings without formatTemplates
      const v3Settings: SettingsPersist = {
        version: '3',
        app: {
          defaultLocale: 'en-US',
          fontSize: 16,
          screenMode: 'dark',
          appFormatTemplateName: 'Test format',
          defaultSearchResultLayout: 'split',
          referencePickerOnStart: true,
          inlineVerseNumbers: false,
          superscriptVerseNumbers: false,
          underlineVerseHighlight: false,
          continuousVerses: false,
        },
        locales: ['en-US'],
        localeData: {
          'en-US': {
            naming: { available: [], default: '' },
            translations: { available: [], selected: [], default: '' },
            copyTemplates: [],
            defaultCopyTemplate: ''
          }
        },
        formatTemplates: []
      }

      // Should not throw an error
      expect(() => migrateV3ToV4(v3Settings)).not.toThrow()
    })
  })

  describe('migrateV6ToV7', () => {
    it('should enable highlights for default translations only', () => {
      // Sample v6 settings with multiple locales
      const v6Settings: SettingsPersist = {
        version: '6',
        app: {
          defaultLocale: 'en-US',
          fontSize: 16,
          screenMode: 'dark',
          appFormatTemplateName: 'App format',
          defaultSearchResultLayout: 'split',
          referencePickerOnStart: true,
          inlineVerseNumbers: false,
          superscriptVerseNumbers: false,
          underlineVerseHighlight: false,
          continuousVerses: false,
          highlightingEnabled: true,
        },
        locales: ['en-US', 'pl-PL'],
        localeData: {
          'en-US': {
            naming: { available: [], default: '' },
            translations: {
              available: ['KJV', 'NIV', 'NLT'],
              selected: ['KJV', 'NIV'],
              default: 'KJV'
            },
            copyTemplates: [],
            defaultCopyTemplate: ''
          },
          'pl-PL': {
            naming: { available: [], default: '' },
            translations: {
              available: ['BT5', 'BW'],
              selected: ['BT5'],
              default: 'BT5'
            },
            copyTemplates: [],
            defaultCopyTemplate: ''
          }
        },
        formatTemplates: []
      }

      // Migrate
      migrateV6ToV7(v6Settings)

      // Verify that highlightsEnabled is initialized
      expect(v6Settings.localeData['en-US'].translations.highlightsEnabled).toBeDefined()
      expect(v6Settings.localeData['pl-PL'].translations.highlightsEnabled).toBeDefined()

      // Verify that only default translations have highlights enabled
      expect(v6Settings.localeData['en-US'].translations.highlightsEnabled!['KJV']).toBe(true)
      expect(v6Settings.localeData['en-US'].translations.highlightsEnabled!['NIV']).toBeUndefined()
      expect(v6Settings.localeData['en-US'].translations.highlightsEnabled!['NLT']).toBeUndefined()

      expect(v6Settings.localeData['pl-PL'].translations.highlightsEnabled!['BT5']).toBe(true)
      expect(v6Settings.localeData['pl-PL'].translations.highlightsEnabled!['BW']).toBeUndefined()
    })

    it('should handle locales without default translations', () => {
      const v6Settings: SettingsPersist = {
        version: '6',
        app: {
          defaultLocale: 'en-US',
          fontSize: 16,
          screenMode: 'dark',
          appFormatTemplateName: 'App format',
          defaultSearchResultLayout: 'split',
          referencePickerOnStart: true,
          inlineVerseNumbers: false,
          superscriptVerseNumbers: false,
          underlineVerseHighlight: false,
          continuousVerses: false,
          highlightingEnabled: true,
        },
        locales: ['en-US'],
        localeData: {
          'en-US': {
            naming: { available: [], default: '' },
            translations: {
              available: ['KJV', 'NIV'],
              selected: ['KJV'],
              default: '' // No default set
            },
            copyTemplates: [],
            defaultCopyTemplate: ''
          }
        },
        formatTemplates: []
      }

      // Migrate
      migrateV6ToV7(v6Settings)

      // Verify that highlightsEnabled is initialized but empty
      expect(v6Settings.localeData['en-US'].translations.highlightsEnabled).toBeDefined()
      expect(Object.keys(v6Settings.localeData['en-US'].translations.highlightsEnabled!)).toHaveLength(0)
    })

    it('should not throw error for missing localeData', () => {
      const v6Settings: SettingsPersist = {
        version: '6',
        app: {
          defaultLocale: 'en-US',
          fontSize: 16,
          screenMode: 'dark',
          appFormatTemplateName: 'App format',
          defaultSearchResultLayout: 'split',
          referencePickerOnStart: true,
          inlineVerseNumbers: false,
          superscriptVerseNumbers: false,
          underlineVerseHighlight: false,
          continuousVerses: false,
          highlightingEnabled: true,
        },
        locales: [],
        localeData: {} as Record<string, never>,
        formatTemplates: []
      }

      // Should not throw an error
      expect(() => migrateV6ToV7(v6Settings)).not.toThrow()
    })
  })

  describe('migrateV9ToV10', () => {
    const highlightsKey = LOCAL_STORAGE_KEY + '.highlights'

    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear()
    })

    afterEach(() => {
      // Clean up after each test
      localStorage.clear()
    })

    it('should remove created and modified fields from highlights', () => {
      // Setup: Store highlights with created and modified fields
      const oldHighlights = {
        byTranslation: {
          'en-US:KJV': [
            {
              passage: [0, 0, 1, 3],
              highlightColorId: 'hl-yellow',
              created: 1234567890,
              modified: 1234567890
            },
            {
              passage: [0, 0, 5, 7],
              highlightColorId: 'hl-green',
              created: 1234567891,
              modified: 1234567892
            }
          ],
          'pl-PL:BT5': [
            {
              passage: [1, 1, 1, 1],
              highlightColorId: 'hl-blue',
              created: 1234567893,
              modified: 1234567894
            }
          ]
        },
        config: {
          colors: [
            { id: 'hl-yellow', name: 'Yellow', hex: '#ffeb3b', order: 0 }
          ],
          active: 'hl-yellow'
        }
      }

      localStorage.setItem(highlightsKey, JSON.stringify(oldHighlights))

      // Migrate
      migrateV9ToV10()

      // Verify
      const migratedData = localStorage.getItem(highlightsKey)
      expect(migratedData).toBeTruthy()

      const migratedHighlights = JSON.parse(migratedData!)

      // Check that created and modified fields are removed
      expect(migratedHighlights.byTranslation['en-US:KJV']).toHaveLength(2)
      expect(migratedHighlights.byTranslation['en-US:KJV'][0]).toEqual({
        passage: [0, 0, 1, 3],
        highlightColorId: 'hl-yellow'
      })
      expect(migratedHighlights.byTranslation['en-US:KJV'][1]).toEqual({
        passage: [0, 0, 5, 7],
        highlightColorId: 'hl-green'
      })
      expect(migratedHighlights.byTranslation['pl-PL:BT5']).toHaveLength(1)
      expect(migratedHighlights.byTranslation['pl-PL:BT5'][0]).toEqual({
        passage: [1, 1, 1, 1],
        highlightColorId: 'hl-blue'
      })

      // Ensure config is preserved
      expect(migratedHighlights.config).toEqual(oldHighlights.config)
    })

    it('should handle highlights without created and modified fields', () => {
      // Setup: Store highlights already in new format
      const newHighlights = {
        byTranslation: {
          'en-US:KJV': [
            {
              passage: [0, 0, 1, 3],
              highlightColorId: 'hl-yellow'
            }
          ]
        },
        config: {
          colors: [
            { id: 'hl-yellow', name: 'Yellow', hex: '#ffeb3b', order: 0 }
          ],
          active: 'hl-yellow'
        }
      }

      localStorage.setItem(highlightsKey, JSON.stringify(newHighlights))

      // Migrate
      migrateV9ToV10()

      // Verify - data should remain unchanged
      const migratedData = localStorage.getItem(highlightsKey)
      expect(JSON.parse(migratedData!)).toEqual(newHighlights)
    })

    it('should handle missing highlights data', () => {
      // No highlights in localStorage
      // Should not throw an error
      expect(() => migrateV9ToV10()).not.toThrow()
    })

    it('should handle corrupted highlights data gracefully', () => {
      // Setup: Store invalid JSON
      localStorage.setItem(highlightsKey, 'invalid json')

      // Should not throw an error
      expect(() => migrateV9ToV10()).not.toThrow()
    })

    it('should handle highlights in legacy format', () => {
      // Setup: Store highlights in old legacy format (pre-v8)
      const legacyHighlights = {
        translation: { locale: 'en-US', symbol: 'KJV' },
        passageHighlights: [
          {
            passage: [0, 0, 1, 3],
            highlightColorId: 'hl-yellow',
            created: 1234567890,
            modified: 1234567890
          }
        ],
        config: {
          colors: [
            { id: 'hl-yellow', name: 'Yellow', hex: '#ffeb3b', order: 0 }
          ],
          active: 'hl-yellow'
        }
      }

      localStorage.setItem(highlightsKey, JSON.stringify(legacyHighlights))

      // Should not throw an error and should not modify legacy format
      // (legacy format should be migrated by earlier migrations first)
      expect(() => migrateV9ToV10()).not.toThrow()

      const data = localStorage.getItem(highlightsKey)
      const parsedData = JSON.parse(data!)
      // Should remain unchanged since it's not in the expected format
      expect(parsedData).toEqual(legacyHighlights)
    })
  })
})
