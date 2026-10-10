# Getting the site into Google Search

Google can find a site on its own, with no set time for it. These steps tell
Google about the site directly. No programming is needed. The steps use
`https://nick-baumann.netlify.app/`; type it exactly like that.

## What you need

- A Google account (for example a Gmail address).
- Access to this repository on GitHub, to upload one file.

## Steps

1. Open [Google Search Console](https://search.google.com/search-console) and
   sign in with your Google account.
2. Click **Add property**. Choose **URL prefix** (the right-hand box), enter
   `https://nick-baumann.netlify.app/` and click **Continue**. Do not use the
   **Domain** box: it needs settings at the domain owner, and Netlify owns
   `netlify.app`.
3. In the list of verification methods, open **HTML file** and click the
   download button. A file with a name like `google1a2b3c4d.html` is saved to
   your computer. Leave the Search Console tab open.
4. On GitHub, open this repository, then the folder `personal-site.web`, then
   the folder `public`. Click **Add file**, then **Upload files**. Drag the
   downloaded file into the page. Choose **Commit directly to the `main`
   branch** and click **Commit changes**. If GitHub only offers to create a new
   branch, do that, then click **Create pull request** and **Merge pull
   request**.
5. Netlify publishes the change by itself, usually within a few minutes. To
   check, open `https://nick-baumann.netlify.app/` followed by the file name,
   for example `https://nick-baumann.netlify.app/google1a2b3c4d.html`. The page
   should show one line starting with `google-site-verification`.
6. Go back to the Search Console tab and click **Verify**. Do not delete the
   file later: Google checks it again from time to time.
7. Paste `https://nick-baumann.netlify.app/` into the search bar at the top of
   Search Console and press Enter. When the result appears, click **Request
   indexing**. This site has no sitemap file, so skip the **Sitemaps** menu;
   this step replaces it.

## How long it takes

Google states that crawling and indexing can take from a few days to a few
weeks. Being in the index does not decide where the site appears in the results.

To check, search Google for `site:nick-baumann.netlify.app` (with no space after
the colon). In Search Console, the **Pages** report shows which pages are
indexed and why any are not.
