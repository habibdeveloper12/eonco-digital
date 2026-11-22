# Managing the website from WordPress

WordPress is the dashboard for the Eonco Digital website. Your team edits in WordPress, and the website (Next.js) updates within seconds. No code and no rebuilds.

| In WordPress | On the website |
|---|---|
| **Services** | Every service page, e.g. `/hubspot-migration`, plus the menus |
| **Industries** | `/industries` and `/industries/{slug}`, the case-study filter and menus |
| **HubSpot Themes** | `/hubspot-themes`, theme pages and the homepage carousel |
| **Pages** | Any new page at `/{slug}` (e.g. `/careers`), plus Privacy Policy and Terms |
| **Posts** | `/blog` |
| **Projects** | `/case-studies` and the homepage showcase |
| **Testimonials** | Homepage quotes |
| **Settings → Eonco Company Details** | Contact details, offices, socials, homepage headline, homepage figures, homepage FAQ, default SEO |

Still in the website code: the About page, the page layouts and design, the HubSpot Modules and Apps lists, and the homepage section headings.

---

## One-time setup

### 1. Install or update the plugin

- **Already installed?** It updates itself to version 1.3 after the website is deployed. To speed that up, go to **Dashboard → Updates → Check again**.
- **New install:** go to **Plugins → Add New → Upload Plugin** and choose `wordpress/eonco-headless.zip`, then **Activate**. Don't re-zip the folder with PowerShell's `Compress-Archive`. It writes Windows-style paths that make WordPress say *"Plugin file does not exist"*.

After updating, go to **Settings → Permalinks** and click **Save** once. This registers the new Services, Industries and HubSpot Themes sections.

### 2. Website environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Value |
|---|---|
| `WORDPRESS_URL` | Your WordPress address, e.g. `https://cms.eoncodigital.com` (no slash at the end) |
| `REVALIDATE_SECRET` | A long random password |
| `NEXT_PUBLIC_SITE_URL` | `https://www.eoncodigital.com` |

Redeploy once after changing them.

### 3. Connect WordPress to the website

In WordPress, go to **Settings → Eonco Website**:

- **Website URL**: `https://www.eoncodigital.com`
- **Refresh secret**: the same value as `REVALIDATE_SECRET`
- **Search engines**: keep *"Hide this WordPress site from Google"* ticked

Click **Save**, then **Test connection**.

### 4. Import the website's current content (important)

On the same page, click **Import website content**. It copies everything the website shows today into WordPress (16 services, industries, themes, blog posts, homepage headline and FAQ, and draft legal pages), so you edit instead of starting from blank.

> **Do this before you publish your first service, industry or theme.** As soon as one item of a type is published in WordPress, WordPress becomes the master list for that type. Anything not published there disappears from the website. Running the import first means nothing disappears.

The import never overwrites anything that already exists, so it is safe to run again.

---

## Day-to-day editing

### Services

Go to **Services → (choose one)**.

- **Title**: the name in menus and cards.
- **Excerpt** (sidebar): the one-line summary on cards and in the menu.
- **Featured image**: the picture at the top of the page. Without one, the site draws an illustration.
- **Main editor**: long-form content, shown as an "in depth" section after the overview. Use it for SEO (see below).
- **Order** (sidebar → *Page attributes*): the position in the menu.
- **Service page content** box: headline, overview, cards, comparison table, process, 3 packages and FAQs. **Any empty field keeps the website's current text.**

  Lists are written one item per line, as `Title | Text`. For example:

  ```
  Salesforce to HubSpot | Objects, history and automation rebuilt natively.
  Zoho to HubSpot | Modules, notes and attachments mapped cleanly.
  ```

- **New service**: go to **Services → Add service**. Its address is the slug, e.g. *hubspot-audit* becomes `/hubspot-audit`. It appears in the menu automatically.
- **Remove a service**: switch it to Draft or move it to Trash.

### Industries and HubSpot Themes

These work the same way as Services. For a theme, upload a screenshot as the **Featured image** to replace the drawn mockup. You can also add a **Buy link** (e.g. its HubSpot Marketplace listing).

### Pages

Use **Pages → Add New** as normal. The page appears at `/{slug}`.

- A page with the slug `privacy-policy` or `terms-and-conditions` replaces the website's template text.
- Slugs that already have a designed page (about, contact, blog, case-studies, industries and others) can't be replaced this way.

### Blog posts, Projects, Testimonials

These work as before. Only publish projects and quotes the client has approved.

### Homepage

Go to **Settings → Eonco Company Details**. You can edit:

- the headline (one line per row; the last line is shown in red)
- the intro text
- the Google title and description
- up to 10 FAQ questions
- the figures
- the offices
- the social links

---

## SEO & AI answers (AEO)

Every service, industry, theme, page, post and project has a **Search & social** box:

| Field | Tip |
|---|---|
| Search title | About 60 characters, main phrase first: *HubSpot Migration Services \| Zero Data Loss*. "\| Eonco Digital" is added automatically. |
| Search description | 120 to 155 characters. Say what you offer and who it is for. |
| Share image | 1200 × 630 px, used on LinkedIn, Facebook and X. |
| Hide from search engines | Removes the page from Google, the sitemap and `llms.txt`. |

If Yoast SEO is installed, its description, share image and noindex setting are also used when the box is empty.

The website handles these automatically:

- canonical URLs
- `sitemap.xml` with real "last updated" dates
- `robots.txt`
- `llms.txt` for AI assistants
- structured data: Organization, Service, FAQ, Breadcrumb, BlogPosting and Product

What ranks a page is **the content you write**:

- **Long-form content:** write 800 to 1,500 words in the main editor of each service, with `##` headings that match real searches ("How much does a HubSpot migration cost?").
- **Answer first:** answer each question in the first sentence. Google's AI Overviews, ChatGPT and Perplexity quote those sentences.
- **Internal links:** link between related services, case studies and posts. Links you add in the editor are rewritten to the website address automatically.
- **Images:** add alt text to every image (**Media → image → Alternative text**).

---

## Good to know

- **Preview:** WordPress's *Preview* button shows the WordPress theme, not the website. Publish, then check the live page with the **View** link (it opens the real website).
- **Speed:** changes appear within a few seconds of publishing. If WordPress can't reach the website, they still appear within 5 minutes.
- **If WordPress is down:** the website keeps showing the last published content and never goes blank.

## Who can do what

- **Author**: writes and publishes their own posts.
- **Editor**: everything content-related, including services, pages, projects and Company Details (recommended for the marketing lead).
- **Administrator**: plugins, settings and the import (keep this to one or two people).

## How it works (for developers)

- `src/lib/wordpress.ts`: posts, projects, testimonials and settings. `src/lib/cms.ts`: services, industries, themes and pages. Both merge WordPress data over the built-in content in `src/content` by slug, and fall back to it when WordPress is empty or unreachable.
- Fetches are cached for 5 minutes with the tag `wordpress`. The plugin calls `POST /api/revalidate` (header `x-revalidate-secret`) on publish, update or delete, and on settings save.
- `GET /api/wp-export` (same secret) returns the built-in content in the plugin's format, for the import.
- Plugin source: `wordpress/eonco-headless/`. To ship a change, raise `Version:` and `VERSION` and deploy. `npm run build` repackages it into `public/wp-plugin/`, and WordPress updates itself.
- WordPress HTML is rendered as-is, so only give publishing rights to people you trust.
