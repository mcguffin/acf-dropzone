
module.exports = Backbone.View.extend({
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
		return this;
	},
	setProgress:function( percent ) {
		this.$bar.width( ( percent )+'%');
		return this;
	}
});
