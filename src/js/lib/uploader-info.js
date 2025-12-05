
module.exports = {
	UploaderInfo: wp.media.View.extend({
		tagName:   'div',
		className: 'acf-dropzone-info',
		template:wp.template('acf-dropzone-info')
	}),
	GalleryUploaderInfo: wp.media.View.extend({
		tagName:   'div',
		className: 'acf-dropzone-info',
		template:wp.template('acf-dropzone-info-gallery')
	})
};
