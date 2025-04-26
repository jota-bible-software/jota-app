# Jota Bible App

Ergonomic app to search and read the Bible

## Multi-Domain Support

This application is designed to work with multiple domains pointing to the same directory:

1. **netanel.pl/jota** - Main site, accessed via a subdirectory
2. **bible.netanel.pl** - Bible-specific subdomain 
3. **biblia.netanel.pl** - Alternative language subdomain
4. Any other subdomains that point to the same directory

The app automatically detects which domain it's running on and adjusts its base URL accordingly.

See [MULTI_DOMAIN_SETUP.md](./MULTI_DOMAIN_SETUP.md) for detailed information about the multi-domain configuration.

### How it Works

1. When loaded, the `domain-handler.js` script detects the current domain
2. For any subdomain (like bible.netanel.pl, biblia.netanel.pl), it sets the base URL to `/`
3. For the main domain (netanel.pl), it uses `/jota/` as the base URL
4. The Vue router uses this information to correctly navigate within the app
5. The .htaccess file also contains rules to properly handle server-side routing

### Deployment

The application is automatically deployed using GitHub Actions when changes are pushed to the main branch. See the workflow file in `.github/workflows/deploy.yaml` for details.

If you need to manually deploy the application:

```bash
# Build the app
pnpm build

# Then upload the dist/spa/ directory to your server
```

### Server Configuration

Make sure your server is properly configured to handle both domains:

1. `bible.netanel.pl` should point to the same directory as `netanel.pl/jota`
2. The server should be configured to rewrite non-existent paths to index.html for SPA routing

See the `.htaccess` file in the `public` directory for the actual implementation.

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
