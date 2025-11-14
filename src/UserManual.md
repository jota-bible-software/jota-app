# Verse Highlighting User Guide

## Overview

The verse highlighting feature allows you to mark and organize Bible passages with customizable colors. This helps you categorize verses for study, identify themes, mark important passages, and personalize your Bible reading experience.

## Getting Started

### Enabling Highlighting

Highlighting is enabled per translation, giving you control over which Bible versions can be highlighted:

1. Open the app settings (gear icon)
2. Go to **Translations** settings
3. Find the translation you want to highlight
4. Toggle the highlight icon (next to the translation name) to ON

Once enabled, you'll see a highlight button when you select verses in the chapter view for that translation.

**Per-Translation Control:**
- Each translation has its own highlight toggle
- You can enable highlighting for some translations and disable it for others
- A badge next to the toggle shows how many highlights exist for that translation (if any)
- Disabling highlighting hides the highlight button but preserves your existing highlights

## Highlighting Verses

### Applying a Highlight

There are two ways to highlight verses:

**Method 1: Quick Highlight (Split Button)**
1. Select one or more verses by clicking on them
2. Click the colored square button (shows the currently active color)
3. The verse(s) will be highlighted with that color

**Method 2: Choose Color (Dropdown)**
1. Select one or more verses
2. Click the dropdown arrow next to the highlight button
3. Choose a color from the palette
4. The verse(s) will be highlighted with the selected color

### Removing a Highlight

1. Select the highlighted verse(s)
2. Click the highlight button
3. The highlight will be removed

## Managing Colors

### Accessing Color Management

1. Select any verse to show the highlight button
2. Click the dropdown arrow
3. Click **Manage Colors** at the bottom of the menu
4. Or, go to Settings → **Highlights** tab

### Managing Translations for Highlighting

In the **Highlights** settings tab, you can manage which translations are enabled for highlighting:

1. Go to Settings → **Highlights**
2. In the **Translations** section at the top, you'll see:
   - A list of all translations that have highlighting enabled
   - A count badge showing how many highlights exist for each translation
   - An option to add new translations for highlighting
   - An option to remove translations from the highlighting list

**Adding a Translation:**
1. Use the dropdown selector to choose a translation
2. Click the **Add** button (+ icon)
3. The translation will be added to your highlights list

**Removing a Translation:**
1. Find the translation in the list
2. Click the **Delete** button next to it
3. Confirm the removal (this will delete all highlights for that translation)

This centralized view makes it easy to see which translations you're actively highlighting and manage them all in one place.

### Default Colors

The app comes with 8 pre-configured colors:

| Color | Name | Suggested Use |
|-------|------|---------------|
| Yellow | Study | General study notes |
| Green | Promises | God's promises |
| Blue | Commands | Commandments and instructions |
| Orange | Prayer | Prayer requests and prayers |
| Pink | Important | Key verses |
| Purple | Prophecy | Prophetic passages |
| Red | Warnings | Warnings and cautions |
| Gray | Notes | General notes |

### Adding a New Color

1. Open the Color Manager (Settings → Highlights or via dropdown)
2. Click **Add New Color**
3. Enter a name for the color (e.g., "Favorite Verses")
4. Choose a color:
   - Use the color picker palette
   - Or type a hex color code (e.g., #FF5733)
5. Preview your color in the preview box
6. Click **Save**

Your new color will appear immediately in the highlight palette.

### Editing a Color

1. Open the Color Manager
2. Click the **Edit** button (pencil icon) next to any color
3. Modify the name and/or color
4. Click **Save**

All verses highlighted with that color will update to show the new color immediately.

### Removing a Color

1. Open the Color Manager
2. Click the **Delete** button (trash icon) next to the color
3. Review the confirmation message showing how many verses use this color
4. Click **Yes** to confirm

**Important:**
- Removing a color will delete ALL highlights using that color
- This action cannot be undone
- You cannot remove the last remaining color

### Reordering Colors

The order of colors in the palette can be customized:

1. Open the Color Manager
2. Click and hold the drag handle (⋮⋮) next to any color
3. Drag the color to your desired position
4. Release to drop
5. Close the dialog

The new order will be saved automatically and appear in the highlight dropdown.

## Translation-Specific Highlighting

Highlights are **translation-specific**, meaning:

- Highlights are tied to the Bible translation you were using when you created them
- If you switch to a different translation, you won't see your highlights
- Each translation maintains its own separate set of highlights
- A warning icon appears if you have highlights for another translation

### Viewing Highlight Counts

You can see how many highlights exist for each translation:

1. Go to Settings → **Translations**
2. Look for the highlight toggle next to each translation
3. A blue badge shows the number of highlights (only appears if count > 0)
4. This helps you quickly see which translations you've been studying


### Translation Mismatch Warning

When you see the warning icon on the highlight button:

1. It means you have highlights in a different translation
2. Click the button to see which translation contains your highlights
3. You can:
   - Switch back to that translation to see your highlights
   - Start creating highlights in the current translation
   - Dismiss the warning

**Why translation-specific?**
Different translations have different verse numbering and text, so highlights from one translation may not align properly with another.

## Import & Export

### Exporting Highlights

Save your highlights to back them up or share them:

1. Go to Settings → **Highlights**
2. Click **Export**
3. A file named `jota-app-highlights.json` will be downloaded
4. Save this file in a safe location

**What's included in the export:**
- All your highlighted passages
- All your custom colors
- The translation information

### Importing Highlights

Restore or merge highlights from a backup file:

1. Go to Settings → **Highlights**
2. Click **Select File** and choose your `.json` export file
3. Click **Import**
4. A success message will confirm the import

**Import behavior:**
- Imported highlights are **merged** with existing ones (not replaced)
- If you import colors with the same ID, they'll be skipped
- New colors will be added to your palette
- Your current highlights are preserved

### Resetting to Defaults

To start fresh with the default 8 colors and remove all highlights:

1. Go to Settings → **Highlights**
2. Click **Reset to Defaults**
3. Confirm the action

**Warning:** This will:
- Remove ALL your highlights
- Remove ALL custom colors
- Restore the 8 default colors
- This action cannot be undone

## Storage Information

Storage usage information is available in the **General** settings page:

- **Total Storage Usage**: How much space the app is using (in MB and percentage)
- **Highlights Storage**: How much space your highlights take up (count and KB)

This information helps you monitor your browser's storage capacity. If you run out of storage space, you may need to:
- Remove some highlights
- Clear other app data
- Export your highlights and start fresh

## Tips & Best Practices

### Organizing Your Study

**Create a color scheme:**
- Assign specific meanings to each color
- Use consistent colors across your study
- Example: Red for warnings, Green for promises, Blue for commands

**Use descriptive names:**
- Rename colors to match your study style
- "Prayer Requests" is clearer than "Color 1"
- "Jesus' Words" is more meaningful than "Red"

**Highlight ranges:**
- You can highlight single verses or verse ranges
- Select multiple verses for context-rich passages
- Break long passages into logical sections

### Managing Many Highlights

**Export regularly:**
- Back up your highlights weekly or monthly
- Keep exports organized by date
- Store backups in cloud storage

**Color organization:**
- Reorder colors by frequency of use
- Put your most-used colors at the top
- Group related colors together

**Stay within storage limits:**
- Check storage usage periodically
- Remove unused highlights
- Export and archive old study sessions

## Viewing Your Highlights

### In Chapter View

- Highlighted verses appear with a colored background
- The color matches your assigned highlight color
- Works in both continuous reading and traditional verse modes
- Highlights fit exactly within verse boundaries

### Underline Option

You can optionally add underlines to highlighted verses for additional emphasis:

1. Go to Settings → **Appearance**
2. Toggle **Underline verse highlighting** ON or OFF
3. When enabled, highlighted verses will show both the background color and an underline
4. This setting applies to all highlights across all translations

This visual option helps make highlights more prominent, especially when using lighter colors.

### Active Color Indicator

- The highlight button shows your currently active color
- This is the color that will be applied with quick highlight
- The dropdown shows a checkmark next to the active color

## Frequently Asked Questions

**Q: Can I highlight the same verse with multiple colors?**
A: No, each verse can only have one highlight color at a time. Applying a new color will replace the previous one.

**Q: What happens to my highlights when I update the app?**
A: Your highlights are stored in your browser's local storage and persist through app updates.

**Q: Can I share my highlights with others?**
A: Yes! Export your highlights and share the JSON file. Others can import it into their app.

**Q: Why don't I see my highlights in a different translation?**
A: Highlights are translation-specific to ensure accuracy. You'll need to create new highlights in each translation.

**Q: How many highlights can I create?**
A: There's no hard limit, but you're constrained by browser storage space (typically 5-10 MB). The app will warn you if you approach the limit.

**Q: Can I use the same color palette across devices?**
A: Not automatically, but you can export your highlights (which includes colors) and import them on another device.

**Q: What if I accidentally remove a color with many highlights?**
A: There's no undo, so be careful! Always export your highlights before making major changes. The confirmation dialog shows how many highlights will be affected.

**Q: Can I customize the highlight appearance?**
A: Colors can be customized via the Color Manager. The highlighting style (background color, text visibility) is standardized for readability.

## Troubleshooting

### Highlights Not Appearing

1. Check that highlighting is enabled for that specific translation in Settings → Translations
2. Verify you're viewing the same translation where you created the highlights
3. Look for the translation mismatch warning
4. Check the highlight count badge in Settings → Translations to confirm highlights exist

### Can't Add More Highlights

1. Check storage usage in Settings → General (scroll down to Storage Information)
2. If storage is full, export and remove old highlights
3. Consider clearing browser cache (may remove highlights - export first!)

### Color Picker Not Working

1. Make sure you're entering valid hex color codes (#RRGGBB format)
2. Use the visual color picker instead of typing codes
3. Try refreshing the page

### Import Failed

1. Verify the file is a valid JSON export from this app
2. Check the file wasn't corrupted during transfer
3. Try exporting a fresh backup first, then importing

## Technical Notes

### Storage Format

Highlights are stored in your browser's localStorage as JSON data including:
- Passage references (book, chapter, verse range)
- Color IDs
- Timestamps
- Translation metadata

### Browser Compatibility

The highlighting feature works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### Performance

- Highlighting is optimized for chapters with many highlights
- Color changes update in real-time
- No server communication needed (all local storage)

---

**Need Help?**

If you encounter issues not covered in this guide, please check the app's [GitHub repository](https://github.com/jota-bible-software/jota-app) or contact support.
