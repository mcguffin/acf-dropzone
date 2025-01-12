<?php

namespace AcfDropzone;

class PluginTest {

	private $current_json_save_path = null;

	public function __construct() {
		add_filter( 'acf/settings/load_json', [ $this, 'load_json' ] );

		add_filter( 'acf/settings/save_json', [ $this, 'save_json' ] );

		//
		add_action( 'acf/init', [ $this, 'register_blocks' ] );
		add_action( 'acf/init', [ $this, 'register_options_page' ] );
		//
		add_action( 'template_redirect', 'acf_form_head' );
		// add_filter( 'the_content', function( $content ) {
		//
		// 	ob_start();
		// 	acf_form([
		// 		'id' => 'acf-form',
		// 		'new_post' => false,
		// 		'field_groups' => [ 'group_acf_dropzone_some' ],
		// 		'uploader' => 'wp',
		// 	]);
		// 	return $content . ob_get_clean();
		// });

	}



	/**
	 *	@filter 'acf/init'
	 */
	public function register_options_page() {
		if ( ! function_exists( 'acf_add_options_page' ) ) {
			return;
		}
		acf_add_options_page( array(
			'page_title'	=> 'ACF Dropzone Test',
			'description'	=> 'You are testing ACF Dropzone.',
			'post_id'		=> 'acf_dropzone_test',
			'icon_url'		=> 'dashicons-location-alt',
			'autoload'		=> false,
		) );

	}

	/**
	 *	@action 'acf/init'
	 */
	public function register_blocks() {

		if ( ! function_exists('acf_register_block') ) {
			return;
		}

		// register a testimonial block
		acf_register_block(array(
			'name'				=> 'acf-dropzone-test',
			'title'				=> __('Dropzone Test'),
			'description'		=> __('Testing ACF-Dropzone'),
			'render_callback'	=> function ( $block, $content, $is_preview, $post_id ) {
				printf('<div class="align%s">',$block['align']);
				echo '<h3>Testing ACF Dropzone</h3>';
				echo '</div>';
				?><hr /><?php
			},
			'category'			=> 'embed',
			'icon'				=> 'location-alt',
			'mode'				=> 'preview', // auto|preview|edit
			'align'				=> 'full',
			'keywords'			=> array( 'map' ),
		));


	}

	/**
	 *	@filter 'acf/settings/save_json'
	 */
	public function load_json( $paths ) {
		$paths[] = dirname(__FILE__).'/acf-json';
		return $paths;
	}

	/**
	 *	@filter 'acf/settings/save_json'
	 */
	public function save_json( $path ) {
		if ( ! is_null( $this->current_json_save_path ) ) {
			return $this->current_json_save_path;
		}
		return $path;
	}

	/**
	 *	Figure out where to save ACF JSON
	 *
	 *	@action 'acf/update_field_group'
	 */
	public function mutate_field_group( $field_group ) {
		// default

		if ( strpos( $field_group['key'], 'group_acf_dropzone_' ) === false ) {
			$this->current_json_save_path = null;
			return;
		}
		$this->current_json_save_path = dirname(__FILE__).'/acf-json';

	}
}

new PluginTest();
