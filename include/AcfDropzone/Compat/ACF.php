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


use AcfDropzone\Core;


class ACF extends Core\Singleton {

	/**
	 *	@inheritdoc
	 */
	protected function __construct() {

		add_action( 'acf/enqueue_uploader', array( $this, 'enqueue_assets') );

		add_action( 'acf/render_field_settings/type=image',   array( $this, 'add_dropzone_option') );
		add_action( 'acf/render_field_settings/type=file',    array( $this, 'add_dropzone_option') );
		add_action( 'acf/render_field_settings/type=gallery', array( $this, 'add_dropzone_option') );

		add_filter( 'acf/prepare_field/type=image',   array( $this, 'add_dropzone_class' ) );
		add_filter( 'acf/prepare_field/type=file',    array( $this, 'add_dropzone_class' ) );
		add_filter( 'acf/prepare_field/type=gallery', array( $this, 'add_dropzone_class' ) );
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
			$field['wrapper']['class'] .= ' dropzone';
			$field['wrapper']['class'] = trim( $field['wrapper']['class'] );
		}

		return $field;
	}

	/**
	 *	@action acf/enqueue_uploader
	 */
	public function enqueue_assets() {
		$core = Core\Core::instance();
		add_action( 'print_media_templates', array( $this, 'print_media_templates' ) );

		wp_register_style( 'acf-dropzone', $core->get_asset_url('css/admin/acf-dropzone.css'), array(), $core->get_version() );

		wp_register_script( 'acf-dropzone', $core->get_asset_url('js/admin/acf-dropzone.js'), array('acf-input'), $core->get_version() );
		wp_localize_script( 'acf-dropzone', 'acf_dropzone', array(

		) );

		wp_enqueue_script('acf-dropzone');
		wp_enqueue_style('acf-dropzone');

	}

	/**
	 *	@action print_media_templates
	 */
	public function print_media_templates() {
		?>
		<script type="text/html" id="tmpl-acf-dropzone-notice">
			<p><# if ( data.bold ) { #><strong>{{data.bold}}</strong>: <# } #>{{data.message}}</p>
			<button type="button" class="notice-dismiss">
				<span class="screen-reader-text"><?php _e('Dismiss this notice.','acf-dropzone') ?></span>
			</button>
		</script>
		<script type="text/html" id="tmpl-acf-dropzone-info">
			<p class="drag-drop-info"><?php _e('Drop files here','acf-dropzone') ?></p>
			<p class="show-if-focus"><?php _e('or','acf-dropzone') ?></p>
			<p class="show-if-focus drag-drop-info"><?php _e('Paste from Clipboard','acf-dropzone') ?></p>
			<p><?php _e('or','acf-dropzone') ?></p>
		</script>
		<?php

	}

}
