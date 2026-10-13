# SKI AI — publish from an Android phone

This project contains the SKI AI website, basic SEO files, and a separate backend for real AI responses.

## A. Publish the website using GitHub Pages

1. In your GitHub repository, open **Add file → Upload files** (or create each file with **Add file → Create new file**).
2. Upload `index.html`, `robots.txt`, and `sitemap.xml` into the repository's top/root level. Upload the `worker` folder too if convenient, but it is deployed separately.
3. Commit the files to the `main` branch.
4. Open repository **Settings → Pages**.
5. Under build/deployment, choose **Deploy from a branch**, select `main` and `/(root)`, then Save.
6. Wait for the Pages URL. It should look like `https://YOUR-USERNAME.github.io/ski-ai/` if your repository is named `ski-ai`.
7. Open the URL and confirm the page loads.

## B. Connect real AI responses

The public website alone cannot securely hold an API key. A separate backend is required.

1. Create/sign in to a Cloudflare account at https://dash.cloudflare.com/.
2. Create a Worker and paste the full contents of `worker/worker.js` into its editor, then deploy.
3. In the Worker settings, add a secret named `OPENAI_API_KEY` with your API key as its value. Never put the key in `index.html`, GitHub, or a public message.
4. AI API access may be billed separately from a ChatGPT subscription. Check current provider pricing and limits before use. If you're under 18, ask a parent/guardian to help with account and payment setup.
5. Copy the Worker URL, e.g. `https://your-worker.your-subdomain.workers.dev`.
6. In GitHub, open `index.html`, tap Edit, find `PASTE_YOUR_BACKEND_URL_HERE`, and replace only that text with the Worker URL. Keep the quotation marks. Commit the change.
7. In `worker/worker.js`, change `Access-Control-Allow-Origin: "*"` to your exact website origin, such as `https://YOUR-USERNAME.github.io`, and redeploy the Worker. Do not leave an unrestricted public endpoint without adding abuse protection/rate limits.

## C. Update search-engine files

1. In `index.html`, replace the example URL in the canonical link with your exact published homepage URL.
2. In `robots.txt`, replace the example sitemap URL with your real sitemap URL.
3. In `sitemap.xml`, replace the example `<loc>` URL with your exact homepage URL.
4. Commit these updates.
5. Open Google Search Console: https://search.google.com/search-console/about
6. Add and verify the website using the method offered for your site.
7. Submit the sitemap URL and use URL Inspection to request indexing of the homepage.

Google can take days or longer to index a new website. Submitting a site does not guarantee indexing, ranking, or first place for the name.

## D. Important limits and security

- GitHub Pages hosts static files; it does not run the AI backend.
- The website interface can load before the AI is connected, but replies won't work until the Worker and API key are configured.
- Never share your API key or put it in browser-side JavaScript.
- Add rate limiting, usage limits, and abuse protection before making the AI publicly available. Otherwise other people could run up API usage.
- The model name in `worker.js` must be available to your API account; change it if needed.
- This is a starter project, not a fully production-hardened service.
