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

	var Pasteboard = Backbone.View.extend({
		events: {
			paste: 'onPaste'
		},
		initialize: function(opt) {
			Backbone.View.prototype.initialize.apply( this, arguments );
			this.controller = opt.controller;
			return this;
		},
		render: function() {
			// make focussable
			this.$el.attr('tabindex','0');
			return this;
		},
		onPaste:function(e){

			e.preventDefault();
			e.stopPropagation();
					
			var items = e.originalEvent.clipboardData.items, 
				i, blob;
			
			for ( i = 0; i < items.length; i++ ) {
				
				if ( items[i].kind !== 'file' ) {
					continue;
				}
				// get pasted file ...
				blob = items[i].getAsFile();
				if ( !! blob ) {
					
					// ... add to plupload
					this.controller.uploader.uploader.uploader.addFile( blob, blob.name );					
				}
			}
			return this;
		}
	});

	var ACFDropzone = Backbone.View.extend({
		initialize: function( opt ) {
			var $pasteboard;
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
						foo:'bar',
					}
				}
			});
			// init pasteboard
			// file and image field ...
			$pasteboard = this.$el.find('.hide-if-value');
			if ( ! $pasteboard.length ) {
				// ... gallery field
				$pasteboard = this.$el.find('.acf-gallery-attachments');
			}
			if ( $pasteboard.length ) {
				this.pasteboard = new Pasteboard({
					controller: this,
					el: $pasteboard.get(0)
				});				
			}

			return this;
		},
		render:function() {
			$( this.uploader.render().el ).appendTo( this.el );
			this.pasteboard.render();

			return this;
		},
		ready: function() {
			var self = this;
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
			this.uploader.uploader.uploader.bind('error', this.fileUploadError, this );
			
			return this;
		},
		filesAdded: function( uploader, files ) {
			//
			this.total = files.length;
			this.done = 0;
			//_acfuploader
			//this.notice = false;
console.log('added')
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
			var result;
			this.file = file;
			try {
				this.trigger('acf-dropzone-uploaded',file.attachment,this.done);				
				this.done++;
				if (this.total === this.done ) {
					this.removeProgress();
				}
			} catch( err ) {
				result = JSON.parse( response.response );
				this.fileUploadError( uploader, {
					file: this.file,
					message: result.data.message
				});
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
			this.progress.render().$el.appendTo(this.el);
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
			field: field
		});
		dropzone.render();
		dropzone.ready();
		dropzone.on('acf-dropzone-uploaded', function( attachment, i ){
			if ( parent && parent.get('type') === 'repeater' && i > 0 ) {
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
			field: field
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
