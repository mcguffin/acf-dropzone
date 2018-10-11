ACF Dropzone
============

Add drag and drop upload to ACF File Field, Image field and Gallery field.

Requires at least ACF 5.6.

Usage
-----
Enable the "Dropzone" option in the field settings.

Status
------
This PLugin is currently in beta. Feel free to post issues and pull requests.

Installation
------------

### Production (Stand-Alone)
 - Head over to [releases](../../releases)
 - Download 'acf-dropzone.zip'
 - Upload and activate it like any other WordPress plugin
 - AutoUpdate will run as long as the plugin is active

### Production (using Github Updater – recommended for Multisite)
 - Install [Andy Fragen's GitHub Updater](https://github.com/afragen/github-updater) first.
 - In WP Admin go to Settings / GitHub Updater / Install Plugin. Enter `mcguffin/acf-dropzone` as a Plugin-URI.

### Development
 - cd into your plugin directory
 - $ `git clone git@github.com:mcguffin/acf-dropzone.git`
 - $ `cd acf-dropzone`
 - $ `npm install`
 - $ `gulp`

ToOo
====

 - [x] Gallery: test with multiple
 - [x] Gallery: Prepend/Append setting
 - [x] Style: progress bar
 - [x] Test in repeater
