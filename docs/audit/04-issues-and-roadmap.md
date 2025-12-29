# Jota Bible App - Known Issues & Roadmap

**Document Version**: 1.0
**Last Updated**: December 2024
**Source**: `private/todo.md`, code analysis, and best practice review

---

## 1. Known Bugs & Issues

### 1.1 High Priority

| Issue | Description | Impact | Suggested Fix |
|-------|-------------|--------|---------------|
| Parser edge cases | `Mat.5,5 Kol 3,12 Jak.1,21` not parsed correctly | Users can't find passages | Update jota-parser rules |
| Edition/book sync | When edition changes, books should update | Wrong book names shown | Trigger book reload on edition change |
| Two scroll bars on mobile | Duplicate vertical scroll bars on PS4 browser | Poor mobile UX | Fix CSS overflow settings |
| Safari icon caching | Aggressive caching causes icon misplacement | Visual glitches | Add cache-busting headers |

### 1.2 Medium Priority

| Issue | Description | Impact | Suggested Fix |
|-------|-------------|--------|---------------|
| Settings back navigation | Back from settings doesn't recover main page state | Lost context | Implement state restoration |
| Search input focus | Cursor not set in input after clearing search | Minor UX friction | Add `focus()` call after clear |
| Keyboard navigation | No keyboard nav for search results in formatted layout | Accessibility gap | Implement arrow key navigation |

### 1.3 Testing Gaps

| Test Gap | Description | Priority |
|----------|-------------|----------|
| Copy notification | Test showing notification when copied to clipboard | Medium |
| Tooltip flakiness | Tooltip checking in E2E tests is flaky | Low |
| Highlight persistence | No tests for localStorage quota scenarios | Medium |

---

## 2. Refactoring Needs

### 2.1 Code Organization

| Item | Current | Proposed | Effort |
|------|---------|----------|--------|
| search-store naming | `search-store.ts` | `main-store.ts` | Low |
| BibleSelector naming | `BibleSelector.vue` | `EditionSelector.vue` | Low |
| Component size | Some components >500 lines | Split into smaller components | Medium |

### 2.2 Technical Debt

| Area | Issue | Recommendation |
|------|-------|----------------|
| Type definitions | Some `any` types remain | Replace with proper types |
| Locale handling | Mixed locale patterns | Standardize locale handling |
| Error handling | Inconsistent error patterns | Create error handling utils |
| Loading states | Multiple loading implementations | Unified loading state |

---

## 3. Feature Roadmap

### 3.1 Priority 1 (Core Improvements)

| Feature | Description | Complexity | Status |
|---------|-------------|------------|--------|
| Localized page title | Browser tab shows localized title | Low | Not started |
| Multi-locale parser | Select which locales parser recognizes | Medium | Not started |
| Flag simplification | Hide flag when all editions from one locale | Low | Not started |
| Language selector on front page | Quick language access | Low | Not started |
| Copy only references | Copy passage references without text | Low | Not started |
| Custom fragment separator | Configure separator between multiple fragments | Medium | Not started |
| Updated help page | Refresh and translate help content | Medium | Not started |
| Edition quick buttons | Favorite translation buttons like Total Commander | Medium | Not started |
| User-defined editions | Custom translations with metadata and URL | High | Not started |
| Deploy to jota.netanel.pl | Production deployment | Low | In progress |
| LocalStorage versioning | Migration between storage versions | Medium | Partial |

### 3.2 Priority 2 (Enhanced Features)

| Feature | Description | Complexity | Status |
|---------|-------------|------------|--------|
| Edition from reference | Parser opens edition specified in reference | Medium | Not started |
| Better translation suggestions | Shortcut to suggest improved translations | Medium | Not started |
| Individual translation caching | Cache each translation separately | Medium | Not started |
| Memory usage display | Show translation memory consumption | Low | Not started |
| Slow connection detection | Warn before switching to uncached translation | Medium | Not started |
| jota-bible.app domain | Register new domain | Low | Not started |
| Mobile app (Capacitor/RN) | Native mobile application | High | Planned |
| Desktop app (Electron) | Offline-capable desktop app | High | Planned |
| Camera OCR | Read verse references from camera | High | Not started |

### 3.3 Priority 3 (Advanced Features)

| Feature | Description | Complexity | Status |
|---------|-------------|------------|--------|
| Grammatical search | Search by word forms (50MB dictionary) | Very High | Not started |
| Hitchcock's index | Navigate verses using Hitchcock's index | High | Not started |
| App memory display | Show total app memory usage | Low | Not started |
| Siri integration | Voice command to open passages | High | Not started |

### 3.4 Backlog (Future Considerations)

| Feature | Description | Notes |
|---------|-------------|-------|
| Spotify integration | Link to audio Bible on Spotify | Mateusz Czyż reads SNP |
| Portuguese translations | Add more PT translations | Need AI help to scrape |
| Russian translations | Add RU translations | Need AI help to scrape |
| Ukrainian translations | Add UK translations | Need AI help to scrape |

---

## 4. Highlight Feature Roadmap

### 4.1 Not in MVP (Deferred)

| Feature | Description | Component |
|---------|-------------|-----------|
| View by color | View all passages filtered by highlight color | `HighlightFilterView.vue` |
| Passage navigation | Navigate to highlighted passages from list | `HighlightFilterView.vue` |
| Bulk remove | Delete multiple highlights at once | `HighlightFilterView.vue` |

---

## 5. Mobile App Requirements

### 5.1 Core Requirements (from todo.md)

| Requirement | Description | Priority |
|-------------|-------------|----------|
| Camera OCR | Use camera to read verse references | High |
| Display passages | Show scanned passages | High |
| Offline support | Work without internet | High |
| Share integration | Share to/from other apps | Medium |

### 5.2 Platform Considerations

| Platform | Technology | Pros | Cons |
|----------|------------|------|------|
| React Native | Cross-platform | Shares JS ecosystem | New UI code |
| Capacitor | Wrap web app | Reuse existing UI | May feel non-native |
| Native | Swift/Kotlin | Best performance | Separate codebases |

---

## 6. Technical Improvements

### 6.1 Performance

| Improvement | Description | Benefit |
|-------------|-------------|---------|
| Virtual scrolling | Virtualize long chapter content | Better memory |
| Web Workers | Move search to background thread | Responsive UI |
| IndexedDB caching | Cache translations in IndexedDB | Faster loads |
| Service Worker | Offline-first architecture | PWA support |

### 6.2 Developer Experience

| Improvement | Description | Benefit |
|-------------|-------------|---------|
| Storybook | Component documentation | Better component dev |
| API documentation | Generated from types | Easier onboarding |
| Performance benchmarks | Automated perf tests | Prevent regressions |
| Error monitoring | Sentry or similar | Production insight |

### 6.3 Accessibility

| Improvement | Description | Priority |
|-------------|-------------|----------|
| Screen reader support | Full VoiceOver/TalkBack | High |
| Keyboard navigation | Complete keyboard support | High |
| High contrast mode | For low vision users | Medium |
| Focus indicators | Visible focus rings | High |

---

## 7. Localization Roadmap

### 7.1 Current Status

| Locale | UI Translation | Translations Available |
|--------|----------------|------------------------|
| en-US | Complete | 30+ |
| pl-PL | Complete | 30+ |
| pt-BR | Complete | 4+ |

### 7.2 Planned Additions

| Locale | UI Translation | Bible Translations |
|--------|----------------|-------------------|
| es-ES | Planned | Available (in data2) |
| pt-PT | Planned | Available (in data2) |
| uk-UA | Planned | Available (in data2) |
| de-DE | Planned | Available (in data2) |
| fr-FR | Planned | Available (in data2) |
| ru-RU | Planned | Available (in data2) |

---

## 8. Infrastructure Improvements

### 8.1 Build & Deploy

| Improvement | Description | Status |
|-------------|-------------|--------|
| GitHub Actions | CI/CD pipeline | Done |
| QA environment | Automatic staging deploy | Done |
| Production promotion | Manual promotion workflow | Done |
| Rollback capability | Quick rollback mechanism | Done |

### 8.2 Monitoring (Not Implemented)

| Feature | Tool Options | Priority |
|---------|--------------|----------|
| Error tracking | Sentry, Bugsnag | High |
| Analytics | Plausible, Umami | Medium |
| Performance | Web Vitals | Medium |
| Uptime | UptimeRobot | Low |

---

## 9. Documentation Roadmap

### 9.1 User Documentation

| Document | Status | Priority |
|----------|--------|----------|
| User Manual | Exists (UserManual.md) | Update needed |
| Help Page | Exists (HelpPage.vue) | Update + translate |
| Video tutorials | Not started | Medium |

### 9.2 Developer Documentation

| Document | Status | Priority |
|----------|--------|----------|
| CLAUDE.md | Current | Maintain |
| API docs | Partial | High |
| Contributing guide | Not started | Medium |
| Architecture docs | This document | Done |

---

## 10. Completed Items

### 10.1 Recently Completed

| Feature | Description | Date |
|---------|-------------|------|
| E2E tests | Cypress test suite | 2024 |
| i18n | Multi-language UI | 2024 |
| Default copy template highlight | Fixed visual issue | 2024 |
| Format name sync | Changing format name updates copy template | 2024 |
| Enter key in format | Allow `\n` in format templates | 2024 |
| Single verse message | Don't show "found: 1" for single verse | 2024 |

### 10.2 Architecture Milestones

| Milestone | Description | Status |
|-----------|-------------|--------|
| Phase 0 | Core library extraction | Done |
| Phase 1 | Adapter pattern implementation | Done |
| Phase 2 | Web app refactoring | In progress |
| Phase 3 | Multi-platform deployment | Planned |

---

## 11. Risk Assessment

### 11.1 Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| localStorage limits | Data loss | Storage monitoring + export |
| Browser compat issues | Feature failures | Browser testing matrix |
| Large translation files | Slow loads | Lazy loading + caching |
| Mobile performance | Poor UX | Performance testing |

### 11.2 Project Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | Delayed releases | Clear prioritization |
| Single contributor | Bus factor | Documentation |
| Translation quality | User trust | Community review |

---

## Priority Summary

| Priority | Item Count | Focus Areas |
|----------|------------|-------------|
| P1 | 11 | Core UX, localization |
| P2 | 8 | Caching, mobile |
| P3 | 4 | Advanced search, integrations |
| Backlog | 4 | Content additions |
| Bugs | 4 | Parser, mobile |
| Refactoring | 4 | Naming, types |

**Total Items**: ~35 tracked items

---

## Next Steps

1. Address high-priority bugs
2. Complete P1 feature set
3. Begin mobile app development
4. Expand localization coverage
