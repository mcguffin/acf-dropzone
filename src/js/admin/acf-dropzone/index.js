import $ from 'jquery';
import UploaderInfo from 'uploader-info.js';
import ACFDropzone from 'acf-dropzone.js';

const initFileDropzone = field => {

	if ( ! field.$el.is('.dropzone') ) {
		return;
	}

	const parent = field.parent();

	const el = field.$('[data-uploader="wp"]').get(0)

	// no wp uploader
	if ( ! el ) {
		return;
	}

	// https://stackoverflow.com/questions/1571076/remove-text-with-jquery
	field.$('.hide-if-value > p')
		.contents()
		.filter( function() {
			return this.nodeType == 3; //Node.TEXT_NODE
		})
		.remove();

	// add dropzone info
	if ( ! field.$('.acf-dropzone-info').length ) {
		const info = new UploaderInfo({or:true});
		info.render();
		info.$el.prependTo( field.$('.hide-if-value') );
	}

	const dropzone = new ACFDropzone({
		el,
		field
	});
	dropzone.render();
	dropzone.ready();
	dropzone.on('acf-dropzone-uploaded', ( attachment, i ) => {
		if ( parent && parent.get('type') === 'repeater' && i > 0 ) {
			field.append( attachment, parent );
		} else {
			field.render(attachment);
		}
	});
}
const initGalleryDropzone = field => {
	const el = field.$('.acf-gallery-attachments').get(0);

	// not a dropzone
	if ( ! field.$el.is('.dropzone') ) {
		return;
	}

	// add dropzone info
	if ( ! field.$('.acf-dropzone-info').length ) {
		const info = new UploaderInfo( { or: false } );
		info.render();
		info.$el.prependTo( el );
	}

	const dropzone = new ACFDropzone({
		el,
		field
	});
	dropzone.render();
	dropzone.ready();
	dropzone.on('acf-dropzone-uploaded', attachment => {
		field.appendAttachment(
			attachment,
			field.get('insert') === 'prepend' ? 0 : undefined
		);
	});
}

acf_dropzone.file_fields.forEach( type => {
	acf.addAction( `new_field/type=${type}`, initFileDropzone )
} )
acf_dropzone.gallery_fields.forEach( type => {
	acf.addAction( `new_field/type=${type}`, initGalleryDropzone )
} )
