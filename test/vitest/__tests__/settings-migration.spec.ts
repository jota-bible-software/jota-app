import { migrateV2ToV3, migrateV3ToV4, migrateSettings, validatePostMigration } from 'src/stores/settings-migration'
import { FormatTemplateData, SettingsPersist, SettingsPersistV2 } from 'src/types'
import { describe, expect, it } from 'vitest'

describe('settings-migration', () => {
  describe('migrateV2ToV3', () => {
    it('should correctly migrate settings from v2 to v3', () => {
      // Sample version 2 settings
      const v2Settings: SettingsPersistV2 = {
        "version": "2",
        "appearance": {
          "locale": "pl-PL",
          "fontSize": 16,
          "screenMode": "dark",
          "primaryColor": ""
        },
        "localized": {
          "en-US": {
            "appBookNaming": "Standard",
            "bookNamings": [
              {
                "locale": "en-US",
                "name": "OSIS abbreviations",
                "books": [
                  "Gen",
                  "Exod"
                  // more books here
                ]
              }
              // more namings here
            ],
            "copyTemplates": [
              {
                "name": "Presentation",
                "formatTemplate": "English presentation",
                "bookNaming": "Standard"
              }
              // more templates here
            ],
            "defaultCopyTemplate": "Presentation",
            "selectedTranslations": [
              "AVD"
            ],
            "defaultTranslation": "AVD"
          },
          "pl-PL": {
            "appBookNaming": "Standard",
            "bookNamings": [],
            "copyTemplates": [],
            "defaultCopyTemplate": "",
            "selectedTranslations": [],
            "defaultTranslation": ""
          }
          // more localized data here
        },
        "formatTemplates": [
          {
            "name": "App format",
            "referencePosition": "before",
            "referenceLine": "same line",
            "translationAbbreviation": "none",
            "numbers": false,
            "verseNewLine": false,
            "referenceWithoutContent": false,
            "separatorChar": ":",
            "rangeChar": "-",
            "referenceCharsBefore": "",
            "referenceCharsAfter": "",
            "quoteCharsBefore": "",
            "quoteCharsAfter": "",
            "verseNumberCharsBefore": "",
            "verseNumberCharsAfter": "",
            "translationAbbreviationCharsBefore": "",
            "translationAbbreviationCharsAfter": ""
          }
          // more templates here
        ],
        "appFormatTemplateName": "App format",
        "defaultCopyTemplate": "Studium",
        "defaultSearchResultLayout": "split",
        "referencePickerOnStart": true
      }

      // Migrate settings
      const v3Settings = migrateV2ToV3(v2Settings)

      // Assert basic structure
      expect(v3Settings.version).toBe("3")

      // Verify app settings
      expect(v3Settings.app).toBeDefined()
      expect(v3Settings.app.defaultLocale).toBe("pl-PL")
      expect(v3Settings.app.fontSize).toBe(16)
      expect(v3Settings.app.screenMode).toBe("dark")
      expect(v3Settings.app.appFormatTemplateName).toBe("App format")
      expect(v3Settings.app.defaultSearchResultLayout).toBe("split")
      expect(v3Settings.app.referencePickerOnStart).toBe(true)

      // Verify locales
      expect(v3Settings.locales).toEqual(["en-US", "pl-PL"])

      // Verify locale data for ar-SA
      const enData = v3Settings.localeData["en-US"]
      expect(enData).toBeDefined()

      // Verify naming data
      expect(enData.naming.default).toBe("Standard")
      expect(enData.naming.available).toHaveLength(1)
      expect(enData.naming.available[0].name).toBe("OSIS abbreviations")
      expect(enData.naming.available[0].locale).toBe("en-US")
      expect(enData.naming.available[0].books).toEqual(["Gen", "Exod"])
      expect(enData.naming.available[0].booksText).toBe("Gen, Exod")

      // Verify translations data
      expect(enData.translations.available).toEqual(["AVD"])
      expect(enData.translations.selected).toEqual(["AVD"])
      expect(enData.translations.default).toBe("AVD")

      // Verify copy templates
      expect(enData.copyTemplates).toHaveLength(1)
      expect(enData.copyTemplates[0].name).toBe("Presentation")
      expect(enData.copyTemplates[0].formatTemplate).toBe("English presentation")
      expect(enData.copyTemplates[0].bookNaming).toBe("Standard")
      expect(enData.defaultCopyTemplate).toBe("Presentation")

      // Verify format templates
      expect(v3Settings.formatTemplates).toHaveLength(1)
      expect(v3Settings.formatTemplates[0].name).toBe("App format")
      expect(v3Settings.formatTemplates[0].referencePosition).toBe("before")
      expect(v3Settings.formatTemplates[0].referenceLine).toBe("same line")
      expect(v3Settings.formatTemplates[0].referenceWithoutContent).toBe(false)
    })

    it('should handle missing or partial v2 settings gracefully', () => {
      // Partial v2 settings with minimal data
      const partialV2Settings = {
        "version": "2",
        "localized": {}
      }

      // Migrate settings
      const v3Settings = migrateV2ToV3(partialV2Settings as SettingsPersistV2)

      // Assert basic structure
      expect(v3Settings.version).toBe("3")

      // Verify app settings with defaults
      expect(v3Settings.app).toBeDefined()
      expect(v3Settings.app.defaultLocale).toBe("en-US")
      expect(v3Settings.app.fontSize).toBe(16)
      expect(v3Settings.app.screenMode).toBe("dark")
      expect(v3Settings.app.appFormatTemplateName).toBe("App format")
      expect(v3Settings.app.defaultSearchResultLayout).toBe("split")
      expect(v3Settings.app.referencePickerOnStart).toBe(true)

      // Verify empty locales
      expect(v3Settings.locales).toEqual([])

      // Verify format templates is an empty array
      expect(v3Settings.formatTemplates).toEqual([])
    })
  })

  describe('migrateV2ToV3', () => {
    it('should correctly migrate settings from v2 to v3', () => {
      // Sample version 3 settings
      const v2Settings: SettingsPersist = {
        "version": "3",
        "app": {
          "defaultLocale": "pl-PL",
          "fontSize": 16,
          "screenMode": "dark",
          "appFormatTemplateName": "App format",
          "defaultSearchResultLayout": "split",
          "referencePickerOnStart": true
        },
        "locales": [
          "en-US",
          "pl-PL"
        ],
        "localeData": {
          "en-US": {
            "naming": {
              "available": [
                {
                  "locale": "en",
                  "name": "OSIS abbreviations",
                  "books": [
                    "Gen",
                    "Exod"
                    // more books here
                  ],
                  "booksText": "Gen, Exod"
                }
              ],
              "default": "OSIS abbreviations"
            },
            "translations": {
              "available": [
                "KJV",
                "NLT"
              ],
              "selected": [
                "KJV",
                "NLT"
              ],
              "default": "KJV"
            },
            "copyTemplates": [
              {
                "name": "Presentation",
                "formatTemplate": "English presentation",
                "bookNaming": "Standard"
              }
            ],
            "defaultCopyTemplate": "Presentation"
          },
          "pl-PL": {
            "naming": {
              "available": [
                {
                  "locale": "pl",
                  "name": "BT skróty",
                  "books": [
                    "Rdz",
                    "Wj"
                    // more books here
                  ],
                  "booksText": "Rdz, Wj"
                }
              ],
              "default": "BT skróty"
            },
            "translations": {
              "available": [
                "BT5",
                "UBG"
              ],
              "selected": [
                "BT5",
                "UBG"
              ],
              "default": "UBG"
            },
            "copyTemplates": [
              {
                "name": "Studium",
                "formatTemplate": "Studium",
                "bookNaming": "BT skróty"
              }
            ],
            "defaultCopyTemplate": "Studium"
          }
        },
        "formatTemplates": [
          {
            "name": "App format",
            "referencePosition": "before",
            "referenceLine": "same line",
            "translationAbbreviation": "none",
            "numbers": false,
            "verseNewLine": false,
            "referenceWithoutContent": false,
            "separatorChar": ":",
            "rangeChar": "-",
            "referenceCharsBefore": "",
            "referenceCharsAfter": "",
            "quoteCharsBefore": "",
            "quoteCharsAfter": "",
            "verseNumberCharsBefore": "",
            "verseNumberCharsAfter": "",
            "translationAbbreviationCharsBefore": "",
            "translationAbbreviationCharsAfter": ""
          },
          {
            "name": "Studium",
            "referencePosition": "before",
            "referenceLine": "new line",
            "translationAbbreviation": "uppercase",
            "numbers": true,
            "verseNewLine": false,
            "referenceWithoutContent": false,
            "separatorChar": ":",
            "rangeChar": "-",
            "referenceCharsBefore": "– ",
            "referenceCharsAfter": "",
            "quoteCharsBefore": "",
            "quoteCharsAfter": "",
            "verseNumberCharsBefore": "(",
            "verseNumberCharsAfter": ")",
            "translationAbbreviationCharsBefore": "",
            "translationAbbreviationCharsAfter": ""
          }
        ]
      }
    })
  })

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
})
