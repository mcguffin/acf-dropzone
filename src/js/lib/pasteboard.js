

module.exports = Backbone.View.extend({
	events: {
		focus:'listenPaste',
		blur:'stopListenPaste'
	},
	listenPaste:function(e){
		const self = this;
		this.$el.on('paste',function() {
			self.onPaste.apply( self, arguments );
		});
	},
	stopListenPaste:function(){
		this.$el.off('paste');
	},
	initialize: function(opt) {
		Backbone.View.prototype.initialize.apply( this, arguments );
		this.controller = opt.controller;
		return this;
	},
	render: function() {
		// make focussable
		this.$el.attr('tabindex','-1');//.attr('contenteditable','true');
		return this;
	},
	onPaste:function(e){
		e.preventDefault();
		e.stopPropagation();

		const items = e.originalEvent.clipboardData.items;
		let i, blob, file, filename;

		for ( i = 0; i < items.length; i++ ) {

			if ( items[i].kind !== 'file' ) {
				continue;
			}

			// get pasted file ...
			blob = items[i].getAsFile();
			if ( !! blob ) {
				// ... add to plupload


				this.controller.uploader.uploader.param('post_data', {
					post_title: wp.template('acf-dropzone-attachment-title')({
						fieldname:this.controller.field.get('name')
					}).trim(),
					post_type: 'attachment'
				} );
				this.controller.uploader.uploader.uploader.addFile( blob, blob.name );
			}
		}
		return this;
	}
});
