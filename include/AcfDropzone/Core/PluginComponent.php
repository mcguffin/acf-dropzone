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


abstract class PluginComponent extends Singleton {

	/**
	 *	Called on plugin activation
	 *
	 *	@return array(
	 *		'success'	=> bool,
	 *		'messages'	=> array,
	 *	)
	 */
	abstract function activate();

	/**
	 *	Called on plugin upgrade
	 *	@param	string	$new_version
	 *	@param	string	$old_version
	 *	@return array(
	 *		'success'	=> bool,
	 *		'messages'	=> array,
	 *	)
	 */
	abstract function upgrade( $new_version, $old_version );

	/**
	 *	Called on plugin deactivation
	 *	@return array(
	 *		'success'	=> bool,
	 *		'messages'	=> array,
	 *	)
	 */
	abstract function deactivate();

	/**
	 *	Called on plugin uninstall
	 *	@param	string	$new_version
	 *	@param	string	$old_version
	 *	@return array(
	 *		'success'	=> bool,
	 *		'messages'	=> array,
	 *	)
	 */
	abstract static function uninstall();

}
