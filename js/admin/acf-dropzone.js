!function s(n,a,d){function l(t,e){if(!a[t]){if(!n[t]){var r="function"==typeof require&&require;if(!e&&r)return r(t,!0);if(p)return p(t,!0);var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}var o=a[t]={exports:{}};n[t][0].call(o.exports,function(e){return l(n[t][1][e]||e)},o,o.exports,s,n,a,d)}return a[t].exports}for(var p="function"==typeof require&&require,e=0;e<d.length;e++)l(d[e]);return l}({1:[function(o,e,t){(function(e){"use strict";t("undefined"!=typeof window?window.jQuery:void 0!==e?e.jQuery:null);var s=t(o("uploader-info.js")),n=t(o("acf-dropzone.js"));function t(e){return e&&e.__esModule?e:{default:e}}function r(r){var e,i,t,o;r.$el.is(".dropzone")&&(i=r.parent(),(e=r.$('[data-uploader="wp"]').get(0))&&(r.$(".hide-if-value>p").contents().filter(function(){return 3==this.nodeType}).remove(),(t=new s.default({or:!0})).render(),t.$el.prependTo(r.$(".hide-if-value")),(o=new n.default({el:e,field:r})).render(),o.ready(),o.on("acf-dropzone-uploaded",function(e,t){i&&"repeater"===i.get("type")&&0<t?r.append(e,i):r.render(e)})))}function i(t){var e,r,i=t.$(".acf-gallery-attachments").get(0);t.$el.is(".dropzone")&&((r=new s.default({or:!1})).render(),r.$el.prependTo(i),(e=new n.default({el:i,field:t})).render(),e.ready(),e.on("acf-dropzone-uploaded",function(e){t.appendAttachment(e,"prepend"===t.get("insert")?0:void 0)}))}jQuery,acf_dropzone,acf.addAction("ready_field/type=image",r),acf.addAction("ready_field/type=file",r),acf.addAction("ready_field/type=gallery",i),acf.addAction("append_field/type=image",r),acf.addAction("append_field/type=file",r),acf.addAction("append_field/type=gallery",i)}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"acf-dropzone.js":2,"uploader-info.js":6}],2:[function(e,t,r){"use strict";var i=n(e("notice.js")),o=n(e("pasteboard.js")),s=n(e("progress.js"));function n(e){return e&&e.__esModule?e:{default:e}}t.exports=Backbone.View.extend({initialize:function(e){return this.field=e.field,this.notice=!1,this.progress=!1,this.uploader=new wp.media.view.UploaderWindow({controller:this,uploader:{dropzone:this.el,container:this.el,params:{_acfuploader:this.field.get("key")}}}),this.pasteboard=new o.default({controller:this,el:this.$el.is('[data-uploader="wp"]')?this.el:this.field.$(".acf-gallery-attachments").get(0)}),this},render:function(){return $(this.uploader.render().el).appendTo(this.el),this.pasteboard.render(),this},ready:function(){var t=this;return this.$el.on("drop dragenter dragleave dragover",function(e){e.stopPropagation()}).on("drop",function(e){t.removeNotice()}),this.trigger("activate"),this.uploader.ready(),this.uploader.uploader.uploader.bind("FilesAdded",this.filesAdded,this),this.uploader.uploader.uploader.bind("BeforeUpload",this.fileBeforeUpload,this),this.uploader.uploader.uploader.bind("UploadProgress",this.fileUploadProgress,this),this.uploader.uploader.uploader.bind("FileUploaded",this.fileUploaded,this),this.uploader.uploader.uploader.bind("error",this.fileUploadError,this),this.pasteboard.render(),this},filesAdded:function(e,t){this.total=t.length,this.done=0},fileBeforeUpload:function(e,t){this.addProgress(),this.progress.setLabel(_.escape(t.name))},fileUploadProgress:function(e,t){this.addProgress(),this.progress.setProgress((100*this.done+t.percent)/this.total)},fileUploaded:function(t,e,r){var i;this.file=e;try{this.trigger("acf-dropzone-uploaded",e.attachment,this.done),this.done++,this.total===this.done&&this.removeProgress()}catch(e){try{i=JSON.parse(r.response),this.fileUploadError(t,{file:this.file,message:i.data.message})}catch(e){this.fileUploadError(t,{file:this.file,message:r.response})}}},fileUploadError:function(e,t){this.done++,this.total===this.done&&this.removeProgress(),this.trigger("acf-dropzone-error",t),this.addNotice({type:"error",bold:_.escape(t.file.name),message:t.message})},addProgress:function(){return this.progress||(this.progress=new s.default,this.progress.render().$el.prependTo(this.el)),this},removeProgress:function(e){return this.progress&&(this.progress.$el.remove(),this.progress=!1),this},addNotice:function(e){return this.notice=new i.default(e),this.notice.render(),this.notice.$el.prependTo(this.el),this},removeNotice:function(e){return this.notice&&(this.notice.remove(),this.notice=!1),this}})},{"notice.js":3,"pasteboard.js":4,"progress.js":5}],3:[function(e,t,r){"use strict";t.exports=wp.media.View.extend({template:wp.template("acf-dropzone-notice"),className:"notice is-dismissible",events:{"click .notice-dismiss":"remove"},render:function(){return wp.media.View.prototype.render.apply(this,arguments),this.$el.addClass(this.options.type),this}})},{}],4:[function(e,t,r){"use strict";t.exports=Backbone.View.extend({events:{focus:"listenPaste",blur:"stopListenPaste"},listenPaste:function(e){var t=this;this.$el.on("paste",function(){t.onPaste.apply(t,arguments)})},stopListenPaste:function(){this.$el.off("paste")},initialize:function(e){return Backbone.View.prototype.initialize.apply(this,arguments),this.controller=e.controller,this},render:function(){return this.$el.attr("tabindex","-1"),this},onPaste:function(e){e.preventDefault(),e.stopPropagation();var t,r,i=e.originalEvent.clipboardData.items;for(t=0;t<i.length;t++)"file"===i[t].kind&&(r=i[t].getAsFile())&&(this.controller.uploader.uploader.param("post_data",{post_title:wp.template("acf-dropzone-attachment-title")({fieldname:this.controller.field.get("name")}).trim(),post_type:"attachment"}),this.controller.uploader.uploader.uploader.addFile(r,r.name));return this}})},{}],5:[function(e,t,r){"use strict";t.exports=Backbone.View.extend({tagName:"div",className:"media-progress-bar-box",render:function(){return this.$progress=$("<div />").addClass("media-progress-bar"),this.$label=$("<div />").addClass("media-progress-label"),this.$bar=$("<div />"),this.$el.append(this.$label),this.$progress.append(this.$bar).appendTo(this.$el),this},setLabel:function(e){return this.$label.text(e),this},setProgress:function(e){return this.$bar.width(e+"%"),this}})},{}],6:[function(e,t,r){"use strict";t.exports=wp.media.View.extend({tagName:"div",className:"acf-dropzone-info",template:wp.template("acf-dropzone-info")})},{}]},{},[1]);