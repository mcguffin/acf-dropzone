import $ from 'jquery';
import Notice from 'notice.js';
import Pasteboard from 'pasteboard.js';
import Progress from 'progress.js';


module.exports = Backbone.View.extend({
	initialize: function( opt ) {

		const self = this;

		this.field = opt.field;

		this.notice = false;
		this.progress = false;
		this.uploader = new wp.media.view.UploaderWindow({
			controller: this,
			uploader: {
				dropzone:  this.el,
				container: this.el,
				params: {
					_acfuploader: this.field.get('key'),
				},
				error: function( msg, err, file ) {
					self.fileUploadError( self.uploader, {
						message: msg,
						file: file
					} )
				}
			}
		});

		this.pasteboard = new Pasteboard({
			controller: this,
			el: this.$el.is('[data-uploader="wp"]') ? this.el : this.field.$('.acf-gallery-attachments').get(0)
		});

		return this;
	},
	render:function() {
		$( this.uploader.render().el ).appendTo( this.el );

		this.pasteboard.render();

		return this;
	},
	ready: function() {
		const self = this;
		this.$el
		.on('drop dragenter dragleave dragover',function(e){
			// prevent block editor file drop
			e.stopPropagation()
		})
		.on('drop',function(e){
			// reset error
			self.removeNotice();
		});

		this.trigger('activate')
		this.uploader.ready();
		//
		this.uploader.uploader.uploader.bind('FilesAdded', this.filesAdded, this );
		this.uploader.uploader.uploader.bind('BeforeUpload', this.fileBeforeUpload, this );
		this.uploader.uploader.uploader.bind('UploadProgress', this.fileUploadProgress, this );
		this.uploader.uploader.uploader.bind('FileUploaded', this.fileUploaded, this );
		this.uploader.uploader.uploader.bind('error', this.fileUploadError, this ); // maybe remove this?
		this.pasteboard.render();
		return this;
	},
	filesAdded: function( uploader, files ) {
		//
		this.total = files.length;
		this.done = 0;
		//_acfuploader
		//this.notice = false;
	},
	fileBeforeUpload: function( uploader, file ) {
		this.addProgress();
		this.progress.setLabel( _.escape(file.name) );
	},
	fileUploadProgress:function( uploader, file ) {
		this.addProgress();
		this.progress.setProgress( ( 100 * this.done + file.percent ) / this.total );
	},
	fileUploaded:function( uploader, file, response ) {
		let result;
		this.file = file;
		try {
			this.trigger('acf-dropzone-uploaded',file.attachment,this.done);
			this.done++;
			if (this.total === this.done ) {
				this.removeProgress();
			}
		} catch( err ) {
			try {
				result = JSON.parse( response.response );
				this.fileUploadError( uploader, {
					file: this.file,
					message: result.data.message
				});
			} catch ( err2 ) {
				this.fileUploadError( uploader, {
					file: this.file,
					message: response.response
				});
			}
		}
	},
	fileUploadError:function( uploader, error ) {
		this.done++;
		if (this.total === this.done ) {
			this.removeProgress();
		}
		this.trigger( 'acf-dropzone-error', error );

		this.addNotice({
			type:'error',
			bold: _.escape(error.file.name),
			message: error.message
		});
	},
	addProgress:function() {
		if ( this.progress ) {
			return this;
		}
		this.progress = new Progress();
		this.progress.render().$el.prependTo(this.el);
		return this;
	},
	removeProgress:function( percent ) {
		if ( ! this.progress ) {
			return this;
		}

		this.progress.$el.remove();
		this.progress = false;
		return this;
	},
	addNotice:function(options) {
		this.notice = new Notice(options);
		this.notice.render();
		this.notice.$el.prependTo(this.el);
		return this;
	},
	removeNotice:function(options) {
		if ( !! this.notice ) {
			this.notice.remove();
			this.notice = false;
		}
		return this;
	}
});
