import { cn } from "../ui/cn";

const WP = process.env.WORDPRESS_URL?.replace(/\/+$/, "");

/**
 * Links written in the WordPress editor often point at the WordPress address
 * (e.g. https://cms.example.com/hubspot-migration/). Point them at this
 * website instead so visitors and search engines stay on the real site.
 * Media files (/wp-content/...) keep their WordPress address.
 */
function localizeLinks(html: string) {
  if (!WP) return html;
  const host = WP.replace(/^https?:\/\//, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return html.replace(new RegExp(`href=(["'])https?://${host}(/(?!wp-content/|wp-json/|wp-admin/)[^"']*)?\\1`, "gi"), (_m, q: string, path = "/") => {
    const clean = path.length > 1 ? path.replace(/\/(?=$|[?#])/, "") : "/";
    return `href=${q}${clean}${q}`;
  });
}

/** Content written in the WordPress editor (headings, images, lists, embeds, blocks). */
export function RichContent({ html, className }: { html: string; className?: string }) {
  // Only people with publishing rights in WordPress can write this HTML.
  return <div className={cn("prose-y", className)} dangerouslySetInnerHTML={{ __html: localizeLinks(html) }} />;
}
