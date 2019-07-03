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

	var UploaderInfo = wp.media.View.extend({
		tagName:   'div',
		className: 'acf-dropzone-info',
		template:wp.template('acf-dropzone-info')
	});
	var Progress = Backbone.View.extend({
		tagName:   'div',
		className: 'media-progress-bar-box',
		render:function() {
			this.$progress = $('<div />').addClass('media-progress-bar');
			this.$label = $('<div />').addClass('media-progress-label');
			this.$bar = $('<div />');
			this.$el
				.append( this.$label );
			this.$progress
				.append( this.$bar )
				.appendTo( this.$el );

			return this;
		},
		setLabel:function(label) {
			this.$label.text(label);
		},
		setProgress:function( percent ) {
			this.$bar.width( ( percent )+'%');
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
			this.progress = false;
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
			$( this.uploader.render().el ).appendTo( this.el );

			return this;
		},
		ready: function() {
			// prevent block editor file drop
			this.$el.on('drop dragenter dragleave dragover',function(e){
				e.stopPropagation()
			});

			this.trigger('activate')
			this.uploader.ready();
			//
			this.uploader.uploader.uploader.bind('FilesAdded', this.filesAdded, this );
			this.uploader.uploader.uploader.bind('BeforeUpload', this.fileBeforeUpload, this );
			this.uploader.uploader.uploader.bind('UploadProgress', this.fileUploadProgress, this );
			this.uploader.uploader.uploader.bind('FileUploaded', this.fileUploaded, this );
			this.uploader.uploader.uploader.bind('error', this.fileUploadError, this );

			return this;
		},
		filesAdded: function( uploader, files ) {
			this.total = files.length;
			this.done = 0;
		},
		fileBeforeUpload: function( uploader, file ) {
			!! this.notice && this.notice.remove();
			this.addProgress();
			this.progress.setLabel( _.escape(file.name) );
			this.notice = false;
		},
		fileUploadProgress:function( uploader, file ) {
			this.addProgress();
			this.progress.setProgress( ( 100 * this.done + file.percent ) / this.total );
		},
		fileUploaded:function( uploader, file, response ) {
			this.file = file;
			this.trigger('acf-dropzone-uploaded',file.attachment,this.done);
			this.done++;
			if (this.total === this.done ) {
				this.removeProgress();
			}
		},
		fileUploadError:function( uploader, error ) {
			this.done++;
			this.removeProgress();
			this.trigger( 'acf-dropzone-error', error );

			this.notice = new Notice({
				type:'error',
				bold: _.escape(error.file.name),
				message: error.message
			});
			this.notice.render();
			this.notice.$el.prependTo(this.el);
			this.total--;
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


	function initFileDropzone( field ) {
		var el,
			field = field,
			parent,
			info;

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

		info = new UploaderInfo();
		info.render();
		info.$el.prependTo( field.$('.hide-if-value') );

		dropzone = new ACFDropzone({
			el: el,
		});
		dropzone.render();
		dropzone.ready();
		dropzone.on('acf-dropzone-uploaded', function( attachment, i ){
			if ( parent.get('type') === 'repeater' && i > 0 ) {
				field.append( attachment, parent );
			} else {
				field.render(attachment);				
			}
		});
	}

	function initGalleryDropzone( field ) {
		var el = field.$('.acf-gallery-main').get(0),
			field = field;

		if ( ! field.$el.is('.dropzone') ) {
			return;
		}

		dropzone = new ACFDropzone({
			el: el,
		});
		dropzone.render();
		dropzone.ready();
		dropzone.on('acf-dropzone-uploaded', function( attachment ){

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


})(jQuery, acf_dropzone );
