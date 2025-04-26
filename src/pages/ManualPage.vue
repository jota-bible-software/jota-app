<template>
  <q-page class="manual-page q-pa-md">
    <div class="manual-container">
      <h1 class="text-h4 text-primary q-mb-md">{{ $t('manualPage.title') }}</h1>
      
      <q-tabs
        v-model="currentTab"
        dense
        class="text-primary"
        active-color="primary"
        indicator-color="primary"
        align="justify"
        narrow-indicator
      >
        <q-tab name="intro" :label="$t('manualPage.introduction')" />
        <q-tab name="getting-started" :label="$t('manualPage.gettingStarted')" />
        <q-tab name="basic" :label="$t('manualPage.basicFunctions')" />
        <q-tab name="editions" :label="$t('manualPage.bibleEditions')" />
        <q-tab name="settings" :label="$t('manualPage.settings')" />
        <q-tab name="advanced" :label="$t('manualPage.advancedFeatures')" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="currentTab" animated>
        <!-- Introduction -->
        <q-tab-panel name="intro">
          <h2 class="text-h5 text-primary">Introduction</h2>
          <p>Welcome to the Jota Bible App, an ergonomic application designed to help you search, read, and study the Bible with ease.</p>
          
          <h3 class="text-h6 q-mt-md">Key Features</h3>
          <ul>
            <li>Powerful Bible search engine that supports references, keywords, and phrases</li>
            <li>Multi-language support with various Bible editions</li>
            <li>Customizable interface with light and dark modes</li>
            <li>Advanced formatting options for copying and sharing Bible passages</li>
            <li>Audio playback for listening to Bible chapters</li>
            <li>User-friendly navigation through books, chapters, and verses</li>
            <li>Ability to customize book names and formatting styles</li>
            <li>Import and export settings for backup and cross-device use</li>
          </ul>

          <h3 class="text-h6 q-mt-md">About Jota Bible App</h3>
          <p>Jota Bible App is a modern web application designed with user experience in mind. It's built using the Quasar framework, providing a responsive design that works seamlessly across desktop and mobile devices.</p>
          
          <p>The app is intended to make Bible study more accessible and efficient, whether you're conducting research, preparing for a study group, or enjoying personal devotional time.</p>

          <h3 class="text-h6 q-mt-md">Supported Platforms</h3>
          <p>Jota Bible App runs in modern web browsers on:</p>
          <ul>
            <li>Desktop computers (Windows, macOS, Linux)</li>
            <li>Tablets (iPad, Android tablets)</li>
            <li>Mobile phones (iPhone, Android phones)</li>
          </ul>
          <p>For the best experience, we recommend using the latest version of Chrome, Firefox, Safari, or Edge.</p>

          <h3 class="text-h6 q-mt-md">Getting Help</h3>
          <p>This manual provides comprehensive information on using Jota Bible App. If you have additional questions or encounter issues, you can refer to the following resources:</p>
          <ul>
            <li>Check the Settings > General section for contact information</li>
            <li>Visit the GitHub repository for technical information and updates</li>
          </ul>
        </q-tab-panel>

        <!-- Getting Started -->
        <q-tab-panel name="getting-started">
          <h2 class="text-h5 text-primary">Getting Started</h2>
          
          <h3 class="text-h6 q-mt-md">Installation Requirements</h3>
          <p>Jota Bible App is a web application that requires:</p>
          <ul>
            <li>A modern web browser (Chrome, Firefox, Safari, Edge)</li>
            <li>JavaScript enabled</li>
            <li>Internet connection for initial loading and Bible edition downloads</li>
          </ul>
          <p>No installation is needed; simply open the application URL in your browser.</p>
          
          <h3 class="text-h6 q-mt-md">First Launch Experience</h3>
          <p>When you launch Jota Bible App for the first time:</p>
          <ol>
            <li>The app will detect your browser's language and use it as the default interface language if supported</li>
            <li>A default Bible edition will be loaded based on your language</li>
            <li>Depending on your settings, you'll see either the reference picker or the default Bible chapter</li>
          </ol>
          <p>Note that the first time you use the app, it will download Bible edition data which might take a moment depending on your connection speed.</p>
          
          <h3 class="text-h6 q-mt-md">Interface Overview</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Main Components</h4>
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/400" class="rounded-borders screenshot" alt="Jota App Interface">
              <div class="absolute-bottom text-subtitle1 text-center">
                Main interface of Jota Bible App
              </div>
            </q-img>
          </div>
          
          <p>The main interface consists of the following components:</p>
          <ul>
            <li><strong>Search Bar</strong>: Located at the top of the screen, allows you to search for Bible references or text</li>
            <li><strong>Bible Selector</strong>: Dropdown menu to choose from available Bible editions</li>
            <li><strong>Tool Buttons</strong>: Various controls including:
              <ul>
                <li>Whole Words toggle: Enable/disable whole word search</li>
                <li>Book/Chapter selector: Open the reference picker</li>
                <li>Help: Access this manual</li>
                <li>Settings: Configure app preferences</li>
              </ul>
            </li>
            <li><strong>Message Line</strong>: Displays status information, search results count, and action buttons</li>
            <li><strong>Content Area</strong>: The main section displaying Bible text or search results</li>
          </ul>

          <h4 class="text-subtitle1 q-mt-sm">Desktop vs. Mobile Layout</h4>
          <p>Jota Bible App adapts its interface based on your screen size:</p>
          <ul>
            <li><strong>Desktop</strong>: All tool buttons are visible in the top toolbar</li>
            <li><strong>Mobile</strong>: Some tool buttons are moved to a dropdown menu accessible via the three dots (⋮) icon</li>
          </ul>

          <h3 class="text-h6 q-mt-md">Selecting a Bible Edition</h3>
          <p>To change the Bible edition you're viewing:</p>
          <ol>
            <li>Click on the Bible selector dropdown in the upper right corner</li>
            <li>Choose your preferred edition from the list</li>
          </ol>
          <p>The available editions depend on which ones you've enabled in Settings > Editions.</p>

          <h3 class="text-h6 q-mt-md">Basic Navigation</h3>
          <p>There are several ways to navigate the Bible:</p>
          <ul>
            <li><strong>Search Bar</strong>: Enter a Bible reference (e.g., "John 3:16") and press Enter</li>
            <li><strong>Reference Picker</strong>: Click the book/chapter button to select a specific book, chapter, and verse</li>
            <li><strong>Navigation Controls</strong>: Use the previous/next buttons to move between chapters</li>
          </ul>
          <p>You'll learn more detailed navigation techniques in the Basic Functions section.</p>
        </q-tab-panel>

        <!-- Basic Functions -->
        <q-tab-panel name="basic">
          <h2 class="text-h5 text-primary">Basic Functions</h2>
          
          <h3 class="text-h6 q-mt-md">Bible Navigation</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Using the Reference Picker</h4>
          <p>The Reference Picker is the most direct way to navigate to a specific part of the Bible.</p>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/400" class="rounded-borders screenshot" alt="Reference Picker">
              <div class="absolute-bottom text-subtitle1 text-center">
                Reference Picker interface
              </div>
            </q-img>
          </div>
          
          <p>To open and use the Reference Picker:</p>
          <ol>
            <li>Click on the book and chapter button <q-icon name="icon-mat-book" size="xs" class="q-mx-xs" /> in the toolbar</li>
            <li>In the first screen, select a Bible book from the list</li>
            <li>In the second screen, select a chapter number from the grid</li>
            <li>Optionally, in the third screen, select a specific verse</li>
          </ol>
          
          <p>You can always navigate back to the previous selection screen using the back button at the top of the Reference Picker.</p>

          <h4 class="text-subtitle1 q-mt-sm">Navigating with the Search Bar</h4>
          <p>You can quickly jump to any Bible passage by entering a reference in the search bar:</p>
          <ol>
            <li>Click in the search bar at the top of the application</li>
            <li>Type a Bible reference using standard format (e.g., "Genesis 1:1", "John 3:16-18", "Ps 23")</li>
            <li>Press Enter or click the search icon</li>
          </ol>
          <p>The app supports various reference formats including standard references ("John 3:16"), abbreviated book names ("Jn 3:16"), and chapter ranges ("Romans 8:28-39").</p>

          <h4 class="text-subtitle1 q-mt-sm">Navigating Between Chapters</h4>
          <p>When viewing a chapter, several navigation methods are available:</p>
          <ul>
            <li><strong>Previous/Next Chapter Buttons</strong>: Click the previous chapter <q-icon name="chevron_left" size="xs" class="q-mx-xs" /> or next chapter <q-icon name="chevron_right" size="xs" class="q-mx-xs" /> buttons in the message line</li>
            <li><strong>Keyboard Shortcuts</strong>: Use the left arrow key for the previous chapter and right arrow key for the next chapter</li>
            <li><strong>Swipe Gestures</strong> (mobile devices): Swipe left to go to the next chapter, swipe right to go to the previous chapter</li>
          </ul>

          <h4 class="text-subtitle1 q-mt-sm">Navigating Between Verses</h4>
          <p>To navigate to specific verses within a chapter:</p>
          <ul>
            <li><strong>Click Verse Numbers</strong>: Click on any verse number to focus on that verse</li>
            <li><strong>Keyboard Shortcuts</strong>: Use the up and down arrow keys to move between verses</li>
            <li><strong>Scroll</strong>: Simply scroll through the chapter to read all verses</li>
          </ul>
          <p>When a verse is selected, it will be highlighted, and you can view it in context or copy it using the copy button.</p>

          <h4 class="text-subtitle1 q-mt-sm">Selecting Multiple Verses</h4>
          <p>To select multiple verses:</p>
          <ol>
            <li>Click on the first verse number you want to select</li>
            <li>Hold Shift and click on the last verse number to select all verses in the range</li>
            <li>Alternatively, after selecting the first verse, press Shift + Down Arrow to extend the selection</li>
          </ol>
          <p>Selected verses will be highlighted, and you can copy all of them using the copy function.</p>

          <h3 class="text-h6 q-mt-md">Bible Search</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Basic Search Functionality</h4>
          <p>The search function allows you to find words, phrases, or references throughout the Bible:</p>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/200" class="rounded-borders screenshot" alt="Search Bar">
              <div class="absolute-bottom text-subtitle1 text-center">
                Search bar with example query
              </div>
            </q-img>
          </div>
          
          <p>To perform a search:</p>
          <ol>
            <li>Type your query in the search bar at the top of the application</li>
            <li>Press Enter or click the search icon <q-icon name="search" size="xs" class="q-mx-xs" /></li>
            <li>View the results in the content area</li>
          </ol>
          
          <p>The search function will look for your query within the currently selected Bible edition. Search terms are highlighted in the results for easy identification.</p>

          <h4 class="text-subtitle1 q-mt-sm">Advanced Search Techniques</h4>
          <p>Jota Bible App supports several advanced search techniques:</p>
          <ul>
            <li><strong>Multiple Word Search</strong>: Enter multiple words separated by spaces to find verses containing all those words (e.g., "faith hope love")</li>
            <li><strong>Phrase Search</strong>: Enter a specific phrase in quotes to search for that exact phrase (e.g., "\"love your neighbor\"")</li>
            <li><strong>Reference Search</strong>: Enter Bible references to find specific verses or passages (e.g., "John 3:16", "Psalm 23")</li>
            <li><strong>Mixed Search</strong>: Combine references and words to find specific terms within certain books or chapters (e.g., "John faith")</li>
          </ul>

          <h4 class="text-subtitle1 q-mt-sm">Whole Words Search Option</h4>
          <p>The Whole Words option allows you to search for complete words only, rather than partial matches:</p>
          
          <div class="q-pa-md">
            <div class="row items-center">
              <q-btn flat dense no-caps icon="text_format" color="primary">
                <q-tooltip>Whole words</q-tooltip>
              </q-btn>
              <span class="q-ml-sm">Whole Words button</span>
            </div>
          </div>
          
          <p>Toggle this option by clicking the Whole Words button <q-icon name="text_format" size="xs" class="q-mx-xs" /> in the toolbar:</p>
          <ul>
            <li><strong>Enabled</strong>: Searching for "love" will match only the complete word "love"</li>
            <li><strong>Disabled</strong>: Searching for "love" will also match words like "lovely", "beloved", etc.</li>
          </ul>

          <h4 class="text-subtitle1 q-mt-sm">Viewing Search Results</h4>
          <p>Search results can be viewed in two different layouts:</p>
          <ul>
            <li><strong>Split Layout</strong>: Shows the list of found references on the left and the selected passage on the right. This is useful for quickly scanning through results and reading individual passages in context.</li>
            <li><strong>Formatted Layout</strong>: Shows all found passages in a continuous, formatted view, suitable for reading or printing. This provides a complete view of all search results at once.</li>
          </ul>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/400" class="rounded-borders screenshot" alt="Search Results">
              <div class="absolute-bottom text-subtitle1 text-center">
                Search results in split layout
              </div>
            </q-img>
          </div>
          
          <p>To switch between layouts, use the layout buttons in the message line.</p>

          <h4 class="text-subtitle1 q-mt-sm">Reading Results in Context</h4>
          <p>When viewing search results in the split layout:</p>
          <ol>
            <li>Click on any reference in the left panel to view that passage in the right panel</li>
            <li>Use the up and down arrow keys to navigate through the list of references</li>
            <li>Click on a verse number in the right panel to select that specific verse</li>
          </ol>

          <h4 class="text-subtitle1 q-mt-sm">Sorting and Filtering Search Results</h4>
          <p>To organize your search results more effectively:</p>
          <ul>
            <li><strong>Sort and Remove Duplicates</strong>: Click the sort button <q-icon name="sort" size="xs" class="q-mx-xs" /> in the message line to arrange results in canonical order and remove duplicate references</li>
            <li><strong>Filter Results</strong>: Use additional search terms to narrow down your results</li>
          </ul>
          
          <div class="q-pa-md">
            <div class="row items-center">
              <q-btn flat dense no-caps icon="sort" color="primary">
                <q-tooltip>Sort and remove duplicates</q-tooltip>
              </q-btn>
              <span class="q-ml-sm">Sort and remove duplicates button</span>
            </div>
          </div>

          <h3 class="text-h6 q-mt-md">Copying Bible Text</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Copying Verses</h4>
          <p>Jota Bible App makes it easy to copy Bible verses for use in other applications:</p>
          <ol>
            <li>Select the verse(s) you want to copy by clicking on the verse numbers</li>
            <li>Click the "Copy selected verses" button in the message line</li>
            <li>The selected text will be copied to your clipboard using your default copy template</li>
          </ol>
          
          <h4 class="text-subtitle1 q-mt-sm">Copying Search Results</h4>
          <p>To copy all found verses from a search:</p>
          <ol>
            <li>Perform your search</li>
            <li>Click the "Copy found verses" button in the message line</li>
            <li>All search results will be copied to your clipboard using your default copy template</li>
          </ol>
          <p>The formatting of the copied text depends on your copy template settings, which can be customized in Settings > Copy Templates.</p>
        </q-tab-panel>

        <!-- Bible Editions -->
        <q-tab-panel name="editions">
          <h2 class="text-h5 text-primary">Bible Editions</h2>
          
          <h3 class="text-h6 q-mt-md">Understanding Bible Editions</h3>
          <p>Jota Bible App supports multiple Bible editions (translations) in various languages. Each edition has its own characteristics:</p>
          <ul>
            <li><strong>Translation Philosophy</strong>: Some editions are more literal (word-for-word), while others are more dynamic (thought-for-thought)</li>
            <li><strong>Language Style</strong>: Editions vary in their use of modern or traditional language</li>
            <li><strong>Content</strong>: Some editions include footnotes, cross-references, or deuterocanonical books</li>
          </ul>
          <p>Having access to multiple editions allows you to compare translations and gain deeper insights into the biblical text.</p>
          
          <h3 class="text-h6 q-mt-md">Available Bible Editions</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">English Editions</h4>
          <ul>
            <li><strong>KJV</strong> (King James Version): A classic, widely-used translation in traditional English</li>
            <li><strong>NLT</strong> (New Living Translation): A modern, readable thought-for-thought translation</li>
          </ul>
          
          <h4 class="text-subtitle1 q-mt-sm">Polish Editions</h4>
          <ul>
            <li><strong>EIB</strong>: Pismo Święte Ewangeliczny Instytut Biblijny</li>
            <li><strong>BT5</strong>: Biblia Tysiąclecia, 5th edition</li>
            <li><strong>UBG</strong>: Uwspółcześniona Biblia Gdańska</li>
          </ul>
          
          <p>The specific editions available in your installation may vary. Check the Settings > Editions page to see all available editions.</p>
          
          <h3 class="text-h6 q-mt-md">Managing Editions</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Accessing Edition Settings</h4>
          <p>To manage Bible editions:</p>
          <ol>
            <li>Click the settings icon <q-icon name="settings" size="xs" class="q-mx-xs" /> in the toolbar</li>
            <li>Navigate to the "Editions" tab</li>
          </ol>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/400" class="rounded-borders screenshot" alt="Edition Settings">
              <div class="absolute-bottom text-subtitle1 text-center">
                Edition management in Settings
              </div>
            </q-img>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Selecting Bible Editions</h4>
          <p>In the Editions tab, you can choose which Bible editions to enable:</p>
          <ol>
            <li>Editions are organized by language</li>
            <li>Check the box next to each edition you want to enable</li>
            <li>Click "Select all for language" to enable all editions for a specific language</li>
          </ol>
          <p>Enabled editions will be available for selection in the main Bible selector dropdown.</p>

          <h4 class="text-subtitle1 q-mt-sm">Setting Default Editions</h4>
          <p>For each language, you can set a default edition that will be used automatically:</p>
          <ol>
            <li>In the Editions tab, locate the language section</li>
            <li>Use the "Default edition" dropdown to select your preferred edition</li>
          </ol>
          <p>The default edition for a language will be loaded automatically when you switch to that language in the interface.</p>

          <h3 class="text-h6 q-mt-md">Using Multiple Editions</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Switching Between Editions</h4>
          <p>To switch between enabled Bible editions while using the app:</p>
          <ol>
            <li>Click on the Bible selector dropdown in the top toolbar</li>
            <li>Select the desired edition from the list</li>
          </ol>
          <p>The content area will update to display the selected edition, maintaining your current location or search results.</p>

          <h4 class="text-subtitle1 q-mt-sm">Comparing Translations</h4>
          <p>You can easily compare how different translations render the same passage:</p>
          <ol>
            <li>Navigate to a verse or passage in one edition</li>
            <li>Switch to another edition using the Bible selector</li>
            <li>The same passage will be displayed in the new edition</li>
          </ol>
          <p>This feature is particularly useful for Bible study and gaining deeper understanding of the text.</p>
          
          <h3 class="text-h6 q-mt-md">Language Support</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Changing Interface Language</h4>
          <p>Jota Bible App's interface can be displayed in different languages:</p>
          <ol>
            <li>Go to Settings > General</li>
            <li>Select your preferred language from the "Default language" dropdown</li>
          </ol>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/200" class="rounded-borders screenshot" alt="Language Selection">
              <div class="absolute-bottom text-subtitle1 text-center">
                Language selection in General settings
              </div>
            </q-img>
          </div>
          <p>When you change the interface language, the app will automatically switch to using the default Bible edition for that language.</p>

          <h4 class="text-subtitle1 q-mt-sm">Multi-Language Support</h4>
          <p>Jota Bible App allows you to work with Bible editions in multiple languages simultaneously:</p>
          <ul>
            <li>You can enable editions from different languages</li>
            <li>Quickly switch between languages by changing editions</li>
            <li>Configure settings independently for each supported language</li>
          </ul>
          <p>This is particularly useful for bilingual users or those studying the Bible in languages other than their native tongue.</p>
        </q-tab-panel>

        <!-- Settings -->
        <q-tab-panel name="settings">
          <h2 class="text-h5 text-primary">Customization Settings</h2>
          
          <h3 class="text-h6 q-mt-md">Accessing Settings</h3>
          <p>Access the Settings page by clicking the settings icon <q-icon name="settings" size="xs" class="q-mx-xs" /> in the toolbar. The Settings page is divided into several tabs, each controlling different aspects of the application.</p>
          
          <div class="q-pa-md">
            <div class="row items-center">
              <q-btn flat dense no-caps icon="settings" color="primary">
                <q-tooltip>Settings</q-tooltip>
              </q-btn>
              <span class="q-ml-sm">Settings button</span>
            </div>
          </div>
          
          <h3 class="text-h6 q-mt-md">General Settings</h3>
          <p>The General tab contains basic application preferences:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Language Settings</h4>
          <ul>
            <li><strong>Default Language</strong>: Choose the interface language for the application</li>
          </ul>
          
          <h4 class="text-subtitle1 q-mt-sm">Display Preferences</h4>
          <ul>
            <li><strong>Default Search Result Layout</strong>: Choose between Split or Formatted layout for search results</li>
            <li><strong>Reference Picker on Start</strong>: When enabled, shows the book and chapter selection screen when the application starts</li>
          </ul>
          
          <h4 class="text-subtitle1 q-mt-sm">Contact Information</h4>
          <ul>
            <li><strong>GitHub Repository</strong>: Link to the application's source code repository</li>
            <li><strong>Contact Email</strong>: Email address for support and feedback</li>
          </ul>

          <h3 class="text-h6 q-mt-md">Appearance Settings</h3>
          <p>The Appearance tab allows you to customize the visual aspects of the application:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Font Size Adjustment</h4>
          <p>Adjust the size of the Bible text to improve readability:</p>
          <ul>
            <li>Use the slider to set the font size</li>
            <li>Click the "+" button to increase the font size</li>
            <li>Click the "-" button to decrease the font size</li>
          </ul>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/200" class="rounded-borders screenshot" alt="Font Size Adjustment">
              <div class="absolute-bottom text-subtitle1 text-center">
                Font size adjustment in Appearance settings
              </div>
            </q-img>
          </div>
          
          <p>A live preview of the Bible text with the selected font size is shown below the controls.</p>

          <h4 class="text-subtitle1 q-mt-sm">Screen Mode</h4>
          <p>Choose between different display modes for the application:</p>
          <ul>
            <li><strong>Light Mode</strong>: Light background with dark text</li>
            <li><strong>Dark Mode</strong>: Dark background with light text</li>
            <li><strong>Auto Mode</strong>: Follows your system's theme</li>
          </ul>
          
          <div class="q-pa-md">
            <div class="row items-center q-gutter-md">
              <q-btn flat dense no-caps icon="light_mode" color="primary">
                <q-tooltip>Light mode</q-tooltip>
              </q-btn>
              <q-btn flat dense no-caps icon="dark_mode" color="primary">
                <q-tooltip>Dark mode</q-tooltip>
              </q-btn>
              <q-btn flat dense no-caps icon="auto_mode" color="primary">
                <q-tooltip>Auto mode</q-tooltip>
              </q-btn>
            </div>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Primary Color</h4>
          <p>Select the primary color for the application interface from a range of available colors.</p>

          <h3 class="text-h6 q-mt-md">Book Name Settings</h3>
          <p>The Book Names tab allows you to customize how Bible book names are displayed:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Book Naming Schemes</h4>
          <p>Jota Bible App supports different naming schemes for Bible books:</p>
          <ul>
            <li><strong>Full Names</strong>: Complete book names (e.g., "Genesis", "Exodus")</li>
            <li><strong>Standard Abbreviations</strong>: Common abbreviations (e.g., "Gen", "Exo")</li>
            <li><strong>Custom Naming</strong>: User-defined names or abbreviations</li>
          </ul>

          <h4 class="text-subtitle1 q-mt-sm">Managing Book Naming Schemes</h4>
          <p>You can create, edit, and select book naming schemes for each language:</p>
          <ol>
            <li>Select a language from the tabs at the top of the Book Names section</li>
            <li>View and select from existing naming schemes</li>
            <li>Click "Add" to create a new naming scheme</li>
            <li>Click "Edit" to modify an existing scheme</li>
            <li>Click "Remove" to delete a scheme (not possible for schemes in use)</li>
          </ol>
          
          <h4 class="text-subtitle1 q-mt-sm">Creating Custom Book Names</h4>
          <p>To create a custom book naming scheme:</p>
          <ol>
            <li>Click the "Add" button in the Book Names tab</li>
            <li>Enter a name for your naming scheme</li>
            <li>Enter custom names or abbreviations for each Bible book</li>
            <li>Click "Save" to store your custom naming scheme</li>
          </ol>
          <p>Note that a valid naming scheme must contain exactly 73 book names (66 for the Protestant canon plus 7 for the deuterocanonical books).</p>

          <h3 class="text-h6 q-mt-md">Format Templates</h3>
          <p>Format templates control how Bible passages are displayed and formatted when copied:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Template Settings</h4>
          <p>Each format template includes several formatting options:</p>
          <ul>
            <li><strong>Reference Position</strong>: Where the Bible reference appears (before or after the content)</li>
            <li><strong>Verses with Numbers</strong>: Whether to include verse numbers</li>
            <li><strong>New Line for Each Verse</strong>: Whether each verse starts on a new line</li>
            <li><strong>Range Character</strong>: Character used between verse ranges (e.g., 1-3)</li>
            <li><strong>Separator Character</strong>: Character used between chapter and verse (e.g., John 3:16)</li>
            <li><strong>Characters around References, Verse Numbers, etc.</strong>: Special formatting for different elements</li>
          </ul>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/400" class="rounded-borders screenshot" alt="Format Templates">
              <div class="absolute-bottom text-subtitle1 text-center">
                Format templates settings
              </div>
            </q-img>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Managing Format Templates</h4>
          <p>You can create, edit, and select format templates:</p>
          <ol>
            <li>View existing templates in the Format Templates tab</li>
            <li>Click "Add new template" to create a new template</li>
            <li>Configure the formatting options according to your preferences</li>
            <li>View a live preview of the formatted text</li>
            <li>Click "Save" to store your template</li>
          </ol>
          <p>The "App format" template is used for displaying Bible text in the application interface.</p>

          <h3 class="text-h6 q-mt-md">Copy Templates</h3>
          <p>Copy templates combine format templates and book naming schemes for copying Bible passages:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Template Structure</h4>
          <p>Each copy template consists of:</p>
          <ul>
            <li><strong>Template Name</strong>: A descriptive name for the template</li>
            <li><strong>Format Template</strong>: The formatting style to be used</li>
            <li><strong>Book Naming</strong>: The book naming scheme to be used</li>
          </ul>

          <h4 class="text-subtitle1 q-mt-sm">Creating Copy Templates</h4>
          <p>To create a custom copy template:</p>
          <ol>
            <li>Go to Settings > Copy Templates</li>
            <li>Click "Add new template"</li>
            <li>Enter a name for your template</li>
            <li>Select a format template from the dropdown</li>
            <li>Select a book naming scheme from the dropdown</li>
            <li>Click "Save" to store your template</li>
          </ol>
          
          <h4 class="text-subtitle1 q-mt-sm">Default Copy Template</h4>
          <p>Set a default copy template for each language by selecting a template and clicking "Set as default". The default template will be used when copying Bible passages unless another template is explicitly selected.</p>

          <h3 class="text-h6 q-mt-md">Import/Export Settings</h3>
          <p>The Import/Export tab allows you to back up and restore your application settings:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Exporting Settings</h4>
          <p>To export your current settings to a file:</p>
          <ol>
            <li>Go to Settings > Import / Export</li>
            <li>Click the "Export" button</li>
            <li>Save the settings file to your device</li>
          </ol>
          <p>This file contains all your preferences, templates, and customizations.</p>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/200" class="rounded-borders screenshot" alt="Export Settings">
              <div class="absolute-bottom text-subtitle1 text-center">
                Export settings interface
              </div>
            </q-img>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Importing Settings</h4>
          <p>To import settings from a previously exported file:</p>
          <ol>
            <li>Go to Settings > Import / Export</li>
            <li>Click "Select settings file" and choose your settings file</li>
            <li>Click the "Import" button</li>
          </ol>
          <p>This will replace your current settings with those from the imported file.</p>

          <h4 class="text-subtitle1 q-mt-sm">Resetting Settings</h4>
          <p>To reset all settings to their default values:</p>
          <ol>
            <li>Go to Settings > Import / Export</li>
            <li>Click the "Reset settings" button</li>
            <li>Confirm that you want to reset all settings</li>
          </ol>
          <p>This will remove all customizations and restore the default application settings.</p>
        </q-tab-panel>

        <!-- Advanced Features -->
        <q-tab-panel name="advanced">
          <h2 class="text-h5 text-primary">Advanced Features</h2>
          
          <h3 class="text-h6 q-mt-md">Audio Playback</h3>
          <p>Jota Bible App includes audio playback functionality, allowing you to listen to Bible chapters:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Playing Bible Audio</h4>
          <p>To play audio for the current Bible chapter:</p>
          <ol>
            <li>Navigate to the chapter you want to listen to</li>
            <li>Click the audio play button <q-icon name="play_circle" size="xs" class="q-mx-xs" /> in the message line</li>
            <li>The audio will begin playing automatically</li>
          </ol>
          
          <div class="q-pa-md">
            <div class="row items-center">
              <q-btn flat dense no-caps icon="play_circle" color="primary">
                <q-tooltip>Play audio</q-tooltip>
              </q-btn>
              <span class="q-ml-sm">Audio play button</span>
            </div>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Audio Player Controls</h4>
          <p>Once audio playback begins, the audio player will appear with the following controls:</p>
          <ul>
            <li><strong>Play/Pause</strong>: Control audio playback</li>
            <li><strong>Time Display</strong>: Shows current position and total length</li>
            <li><strong>Progress Bar</strong>: Shows playback progress and allows seeking</li>
            <li><strong>Volume Control</strong>: Adjust audio volume</li>
          </ul>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/200" class="rounded-borders screenshot" alt="Audio Player">
              <div class="absolute-bottom text-subtitle1 text-center">
                Audio player interface
              </div>
            </q-img>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Audio Playback Notes</h4>
          <ul>
            <li>Audio availability depends on the selected Bible edition</li>
            <li>You can continue navigating the application while audio plays</li>
            <li>Audio playback will stop if you navigate to a different chapter</li>
          </ul>

          <h3 class="text-h6 q-mt-md">Advanced Copy and Share Features</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Selective Copying</h4>
          <p>Jota Bible App allows you to copy specific verses or ranges:</p>
          <ol>
            <li>Select individual verses by clicking on their verse numbers</li>
            <li>Select a range of verses by clicking the first verse, then Shift+clicking the last verse</li>
            <li>Click the "Copy selected verses" button in the message line</li>
            <li>The selected verses will be copied to your clipboard using your default copy template</li>
          </ol>
          
          <div class="q-pa-md">
            <div class="row items-center">
              <q-btn flat dense no-caps icon="content_copy" color="primary">
                <q-tooltip>Copy selected verses</q-tooltip>
              </q-btn>
              <span class="q-ml-sm">Copy button</span>
            </div>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Template-Based Copying</h4>
          <p>When copying Bible passages, you can choose from different templates:</p>
          <ol>
            <li>Select the verse(s) you want to copy</li>
            <li>Open the copy dropdown menu in the message line</li>
            <li>Choose your preferred copy template</li>
            <li>Click the copy button</li>
          </ol>
          <p>This feature is particularly useful when preparing content for different contexts, such as academic papers, presentations, or personal notes.</p>

          <h4 class="text-subtitle1 q-mt-sm">Copying Search Results</h4>
          <p>After performing a search, you can copy all found passages at once:</p>
          <ol>
            <li>Perform your search</li>
            <li>Click the "Copy found verses" button in the message line</li>
            <li>All search results will be copied in your default or selected template format</li>
          </ol>
          <p>This is useful for creating comprehensive reference lists or study materials.</p>

          <h3 class="text-h6 q-mt-md">Advanced Search Techniques</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Regular Expression Search</h4>
          <p>For advanced users, Jota Bible App supports regular expression searches:</p>
          <ol>
            <li>Start your search query with a forward slash (/)</li>
            <li>Enter your regular expression pattern</li>
            <li>Press Enter or click the search icon</li>
          </ol>
          <p>Example: <code>/\blov\w*\b</code> would find all words starting with "lov".</p>

          <h4 class="text-subtitle1 q-mt-sm">Book-Specific Searches</h4>
          <p>To search within specific books only:</p>
          <ol>
            <li>Enter the book name or abbreviation followed by your search term</li>
            <li>Example: "John love" searches for "love" in the Gospel of John only</li>
          </ol>

          <h4 class="text-subtitle1 q-mt-sm">Multi-Term Searches</h4>
          <p>Combine multiple search terms for more specific results:</p>
          <ul>
            <li><strong>Space-separated terms</strong>: Find passages containing all terms (e.g., "faith hope love")</li>
            <li><strong>Quoted phrases</strong>: Find exact phrases (e.g., "\"love your neighbor\"")</li>
            <li><strong>Combined approaches</strong>: Mix specific phrases and individual terms (e.g., "\"kingdom of God\" faith")</li>
          </ul>

          <h3 class="text-h6 q-mt-md">Settings Management</h3>
          
          <h4 class="text-subtitle1 q-mt-sm">Cross-Device Synchronization</h4>
          <p>Transfer your settings between different devices:</p>
          <ol>
            <li>On your source device, go to Settings > Import / Export and click "Export"</li>
            <li>Save the settings file and transfer it to your target device</li>
            <li>On the target device, go to Settings > Import / Export</li>
            <li>Click "Select settings file" and choose the transferred file</li>
            <li>Click "Import" to apply the settings</li>
          </ol>
          
          <div class="q-pa-md">
            <q-img src="/api/placeholder/800/200" class="rounded-borders screenshot" alt="Export Settings">
              <div class="absolute-bottom text-subtitle1 text-center">
                Export settings interface
              </div>
            </q-img>
          </div>

          <h4 class="text-subtitle1 q-mt-sm">Settings Backup</h4>
          <p>Regularly back up your settings to prevent data loss:</p>
          <ol>
            <li>Go to Settings > Import / Export</li>
            <li>Click "Export"</li>
            <li>Save the file with a descriptive name and date</li>
            <li>Store the backup in a safe location (cloud storage, external drive, etc.)</li>
          </ol>
          <p>This ensures you can restore your customized settings if needed.</p>

          <h3 class="text-h6 q-mt-md">Keyboard Shortcuts</h3>
          <p>Jota Bible App provides several keyboard shortcuts for efficient navigation:</p>
          
          <h4 class="text-subtitle1 q-mt-sm">Navigation Shortcuts</h4>
          <table class="q-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Left Arrow</td>
                <td>Previous chapter</td>
              </tr>
              <tr>
                <td>Right Arrow</td>
                <td>Next chapter</td>
              </tr>
              <tr>
                <td>Up Arrow</td>
                <td>Previous verse</td>
              </tr>
              <tr>
                <td>Down Arrow</td>
                <td>Next verse</td>
              </tr>
              <tr>
                <td>Shift + Up/Down Arrow</td>
                <td>Select multiple verses</td>
              </tr>
              <tr>
                <td>Enter (in search box)</td>
                <td>Execute search</td>
              </tr>
              <tr>
                <td>Escape</td>
                <td>Clear search input</td>
              </tr>
            </tbody>
          </table>

          <h4 class="text-subtitle1 q-mt-sm">Additional Shortcuts</h4>
          <table class="q-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ctrl+C (when text is selected)</td>
                <td>Copy selected text</td>
              </tr>
              <tr>
                <td>Ctrl+F</td>
                <td>Focus search box</td>
              </tr>
              <tr>
                <td>Alt+Left Arrow</td>
                <td>Go back in navigation history</td>
              </tr>
              <tr>
                <td>Alt+Right Arrow</td>
                <td>Go forward in navigation history</td>
              </tr>
            </tbody>
          </table>
          <p>Using keyboard shortcuts can significantly speed up your Bible study and navigation.</p>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const currentTab = ref('intro')
const route = useRoute()

onMounted(() => {
  // Check if section is specified in the route query
  if (route.query.section && typeof route.query.section === 'string') {
    const section = route.query.section
    if (['intro', 'getting-started', 'basic', 'editions', 'settings', 'advanced'].includes(section)) {
      currentTab.value = section
    }
  }
})
</script>

<style lang="scss">
.manual-page {
  .manual-container {
    max-width: 1000px;
    margin: 0 auto;
  }

  h2, h3, h4 {
    margin-top: 1.5rem;
    margin-bottom: 1rem;
  }

  h4 {
    margin-top: 1rem;
    color: var(--q-primary);
  }

  p {
    margin-bottom: 0.8rem;
  }

  ul, ol {
    margin-bottom: 1.2rem;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  .q-tab-panels {
    background-color: transparent;
  }

  .screenshot {
    border: 1px solid var(--q-separator);
    border-radius: 8px;
    margin: 1rem 0;
  }

  code {
    background-color: var(--q-primary-fade);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-size: 0.9em;
  }
}
</style>
