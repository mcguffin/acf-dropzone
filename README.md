ACF Dropzone
============

This is the official github repository of the [ACF Dropzone](https://wordpress.org/plugins/acf-dropzone/) plugin.

About
-----

Add drag and drop upload to ACF File Field, Image field and Gallery field.

Requires at least WP 5.0 and ACF 5.6.

Usage
-----
Enable the "Dropzone" option in the field settings.

![Dropzone Setting](.wporg/screenshot-1.png)

Enjoy your new dropping experience!

![Happy Dropping](.wporg/screenshot-2.png)


Installation
------------

### Production

#### In WP Admin
Just follow the [Automatic Plugin Installation](https://wordpress.org/support/article/managing-plugins/#automatic-plugin-installation) procedere.

#### WP-CLI
```
$ wp plugin install --activate acf-dropzone
```

#### Using composer
```
composer require mcguffin/acf-dropzone
```

### Development
 - cd into your plugin directory
 - $ `git clone git@github.com:mcguffin/acf-dropzone.git`
 - $ `cd acf-dropzone`
 - $ `npm install`
 - $ `npm run dev`

Plugin API
----------
To add dropzone capability to arbitrary field types you can use the `acf_dropzone/file_fields` and `acf_dropzone/gallery_fields` filter.

This might come in handy if you use the feature image field type of [ACF Frontend](https://wordpress.org/plugins/acf-frontend-form-element/), or something alike.

Adding support for ACF Frontend‘s `featured_image` field:
```php
add_filter( 'acf_dropzone/file_fields', function($fields) {
	$fields[] = 'featured_image';
	return $fields;
});
```

Please note that the field input HTML needs to be exactly as the one provided by ACF, so filters won't work on any field.
