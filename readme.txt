=== ACF Dropzone ===
Contributors: podpirate
Donate link: https://www.msf.org/donate
Tags: drag-drop, paste, acf, file upload
Requires at least: 5.0
Requires PHP: 5.6
Tested up to: 6.4
Stable tag: 1.1.15
License: GPLv3 or later
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Drag and drop file upload for ACF-Fields.

== Description ==

Enable Drag and Drop Upload in [ACF](https://wordpress.org/plugins/advanced-custom-fields/)’s Image, File and Gallery Field.

= Supported Fields =

- Image Field
- File Field
- Gallery Field ([ACF PRO](https://www.advancedcustomfields.com/pro) only)

= Usage =
Check "Enable Dropzone" in the ACF Field Editor.

= Development =
Please head over to the source code [on Github](https://github.com/mcguffin/acf-dropzone).

== Installation ==

Just follow the [Automatic Plugin Installation](https://wordpress.org/support/article/managing-plugins/#automatic-plugin-installation) procedere.

== Frequently asked questions ==

= I found a bug. Where should I post it? =

Please use the issues section in the [GitHub-Repository](https://github.com/mcguffin/acf-dropzone/issues).

I will most likely not maintain the forum support forum on wordpress.org. Anyway, other users might have an answer for you, so it's worth a shot.

= I'd like to suggest a feature. Where should I post it? =

Please post an issue in the [GitHub-Repository](https://github.com/mcguffin/acf-dropzone/issues)

= Just dragging files is so cool! Any way I can show my appreciation? =

Thanks! As a well trained person living in a rich country I am doing quite well.
But there are billions of people lacking access to essential health services.

So, if this little piece of software made your life a bit easier, a donation at [Medecins sans Frontieres](https://www.msf.org/donate) will do the same for many other people.


== Screenshots ==

1. ACF Field configuration
2. Some ACF Fields with dropzone enabled.
3. Dragging over ...
4. ... uploading
5. Dragging over a Gallery field

== Upgrade Notice ==

On the whole upgrading is always a good idea.

== Changelog ==

= 1.1.15 =
 - Fix: Broken CSS in webkit (chrome, edge)

= 1.1.14 =
 - UI: Consistent size in focus state
 - Fix: Dropzones in duplicated fields not droppable

= 1.1.13 =
 - Fix: fix php 8.2 deprecation notice

= 1.1.12 =
 - Fix: Dropzone not initing in addded repeater fields

= 1.1.9 - 1.1.11 =
 - Test with ACF 6.0

= 1.1.8 =
 - Enhancement: Include `_acf_post_id` and `post_id` in upload `$_REQUEST`
 - Test with WP 6.0

= 1.1.7 =
 - Fix: Two error messages showing

= 1.1.6 =
 - Support basic uploader (frontend)
 - Introduce Plugin API hooks
 - Fix missing error messages
 - WP 5.8 Compatibility
 - Test with PHP 8

= 1.1.5 =
 - Fix: fatal error in AcfDropzone/Compat/ACF (undefined function)

= 1.1.4 =
 - Use WP 5.7 admin colors
 - Fix: PHP Warning sometimes seen in error logs

= 1.1.3 =
 - Fix PHP Warning on ACF options pages

= 1.1.2 =
 - Security hardening

= 1.1.1 =
 - Fix js dependency

= 1.1.0 =
 - Introduce paste feature
 - Slight UI improvements
 - Apply ACF's file validation on upload

= 1.0.0 =
Release at wordpress.org
