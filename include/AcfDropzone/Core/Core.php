<?php
/**
 *	@package AcfDropzone\Core
 *	@version 1.0.0
 *	2018-09-22
 */

namespace AcfDropzone\Core;

if ( ! defined('ABSPATH') ) {
	die('FU!');
}

use AcfDropzone\Compat;

class Core extends Plugin {

	/**
	 *	@inheritdoc
	 */
	protected function __construct() {

		add_action( 'plugins_loaded' , array( $this , 'init_compat' ), 0 );
		add_action( 'init' , array( $this , 'init' ) );

		add_action( 'wp_enqueue_scripts' , array( $this , 'wp_enqueue_style' ) );

		$args = func_get_args();
		parent::__construct( ...$args );
	}

	/**
	 *	Load frontend styles and scripts
	 *
	 *	@action wp_enqueue_scripts
	 */
	public function wp_enqueue_style() {
	}


	/**
	 *	Load Compatibility classes
	 *
	 *  @action plugins_loaded
	 */
	public function init_compat() {
		if ( function_exists('\acf') && version_compare( acf()->version,'5.0.0','>=') ) {
			Compat\ACF::instance();
		}
	}


	/**
	 *	Init hook.
	 *
	 *  @action init
	 */
	public function init() {
	}

	/**
	 *	Get asset url for this plugin
	 *
	 *	@param	string	$asset	URL part relative to plugin class
	 *	@return string URL
	 */
	public function get_asset_url( $asset ) {
		return plugins_url( $asset, $this->get_plugin_file() );
	}



}
