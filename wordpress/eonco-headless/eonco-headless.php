<?php
/**
 * Plugin Name:       Eonco Headless
 * Description:       Lets the Eonco Digital website (Next.js) read Projects, Testimonials and Blog posts from this WordPress site, and refreshes the website the moment content is published.
 * Version:           1.2.0
 * Update URI:        eonco-headless
 * Requires at least: 6.2
 * Requires PHP:      7.4
 * Author:            Eonco Digital
 * Text Domain:       eonco-headless
 */

if (!defined('ABSPATH')) {
    exit;
}

final class Eonco_Headless
{
    const OPT = 'eonco_headless';
    const VERSION = '1.2.0';

    /** Industries must match IndustrySlug in src/content/caseStudies.ts */
    const INDUSTRIES = [
        'professional-services' => 'Professional Services',
        'healthcare'            => 'Healthcare',
        'ecommerce'             => 'Ecommerce',
        'construction'          => 'Construction & Trades',
        'saas'                  => 'SaaS',
        'education'             => 'Education & Training',
    ];

    public static function init()
    {
        add_action('init', [__CLASS__, 'register_types']);
        add_action('init', [__CLASS__, 'register_meta']);
        add_filter('use_block_editor_for_post_type', [__CLASS__, 'classic_for_simple_types'], 10, 2);
        add_action('add_meta_boxes', [__CLASS__, 'meta_boxes']);
        add_action('save_post', [__CLASS__, 'save_meta'], 10, 2);
        add_filter('enter_title_here', [__CLASS__, 'title_placeholder'], 10, 2);

        // Refresh the website when content changes.
        add_action('transition_post_status', [__CLASS__, 'on_status_change'], 10, 3);
        add_action('save_post', [__CLASS__, 'on_save'], 20, 2);
        add_action('before_delete_post', [__CLASS__, 'on_delete']);

        // Settings page.
        add_action('admin_menu', [__CLASS__, 'settings_menu']);
        add_action('admin_init', [__CLASS__, 'settings_register']);
        add_action('admin_post_eonco_test_revalidate', [__CLASS__, 'test_revalidate']);

        // Optional: send public visitors of this WordPress site to the real website.
        add_action('template_redirect', [__CLASS__, 'maybe_redirect']);

        // Company details editable by editors, served at /wp-json/eonco/v1/settings
        self::site_init();

        // Self-update from the website, so the plugin never has to be uploaded again.
        self::updater_init();
    }

    /* ------------------------------------------------------------------ */
    /* Self-updater                                                        */
    /* ------------------------------------------------------------------ */

    /**
     * Checks {Website URL}/wp-plugin/eonco-headless.json for a newer version and
     * installs it through the normal WordPress update system (auto-update on).
     * The website URL is the one set in Settings → Eonco Website.
     */
    private static function update_source()
    {
        $o = get_option(self::OPT, []);
        $url = rtrim($o['frontend_url'] ?? '', '/');
        return $url ? $url . '/wp-plugin/eonco-headless.json' : '';
    }

    private static function remote_info()
    {
        $src = self::update_source();
        if (!$src) return null;
        $cached = get_transient('eonco_update_info');
        if (is_array($cached) && ($cached['src'] ?? '') === $src) return $cached['data'];
        $res = wp_remote_get($src, ['timeout' => 8, 'headers' => ['Accept' => 'application/json']]);
        $data = null;
        if (!is_wp_error($res) && wp_remote_retrieve_response_code($res) === 200) {
            $json = json_decode(wp_remote_retrieve_body($res), true);
            if (is_array($json) && !empty($json['version']) && !empty($json['package'])) {
                // A relative package path is resolved against the update source folder.
                if (!preg_match('#^https?://#i', $json['package'])) {
                    $json['package'] = trailingslashit(dirname($src)) . ltrim($json['package'], '/');
                }
                $data = $json;
            }
        }
        set_transient('eonco_update_info', ['src' => $src, 'data' => $data], 6 * HOUR_IN_SECONDS);
        return $data;
    }

    public static function updater_init()
    {
        $basename = plugin_basename(__FILE__);

        add_filter('pre_set_site_transient_update_plugins', function ($transient) use ($basename) {
            if (!is_object($transient)) return $transient;
            $info = self::remote_info();
            if ($info && version_compare($info['version'], self::VERSION, '>')) {
                $transient->response[$basename] = (object) [
                    'id'          => 'eonco-headless',
                    'slug'        => 'eonco-headless',
                    'plugin'      => $basename,
                    'new_version' => $info['version'],
                    'package'     => $info['package'],
                    'url'         => $info['homepage'] ?? '',
                    'tested'      => $info['tested'] ?? '',
                    'requires'    => $info['requires'] ?? '6.2',
                ];
            } elseif (isset($transient->no_update)) {
                $transient->no_update[$basename] = (object) ['id' => 'eonco-headless', 'slug' => 'eonco-headless', 'plugin' => $basename, 'new_version' => self::VERSION, 'package' => ''];
            }
            return $transient;
        });

        // "View details" popup in the Plugins screen.
        add_filter('plugins_api', function ($result, $action, $args) {
            if ($action !== 'plugin_information' || ($args->slug ?? '') !== 'eonco-headless') return $result;
            $info = self::remote_info();
            if (!$info) return $result;
            return (object) [
                'name'          => 'Eonco Headless',
                'slug'          => 'eonco-headless',
                'version'       => $info['version'],
                'author'        => 'Eonco Digital',
                'requires'      => $info['requires'] ?? '6.2',
                'tested'        => $info['tested'] ?? '',
                'download_link' => $info['package'],
                'sections'      => ['changelog' => wp_kses_post($info['changelog'] ?? '')],
            ];
        }, 10, 3);

        // Install updates automatically (can still be switched off in Plugins).
        add_filter('auto_update_plugin', function ($update, $item) {
            return (isset($item->slug) && $item->slug === 'eonco-headless') ? true : $update;
        }, 10, 2);

        // Re-check right after the website URL changes, and after an update.
        add_action('update_option_' . self::OPT, function () {
            delete_transient('eonco_update_info');
            delete_site_transient('update_plugins');
        });
        add_action('upgrader_process_complete', function () {
            delete_transient('eonco_update_info');
        });
    }

    /* ------------------------------------------------------------------ */
    /* Content types                                                       */
    /* ------------------------------------------------------------------ */

    public static function register_types()
    {
        register_post_type('case_study', [
            'labels' => [
                'name'          => 'Projects',
                'singular_name' => 'Project',
                'add_new'       => 'Add project',
                'add_new_item'  => 'Add new project',
                'edit_item'     => 'Edit project',
                'all_items'     => 'All projects',
                'menu_name'     => 'Projects',
            ],
            'public'       => true,
            'show_in_rest' => true,
            'rest_base'    => 'case-studies',
            'menu_icon'    => 'dashicons-portfolio',
            'menu_position'=> 5,
            'has_archive'  => false,
            'rewrite'      => ['slug' => 'case-studies'],
            'supports'     => ['title', 'excerpt', 'thumbnail', 'custom-fields', 'revisions'],
        ]);

        register_post_type('testimonial', [
            'labels' => [
                'name'          => 'Testimonials',
                'singular_name' => 'Testimonial',
                'add_new'       => 'Add testimonial',
                'add_new_item'  => 'Add new testimonial',
                'edit_item'     => 'Edit testimonial',
                'all_items'     => 'All testimonials',
            ],
            'public'              => false,
            'show_ui'             => true,
            'show_in_rest'        => true,
            'rest_base'           => 'testimonials',
            'menu_icon'           => 'dashicons-format-quote',
            'menu_position'       => 6,
            'supports'            => ['title', 'editor', 'custom-fields'],
        ]);
    }

    /** Fields per type: key => [label, type, help]. */
    public static function fields()
    {
        return [
            'case_study' => [
                'eonco_client'       => ['Client name (short)', 'text', 'Shown in big letters on hover, e.g. "Clinic Group". Use an anonymised name if the client has not approved theirs.'],
                'eonco_industry'     => ['Industry', 'industry', 'Used for the filter on the Case Studies page.'],
                'eonco_tags'         => ['Tags', 'text', 'Comma separated, e.g. Healthcare, Service Hub, Automation'],
                'eonco_stats'        => ['Results', 'textarea', 'One result per line as  value | label  e.g.  38% | Faster enquiry response  (up to 4)'],
                'eonco_challenge'    => ['The challenge', 'textarea', 'One paragraph per line.'],
                'eonco_solution'     => ['What we built', 'textarea', 'One paragraph per line.'],
                'eonco_outcome'      => ['The outcome', 'textarea', 'One paragraph per line.'],
                'eonco_stack'        => ['Tools & stack', 'text', 'Comma separated, e.g. HubSpot Sales Hub, Make, Shopify'],
                'eonco_headline'     => ['Mockup headline', 'text', 'Short line shown inside the website mockup when no featured image is set.'],
                'eonco_color_bg'     => ['Mockup background colour', 'color', ''],
                'eonco_color_accent' => ['Mockup accent colour', 'color', ''],
                'eonco_color_ink'    => ['Mockup text colour', 'color', ''],
                'eonco_kind'         => ['Project type', 'kind', ''],
                'eonco_featured'     => ['Feature on homepage', 'checkbox', 'Featured projects appear in the homepage case study section (up to 6).'],
            ],
            'testimonial' => [
                'eonco_role'     => ['Role & company', 'text', 'e.g. Head of Sales, Acme Logistics'],
                'eonco_featured' => ['Use as the large featured quote', 'checkbox', 'Only one testimonial should be featured.'],
            ],
        ];
    }

    public static function register_meta()
    {
        foreach (self::fields() as $type => $fields) {
            foreach ($fields as $key => $f) {
                register_post_meta($type, $key, [
                    'type'          => $f[1] === 'checkbox' ? 'boolean' : 'string',
                    'single'        => true,
                    'show_in_rest'  => true,
                    'default'       => $f[1] === 'checkbox' ? false : '',
                    'auth_callback' => function () {
                        return current_user_can('edit_posts');
                    },
                ]);
            }
        }
    }

    /** Projects and testimonials are simple forms, so they use the classic screen. */
    public static function classic_for_simple_types($use, $post_type)
    {
        return in_array($post_type, ['case_study', 'testimonial'], true) ? false : $use;
    }

    public static function title_placeholder($text, $post)
    {
        if ($post->post_type === 'case_study') return 'Project title, e.g. Patient Lifecycle Automation for a Clinic Group';
        if ($post->post_type === 'testimonial') return 'Person’s name';
        return $text;
    }

    /* ------------------------------------------------------------------ */
    /* Meta boxes                                                          */
    /* ------------------------------------------------------------------ */

    public static function meta_boxes()
    {
        add_meta_box('eonco_project', 'Project details', [__CLASS__, 'render_box'], 'case_study', 'normal', 'high');
        add_meta_box('eonco_testimonial', 'Testimonial details', [__CLASS__, 'render_box'], 'testimonial', 'normal', 'high');
    }

    public static function render_box($post)
    {
        wp_nonce_field('eonco_meta', 'eonco_meta_nonce');
        $fields = self::fields()[$post->post_type] ?? [];
        echo '<style>.eonco-f{margin:0 0 18px}.eonco-f label{display:block;font-weight:600;margin-bottom:6px}.eonco-f input[type=text],.eonco-f textarea,.eonco-f select{width:100%;max-width:720px}.eonco-f textarea{min-height:110px}.eonco-f .description{margin-top:4px}</style>';
        if ($post->post_type === 'case_study') {
            echo '<p class="description" style="margin-bottom:16px">Use the <strong>Excerpt</strong> box below for the one-sentence summary, and <strong>Featured image</strong> (right) for a screenshot of the work. Without an image, the site draws a mockup using the colours below.</p>';
        } else {
            echo '<p class="description" style="margin-bottom:16px">Write the quote in the main editor above. Only publish quotes the client has approved.</p>';
        }
        foreach ($fields as $key => $f) {
            [$label, $type, $help] = $f;
            $val = get_post_meta($post->ID, $key, true);
            echo '<div class="eonco-f">';
            if ($type === 'checkbox') {
                printf('<label><input type="checkbox" name="%1$s" value="1" %2$s> %3$s</label>', esc_attr($key), checked($val, true, false), esc_html($label));
            } else {
                printf('<label for="%s">%s</label>', esc_attr($key), esc_html($label));
                switch ($type) {
                    case 'textarea':
                        printf('<textarea id="%1$s" name="%1$s">%2$s</textarea>', esc_attr($key), esc_textarea($val));
                        break;
                    case 'color':
                        printf('<input type="color" id="%1$s" name="%1$s" value="%2$s">', esc_attr($key), esc_attr($val ?: ($key === 'eonco_color_ink' ? '#ffffff' : ($key === 'eonco_color_accent' ? '#dc1f36' : '#0a2035'))));
                        break;
                    case 'industry':
                        printf('<select id="%1$s" name="%1$s">', esc_attr($key));
                        foreach (self::INDUSTRIES as $slug => $name) {
                            printf('<option value="%s" %s>%s</option>', esc_attr($slug), selected($val, $slug, false), esc_html($name));
                        }
                        echo '</select>';
                        break;
                    case 'kind':
                        printf('<select id="%1$s" name="%1$s"><option value="crm" %2$s>CRM / HubSpot project</option><option value="web" %3$s>Website / app project</option></select>', esc_attr($key), selected($val, 'crm', false), selected($val, 'web', false));
                        break;
                    default:
                        printf('<input type="text" id="%1$s" name="%1$s" value="%2$s">', esc_attr($key), esc_attr($val));
                }
            }
            if ($help) printf('<p class="description">%s</p>', esc_html($help));
            echo '</div>';
        }
    }

    public static function save_meta($post_id, $post)
    {
        if (!isset($_POST['eonco_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['eonco_meta_nonce'])), 'eonco_meta')) return;
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
        if (!current_user_can('edit_post', $post_id)) return;
        $fields = self::fields()[$post->post_type] ?? [];
        foreach ($fields as $key => $f) {
            $type = $f[1];
            if ($type === 'checkbox') {
                update_post_meta($post_id, $key, !empty($_POST[$key]));
                continue;
            }
            $raw = isset($_POST[$key]) ? wp_unslash($_POST[$key]) : '';
            $val = $type === 'textarea' ? sanitize_textarea_field($raw) : ($type === 'color' ? (sanitize_hex_color($raw) ?: '') : sanitize_text_field($raw));
            update_post_meta($post_id, $key, $val);
        }
    }

    /* ------------------------------------------------------------------ */
    /* Website refresh                                                     */
    /* ------------------------------------------------------------------ */

    private static $queued = false;

    private static function watched($post)
    {
        return $post && in_array($post->post_type, ['post', 'case_study', 'testimonial'], true) && !wp_is_post_revision($post) && !wp_is_post_autosave($post);
    }

    public static function on_status_change($new, $old, $post)
    {
        if (self::watched($post) && ($new === 'publish' || $old === 'publish')) self::queue();
    }

    public static function on_save($post_id, $post)
    {
        if (self::watched($post) && $post->post_status === 'publish') self::queue();
    }

    public static function on_delete($post_id)
    {
        $post = get_post($post_id);
        if (self::watched($post) && $post->post_status === 'publish') self::queue();
    }

    /** Send at most one refresh per request, after everything has been saved. */
    private static function queue()
    {
        if (self::$queued) return;
        self::$queued = true;
        add_action('shutdown', function () {
            self::revalidate(false);
        });
    }

    private static function revalidate($blocking)
    {
        $o = get_option(self::OPT, []);
        $url = rtrim($o['frontend_url'] ?? '', '/');
        $secret = $o['secret'] ?? '';
        if (!$url || !$secret) return new WP_Error('eonco_not_configured', 'Website URL and secret are not set.');
        return wp_remote_post($url . '/api/revalidate', [
            'timeout'  => $blocking ? 15 : 3,
            'blocking' => $blocking,
            'headers'  => ['x-revalidate-secret' => $secret],
        ]);
    }

    /* ------------------------------------------------------------------ */
    /* Settings                                                            */
    /* ------------------------------------------------------------------ */

    public static function settings_menu()
    {
        add_options_page('Eonco Website', 'Eonco Website', 'manage_options', 'eonco-headless', [__CLASS__, 'settings_page']);
    }

    public static function settings_register()
    {
        register_setting('eonco_headless', self::OPT, [
            'type'              => 'array',
            'sanitize_callback' => function ($in) {
                return [
                    'frontend_url' => esc_url_raw(trim($in['frontend_url'] ?? '')),
                    'secret'       => sanitize_text_field($in['secret'] ?? ''),
                    'redirect'     => !empty($in['redirect']),
                ];
            },
        ]);
    }

    public static function settings_page()
    {
        $o = wp_parse_args(get_option(self::OPT, []), ['frontend_url' => '', 'secret' => '', 'redirect' => false]);
        $result = isset($_GET['eonco_test']) ? sanitize_text_field(wp_unslash($_GET['eonco_test'])) : '';
        ?>
        <div class="wrap">
            <h1>Eonco Website</h1>
            <p>Connects this WordPress dashboard to the Eonco Digital website. Projects, Testimonials and Posts published here appear on the website within seconds.</p>
            <?php if ($result === 'ok') : ?>
                <div class="notice notice-success"><p>Connected. The website refreshed successfully.</p></div>
            <?php elseif ($result) : ?>
                <div class="notice notice-error"><p>Could not reach the website: <?php echo esc_html($result); ?></p></div>
            <?php endif; ?>
            <form method="post" action="options.php">
                <?php settings_fields('eonco_headless'); ?>
                <table class="form-table" role="presentation">
                    <tr>
                        <th scope="row"><label for="eonco_url">Website URL</label></th>
                        <td><input id="eonco_url" class="regular-text" type="url" name="<?php echo esc_attr(self::OPT); ?>[frontend_url]" value="<?php echo esc_attr($o['frontend_url']); ?>" placeholder="https://eoncodigital.com">
                            <p class="description">The live Next.js website address.</p></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="eonco_secret">Refresh secret</label></th>
                        <td><input id="eonco_secret" class="regular-text" type="text" name="<?php echo esc_attr(self::OPT); ?>[secret]" value="<?php echo esc_attr($o['secret']); ?>" autocomplete="off">
                            <p class="description">Must match <code>REVALIDATE_SECRET</code> in the website's environment variables (Vercel → Project → Settings → Environment Variables).</p></td>
                    </tr>
                    <tr>
                        <th scope="row">Public pages</th>
                        <td><label><input type="checkbox" name="<?php echo esc_attr(self::OPT); ?>[redirect]" value="1" <?php checked($o['redirect']); ?>> Send visitors of this WordPress site's public pages to the website</label>
                            <p class="description">Only turn this on once the new website is live. The dashboard and API keep working.</p></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="eonco_test_revalidate">
                <?php wp_nonce_field('eonco_test'); ?>
                <?php submit_button('Test connection', 'secondary'); ?>
            </form>
        </div>
        <?php
    }

    public static function test_revalidate()
    {
        if (!current_user_can('manage_options')) wp_die('Not allowed');
        check_admin_referer('eonco_test');
        $res = self::revalidate(true);
        if (is_wp_error($res)) {
            $msg = $res->get_error_message();
        } else {
            $code = wp_remote_retrieve_response_code($res);
            $msg = $code === 200 ? 'ok' : 'HTTP ' . $code . ($code === 401 ? ' (secret does not match)' : '');
        }
        wp_safe_redirect(add_query_arg('eonco_test', rawurlencode($msg), admin_url('options-general.php?page=eonco-headless')));
        exit;
    }

    /* ------------------------------------------------------------------ */
    /* Company details (Settings → Eonco Company Details)                  */
    /* ------------------------------------------------------------------ */

    const SITE = 'eonco_site';
    const SOCIALS = ['linkedin' => 'LinkedIn', 'facebook' => 'Facebook', 'instagram' => 'Instagram', 'x' => 'X (Twitter)', 'youtube' => 'YouTube'];

    public static function site_defaults()
    {
        return [
            'email'         => '',
            'phone'         => '',
            'partner_label' => '',
            'socials'       => array_fill_keys(array_keys(self::SOCIALS), ''),
            'offices'       => array_fill(0, 3, ['region' => '', 'address' => '', 'phone' => '']),
            'stats'         => array_fill(0, 4, ['label' => '', 'value' => '', 'note' => '']),
            'why'           => array_fill(0, 3, ['value' => '', 'title' => '', 'text' => '']),
        ];
    }

    public static function site_get()
    {
        $d = self::site_defaults();
        $o = get_option(self::SITE, []);
        $o = is_array($o) ? $o : [];
        $out = wp_parse_args($o, $d);
        foreach (['socials', 'offices', 'stats', 'why'] as $k) {
            $out[$k] = is_array($out[$k]) ? $out[$k] : $d[$k];
        }
        return $out;
    }

    public static function site_init()
    {
        add_action('admin_menu', function () {
            add_options_page('Eonco Company Details', 'Eonco Company Details', 'edit_others_posts', 'eonco-company', [__CLASS__, 'site_page']);
        });
        add_action('admin_post_eonco_save_site', [__CLASS__, 'site_save']);
        add_action('rest_api_init', function () {
            register_rest_route('eonco/v1', '/settings', [
                'methods'             => 'GET',
                'permission_callback' => '__return_true', // public, read-only, contains only published company details
                'callback'            => function () {
                    return rest_ensure_response(self::site_get());
                },
            ]);
        });
    }

    public static function site_save()
    {
        if (!current_user_can('edit_others_posts')) wp_die('Not allowed');
        check_admin_referer('eonco_site');
        $in = isset($_POST['site']) && is_array($_POST['site']) ? wp_unslash($_POST['site']) : [];
        $d = self::site_defaults();
        $clean = [
            'email'         => sanitize_email($in['email'] ?? ''),
            'phone'         => sanitize_text_field($in['phone'] ?? ''),
            'partner_label' => sanitize_text_field($in['partner_label'] ?? ''),
            'socials'       => [],
            'offices'       => [],
            'stats'         => [],
            'why'           => [],
        ];
        foreach (array_keys(self::SOCIALS) as $k) {
            $clean['socials'][$k] = esc_url_raw(trim($in['socials'][$k] ?? ''));
        }
        foreach (array_keys($d['offices']) as $i) {
            $o = $in['offices'][$i] ?? [];
            $clean['offices'][] = ['region' => sanitize_text_field($o['region'] ?? ''), 'address' => sanitize_textarea_field($o['address'] ?? ''), 'phone' => sanitize_text_field($o['phone'] ?? '')];
        }
        foreach (array_keys($d['stats']) as $i) {
            $s = $in['stats'][$i] ?? [];
            $clean['stats'][] = ['label' => sanitize_text_field($s['label'] ?? ''), 'value' => sanitize_text_field($s['value'] ?? ''), 'note' => sanitize_text_field($s['note'] ?? '')];
        }
        foreach (array_keys($d['why']) as $i) {
            $s = $in['why'][$i] ?? [];
            $clean['why'][] = ['value' => sanitize_text_field($s['value'] ?? ''), 'title' => sanitize_text_field($s['title'] ?? ''), 'text' => sanitize_textarea_field($s['text'] ?? '')];
        }
        update_option(self::SITE, $clean, false);
        self::revalidate(false);
        wp_safe_redirect(admin_url('options-general.php?page=eonco-company&saved=1'));
        exit;
    }

    public static function site_page()
    {
        $s = self::site_get();
        $n = 'site';
        $f = function ($name, $val, $ph = '', $type = 'text') {
            printf('<input type="%s" class="regular-text" name="%s" value="%s" placeholder="%s">', esc_attr($type), esc_attr($name), esc_attr($val), esc_attr($ph));
        };
        ?>
        <div class="wrap">
            <h1>Eonco Company Details</h1>
            <p>These details appear across the website (footer, contact page, homepage figures and search-engine data). <strong>Leave a field empty to keep the website's current text.</strong></p>
            <?php if (!empty($_GET['saved'])) : ?><div class="notice notice-success"><p>Saved. The website will update within a few seconds.</p></div><?php endif; ?>
            <form method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>">
                <input type="hidden" name="action" value="eonco_save_site">
                <?php wp_nonce_field('eonco_site'); ?>

                <h2>Contact</h2>
                <table class="form-table" role="presentation">
                    <tr><th>Email</th><td><?php $f("{$n}[email]", $s['email'], 'hello@eoncodigital.com', 'email'); ?></td></tr>
                    <tr><th>Main phone</th><td><?php $f("{$n}[phone]", $s['phone'], '+61 2 0000 0000'); ?></td></tr>
                    <tr><th>Hero label</th><td><?php $f("{$n}[partner_label]", $s['partner_label'], 'HubSpot Specialists'); ?><p class="description">The small label above the homepage headline, e.g. your real HubSpot partner tier.</p></td></tr>
                </table>

                <h2>Social profiles</h2>
                <table class="form-table" role="presentation">
                    <?php foreach (self::SOCIALS as $k => $label) : ?>
                        <tr><th><?php echo esc_html($label); ?></th><td><?php $f("{$n}[socials][{$k}]", $s['socials'][$k] ?? '', 'https://', 'url'); ?></td></tr>
                    <?php endforeach; ?>
                </table>

                <h2>Offices</h2>
                <p class="description">Offices with an empty name or address are not shown.</p>
                <table class="form-table" role="presentation">
                    <?php foreach ($s['offices'] as $i => $o) : ?>
                        <tr><th>Office <?php echo (int) $i + 1; ?></th><td>
                            <p><?php $f("{$n}[offices][{$i}][region]", $o['region'] ?? '', 'Name, e.g. Head Office'); ?></p>
                            <p><textarea class="regular-text" rows="2" name="<?php echo esc_attr("{$n}[offices][{$i}][address]"); ?>" placeholder="Street address&#10;City, Postcode"><?php echo esc_textarea($o['address'] ?? ''); ?></textarea></p>
                            <p><?php $f("{$n}[offices][{$i}][phone]", $o['phone'] ?? '', 'Phone'); ?></p>
                        </td></tr>
                    <?php endforeach; ?>
                </table>

                <h2>Homepage figures (“Who we are”)</h2>
                <p class="description">Only publish numbers you can back up. Value examples: <code>$2.4M</code>, <code>40+</code>, <code>30K+</code>, <code>5 / 5</code>.</p>
                <table class="form-table" role="presentation">
                    <?php foreach ($s['stats'] as $i => $st) : ?>
                        <tr><th>Figure <?php echo (int) $i + 1; ?></th><td>
                            <p><?php $f("{$n}[stats][{$i}][label]", $st['label'] ?? '', 'Label, e.g. Pipeline generated'); ?></p>
                            <p><?php $f("{$n}[stats][{$i}][value]", $st['value'] ?? '', 'Value, e.g. $2.4M'); ?></p>
                            <p><?php $f("{$n}[stats][{$i}][note]", $st['note'] ?? '', 'Note, e.g. In the last 12 months'); ?></p>
                        </td></tr>
                    <?php endforeach; ?>
                </table>

                <h2>Homepage figures (“Why Eonco”)</h2>
                <table class="form-table" role="presentation">
                    <?php foreach ($s['why'] as $i => $w) : ?>
                        <tr><th>Card <?php echo (int) $i + 1; ?></th><td>
                            <p><?php $f("{$n}[why][{$i}][value]", $w['value'] ?? '', 'Value, e.g. 1,000+'); ?></p>
                            <p><?php $f("{$n}[why][{$i}][title]", $w['title'] ?? '', 'Title, e.g. Automations built'); ?></p>
                            <p><textarea class="regular-text" rows="2" name="<?php echo esc_attr("{$n}[why][{$i}][text]"); ?>" placeholder="One or two sentences"><?php echo esc_textarea($w['text'] ?? ''); ?></textarea></p>
                        </td></tr>
                    <?php endforeach; ?>
                </table>

                <?php submit_button('Save company details'); ?>
            </form>
        </div>
        <?php
    }

    public static function maybe_redirect()
    {
        $o = get_option(self::OPT, []);
        if (empty($o['redirect']) || empty($o['frontend_url']) || is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST) || is_user_logged_in()) return;
        $path = wp_parse_url(add_query_arg([]), PHP_URL_PATH) ?: '/';
        wp_redirect(rtrim($o['frontend_url'], '/') . $path, 301);
        exit;
    }
}

Eonco_Headless::init();
