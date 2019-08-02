
module.exports = wp.media.View.extend({
	template:wp.template('acf-dropzone-notice'),
	className:'notice is-dismissible',
	events:{
		'click .notice-dismiss' : 'remove',
	},
	render:function() {

		wp.media.View.prototype.render.apply(this,arguments);

		this.$el.addClass(this.options.type);

		return this;
	}
})
