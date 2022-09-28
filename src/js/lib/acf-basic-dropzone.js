import $ from 'jquery';

class ACFBasicDropzone {

	constructor( { el } ) {

		if ( $(el).is('.acf-dropzone-inited') ) {
			return;
		}

		let fileInput = $(el).find('[type="file"]').get(0)

		$(el)
			.addClass('acf-dropzone-inited')
			.on('dragover', e => {
				$(el).addClass('drag-over')
				e.preventDefault();
			})
			.on('dragleave', e => {
				$(el).removeClass('drag-over')
			})
			.on( 'drop', e => {
				$(el).removeClass('drag-over')
				e.preventDefault();
				fileInput.files = e.originalEvent.dataTransfer.files;
			});
	}
}

module.exports = ACFBasicDropzone;
