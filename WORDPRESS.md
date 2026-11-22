# Managing website content from WordPress

The Eonco Digital website reads its **blog posts**, **projects (case studies)** and **testimonials** from your WordPress dashboard. Your team writes and publishes in WordPress, and the website updates within seconds. No code, no rebuilds.

Everything else (services, pricing, pages and design) lives in the website code.

---

## One-time setup (about 15 minutes)

### 1. Install the plugin in WordPress

1. Use the ready-made file `wordpress/eonco-headless.zip` from this project. Don't re-zip the folder with PowerShell's `Compress-Archive`. It writes Windows-style paths that make WordPress say *"Plugin file does not exist"*.
2. In WordPress, go to **Plugins → Add New → Upload Plugin**, choose the zip and click **Install Now**, then **Activate**.
   - If an earlier upload failed, first delete the broken copy under **Plugins** (or remove `wp-content/plugins/eonco-headless` with your host's file manager), then upload again.
3. You will see two new menu items: **Projects** and **Testimonials**.

### Plugin updates are automatic (no more uploads)

From version 1.2 the plugin updates itself. Every time the website is deployed, it publishes the latest plugin at `/wp-plugin/`. WordPress checks that address (based on **Settings → Eonco Website → Website URL**) and installs new versions automatically. You only ever upload the zip once.

- To check manually: **Dashboard → Updates → Check again**.
- For developers: to ship a plugin change, edit `wordpress/eonco-headless/eonco-headless.php`, raise `Version:` and `VERSION` in that file, and deploy. `npm run build` repackages it (`npm run plugin:build` does it on its own).

### 2. Make the WordPress API readable

Go to **Settings → Permalinks**, choose **Post name** and click **Save**. Then open `https://YOUR-WORDPRESS-SITE/wp-json/wp/v2/posts` in a browser. If you see text that starts with `[{"id":`, it works.

### 3. Connect the website (Vercel)

In Vercel: **Project → Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `WORDPRESS_URL` | Your WordPress address, e.g. `https://cms.eoncodigital.com` (no slash at the end) |
| `REVALIDATE_SECRET` | A long random password, e.g. from a password generator |

Then **redeploy** the project once.

### 4. Connect WordPress back to the website

In WordPress: **Settings → Eonco Website**

- **Website URL**: the live website address, e.g. `https://eoncodigital.com`
- **Refresh secret**: the same `REVALIDATE_SECRET` value from step 3

Click **Save**, then **Test connection**. You should see *"Connected. The website refreshed successfully."*

> If your WordPress site is still your current public website, leave **"Send visitors … to the website"** switched off until the new site is live.

---

## Day-to-day: what your team does

### Blog posts → `/blog`

Use **Posts → Add New** as normal.

- **Title**, **content** (the normal editor, with headings, images, lists and quotes) and **Excerpt** (the summary shown on cards).
- **Category**: the first category (other than *Uncategorized*) is shown as the post's label.
- **Featured image**: used as the cover. Without one, the site draws a branded cover.

### Projects (case studies) → `/case-studies`

Use **Projects → Add project**.

| Field | What to write |
|---|---|
| Title | e.g. *Patient Lifecycle Automation for a Multi-Site Clinic Group* |
| Excerpt | One-sentence summary |
| Featured image | A screenshot of the work (optional; without it the site draws a mockup in the colours you pick) |
| Client name | Short name shown on hover. Use an anonymised name if the client has not approved theirs |
| Industry | Used for the filter on the Case Studies page |
| Tags | Comma separated: `Healthcare, Service Hub, Automation` |
| Results | One per line, as `value | label`, e.g. `38% | Faster enquiry response` |
| The challenge / What we built / The outcome | One paragraph per line |
| Tools & stack | Comma separated |
| Feature on homepage | Tick for up to 6 projects to show in the homepage showcase |

### Testimonials → homepage

Use **Testimonials → Add testimonial**.

- **Title**: the person's name
- **Main editor**: the quote
- **Role & company**: e.g. *Head of Sales, Acme Logistics*
- **Use as the large featured quote**: tick one testimonial

Only publish quotes and results the client has approved.

---

## Who can do what

Give each employee their own WordPress login (**Users → Add New**):

- **Author**: can write and publish their own posts
- **Editor**: can publish and edit everyone's posts, projects and testimonials (recommended for the marketing lead)
- **Administrator**: everything, including plugins and settings (keep this to one or two people)

---

## How it works (for developers)

- `src/lib/wordpress.ts` fetches from the WordPress REST API (`/wp-json/wp/v2/posts`, `/case-studies`, `/testimonials`) and maps it to the site's types. If `WORDPRESS_URL` is empty or WordPress is unreachable, it falls back to the sample content in `src/content`.
- Pages are cached for 5 minutes. When content is published, updated or deleted, the plugin calls `POST /api/revalidate` with the `x-revalidate-secret` header, which clears the cache at once.
- New post and project URLs work immediately (`dynamicParams = true`), with no rebuild.
- Post content is rendered as HTML from WordPress, so only give publishing rights to people you trust.
