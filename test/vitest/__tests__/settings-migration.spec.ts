import { migrateV2ToV3 } from 'src/stores/settings-migration'
import { SettingsPersist, SettingsPersistV2 } from 'src/types'
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
            "selectedEditions": [
              "AVD"
            ],
            "defaultEdition": "AVD"
          },
          "pl-PL": {
            "appBookNaming": "Standard",
            "bookNamings": [],
            "copyTemplates": [],
            "defaultCopyTemplate": "",
            "selectedEditions": [],
            "defaultEdition": ""
          }
          // more localized data here
        },
        "formatTemplates": [
          {
            "name": "App format",
            "referencePosition": "before",
            "referenceLine": "same line",
            "editionAbbreviation": "none",
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
            "editionAbbreviationCharsBefore": "",
            "editionAbbreviationCharsAfter": ""
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

      // Verify editions data
      expect(enData.editions.available).toEqual(["AVD"])
      expect(enData.editions.selected).toEqual(["AVD"])
      expect(enData.editions.default).toBe("AVD")

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
            "editions": {
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
            "editions": {
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
            "editionAbbreviation": "none",
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
            "editionAbbreviationCharsBefore": "",
            "editionAbbreviationCharsAfter": ""
          },
          {
            "name": "Studium",
            "referencePosition": "before",
            "referenceLine": "new line",
            "editionAbbreviation": "uppercase",
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
            "editionAbbreviationCharsBefore": "",
            "editionAbbreviationCharsAfter": ""
          }
        ]
      }
    })
  })
})
