Discourse.TagsView = Discourse.View.extend({
	templateName: "topic_tags",

	model: Em.computed.alias('controller.model'),
	insertTagsView: function() {
		this._insertElementLater(function() {
			var target = this._parentView.$("h1");
      		this.$().insertAfter(target);
      	}.bind(this));
	}
});
Discourse.TopicView.reopen({
	addTags: function(){
		this._super();
		if (this.get("tagsview")) return;

		var view = this.createChildView(Discourse.TagsView,
			 {controller: this.get("controller")});
		view.insertTagsView();
		this.set("tagsview", view)
	}.on("didInsertElement")
});