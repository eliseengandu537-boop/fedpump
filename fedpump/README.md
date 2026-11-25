# Fedpump website

A responsive company website built from Fedpump's supplied 2026 company profile. Original company photography and branding are embedded locally. The deployable site is in `dist/`; no production build or runtime dependencies are required.

## Local preview

Run `npm run dev` from this folder, then visit http://127.0.0.1:4173.

You can also run `npm run dev` from the parent `website 1234` folder and open http://localhost:4173. Leave the terminal running while previewing; press Ctrl+C to stop it.

## Vercel deployment

Both the repository root and this folder include a `vercel.json`. From the repository root, Vercel publishes `fedpump/dist`; when this folder is selected as the project root, it publishes `dist`. Both configurations use the **Other** framework preset and skip installation and build commands because the site is already static.

To deploy from either folder, run `npx vercel@latest login`, then `npx vercel@latest --prod`. Sign in with the Vercel account that should own the site and select its account/team when prompted.

Alternatively, import the Git repository in Vercel, leave its Root Directory as the repository root, and use the included configuration. If selecting `fedpump` as Root Directory, its own configuration supplies the correct output path. No environment variables are required.

The `.vercelignore` files exclude PDF extraction artifacts, development tools and other local-only material from CLI uploads. The enquiry form sends submissions through FormSubmit. After deployment, submit the form once and activate the confirmation email sent to fedpump@outlook.com.

## Checks

Run `npm run check` for JavaScript syntax validation. Development dependencies support PDF asset extraction and browser checks only.

## Editing

- `dist/index.html`: company content, contact details and the enquiry assistant.
- `dist/styles.css`: visual system, responsive layouts and reduced-motion styles.
- `dist/app.js`: service selector, mobile navigation, galleries, guided project enquiry assistant, email enquiry builder, scroll parallax, staggered reveals, sticky navigation and page progress.
- `dist/assets/`: original logo and photographs extracted from the supplied company profile, plus the approved looping hero video.
- `dist/privacy-policy.html` and `dist/privacy.css`: privacy policy, linked from the homepage footer, enquiry form and project assistant. The page explains the enquiry workflows and the owner's confirmation that enquiries are used only to reply and arrange work. Review this policy whenever providers, tracking or enquiry handling change.
- `scripts/prepare-favicons.mjs`: run with Node to regenerate square PNG icons, the Apple touch icon and the multi-size ICO from the existing company logo. These files are deployed at stable root URLs; Google decides when to refresh the search-result icon.

The enquiry form sends submissions through FormSubmit to fedpump@outlook.com. The guided project assistant opens the visitor's email application with a prepared draft for the visitor to send. The assistant does not use a live AI model, send messages, or store lead details on a server. Manrope and DM Sans are bundled locally, with their font licences, so the site makes no external font requests.

Company facts and contact details are based on the supplied profile. No ISO certification is claimed; the profile describes ISO 9001 as in progress. The original PDF, which includes affidavit pages, is not included in the deployed assets.

## Google Search and Google Maps

The primary website is **https://www.fedpump.com/**. The homepage canonical URL, social previews, `LocalBusiness` / `WebSite` / `WebPage` structured data, `dist/robots.txt`, and `dist/sitemap.xml` all use this domain. If the domain changes, update these together. The sitemap lists the homepage and privacy policy; section anchors are not separate pages. Opening hours were confirmed by the owner as 24 hours every day.

Publishing these files prepares the website for indexing. It does not claim the Google Business Profile, verify Search Console ownership, or guarantee indexing or ranking.

1. Sign in to [Google Business Profile](https://business.google.com/) with the owner's Google account. Claim the existing **Fedpump CC** listing through **Own this business?** if needed, and complete Google's verification. Use the existing listing rather than creating a duplicate.
2. In **Edit profile**, add **https://www.fedpump.com/** as the website. Confirm **96 Craig Road, Anderbolt, Boksburg, 1459**, primary phone **060 532 4233**, and **open 24 hours** on every day. The office number **011 894 3658** can remain an additional phone number.
3. Add **https://www.fedpump.com/** as a URL-prefix property in [Google Search Console](https://search.google.com/search-console/). Choose an available ownership verification method. For HTML-tag verification, add the exact Google-provided `google-site-verification` meta tag inside the `<head>` in `dist/index.html` and deploy before clicking Verify. For HTML-file verification, place Google's exact verification file in `dist/` and deploy. Never invent a verification token.
4. After verification, submit **https://www.fedpump.com/sitemap.xml** under **Sitemaps**. Use **URL Inspection** for **https://www.fedpump.com/**, run the live test, and select **Request indexing**.
5. Check the published homepage in Google's [Rich Results Test](https://search.google.com/test/rich-results). Search Console's indexing report is the source of truth for indexing status. Crawling can take days to weeks; a request does not guarantee inclusion or a particular position.

Google's references: [edit a Business Profile](https://support.google.com/business/answer/3039617), [local business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business), and [request crawling](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

For Render web services deployed from the repository root, the root `package.json` starts this static site and the server serves `dist/` on Render's assigned port. GitHub Pages deployment is defined in `.github/workflows/deploy-pages.yml`. Before the first Pages deployment, enable Pages in the repository’s **Settings → Pages** and set the build and deployment source to **GitHub Actions**. The workflow publishes the static site from `dist/` on pushes to `main` and can also be started manually from the Actions tab.
