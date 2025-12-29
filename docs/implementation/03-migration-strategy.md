# Implementation: Migration Strategy

**Document Version**: 1.0
**Last Updated**: December 2024

---

## Overview

This document outlines the strategy for migrating existing web app users to the new mobile app, ensuring a smooth transition while maintaining data integrity and user experience.

---

## 1. Migration Overview

### 1.1 Migration Goals

| Goal | Description |
|------|-------------|
| Data Preservation | All user data migrates without loss |
| Seamless Experience | Users can continue where they left off |
| Gradual Adoption | No forced migration, users choose when |
| Feature Parity | Core features available on mobile at launch |
| Cross-Platform Sync | Data stays in sync across platforms |

### 1.2 Migration Scope

```
DATA TO MIGRATE:

Critical:
├── Highlights (all translations)
├── Reading position (last location)
└── Basic settings (translation, theme)

Important:
├── Search history
├── Reading plan progress
├── Custom format templates
└── Preferred translations list

Optional:
├── Reading statistics
├── Notes (if implemented)
└── Custom reading plans
```

### 1.3 Migration Phases

```
PHASE DIAGRAM:

Phase 1: Prepare
├── Design sync API
├── Implement cloud backup on web
└── Create export/import formats

Phase 2: Bridge
├── Launch mobile app
├── Enable manual data transfer
└── Provide migration tools

Phase 3: Sync
├── Enable real-time sync
├── Conflict resolution
└── Cross-platform features

Phase 4: Optimize
├── Improve sync efficiency
├── Handle edge cases
└── Deprecate old methods
```

---

## 2. Data Migration Approach

### 2.1 Migration Options

```
OPTION A: Manual Export/Import
┌─────────────────────────────────────────────────────┐
│                                                     │
│   WEB APP                     MOBILE APP            │
│   ┌────────────┐              ┌────────────┐       │
│   │ Export     │   File/QR    │   Import   │       │
│   │ to JSON    │ ──────────►  │   JSON     │       │
│   └────────────┘              └────────────┘       │
│                                                     │
│   Pros: Works offline, no server needed            │
│   Cons: Manual process, no auto-sync               │
│                                                     │
└─────────────────────────────────────────────────────┘

OPTION B: Cloud Sync
┌─────────────────────────────────────────────────────┐
│                                                     │
│   WEB APP        CLOUD         MOBILE APP           │
│   ┌────────┐    ┌──────┐      ┌────────┐           │
│   │ Upload │ ─► │ Sync │ ◄──► │ Sync   │           │
│   │        │ ◄─ │Server│      │        │           │
│   └────────┘    └──────┘      └────────┘           │
│                                                     │
│   Pros: Automatic, real-time, multi-device         │
│   Cons: Requires account, server infrastructure    │
│                                                     │
└─────────────────────────────────────────────────────┘

RECOMMENDED: Implement both options
- Manual export for offline/privacy users
- Cloud sync for convenience (optional)
```

### 2.2 Export Data Format

```json
// jota-export-v1.json
{
  "version": "1.0",
  "exportedAt": "2024-12-15T10:30:00Z",
  "app": "jota-web",
  "appVersion": "2.1.0",

  "user": {
    "id": "uuid-optional",
    "settings": {
      "defaultTranslation": "ESV",
      "theme": "light",
      "fontSize": 18,
      "showVerseNumbers": true,
      "formatTemplate": "reference-text"
    }
  },

  "highlights": [
    {
      "id": "h-uuid-1",
      "translationId": "ESV",
      "reference": {
        "book": 42,
        "chapter": 2,
        "startVerse": 16,
        "endVerse": null
      },
      "color": "yellow",
      "createdAt": "2024-01-15T08:00:00Z",
      "updatedAt": "2024-01-15T08:00:00Z"
    }
  ],

  "readingPosition": {
    "translationId": "ESV",
    "book": 42,
    "chapter": 2,
    "scrollPosition": 0.35
  },

  "searchHistory": [
    {
      "query": "John 3:16",
      "type": "reference",
      "timestamp": "2024-12-14T15:00:00Z"
    }
  ],

  "readingPlans": [
    {
      "planId": "bible-in-year",
      "startedAt": "2024-01-01T00:00:00Z",
      "currentDay": 349,
      "completedDays": [1, 2, 3, ...],
      "streak": 15
    }
  ],

  "preferences": {
    "favoriteTranslations": ["ESV", "NIV", "KJV"],
    "formatTemplates": [
      {
        "id": "custom-1",
        "name": "My Format",
        "template": "{{text}} - {{reference}}"
      }
    ]
  }
}
```

### 2.3 QR Code Transfer

```
QR CODE TRANSFER FLOW:

1. Web App generates QR code containing:
   - Short transfer code (6 characters)
   - Server URL (if using cloud)
   - Expiry timestamp (15 minutes)

2. Mobile app scans QR:
   ┌─────────────────────────────────────┐
   │                                     │
   │        ┌───────────────┐            │
   │        │ ▄▄▄▄▄ ▄ ▄ ▄▄▄ │            │
   │        │ █   █ ███ █ █ │            │
   │        │ ███ █ ▄▄▄ ███ │            │
   │        │ █ █ ▄▄▄ █▄█▄█ │            │
   │        │ █▄▄█▄█ █ █▄▄█ │            │
   │        └───────────────┘            │
   │                                     │
   │     Scan to transfer your data      │
   │                                     │
   └─────────────────────────────────────┘

3. Mobile downloads data from server
   - Or receives direct via local network

4. Import completes, user can verify
```

---

## 3. Web App Preparation

### 3.1 Add Export Feature

```typescript
// Web app: Add export functionality

async function exportUserData(): Promise<JotaExportFile> {
  const settings = await settingsStore.getAll();
  const highlights = await highlightStore.getAll();
  const history = await searchStore.getHistory();
  const plans = await planStore.getProgress();

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    app: 'jota-web',
    appVersion: APP_VERSION,
    user: {
      settings: {
        defaultTranslation: settings.translation,
        theme: settings.theme,
        fontSize: settings.fontSize,
        // ... other settings
      },
    },
    highlights: highlights.map(formatHighlightForExport),
    readingPosition: settings.lastPosition,
    searchHistory: history,
    readingPlans: plans,
    preferences: {
      favoriteTranslations: settings.favorites,
      formatTemplates: settings.templates,
    },
  };
}

// UI: Settings > Export Data
function ExportDataButton() {
  const handleExport = async () => {
    const data = await exportUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    downloadFile(blob, `jota-export-${Date.now()}.json`);
  };

  return <Button onClick={handleExport}>Export My Data</Button>;
}
```

### 3.2 Add Cloud Backup (Optional)

```typescript
// Web app: Enable cloud backup

interface BackupService {
  backup(): Promise<void>;
  restore(): Promise<JotaExportFile>;
  getStatus(): Promise<BackupStatus>;
}

async function enableCloudBackup(userId: string) {
  const data = await exportUserData();

  // Upload to secure API
  await api.post('/backup', {
    userId,
    data: encrypt(data),
    timestamp: Date.now(),
  });

  // Show transfer code
  const transferCode = generateTransferCode();
  return transferCode;
}
```

### 3.3 Web App UI Changes

```
SETTINGS PAGE ADDITIONS:

┌─────────────────────────────────────────────────────┐
│ ←          Settings                                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ... existing settings ...                          │
│                                                     │
│  Data & Sync                                        │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 📤  Export My Data                      →  │    │
│  │     Download highlights and settings        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ 📱  Transfer to Mobile App              →  │    │ NEW
│  │     Move your data to Jota Mobile          │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │ ☁️  Cloud Backup                        →  │    │ OPTIONAL
│  │     Automatically sync your data           │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 4. Mobile App Import

### 4.1 Import Flow

```
IMPORT DATA FLOW:

1. First Launch
   ┌─────────────────────────────────────┐
   │                                     │
   │         Welcome to Jota             │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │     Start Fresh             │    │
   │  └─────────────────────────────┘    │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │     Import from Web App     │    │ ← Prominent option
   │  └─────────────────────────────┘    │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │     Restore from Backup     │    │
   │  └─────────────────────────────┘    │
   │                                     │
   └─────────────────────────────────────┘

2. Import Options Screen
   ┌─────────────────────────────────────┐
   │ ←     Import Your Data              │
   ├─────────────────────────────────────┤
   │                                     │
   │  Choose how to import:              │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │ 📷  Scan QR Code            │    │ ← Easiest
   │  │     Quick transfer from web │    │
   │  └─────────────────────────────┘    │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │ 📁  Import File             │    │
   │  │     From downloads/files    │    │
   │  └─────────────────────────────┘    │
   │                                     │
   │  ┌─────────────────────────────┐    │
   │  │ 🔑  Enter Code              │    │
   │  │     6-character transfer    │    │
   │  └─────────────────────────────┘    │
   │                                     │
   └─────────────────────────────────────┘
```

### 4.2 Import Implementation

```typescript
// Mobile app: Import data

import * as DocumentPicker from 'react-native-document-picker';

async function importFromFile() {
  try {
    const result = await DocumentPicker.pick({
      type: ['application/json'],
    });

    const content = await RNFS.readFile(result.uri, 'utf8');
    const data = JSON.parse(content) as JotaExportFile;

    // Validate format version
    if (!isValidExportFile(data)) {
      throw new Error('Invalid or outdated export file');
    }

    // Import data
    await importUserData(data);

    return { success: true, stats: getImportStats(data) };
  } catch (error) {
    return { success: false, error };
  }
}

async function importUserData(data: JotaExportFile) {
  // Import settings
  await settingsStore.import(data.user.settings);

  // Import highlights
  for (const highlight of data.highlights) {
    await highlightStore.add(highlight);
  }

  // Import search history
  await searchStore.importHistory(data.searchHistory);

  // Import reading plan progress
  if (data.readingPlans) {
    for (const plan of data.readingPlans) {
      await planStore.importProgress(plan);
    }
  }

  // Set reading position
  if (data.readingPosition) {
    await settingsStore.setLastPosition(data.readingPosition);
  }
}
```

### 4.3 Import Confirmation

```
IMPORT SUMMARY:
┌─────────────────────────────────────┐
│ ←      Import Complete              │
├─────────────────────────────────────┤
│                                     │
│            ✓                        │
│                                     │
│     Data imported successfully      │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  Summary:                           │
│                                     │
│  📍 127 highlights imported         │
│  ⚙️  Settings restored              │
│  📖 Reading position: John 3        │
│  🔍 15 recent searches              │
│  📅 1 reading plan (Day 42)         │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  ┌─────────────────────────────┐    │
│  │       Start Reading         │    │
│  └─────────────────────────────┘    │
│                                     │
│       View import details           │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Sync Architecture

### 5.1 Sync Server Design

```
SYNC ARCHITECTURE:

┌──────────────┐        ┌──────────────┐
│   Web App    │        │  Mobile App  │
│              │        │              │
│  ┌────────┐  │        │  ┌────────┐  │
│  │ Local  │  │        │  │ Local  │  │
│  │ Store  │  │        │  │ Store  │  │
│  └───┬────┘  │        │  └───┬────┘  │
│      │       │        │      │       │
│  ┌───┴────┐  │        │  ┌───┴────┐  │
│  │ Sync   │  │        │  │ Sync   │  │
│  │ Client │  │        │  │ Client │  │
│  └───┬────┘  │        │  └───┬────┘  │
└──────┼───────┘        └──────┼───────┘
       │                       │
       │     ┌─────────┐       │
       └────►│  Sync   │◄──────┘
             │ Server  │
             │         │
             │ ┌─────┐ │
             │ │ DB  │ │
             │ └─────┘ │
             └─────────┘
```

### 5.2 Sync Protocol

```typescript
// Sync protocol implementation

interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'highlight' | 'setting' | 'plan';
  data: any;
  timestamp: number;
  clientId: string;
}

interface SyncState {
  lastSyncTimestamp: number;
  pendingOperations: SyncOperation[];
  conflictQueue: SyncConflict[];
}

async function sync(state: SyncState): Promise<SyncResult> {
  // 1. Send pending operations
  const serverOps = await api.sync({
    operations: state.pendingOperations,
    lastSync: state.lastSyncTimestamp,
  });

  // 2. Apply server operations locally
  for (const op of serverOps.operations) {
    await applyOperation(op);
  }

  // 3. Handle conflicts
  const conflicts = detectConflicts(
    state.pendingOperations,
    serverOps.operations
  );

  if (conflicts.length > 0) {
    await handleConflicts(conflicts);
  }

  // 4. Update sync state
  return {
    lastSyncTimestamp: serverOps.timestamp,
    pendingOperations: [],
    appliedCount: serverOps.operations.length,
  };
}
```

### 5.3 Conflict Resolution

```
CONFLICT RESOLUTION STRATEGIES:

1. Settings: Last Write Wins
   ┌─────────────────────────────────────┐
   │ Setting: theme                       │
   │ Web: "dark" at 10:00                │
   │ Mobile: "light" at 10:05            │
   │ Result: "light" (later wins)        │
   └─────────────────────────────────────┘

2. Highlights: Merge Strategy
   ┌─────────────────────────────────────┐
   │ Same verse highlighted:              │
   │ Web: yellow at 10:00                │
   │ Mobile: green at 10:05              │
   │ Result: Keep green (later)          │
   │         OR prompt user to choose    │
   └─────────────────────────────────────┘

3. Deletes: Delete Wins
   ┌─────────────────────────────────────┐
   │ Highlight edited vs deleted:         │
   │ Web: Delete at 10:00                │
   │ Mobile: Update at 10:05             │
   │ Result: Deleted (prevent zombie)    │
   └─────────────────────────────────────┘

4. User Choice (for important conflicts)
   ┌─────────────────────────────────────┐
   │ ⚠️  Sync Conflict                   │
   │                                     │
   │ This highlight was changed in       │
   │ both places:                        │
   │                                     │
   │ Web version: Yellow                 │
   │ Mobile version: Green               │
   │                                     │
   │ [Keep Web] [Keep Mobile] [Keep Both]│
   └─────────────────────────────────────┘
```

---

## 6. Feature Parity Considerations

### 6.1 Feature Comparison

| Feature | Web App | Mobile MVP | Mobile Full |
|---------|---------|------------|-------------|
| Bible Reading | ✓ | ✓ | ✓ |
| Search | ✓ | ✓ | ✓ |
| Highlights | ✓ | ✓ | ✓ |
| Copy/Share | ✓ | ✓ | ✓ |
| Multiple Translations | ✓ | ✓ | ✓ |
| Settings | ✓ | ✓ | ✓ |
| Reading Plans | ✓ | - | ✓ |
| Audio | Partial | - | ✓ |
| Sync | - | - | ✓ |
| Camera OCR | - | - | ✓ |
| Offline | - | ✓ | ✓ |

### 6.2 Gap Analysis

```
FEATURES WITH MOBILE ADVANTAGE:

Mobile Only:
├── Offline-first architecture
├── Native performance
├── Camera OCR
├── Widget support
├── Push notifications
└── Background audio

Web Only (at launch):
├── Keyboard shortcuts
├── Multi-window support
└── Some advanced settings

PARITY TARGETS:
- Core reading experience: Launch
- Highlighting: Launch
- Full settings: Phase 2
- Reading plans: Phase 3
```

---

## 7. User Communication

### 7.1 Announcement Strategy

```
COMMUNICATION TIMELINE:

Pre-Launch (2 weeks):
├── Email announcement to web users
├── In-app banner "Mobile app coming soon"
└── Social media teasers

Launch Day:
├── Email with download links
├── In-app modal with QR code
├── Blog post with features
└── App store optimization

Post-Launch (Week 1):
├── Follow-up email for non-migrated users
├── Tips and tutorials
└── Feedback collection
```

### 7.2 In-App Announcement

```
WEB APP ANNOUNCEMENT:
┌─────────────────────────────────────────────────────┐
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │                                               │  │
│  │     📱 Jota is now on mobile!                │  │
│  │                                               │  │
│  │  Take your Bible reading anywhere with       │  │
│  │  our new mobile app. Your highlights and     │  │
│  │  settings transfer automatically.            │  │
│  │                                               │  │
│  │  ┌─────────────┐     ┌─────────────┐        │  │
│  │  │ App Store   │     │ Play Store  │        │  │
│  │  └─────────────┘     └─────────────┘        │  │
│  │                                               │  │
│  │         Transfer my data →                   │  │
│  │                                               │  │
│  │                                    Dismiss   │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 7.3 Migration Guidance

```
HELP DOCUMENTATION:

"How to Transfer Your Data to Mobile"

1. Open Jota Web
   - Go to Settings > Data & Sync
   - Click "Transfer to Mobile App"

2. Scan QR Code
   - Open Jota Mobile
   - Tap "Import from Web App"
   - Scan the QR code shown on web

3. Verify Import
   - Check your highlights are present
   - Confirm your reading position
   - Review settings

Troubleshooting:
- QR code expired? Generate a new one
- File too large? Try exporting in parts
- Missing data? Contact support
```

---

## 8. Rollback Plan

### 8.1 Rollback Scenarios

| Scenario | Action |
|----------|--------|
| Critical bug found | Disable app store downloads |
| Data corruption | Restore from backup |
| Sync issues | Fallback to manual export |
| Performance issues | Push hotfix |

### 8.2 Data Recovery

```typescript
// Data recovery mechanisms

// 1. Local backup before import
async function createLocalBackup() {
  const allData = await getAllLocalData();
  await AsyncStorage.setItem(
    'backup_before_import',
    JSON.stringify(allData)
  );
}

// 2. Restore from local backup
async function restoreFromBackup() {
  const backup = await AsyncStorage.getItem('backup_before_import');
  if (backup) {
    await restoreData(JSON.parse(backup));
  }
}

// 3. Cloud backup recovery
async function recoverFromCloud(userId: string) {
  const backups = await api.get(`/backups/${userId}`);
  // Show list of available backups
  // Let user choose which to restore
}
```

---

## 9. Beta Testing

### 9.1 Beta Program Structure

```
BETA TESTING PHASES:

Alpha (Internal):
├── Team members only
├── Focus on core functionality
└── 1-2 weeks

Closed Beta:
├── Invited web app power users
├── ~100 users
├── Migration testing focus
└── 2-3 weeks

Open Beta:
├── Public TestFlight / Play Beta
├── Broader device testing
├── Performance monitoring
└── 2-4 weeks

Release Candidate:
├── Final bug fixes
├── App store review
├── Staged rollout
└── 1 week
```

### 9.2 Beta Feedback Collection

```
FEEDBACK MECHANISMS:

In-App:
├── Shake to report bug
├── Feedback button in settings
└── Crash reporting (automatic)

External:
├── Beta feedback form
├── Discord/Slack channel
└── Email support

Metrics:
├── Import success rate
├── Crash-free sessions
├── Sync conflict rate
└── User retention
```

---

## 10. Success Metrics

### 10.1 Migration KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Import success rate | > 95% | Imports / Attempts |
| Data integrity | 100% | Verification checks |
| User migration rate | > 30% (Month 1) | Mobile / Web users |
| Cross-platform active | > 20% | Using both platforms |
| Sync conflict rate | < 2% | Conflicts / Syncs |

### 10.2 User Satisfaction

```
POST-MIGRATION SURVEY:

1. How easy was the data transfer? (1-5)
2. Was any data missing after migration? (Y/N)
3. Are you using the mobile app as your primary? (Y/N)
4. What features are you missing? (Open)
5. Overall satisfaction with migration (1-5)
```

---

## 11. Long-term Maintenance

### 11.1 Ongoing Support

| Activity | Frequency |
|----------|-----------|
| Export format updates | As needed |
| Sync protocol improvements | Quarterly |
| Migration documentation updates | Monthly |
| Legacy data support | 2 years minimum |

### 11.2 Deprecation Timeline

```
DEPRECATION PLAN:

Year 1:
├── Maintain full compatibility
├── Support all export versions
└── Keep manual import option

Year 2:
├── Focus on cloud sync
├── Deprecate oldest export formats
└── Encourage account creation

Year 3+:
├── Remove legacy import options
├── Cloud sync as primary
└── Archive old format support
```

