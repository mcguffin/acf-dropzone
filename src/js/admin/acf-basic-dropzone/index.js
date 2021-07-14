import ACFBasicDropzone from 'acf-basic-dropzone.js';


const initFileDropzone = field => {
	let el,
		uploaderType,
		parent,
		info,
		dropzone;

	if ( ! field.$el.is('.dropzone') ) {
		return;
	}

	parent = field.parent();

	el = field.$('[data-uploader="basic"]').get(0)

	if ( ! el ) {
		return;
	}
	// https://stackoverflow.com/questions/1571076/remove-text-with-jquery
	dropzone = new ACFBasicDropzone({
		el: el,
		field: field
	});

}
acf_dropzone.file_fields.forEach( type => {
	acf.addAction( `ready_field/type=${type}`, initFileDropzone );
	acf.addAction( `append_field/type=${type}`, initFileDropzone );
});
