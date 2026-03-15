# Deployment Guide

## Vercel Deployment

### Quick Deploy (from GitHub)

1. Go to https://vercel.com/new
2. Import the repository: `wowsuchbot/such-gallery`
3. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install --legacy-peer-deps`
   - **Output Directory**: `.next`

4. Add environment variables:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEYNAR_API_KEY` - Your Neynar API key
   - `NEXT_PUBLIC_URL` - Your production URL (e.g., `https://such-gallery.vercel.app`)
   - `ALCHEMY_API_KEY` - Your Alchemy API key (optional but recommended)
   - `SESSION_PASSWORD` - Secure password for session encryption (min 32 chars)

5. Click "Deploy"

### Setting Up PostgreSQL

You'll need a PostgreSQL database. Options:

#### Option 1: Supabase (Recommended)
1. Go to https://supabase.com
2. Create a new project
3. Get the connection string from Settings → Database
4. Add to Vercel as `DATABASE_URL`

#### Option 2: Railway
1. Go to https://railway.app
2. Create a new PostgreSQL database
3. Copy the connection string
4. Add to Vercel as `DATABASE_URL`

#### Option 3: Neon
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string
4. Add to Vercel as `DATABASE_URL`

### Running Database Migrations

After deploying, you need to create the database schema:

1. SSH into the Vercel deployment or use the Vercel CLI:
   ```bash
   vercel env pull .env.local
   ```

2. Run the migration:
   ```bash
   npm run db:push
   ```

Or, you can add a custom build script in Vercel to run migrations automatically.

### API Keys

#### Neynar API Key
1. Go to https://neynar.com
2. Sign up for an account
3. Create a new application
4. Copy the API key
5. Add to Vercel as `NEYNAR_API_KEY`

#### Alchemy API Key
1. Go to https://www.alchemy.com
2. Sign up for an account
3. Create a new app on Base mainnet
4. Copy the API key
5. Add to Vercel as `ALCHEMY_API_KEY`

### Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your domain (e.g., `such.gallery`)
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_URL` environment variable

### Webhooks (Optional)

If you want to track quote-casts via Neynar webhooks:

1. Go to https://neynar.com/dashboard/apps
2. Create a webhook for cast.created events
3. Set the target URL to: `https://your-domain.com/api/webhooks/neynar`
4. Filter by parent_url containing your domain

### Post-Deployment Checklist

- [ ] Database is accessible (check logs)
- [ ] Database schema is migrated
- [ ] API keys are working (test NFT metadata fetch)
- [ ] Webhook is configured (if using)
- [ ] Custom domain is set up (if using)
- [ ] Environment variables are all set
- [ ] Test the app end-to-end

### Troubleshooting

#### Build Failures
- Check that `installCommand` is `npm install --legacy-peer-deps`
- Verify all environment variables are set
- Check build logs for specific errors

#### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check that the database allows connections from Vercel
- Test connection locally first with the same URL

#### API Errors
- Verify API keys are correct and have required permissions
- Check that API keys are not rate-limited
- Review API response logs

### Monitoring

- Enable Vercel Analytics in project settings
- Set up error tracking (e.g., Sentry) if needed
- Monitor database usage and costs

## Local Development

After deployment, you can still run locally:

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy environment variables from Vercel
vercel env pull .env.local

# Run database migrations
npm run db:push

# Start dev server
npm run dev
```

## Production vs Development

### Production
- Build optimized for performance
- Environment variables from Vercel
- Database migrations run once during setup

### Development
- Hot reloading enabled
- Local environment variables from `.env`
- Database can use local PostgreSQL or the same production DB

### Switching Environments

Use `vercel env pull .env.local` to pull production environment variables for local testing.

Use `vercel env push .env.local` to push local changes (not recommended for secrets).

## Support

For issues or questions:
- Check the logs in Vercel Dashboard
- Review the main README.md
- Open an issue on GitHub: https://github.com/wowsuchbot/such-gallery/issues
