This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Unified funnel ingest

Analytics flows through The Hub's `/api/funnel-event` endpoint, not Vercel Analytics or GA4. Every outbound CTA fires a `cta_click` / `lead_form` / `external_link` / `scroll_depth` / `quiz_started` / `quiz_completed` / `lead_submitted` event, signed with an HMAC secret and stamped `marketing_ref=sammorrispb`.

See `src/lib/funnelClient.ts` (browser → `/api/funnel-track` proxy) and `src/lib/funnelServer.ts` (server → Hub, signed). URL helpers `hubUrl()` / `crUrl()` in `src/lib/urls.ts` stamp `?ref=sammorrispb` / `utm_source=sammorrispb` on every cross-site link.

Required env var (set in `.env.local` for dev and Vercel project settings for prod):

```
FUNNEL_INGEST_SECRET_SAMMORRISPB=<shared HMAC secret; must match The-Hub>
```
