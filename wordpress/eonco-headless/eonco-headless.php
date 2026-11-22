<?php
/**
 * Plugin Name:       Eonco Headless
 * Description:       Lets the Eonco Digital website (Next.js) read Projects, Testimonials and Blog posts from this WordPress site, and refreshes the website the moment content is published.
 * Version:           1.0.0
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
                        printf('<input type="color" id="%1$s" name="%1$s" value="%2$s">', esc_attr($key), esc_attr($val ?: ($key === 'eonco_color_ink' ? '#ffffff' : ($key === 'eonco_color_accent' ? '#e8233a' : '#0a2035'))));
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
