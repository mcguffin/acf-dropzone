<?php
/**
 *	@package AcfDropzone\Compat
 *	@version 1.0.0
 *	2018-09-22
 */

namespace AcfDropzone\Compat;

if ( ! defined('ABSPATH') ) {
	die('FU!');
}


use AcfDropzone\Asset;
use AcfDropzone\Core;


class ACF extends Core\Singleton {

	private $file_field_types = null;
	private $gallery_field_types = null;

	/**
	 *	@inheritdoc
	 */
	protected function __construct() {

		add_action( 'acf/enqueue_uploader', array( $this, 'enqueue_assets') );
		// acf doesn't enqueue media upload in block editor
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_assets') );

		add_action( 'acf/init', [ $this, 'acf_init' ] );

	}

	/**
	 *	Add the Dropzone option to acf fields
	 *
	 *	@action acf/init
	 */
	public function acf_init( $field ) {

		$this->file_field_types    = apply_filters( 'acf_dropzone/file_fields', [ 'image', 'file' ] );
		$this->gallery_field_types = apply_filters( 'acf_dropzone/gallery_fields', [ 'gallery' ] );

		$field_types              = array_merge( $this->file_field_types, $this->gallery_field_types );

		foreach ( $field_types as $field_type ) {
			add_action( 'acf/render_field_settings/type=' . $field_type, [ $this, 'add_dropzone_option' ] );
			add_filter( 'acf/prepare_field/type=' . $field_type, [ $this, 'add_dropzone_class' ] );
		}

		foreach ( $this->file_field_types as $field_type ) {
			// check if basic uploader is used
			add_action( 'acf/render_field/type=' . $field_type, [ $this, 'render_field' ] );
		}

	}

	/**
	 *	maybe enqueue basic assets
	 *
	 *	@action acf/render_field_settings/type=image
	 *	@action acf/render_field_settings/type=file
	 */
	public function render_field() {
		$this->enqueue_basic_assets();
	}

	/**
	 *	Add the Dropzone option to acf fields
	 *
	 *	@action acf/render_field_settings/type=image
	 *	@action acf/render_field_settings/type=file
	 *	@action acf/render_field_settings/type=gallery
	 */
	public function add_dropzone_option( $field ) {

		// save_other_choice
		acf_render_field_setting( $field, array(
			'label'			=> __('Enable Dropzone','acf-dropzone'),
			'instructions'	=> '',
			'name'			=> 'dropzone',
			'type'			=> 'true_false',
			'ui'			=> 1,
			'message'		=> ''
		));
	}

	/**
	 *	Add the Dropzone css class to field
	 *
	 *	@filter acf/prepare_field/type=image
	 *	@filter acf/prepare_field/type=file
	 *	@filter acf/prepare_field/type=gallery
	 */
	public function add_dropzone_class( $field ) {
		$field = wp_parse_args( $field, array(
			'dropzone'	=> 0,
		));

		if ( $field['dropzone'] ) {

			$drop_type = in_array( $field['type'], $this->gallery_field_types )
				? 'gallery'
				: 'file';

			$field['wrapper']['class'] .= ' dropzone dropzone-' . sanitize_html_class( $drop_type );
			$field['wrapper']['class'] = trim( $field['wrapper']['class'] );

		}

		return $field;
	}

	/**
	 *	@action acf/enqueue_uploader
	 */
	public function enqueue_assets() {

		if ( ! has_action( 'print_media_templates', [ $this, 'print_media_templates' ] ) ) {
			add_action( 'print_media_templates', [ $this, 'print_media_templates' ] );
		}

		Asset\Asset::get('css/admin/acf-dropzone.css')->enqueue();

		Asset\Asset::get('js/admin/acf-dropzone.js')
			->deps('acf-input','jquery')
			->localize( [
				'file_fields' => $this->file_field_types,
				'gallery_fields' => $this->gallery_field_types,
			], 'acf_dropzone' )
			->enqueue();

	}

	/**
	 *	Enqueue assets for basic uploader
	 */
	public function enqueue_basic_assets() {

		Asset\Asset::get('css/admin/acf-dropzone.css')->enqueue();

		Asset\Asset::get('js/admin/acf-basic-dropzone.js')
			->deps('acf-input','jquery')
			->localize( [
				'file_fields' => array_merge( $this->file_field_types, [ 'upload_image' ] ), // acf basic uploader has a different field type
				'gallery_fields' => $this->gallery_field_types,
			], 'acf_dropzone' )
			->enqueue();

	}


	/**
	 *	@action print_media_templates
	 */
	public function print_media_templates() {
		?>
		<script type="text/html" id="tmpl-acf-dropzone-notice">
			<p><# if ( data.bold ) { #><strong>{{data.bold}}</strong>: <# } #>{{data.message}}</p>
			<button type="button" class="notice-dismiss">
				<span class="screen-reader-text">
					<?php esc_html_e('Dismiss this notice.','acf-dropzone') ?>
				</span>
			</button>
		</script>
		<script type="text/html" id="tmpl-acf-dropzone-info">

			<p class="show-if-focus drag-drop-info"><?php esc_html_e('Paste from Clipboard','acf-dropzone') ?></p>
			<p class="show-if-focus"><?php esc_html_e('or','acf-dropzone') ?></p>
			<p class="drag-drop-info"><?php esc_html_e('Drop files here','acf-dropzone') ?></p>
			<# if (data.or) { #><p><?php esc_html_e('or','acf-dropzone') ?></p><# } #>

		</script>
		<script type="text/html" id="tmpl-acf-dropzone-attachment-title">
			<?php
			/* Translators: followed by post or admin page name */
			$pasted_into = _x('Pasted Into', 'attachment-title', 'acf-dropzone');

			global $plugin_page;
			if ( $post = get_post() ) {
				// post title
				$pasted_into .= ' ' . $post->post_title;
			} else if ( function_exists('acf_get_options_page') && $options_page = acf_get_options_page( $plugin_page ) ) {
				// acf options page title
				$pasted_into .= ' ' . $options_page['page_title'];
			} else if ( function_exists( 'get_current_screen' ) && $screen = get_current_screen() ) {
				// screen id
				$pasted_into .= ' ' . esc_html( $screen->id );
			} else {
				$pasted_into = _x('Pasted File', 'attachment-title', 'acf-dropzone');
			}
			echo esc_html( $pasted_into );
			?> - {{data.fieldname}}
		</script>
		<?php

	}

}
