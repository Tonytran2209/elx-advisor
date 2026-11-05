# Loon Studio — 3D interaction

Standalone snapshot of https://loon-studio.webflow.io/3d-interaction.

## Deploy to Vercel

Import this GitHub repository in Vercel. Choose **Other** as the framework preset,
leave Build Command empty, and use `.` as the Output Directory. No environment
variables or build step are required. Both `/` and `/3d-interaction` serve the page.

## Edit

- `index.html`: content, structure, and inline page styles.
- `js/scene.js`: Three.js scenes, camera, lighting, loading, and animation.
- `assets/`: downloaded page CSS, JavaScript, images, and fonts.
- `models/`: original Meshopt GLB models, served directly from this site.
- `vendor/three/`: Three.js 0.150.1 and its addons/license.
- `asset-manifest.json`: original public asset URLs and local replacements.

Preview with any static HTTP server, for example `python3 -m http.server 8000`.
Opening index.html directly as a file will not work with module scripts/models.

This is the publicly delivered page, not the Webflow Designer project or CMS.
Published Webflow runtime files are retained for layout and slider interactions.
Google Analytics, PostHog, HubSpot, the old consent widget and unused Cal embed
were removed from this copy. Add your own integrations if needed.
The original “See more” and “Contact” links point to `#`; set their destinations.
Third-party libraries retain their respective licenses.
