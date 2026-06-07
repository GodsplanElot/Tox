# Adsterra Banner Setup For ToxicReels

This guide explains how to create the Adsterra banner code, map it into ToxicReels frontend env variables, and deploy it safely.

## Current Project Integration

The download modal already supports Adsterra through Vite env variables:

```env
VITE_ADSTERRA_BANNER_KEY=
VITE_ADSTERRA_BANNER_SRC=
VITE_ADSTERRA_BANNER_WIDTH=300
VITE_ADSTERRA_BANNER_HEIGHT=250
VITE_ADSTERRA_BANNER_FORMAT=iframe
```

The real values must not be committed to Git. Put them in:

- `frontend/.env.local` for local testing.
- Vercel project environment variables for production.

The backend on Lightsail does not control frontend banner env values because the React app is hosted on Vercel.

## Phase 1: Create Or Prepare Your Adsterra Publisher Account

1. Go to Adsterra and sign in as a Publisher.
2. If you do not have a publisher account, create one and verify your email.
3. Add your payment details when Adsterra requires it for publisher setup.
4. Make sure the account is approved enough to add a website and request ad units.

## Phase 2: Add ToxicReels As A Website

1. Open the Adsterra Publisher dashboard.
2. Go to `Websites`.
3. Click `Add website` or `Add new website`.
4. Enter the site URL:

```text
https://toxicreels.com
```

5. Choose the closest category for the platform, for example:

```text
Entertainment
```

6. Select a banner ad unit.
7. Recommended first banner size for the ToxicReels download modal:

```text
300x250
```

This size fits desktop and mobile modals better than a wide `728x90` banner.

8. Submit the website/ad unit for approval.
9. Wait for Adsterra approval if the dashboard marks it as pending.

## Phase 3: Get The Banner Code

After approval:

1. Go back to `Websites`.
2. Find `toxicreels.com`.
3. Open the banner/ad unit section.
4. Click `Get code`, `All codes`, or the equivalent code button.
5. Copy the banner script.

Adsterra banner code usually looks similar to this:

```html
<script type="text/javascript">
  atOptions = {
    'key' : 'YOUR_BANNER_KEY',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/YOUR_SCRIPT_PATH/invoke.js"></script>
```

The exact domain/path can differ. Use the values from your own Adsterra dashboard.

## Phase 4: Map The Adsterra Code To ToxicReels Env Values

From the copied code, extract:

```env
VITE_ADSTERRA_BANNER_KEY=YOUR_BANNER_KEY
VITE_ADSTERRA_BANNER_SRC=https://www.highperformanceformat.com/YOUR_SCRIPT_PATH/invoke.js
VITE_ADSTERRA_BANNER_WIDTH=300
VITE_ADSTERRA_BANNER_HEIGHT=250
VITE_ADSTERRA_BANNER_FORMAT=iframe
```

Important:

- If Adsterra gives the script URL starting with `//`, add `https:` in front of it.
- Keep width and height aligned with the ad unit you created.
- Do not include quotes around env values.
- Do not paste the full `<script>` tags into `.env.local`.

## Phase 5: Test Locally

Edit:

```text
frontend/.env.local
```

Add or update:

```env
VITE_ADSTERRA_BANNER_KEY=your-real-key
VITE_ADSTERRA_BANNER_SRC=https://your-real-adsterra-script-url/invoke.js
VITE_ADSTERRA_BANNER_WIDTH=300
VITE_ADSTERRA_BANNER_HEIGHT=250
VITE_ADSTERRA_BANNER_FORMAT=iframe
```

Restart the frontend dev server because Vite only reads env variables at startup:

```powershell
cd frontend
npm.cmd run dev
```

Then test:

1. Open a movie or episode detail page with a download link.
2. Click `Download`.
3. Confirm the redirect modal opens.
4. Confirm the ad area loads instead of the `Sponsored space` placeholder.
5. Wait for the countdown.
6. Click `Continue to site`.
7. Confirm the download/watch URL opens in a new tab.

## Phase 6: Add Production Env Values In Vercel

Because the frontend is hosted on Vercel, production Adsterra values must be configured in Vercel.

1. Open Vercel.
2. Select the ToxicReels frontend project.
3. Go to `Settings`.
4. Open `Environment Variables`.
5. Add these variables for `Production`:

```env
VITE_ADSTERRA_BANNER_KEY=your-real-key
VITE_ADSTERRA_BANNER_SRC=https://your-real-adsterra-script-url/invoke.js
VITE_ADSTERRA_BANNER_WIDTH=300
VITE_ADSTERRA_BANNER_HEIGHT=250
VITE_ADSTERRA_BANNER_FORMAT=iframe
```

6. Add the same values to `Preview` if you want branch preview deployments to show ads.
7. Redeploy the frontend from Vercel.

## Phase 7: Lightsail Note

Lightsail hosts the Django backend at:

```text
https://api.toxicreels.com
```

The Adsterra banner is frontend-only, so there is nothing to add to the Lightsail backend `.env` for this feature.

Only deploy backend changes to Lightsail if the backend code changed. For this Adsterra banner setup, the backend does not need a restart.

## Phase 8: Production Verification

After Vercel redeploys:

1. Open:

```text
https://toxicreels.com
```

2. Navigate to a movie or episode with a download link.
3. Click `Download`.
4. Verify:
   - Modal opens.
   - Non-affiliation message is visible.
   - Adsterra banner loads.
   - Closing the modal removes the ad.
   - Continue unlocks after 5 seconds.
   - Continue opens the correct download/watch URL.

If the placeholder still shows, one of these is wrong:

- `VITE_ADSTERRA_BANNER_KEY` is missing.
- `VITE_ADSTERRA_BANNER_SRC` is missing.
- Vercel was not redeployed after env changes.
- The Adsterra website/ad unit is still pending approval.
- The browser blocked the ad script with an ad blocker.
