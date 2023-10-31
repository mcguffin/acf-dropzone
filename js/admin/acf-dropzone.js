!function(){"use strict";var e=wp.media.View.extend({tagName:"div",className:"acf-dropzone-info",template:wp.template("acf-dropzone-info")}),t=wp.media.View.extend({template:wp.template("acf-dropzone-notice"),className:"notice is-dismissible",events:{"click .notice-dismiss":"remove"},render:function(){return wp.media.View.prototype.render.apply(this,arguments),this.$el.addClass(this.options.type),this}}),i={};(function(e){(function(){var t;(t="undefined"!=typeof window?window.jQuery:void 0!==e?e.jQuery:null)&&t.__esModule,i=Backbone.View.extend({events:{focus:"listenPaste",blur:"stopListenPaste"},listenPaste:function(e){var t=this;this.$el.on("paste",(function(){t.onPaste.apply(t,arguments)}))},stopListenPaste:function(){this.$el.off("paste")},initialize:function(e){return Backbone.View.prototype.initialize.apply(this,arguments),this.controller=e.controller,this},render:function(){return this.$el.attr("tabindex","-1"),this},onPaste:function(e){e.preventDefault(),e.stopPropagation();var t,i,o=e.originalEvent.clipboardData.items;for(t=0;t<o.length;t++)"file"===o[t].kind&&(i=o[t].getAsFile())&&(this.controller.uploader.uploader.param("post_data",{post_title:wp.template("acf-dropzone-attachment-title")({fieldname:this.controller.field.get("name")}).trim(),post_type:"attachment"}),this.controller.uploader.uploader.uploader.addFile(i,i.name));return this}})}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var o={};(function(e){(function(){var t,i=(t="undefined"!=typeof window?window.jQuery:void 0!==e?e.jQuery:null)&&t.__esModule?t:{default:t};o=Backbone.View.extend({tagName:"div",className:"media-progress-bar-box",render:function(){return this.$progress=(0,i.default)("<div />").addClass("media-progress-bar"),this.$label=(0,i.default)("<div />").addClass("media-progress-label"),this.$bar=(0,i.default)("<div />"),this.$el.append(this.$label),this.$progress.append(this.$bar).appendTo(this.$el),this},setLabel:function(e){return this.$label.text(e),this},setProgress:function(e){return this.$bar.width(e+"%"),this}})}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{});var n={};(function(e){(function(){var r=l("undefined"!=typeof window?window.jQuery:void 0!==e?e.jQuery:null),s=l(t),a=l(i),d=l(o);function l(e){return e&&e.__esModule?e:{default:e}}n=Backbone.View.extend({initialize:function(e){var t=this,i={};return this.el.removeAttribute("id"),this.$(".uploader-window,.moxie-shim").remove(),this.field=e.field,i._acfuploader=this.field.get("key"),document.querySelector("#_acf_post_id")&&(i._acf_post_id=document.querySelector("#_acf_post_id").value,parseInt(i._acf_post_id)>0&&(i.post_id=i._acf_post_id)),this.notice=!1,this.progress=!1,this.uploader=new wp.media.view.UploaderWindow({controller:this,uploader:{dropzone:this.el,container:this.el,params:i,error:function(e,i,o){t.fileUploadError(t.uploader,{message:e,file:o})}}}),this.pasteboard=new a.default({controller:this,el:this.$el.is('[data-uploader="wp"]')?this.el:this.field.$(".acf-gallery-attachments").get(0)}),this},render:function(){return(0,r.default)(this.uploader.render().el).appendTo(this.el),this.pasteboard.render(),this},ready:function(){var e=this;return this.$el.on("drop dragenter dragleave dragover",(function(e){e.stopPropagation()})).on("drop",(function(t){e.removeNotice()})),this.trigger("activate"),this.uploader.ready(),this.uploader.uploader.uploader.bind("FilesAdded",this.filesAdded,this),this.uploader.uploader.uploader.bind("BeforeUpload",this.fileBeforeUpload,this),this.uploader.uploader.uploader.bind("UploadProgress",this.fileUploadProgress,this),this.uploader.uploader.uploader.bind("FileUploaded",this.fileUploaded,this),this.pasteboard.render(),this},filesAdded:function(e,t){this.total=t.length,this.done=0},fileBeforeUpload:function(e,t){this.addProgress(),this.progress.setLabel(_.escape(t.name))},fileUploadProgress:function(e,t){this.addProgress(),this.progress.setProgress((100*this.done+t.percent)/this.total)},fileUploaded:function(e,t,i){var o;this.file=t;try{this.trigger("acf-dropzone-uploaded",t.attachment,this.done),this.done++,this.total===this.done&&this.removeProgress()}catch(n){try{o=JSON.parse(i.response),this.fileUploadError(e,{file:this.file,message:o.data.message})}catch(r){this.fileUploadError(e,{file:this.file,message:i.response})}}},fileUploadError:function(e,t){this.done++,this.total===this.done&&this.removeProgress(),this.trigger("acf-dropzone-error",t),this.addNotice({type:"error",bold:_.escape(t.file.name),message:t.message})},addProgress:function(){return this.progress||(this.progress=new d.default,this.progress.render().$el.prependTo(this.el)),this},removeProgress:function(e){return this.progress?(this.progress.$el.remove(),this.progress=!1,this):this},addNotice:function(e){return this.notice=new s.default(e),this.notice.render(),this.notice.$el.prependTo(this.el),this},removeNotice:function(e){return this.notice&&(this.notice.remove(),this.notice=!1),this}})}).call(this)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{}),function(t){(function(){r("undefined"!=typeof window?window.jQuery:void 0!==t?t.jQuery:null);var i=r(e),o=r(n);function r(e){return e&&e.__esModule?e:{default:e}}var s=function(e){if(e.$el.is(".dropzone")){var t=e.parent(),n=e.$('[data-uploader="wp"]').get(0);if(n){if(e.$(".hide-if-value > p").contents().filter((function(){return 3==this.nodeType})).remove(),!e.$(".acf-dropzone-info").length){var r=new i.default({or:!0});r.render(),r.$el.prependTo(e.$(".hide-if-value"))}var s=new o.default({el:n,field:e});s.render(),s.ready(),s.on("acf-dropzone-uploaded",(function(i,o){t&&"repeater"===t.get("type")&&o>0?e.append(i,t):e.render(i)}))}}},a=function(e){var t=e.$(".acf-gallery-attachments").get(0);if(e.$el.is(".dropzone")){if(!e.$(".acf-dropzone-info").length){var n=new i.default({or:!1});n.render(),n.$el.prependTo(t)}var r=new o.default({el:t,field:e});r.render(),r.ready(),r.on("acf-dropzone-uploaded",(function(t){e.appendAttachment(t,"prepend"===e.get("insert")?0:void 0)}))}};acf_dropzone.file_fields.forEach((function(e){acf.addAction("new_field/type=".concat(e),s)})),acf_dropzone.gallery_fields.forEach((function(e){acf.addAction("new_field/type=".concat(e),a)}))}).call(this)}.call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})}();