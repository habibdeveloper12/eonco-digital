<?php
/**
 * Editable website pages for the Take Solution Today website:
 *   - Services, Industries and HubSpot Themes (content types with their own fields)
 *   - "Search & social" box (SEO title, description, share image, hide from Google) on every type
 *   - "View" links that open the real website instead of this WordPress site
 *   - One-click import of the website's current content
 *   - Keeps this WordPress site itself out of search results
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Eonco_Content
{
    /** Icons available on the website (src/components/ui/Icon.tsx). */
    const ICONS = [
        'Rocket', 'Plug', 'ArrowRightLeft', 'LayoutTemplate', 'Megaphone', 'Headset', 'TrendingUp', 'Code2', 'LifeBuoy',
        'PenTool', 'Bot', 'Layers', 'Send', 'Globe', 'Handshake', 'Briefcase', 'HeartPulse', 'ShoppingBag', 'HardHat',
        'Cloud', 'GraduationCap', 'Building2', 'Database', 'Workflow', 'Award', 'Palette', 'Blocks', 'AppWindow', 'Newspaper',
    ];

    /** Types that get the "Search & social" box. */
    const SEO_TYPES = ['post', 'page', 'case_study', 'service', 'industry', 'hs_theme'];

    public static function init()
    {
        add_action('init', [__CLASS__, 'register_types'], 9);
        add_action('init', [__CLASS__, 'register_seo_meta']);
        add_action('add_meta_boxes', [__CLASS__, 'seo_box']);
        add_action('save_post', [__CLASS__, 'save_seo'], 10, 2);
        add_action('admin_enqueue_scripts', [__CLASS__, 'admin_assets']);
        add_filter('enter_title_here', [__CLASS__, 'title_placeholder'], 10, 2);
        add_action('admin_notices', [__CLASS__, 'import_notice']);

        // "View" links in the dashboard open the real website.
        // Only for published items, so WordPress previews of drafts keep working.
        add_filter('post_link', [__CLASS__, 'frontend_link'], 20, 2);
        add_filter('page_link', [__CLASS__, 'frontend_link'], 20, 2);
        add_filter('post_type_link', [__CLASS__, 'frontend_link'], 20, 2);

        // Keep this WordPress site out of Google (the website is the public site).
        add_filter('wp_robots', [__CLASS__, 'robots']);
        add_action('template_redirect', [__CLASS__, 'robots_header'], 1);

        // Import the website's built-in content.
        add_action('admin_post_eonco_import', [__CLASS__, 'import']);
    }

    /* ------------------------------------------------------------------ */
    /* Content types                                                       */
    /* ------------------------------------------------------------------ */

    public static function register_types()
    {
        $common = [
            'public'        => true,
            'show_in_rest'  => true,
            'has_archive'   => false,
            'hierarchical'  => false,
            'supports'      => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields', 'revisions', 'page-attributes'],
        ];

        register_post_type('service', $common + [
            'labels'        => self::labels('Services', 'Service'),
            'rest_base'     => 'services',
            'menu_icon'     => 'dashicons-hammer',
            'menu_position' => 4,
            'rewrite'       => ['slug' => 'service'],
        ]);
        register_post_type('industry', $common + [
            'labels'        => self::labels('Industries', 'Industry'),
            'rest_base'     => 'industries',
            'menu_icon'     => 'dashicons-building',
            'menu_position' => 7,
            'rewrite'       => ['slug' => 'industries'],
        ]);
        register_post_type('hs_theme', $common + [
            'labels'        => self::labels('HubSpot Themes', 'HubSpot Theme'),
            'rest_base'     => 'hubspot-themes',
            'menu_icon'     => 'dashicons-art',
            'menu_position' => 8,
            'rewrite'       => ['slug' => 'hubspot-themes'],
        ]);
    }

    private static function labels($plural, $single)
    {
        return [
            'name'          => $plural,
            'singular_name' => $single,
            'add_new'       => 'Add ' . strtolower($single),
            'add_new_item'  => 'Add new ' . strtolower($single),
            'edit_item'     => 'Edit ' . strtolower($single),
            'all_items'     => 'All ' . strtolower($plural),
            'menu_name'     => $plural,
        ];
    }

    public static function title_placeholder($text, $post)
    {
        if ($post->post_type === 'service') return 'Service name, e.g. HubSpot Migration';
        if ($post->post_type === 'industry') return 'Industry name, e.g. Healthcare';
        if ($post->post_type === 'hs_theme') return 'Theme name, e.g. Atlas';
        return $text;
    }

    /** Line-format help shared by many fields. */
    const PAIRS = 'One per line, written as   Title | Text   Leave empty to keep the website’s current text.';

    /** Fields per type: key => [label, type, help, options]. Merged into Eonco_Headless::fields(). */
    public static function fields()
    {
        $packages = [];
        foreach ([1 => 'Starter', 2 => 'Professional (shown as “Popular”)', 3 => 'Enterprise'] as $n => $name) {
            $packages["eonco_pkg{$n}_name"]     = ["Package {$n} name", 'text', "Default: {$name}. Leave every package field empty to keep the website’s current package."];
            $packages["eonco_pkg{$n}_price"]    = ["Package {$n} price", 'text', 'e.g. $2,000+   $750/mo   Custom'];
            $packages["eonco_pkg{$n}_unit"]     = ["Package {$n} price unit", 'text', 'e.g. /project  (optional)'];
            $packages["eonco_pkg{$n}_timeline"] = ["Package {$n} timeline", 'text', 'e.g. Timeline: 2 to 3 weeks'];
            $packages["eonco_pkg{$n}_items"]    = ["Package {$n} inclusions", 'textarea', self::PAIRS];
        }

        $icons = array_combine(self::ICONS, self::ICONS);

        return [
            'service' => [
                'eonco_group'       => ['Menu group', 'select', 'Which menu the service appears in.', ['hubspot' => 'HubSpot Services', 'digital' => 'Digital Services']],
                'eonco_nav_label'   => ['Menu label', 'text', 'Text shown in the menu. Leave empty to use the title.'],
                'eonco_icon'        => ['Icon', 'select', 'Shown in the menu and hero.', $icons],
                'eonco_hero_title'  => ['Page headline (H1)', 'text', 'The big headline at the top of the page. Include the main search phrase, e.g. “HubSpot Migration Services”.'],
                'eonco_hero_text'   => ['Headline intro', 'textarea', 'One or two sentences under the headline.'],
                'eonco_cta_label'   => ['Button label', 'text', 'e.g. Plan your migration'],
                'eonco_intro_title' => ['Overview heading', 'text', 'Phrase it as the question people search, e.g. “What is HubSpot migration?”'],
                'eonco_intro_body'  => ['Overview text', 'textarea', 'One paragraph per line. Answer the heading’s question in the first sentence.'],
                'eonco_problems'    => ['“Why projects stall” cards', 'textarea', self::PAIRS],
                'eonco_starting'    => ['“Where are you starting from?” cards', 'textarea', self::PAIRS],
                'eonco_results'     => ['“What results you can expect” cards', 'textarea', self::PAIRS],
                'eonco_types'       => ['“Types of service” cards', 'textarea', self::PAIRS],
                'eonco_comparison'  => ['Comparison table', 'textarea', 'One row per line:   Area | Typical approach | Take Solution Today'],
                'eonco_process'     => ['Process steps', 'textarea', self::PAIRS],
            ] + $packages + [
                'eonco_faqs'        => ['FAQs', 'textarea', 'One per line:   Question | Answer   These also appear in Google and AI answers, so answer directly in the first sentence.'],
            ],
            'industry' => [
                'eonco_icon'  => ['Icon', 'select', '', $icons],
                'eonco_intro' => ['Headline intro', 'textarea', 'One or two sentences under “HubSpot for …”.'],
                'eonco_needs' => ['What these teams need', 'textarea', 'One item per line, e.g. Referral and partner tracking'],
            ],
            'hs_theme' => [
                'eonco_category'     => ['Category', 'text', 'e.g. B2B & Agency'],
                'eonco_tagline'      => ['Page headline', 'text', 'e.g. Atlas: The B2B Agency Theme'],
                'eonco_price'        => ['Price', 'text', 'e.g. $299'],
                'eonco_buy_url'      => ['Buy link', 'url', 'Optional, e.g. the HubSpot Marketplace listing. Without it the button opens the contact page.'],
                'eonco_features'     => ['What’s included', 'textarea', 'One feature per line.'],
                'eonco_headline'     => ['Mockup headline', 'text', 'Shown inside the drawn preview when no featured image is set.'],
                'eonco_frame'        => ['Frame colour', 'color', ''],
                'eonco_color_bg'     => ['Mockup background colour', 'color', ''],
                'eonco_color_accent' => ['Mockup accent colour', 'color', ''],
                'eonco_color_ink'    => ['Mockup text colour', 'color', ''],
            ],
        ];
    }

    /** Help shown at the top of each details box. */
    public static function box_intro($type)
    {
        $common = '<strong>Title</strong> = name in menus and cards. <strong>Excerpt</strong> (sidebar) = one-sentence summary on cards. <strong>Featured image</strong> = picture at the top of the page. <strong>Main editor</strong> = long-form content shown on the page (write 800+ words with headings for the best Google ranking). <strong>Order</strong> (sidebar → Page attributes) = position in menus and lists.';
        switch ($type) {
            case 'service':
                return $common . '<br>Every field below is optional: <strong>leave a field empty to keep the website’s current text</strong>. The page address is the slug, e.g. <code>/hubspot-migration</code>.';
            case 'industry':
                return $common . '<br>The page address is <code>/industries/{slug}</code>. Leave a field empty to keep the website’s current text.';
            case 'hs_theme':
                return $common . '<br>The page address is <code>/hubspot-themes/{slug}</code>. Upload a screenshot as the featured image to replace the drawn mockup.';
        }
        return '';
    }

    /** Industries for the project "Industry" dropdown: the published Industries, plus the built-in six. */
    public static function industry_options()
    {
        $opts = Eonco_Headless::INDUSTRIES;
        $posts = get_posts(['post_type' => 'industry', 'post_status' => 'publish', 'numberposts' => 100, 'orderby' => 'menu_order', 'order' => 'ASC']);
        foreach ($posts as $p) {
            $opts[$p->post_name] = $p->post_title;
        }
        return $opts;
    }

    /* ------------------------------------------------------------------ */
    /* Search & social box                                                 */
    /* ------------------------------------------------------------------ */

    const SEO_FIELDS = [
        'eonco_seo_title'       => 'string',
        'eonco_seo_description' => 'string',
        'eonco_seo_image'       => 'string',
        'eonco_noindex'         => 'boolean',
    ];

    public static function register_seo_meta()
    {
        foreach (self::SEO_TYPES as $type) {
            foreach (self::SEO_FIELDS as $key => $kind) {
                register_post_meta($type, $key, [
                    'type'          => $kind,
                    'single'        => true,
                    'show_in_rest'  => true,
                    'default'       => $kind === 'boolean' ? false : '',
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ]);
            }
        }
    }

    public static function seo_box()
    {
        foreach (self::SEO_TYPES as $type) {
            add_meta_box('eonco_seo', 'Search & social (Google, AI answers, LinkedIn)', [__CLASS__, 'render_seo'], $type, 'normal', 'default');
        }
    }

    public static function render_seo($post)
    {
        wp_nonce_field('eonco_seo', 'eonco_seo_nonce');
        $v = function ($k) use ($post) {
            return get_post_meta($post->ID, $k, true);
        };
        ?>
        <style>.eonco-seo p{margin:0 0 16px}.eonco-seo label{display:block;font-weight:600;margin-bottom:6px}.eonco-seo input[type=text],.eonco-seo input[type=url],.eonco-seo textarea{width:100%;max-width:720px}.eonco-count{color:#646970;font-weight:400}</style>
        <div class="eonco-seo">
            <p class="description">Optional. Empty fields use the page title and summary. Yoast SEO or Rank Math values are used too when installed.</p>
            <p><label for="eonco_seo_title">Search title <span class="eonco-count" data-for="eonco_seo_title" data-max="60"></span></label>
                <input type="text" id="eonco_seo_title" name="eonco_seo_title" value="<?php echo esc_attr($v('eonco_seo_title')); ?>" placeholder="Main search phrase first, e.g. HubSpot Migration Services | Zero Data Loss">
                <span class="description">Up to about 60 characters. “| Take Solution Today” is added automatically.</span></p>
            <p><label for="eonco_seo_description">Search description <span class="eonco-count" data-for="eonco_seo_description" data-max="155"></span></label>
                <textarea id="eonco_seo_description" name="eonco_seo_description" rows="3" placeholder="One or two sentences that answer what the page offers and who it is for."><?php echo esc_textarea($v('eonco_seo_description')); ?></textarea>
                <span class="description">About 120 to 155 characters. Shown under the title in Google.</span></p>
            <p><label for="eonco_seo_image">Share image (LinkedIn, Facebook, X)</label>
                <input type="url" id="eonco_seo_image" name="eonco_seo_image" value="<?php echo esc_attr($v('eonco_seo_image')); ?>" placeholder="https://">
                <button type="button" class="button eonco-pick-image" data-target="eonco_seo_image" style="margin-top:6px">Choose image</button>
                <span class="description">1200 × 630 px works best. Empty = featured image.</span></p>
            <p><label><input type="checkbox" name="eonco_noindex" value="1" <?php checked($v('eonco_noindex'), true); ?>> Hide this page from search engines</label>
                <span class="description">Removes it from Google, the sitemap and AI summaries. Use for thank-you pages, duplicates or drafts you published by mistake.</span></p>
        </div>
        <?php
    }

    public static function save_seo($post_id, $post)
    {
        if (!isset($_POST['eonco_seo_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['eonco_seo_nonce'])), 'eonco_seo')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id) || !in_array($post->post_type, self::SEO_TYPES, true)) return;
        update_post_meta($post_id, 'eonco_seo_title', sanitize_text_field(wp_unslash($_POST['eonco_seo_title'] ?? '')));
        update_post_meta($post_id, 'eonco_seo_description', sanitize_textarea_field(wp_unslash($_POST['eonco_seo_description'] ?? '')));
        update_post_meta($post_id, 'eonco_seo_image', esc_url_raw(wp_unslash($_POST['eonco_seo_image'] ?? '')));
        update_post_meta($post_id, 'eonco_noindex', !empty($_POST['eonco_noindex']));
    }

    /** Media picker and character counters for the SEO box. */
    public static function admin_assets($hook)
    {
        if (!in_array($hook, ['post.php', 'post-new.php', 'settings_page_eonco-company'], true)) return;
        wp_enqueue_media();
        $js = <<<'JS'
jQuery(function ($) {
  $(document).on('click', '.eonco-pick-image', function (e) {
    e.preventDefault();
    var target = $('#' + $(this).data('target'));
    var frame = wp.media({ title: 'Choose image', button: { text: 'Use this image' }, library: { type: 'image' }, multiple: false });
    frame.on('select', function () { target.val(frame.state().get('selection').first().toJSON().url).trigger('input'); });
    frame.open();
  });
  function count() {
    $('.eonco-count').each(function () {
      var el = $(this), len = ($('#' + el.data('for')).val() || '').length, max = +el.data('max');
      el.text(len ? '(' + len + ' / ' + max + ')' : '').css('color', len > max ? '#b32d2e' : '#646970');
    });
  }
  $(document).on('input', '#eonco_seo_title, #eonco_seo_description', count);
  count();
});
JS;
        wp_add_inline_script('jquery-core', $js);
    }

    /* ------------------------------------------------------------------ */
    /* Website links                                                       */
    /* ------------------------------------------------------------------ */

    private static function frontend_url()
    {
        $o = get_option(Eonco_Headless::OPT, []);
        return rtrim($o['frontend_url'] ?? '', '/');
    }

    /** Address of a published item on the website, or null. */
    public static function website_path($post)
    {
        $post = get_post($post);
        if (!$post || $post->post_status !== 'publish') return null;
        $slug = $post->post_name;
        switch ($post->post_type) {
            case 'post':       return '/blog/' . $slug;
            case 'case_study': return '/case-studies/' . $slug;
            case 'industry':   return '/industries/' . $slug;
            case 'hs_theme':   return '/hubspot-themes/' . $slug;
            case 'service':    return '/' . $slug;
            case 'page':       return '/' . $slug;
        }
        return null;
    }

    public static function frontend_link($url, $post)
    {
        $base = self::frontend_url();
        $path = $base ? self::website_path($post) : null;
        return $path ? $base . $path : $url;
    }

    /* ------------------------------------------------------------------ */
    /* Keep this WordPress site out of search results                      */
    /* ------------------------------------------------------------------ */

    public static function hide_wordpress()
    {
        $o = get_option(Eonco_Headless::OPT, []);
        return !array_key_exists('noindex', $o) || !empty($o['noindex']);
    }

    public static function robots($robots)
    {
        if (self::hide_wordpress()) {
            $robots['noindex'] = true;
            $robots['nofollow'] = true;
            unset($robots['max-image-preview']);
        }
        return $robots;
    }

    public static function robots_header()
    {
        if (self::hide_wordpress() && !headers_sent()) header('X-Robots-Tag: noindex, nofollow', true);
    }

    /* ------------------------------------------------------------------ */
    /* Import                                                              */
    /* ------------------------------------------------------------------ */

    public static function import_notice()
    {
        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        if (!$screen || $screen->base !== 'edit' || !in_array($screen->post_type, ['service', 'industry', 'hs_theme'], true)) return;
        $count = wp_count_posts($screen->post_type);
        if (($count->publish ?? 0) + ($count->draft ?? 0) > 0) return;
        $url = admin_url('options-general.php?page=eonco-headless#import');
        printf(
            '<div class="notice notice-info"><p><strong>Start with the website’s current content.</strong> Use <a href="%s">Settings → Website Connection → Import website content</a> to copy every page in, then edit what you need. Publishing your first item here before importing will replace the website’s built-in list.</p></div>',
            esc_url($url)
        );
    }

    private static function find($type, $slug)
    {
        $q = get_posts(['post_type' => $type, 'name' => $slug, 'post_status' => 'any', 'numberposts' => 1, 'suppress_filters' => true]);
        return $q ? $q[0] : null;
    }

    private static function add_items($type, $items, $status, &$done)
    {
        foreach ($items as $it) {
            $slug = sanitize_title($it['slug'] ?? '');
            if (!$slug || self::find($type, $slug)) {
                $done['skipped']++;
                continue;
            }
            $args = [
                'post_type'    => $type,
                'post_status'  => $status,
                'post_name'    => $slug,
                'post_title'   => sanitize_text_field($it['title'] ?? $slug),
                'post_excerpt' => sanitize_textarea_field($it['excerpt'] ?? ''),
                'post_content' => isset($it['content']) ? wp_kses_post($it['content']) : '',
                'menu_order'   => (int) ($it['menu_order'] ?? 0),
            ];
            if (!empty($it['date'])) {
                $args['post_date'] = gmdate('Y-m-d H:i:s', strtotime($it['date'] . ' 09:00:00'));
            }
            $id = wp_insert_post($args, true);
            if (is_wp_error($id)) {
                $done['failed']++;
                continue;
            }
            foreach (($it['meta'] ?? []) as $k => $val) {
                if (strpos($k, 'eonco_') !== 0) continue;
                update_post_meta($id, $k, is_string($val) ? sanitize_textarea_field($val) : $val);
            }
            if (!empty($it['category']) && $type === 'post') {
                $term = term_exists($it['category'], 'category') ?: wp_insert_term(sanitize_text_field($it['category']), 'category');
                if (!is_wp_error($term)) wp_set_post_terms($id, [(int) $term['term_id']], 'category');
            }
            $done['created']++;
        }
    }

    public static function import()
    {
        if (!current_user_can('manage_options')) wp_die('Not allowed');
        check_admin_referer('eonco_import');
        $o = get_option(Eonco_Headless::OPT, []);
        $url = rtrim($o['frontend_url'] ?? '', '/');
        $secret = $o['secret'] ?? '';
        $back = admin_url('options-general.php?page=eonco-headless');

        if (!$url || !$secret) {
            wp_safe_redirect(add_query_arg('eonco_import', rawurlencode('Save the Website URL and Refresh secret first.'), $back));
            exit;
        }
        $res = wp_remote_get($url . '/api/wp-export', ['timeout' => 30, 'headers' => ['x-revalidate-secret' => $secret]]);
        $code = is_wp_error($res) ? 0 : wp_remote_retrieve_response_code($res);
        $data = $code === 200 ? json_decode(wp_remote_retrieve_body($res), true) : null;
        if (!is_array($data)) {
            $msg = is_wp_error($res) ? $res->get_error_message() : ('HTTP ' . $code . ($code === 401 ? ' (secret does not match)' : ($code === 404 ? ' (deploy the latest website first)' : '')));
            wp_safe_redirect(add_query_arg('eonco_import', rawurlencode('Could not read the website content: ' . $msg), $back));
            exit;
        }

        $done = ['created' => 0, 'skipped' => 0, 'failed' => 0];
        $what = isset($_POST['what']) && is_array($_POST['what']) ? array_map('sanitize_key', wp_unslash($_POST['what'])) : [];

        if (in_array('services', $what, true))   self::add_items('service', $data['services'] ?? [], 'publish', $done);
        if (in_array('industries', $what, true)) self::add_items('industry', $data['industries'] ?? [], 'publish', $done);
        if (in_array('themes', $what, true))     self::add_items('hs_theme', $data['themes'] ?? [], 'publish', $done);
        if (in_array('posts', $what, true))      self::add_items('post', $data['posts'] ?? [], 'publish', $done);
        if (in_array('projects', $what, true))   self::add_items('case_study', $data['projects'] ?? [], 'draft', $done);
        if (in_array('pages', $what, true))      self::add_items('page', $data['pages'] ?? [], 'draft', $done);

        if (in_array('homepage', $what, true) && !empty($data['settings'])) {
            $site = Eonco_Headless::site_get();
            $s = $data['settings'];
            if (empty($site['hero_lines']) && !empty($s['hero_lines'])) $site['hero_lines'] = sanitize_textarea_field($s['hero_lines']);
            if (empty($site['hero_text']) && !empty($s['hero_text'])) $site['hero_text'] = sanitize_textarea_field($s['hero_text']);
            $has_faqs = array_filter($site['faqs'], function ($f) { return !empty($f['q']); });
            if (!$has_faqs && !empty($s['faqs'])) {
                $site['faqs'] = [];
                foreach (array_slice($s['faqs'], 0, Eonco_Headless::FAQ_SLOTS) as $f) {
                    $site['faqs'][] = ['q' => sanitize_text_field($f['q'] ?? ''), 'a' => sanitize_textarea_field($f['a'] ?? '')];
                }
                $site['faqs'] = array_pad($site['faqs'], Eonco_Headless::FAQ_SLOTS, ['q' => '', 'a' => '']);
            }
            update_option(Eonco_Headless::SITE, $site, false);
            $done['created']++;
        }

        Eonco_Headless::refresh_website();
        $msg = sprintf('ok:%d:%d:%d', $done['created'], $done['skipped'], $done['failed']);
        wp_safe_redirect(add_query_arg('eonco_import', rawurlencode($msg), $back) . '#import');
        exit;
    }
}

Eonco_Content::init();
