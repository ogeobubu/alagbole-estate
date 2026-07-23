# GitHub Actions Deployment Setup

## Required GitHub Secrets

Go to your repo → Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value |
|-------------|-------|
| `FTP_USERNAME` | `if0_42482652` |
| `FTP_PASSWORD` | Your vPanel password |
| `APP_DOMAIN` | `3v47jhmi.infinityfree.com` |

## How to Deploy

1. Push to `main` branch → auto-deploys
2. Or go to Actions → Deploy to InfinityFree → Run workflow

## First Deploy

After first successful deploy:
1. Visit `https://3v47jhmi.infinityfree.com/deploy` (one-time)
2. Then delete the `/deploy` route from `routes/web.php` and push again
