(function( $, dropzone ){
	//
	// dropzone.Droploader = wp.Uploader.extend({
	// 	init:     function(e) {
	// 		console.log(e);
	// 	},
	// 	error:    function(e) {
	// 		console.log(e);
	// 	},
	// 	success:  function(e) {
	// 		console.log(e);
	// 	},
	// 	added:    function(e) {
	// 		console.log(e);
	// 	},
	// 	progress: function(e) {
	// 		console.log(e);
	// 	},
	// 	complete: function(e) {
	// 		console.log(e);
	// 	},
	//
	// });
	var Progress = Backbone.View.extend({
		tagName:   'div',
		className: 'media-progress-bar',
		render:function() {
			this.$bar = $('<div />');
			this.$el.append(this.$bar);
			return this;
		},
		setProgress:function( percent ) {
			this.$bar.width(percent+'%');
			return this;
		}
	});
	var Notice = wp.media.View.extend({
		template:wp.template('acf-dropzone-notice'),
		className:'notice is-dismissible',
		events:{
			'click .notice-dismiss' : 'remove',
		},
		render:function() {
			wp.media.View.prototype.render.apply(this,arguments);

			this.$el.addClass(this.options.type);
		}
	})


	var ACFDropzone = Backbone.View.extend({
		initialize: function() {
			this.notice = false;
			this.progress = false
			this.uploader = new wp.media.view.UploaderWindow({
				controller: this,
				uploader: {
					dropzone:  this.el,
					container: this.el,
				}
			});
			return this;
		},
		render:function() {
			$(this.uploader.render().el).appendTo( this.el );

			return this;
		},
		ready: function() {
			this.trigger('activate')
			this.uploader.ready();
			//
			this.uploader.uploader.uploader.bind('BeforeUpload', this.fileBeforeUpload, this );
			this.uploader.uploader.uploader.bind('UploadProgress', this.fileUploadProgress, this );
			this.uploader.uploader.uploader.bind('FileUploaded', this.fileUploaded, this );
			this.uploader.uploader.uploader.bind('error', this.fileUploadError, this );

			return this;
		},
		fileBeforeUpload: function( uploader, file ) {
			!! this.notice && this.notice.remove();
			this.notice = false;
		},
		fileUploadProgress:function( uploader, file ) {
			this.addProgress();
			this.progress.setProgress(file.percent);
		},
		fileUploaded:function( uploader, file, response ) {
			this.file = file;
			this.removeProgress();
			this.trigger('acf-dropzone-uploaded',file.attachment)
		},
		fileUploadError:function( uploader, error ) {
			this.removeProgress();
			// add error msg!
//			!! this.file.attachment && this.file.attachment.destroy();
			this.trigger( 'acf-dropzone-error', error );


			this.notice = new Notice({
				type:'error',
				bold: _.escape(error.file.name),
				message: error.message
			});
			this.notice.render();
			this.notice.$el.prependTo(this.el);
		},

		addProgress:function() {
			if ( this.progress ) {
				return this;
			}
			this.progress = new Progress();
			this.progress.render().$el.appendTo(this.el);
		},
		removeProgress:function( percent ) {
			if ( ! this.progress ) {
				return this;
			}

			this.progress.$el.remove();
			this.progress = false;
			return this;
		},
	});
/*
<div id="message" class="notice is-dismissible">
	<p>msg</p>
	<button type="button" class="notice-dismiss">
		<span class="screen-reader-text">Dismiss this notice.</span>
	</button>
</div>
*/

	$('.acf-field.dropzone').each(function(){

		var self = this,
			is_gallery = $(this).is('.acf-field-gallery'),
			el,
			dropzone;
		if ( is_gallery ) {
			el = $( this ).find('.acf-gallery-main').get(0)
		} else {
			el = $( this ).find('[data-uploader="wp"]').get(0);
		}
		dropzone = new ACFDropzone({
			el: el,
		});
		dropzone.render();
		dropzone.ready();
		dropzone.on('acf-dropzone-uploaded', function( attachment ){
			if ( is_gallery ) {
				acf.getField( $(self) ).appendAttachment( attachment );
			} else {
				acf.getField( $(self) ).render(attachment);
			}
		});
		dropzone.on('acf-dropzone-error', function( error ){
		});
	});

})(jQuery, acf_dropzone );
