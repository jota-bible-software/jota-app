# Multi-Domain Setup for Jota Bible App

This document explains how the Jota Bible App is configured to work with multiple domains or subdomains, all pointing to the same directory.

## Overview

The application is designed to work in two scenarios:
1. When accessed via `netanel.pl/jota` (main domain with subdirectory)
2. When accessed via any subdomain like `bible.netanel.pl`, `biblia.netanel.pl`, or `jota.netanel.pl` (direct root path)

## How It Works

### 1. Domain Detection

When the app loads, it uses the `domain-handler.js` script to detect the current domain environment:

```javascript
// In public/domain-handler.js
(function() {
  // Detect if we're on a subdomain
  const isSubdomain = /* detection logic */;
  
  // Configure app with the right base path
  window.JOTA_APP_CONFIG = {
    isSubdomain: isSubdomain,
    hostname: hostname,
    basePath: isSubdomain ? '' : '/jota'
  };
  
  // For subdomains, adjust the base URL via <base> tag
  if (isSubdomain) {
    // Create/update base element...
  }
})();
```

### 2. Router Configuration

The Vue Router uses the detected domain information to set the correct base URL:

```typescript
// In src/router/index.ts
// Default to /jota/ for the main domain
let baseUrl = '/jota/';

// If subdomain detected, use root path
if (window.JOTA_APP_CONFIG?.isSubdomain) {
  baseUrl = '/';
}

// Create router with dynamic base URL
const Router = createRouter({
  history: createHistory(baseUrl),
  // ...
});
```

### Server Configuration

You will need to configure your web server to handle the different domain scenarios. Here's an example of how to set up Apache:

```apache
# For main domain (netanel.pl), use /jota/ as base path
RewriteCond %{HTTP_HOST} ^netanel\.pl$ [NC,OR]
RewriteCond %{HTTP_HOST} ^www\.netanel\.pl$ [NC]
RewriteRule ^(.*)$ - [E=BASE_PATH:/jota/]

# For any subdomain, use root (/) as base path
RewriteCond %{HTTP_HOST} !^netanel\.pl$ [NC]
RewriteCond %{HTTP_HOST} !^www\.netanel\.pl$ [NC]
RewriteRule ^(.*)$ - [E=BASE_PATH:/]

# SPA routing
RewriteBase %{ENV:BASE_PATH}
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . %{ENV:BASE_PATH}index.html [L]
```

This is essentially what the included `.htaccess` file contains.

## Deployment

The application is automatically deployed via GitHub Actions. The workflow is configured to:

1. Build the application
2. Upload the files to the server's `public_html/jota/` directory

## Adding a New Subdomain

To add a new subdomain:

1. Set up the subdomain in your domain registrar or DNS settings
2. Configure the subdomain to point to the same directory (`public_html/jota/`)
3. No code changes required - the app will automatically detect the new subdomain

## Testing Locally

To test different domain scenarios locally:

1. Use `pnpm dev` for standard development
2. Edit your hosts file to test with subdomains:
   ```
   127.0.0.1 test-subdomain.localhost
   ```
3. Access via `http://test-subdomain.localhost:8080` to simulate a subdomain

## Troubleshooting

If the app isn't correctly detecting the domain:

1. Check the browser console for the `Domain detection:` message
2. Verify the `.htaccess` file is being processed correctly
3. Check server logs for any rewrite rule errors
