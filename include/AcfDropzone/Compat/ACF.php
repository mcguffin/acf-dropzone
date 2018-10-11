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


class ACF extends Core\PluginComponent {

	/**
	 *	@inheritdoc
	 */
	protected function __construct() {
		add_action( 'acf/enqueue_uploader', array( $this, 'enqueue_assets') );
		add_action( 'print_media_templates', array( $this, 'print_media_templates' ) );
	}

	public function enqueue_assets() {
		$core = Core\Core::instance();

		wp_register_style( 'acf-dropzone', $core->get_asset_url('css/admin/acf-dropzone.css'), array(), $core->get_version() );

		wp_register_script( 'acf-dropzone', $core->get_asset_url('js/admin/acf-dropzone.js'), array(), $core->get_version() );
		wp_localize_script( 'acf-dropzone', 'acf_dropzone', array(

		) );

		wp_enqueue_script('acf-dropzone');
		wp_enqueue_style('acf-dropzone');

	}

	/**
	 *	@inheritdoc
	 */
	 public function activate(){

	 }

	 /**
	  *	@inheritdoc
	  */
	 public function deactivate(){

	 }

	 /**
	  *	@inheritdoc
	  */
	 public static function uninstall() {
		 // remove content and settings
	 }

	/**
 	 *	@inheritdoc
	 */
	public function upgrade( $new_version, $old_version ) {
	}

	/**
	 *	@action print_media_templates
	 */
	public function print_media_templates() {
		?>
		<script type="text/html" id="tmpl-acf-dropzone-notice">
			<p><# if ( data.bold ) { #><strong>{{data.bold}}</strong>: <# } #>{{data.message}}</p>
			<button type="button" class="notice-dismiss">
				<span class="screen-reader-text"><?php _e('Dismiss this notice.') ?></span>
			</button>
		</script>
		<?php

	}

}
