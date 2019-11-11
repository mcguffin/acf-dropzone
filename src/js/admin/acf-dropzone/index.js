import $ from 'jquery';
import UploaderInfo from 'uploader-info.js';
import ACFDropzone from 'acf-dropzone.js';



const initFileDropzone = field => {
	let el,
		parent,
		info,
		dropzone;

	if ( ! field.$el.is('.dropzone') ) {
		return;
	}

	parent = field.parent();

	el = field.$('[data-uploader="wp"]').get(0)

	if ( ! el ) {
		return;
	}
	// https://stackoverflow.com/questions/1571076/remove-text-with-jquery
	field.$('.hide-if-value>p')
		.contents()
		.filter( function() {
			return this.nodeType == 3; //Node.TEXT_NODE
		})
		.remove();

	info = new UploaderInfo({or:true});
	info.render();
	info.$el.prependTo( field.$('.hide-if-value') );


	dropzone = new ACFDropzone({
		el: el,
		field: field
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

	let dropzone,
		info,
		el = field.$('.acf-gallery-attachments').get(0);

	if ( ! field.$el.is('.dropzone') ) {
		return;
	}

	info = new UploaderInfo({or:false});
	info.render();
	info.$el.prependTo( el );

	dropzone = new ACFDropzone({
		el: el,
		field: field
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


acf.addAction( 'ready_field/type=image',   initFileDropzone );
acf.addAction( 'ready_field/type=file',    initFileDropzone );
acf.addAction( 'ready_field/type=gallery', initGalleryDropzone );

// created from repeater
acf.addAction( 'append_field/type=image',   initFileDropzone );
acf.addAction( 'append_field/type=file',    initFileDropzone );
acf.addAction( 'append_field/type=gallery', initGalleryDropzone );
