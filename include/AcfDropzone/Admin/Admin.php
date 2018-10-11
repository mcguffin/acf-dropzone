<?php
/**
 *	@package AcfDropzone\Admin
 *	@version 1.0.0
 *	2018-09-22
 */

namespace AcfDropzone\Admin;

if ( ! defined('ABSPATH') ) {
	die('FU!');
}

use AcfDropzone\Core;


class Admin extends Core\Singleton {

	private $core;

	/**
	 *	@inheritdoc
	 */
	protected function __construct() {

		$this->core = Core\Core::instance();

		add_action( 'admin_init', array( $this , 'admin_init' ) );
		add_action( 'admin_print_scripts', array( $this , 'enqueue_assets' ) );
	}


	/**
	 *	Admin init
	 *	@action admin_init
	 */
	function admin_init() {
	}

	/**
	 *	Enqueue options Assets
	 *	@action admin_print_scripts
	 */
	function enqueue_assets() {
		wp_enqueue_style( 'acf_dropzone-admin' , $this->core->get_asset_url( '/css/admin.css' ) );

		wp_enqueue_script( 'acf_dropzone-admin' , $this->core->get_asset_url( 'js/admin.js' ) );
		wp_localize_script('acf_dropzone-admin' , 'acf_dropzone_admin' , array(
		) );
	}

}
