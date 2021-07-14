import $ from 'jquery';

class ACFBasicDropzone {

	constructor({el}) {
		let fileInput = $(el).find('[type="file"]').get(0)

		$(el)
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
