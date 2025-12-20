# Jota Bible App

Ergonomic app to search and read the Bible


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

See [MULTI_DOMAIN_SETUP.md](./docs/multi-domain-setup.md) for detailed information about the multi-domain configuration.

---

## Deployment

The app uses a **QA-first deployment** strategy with instant promotion to production.

### Environments

| Environment | URL | Trigger |
|-------------|-----|---------|
| **QA** | https://jota-next.netanel.pl/jota/ | Automatic on push to `main` |
| **Production** | https://netanel.pl/jota/ | Manual promotion |

### Workflow

```
Push to main → Tests run → Auto-deploy to QA → Manual test → Promote → Live!
```

### Deploy to QA

Simply push to the `main` branch. After tests pass, the app is automatically deployed to the QA environment.

```bash
git push origin main
```

### Promote to Production

After testing on QA, promote to production:

**Via command line:**
```bash
pnpm run deploy:promote
```

**Via GitHub UI:**
1. Go to **Actions** → **Promote to Production**
2. Click **Run workflow**
3. Type `promote` in the confirmation field
4. Click **Run workflow**

The switch is instant (directory rename, not file copy).

### Rollback Production

If something goes wrong, rollback to the previous version:

**Via command line:**
```bash
pnpm run deploy:rollback
```

**Via GitHub UI:**
1. Go to **Actions** → **Rollback Production**
2. Click **Run workflow**
3. Type `rollback` in the confirmation field
4. Click **Run workflow**

This instantly restores the previous production version.

### Other Deployment Commands

```bash
# Check deployment status
pnpm run deploy:status

# Watch a running workflow
gh run watch

# View logs of last run
gh run view --log
```

> **Note:** These commands require the [GitHub CLI](https://cli.github.com/) (`gh`) to be installed and authenticated.
