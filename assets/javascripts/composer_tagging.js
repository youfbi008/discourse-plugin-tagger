
Discourse.ComposerTagsView = Discourse.View.extend({
	templateName: "composer_tagging",

	model: Em.computed.alias('controller.model'),

	insertTagsView: function() {
		this._insertElementLater(function() {
			var target = this._parentView.$();
			console.log(target);
      		target.append(this.$());
      		console.log(this.get("model"));
      	}.bind(this));
	}
});

Discourse.Composer.reopen({

	can_be_tagged: function(){
		// only creation of new topic and editing of first post are valid for us
		console.log("asked");
		return this.get("creatingTopic") || (
			this.get("editingPost") && this.get("editingFirstPost"))
	}.property("creatingTopic", "editingPost", "editingFirstPost")

});


Discourse.ComposerView.reopen({
	insertTagsView: function() {
		this._super();
		if (this.get("tagsview")) return;

		var view = this.createChildView(Discourse.ComposerTagsView,
			 {controller: this.get("controller")});
		view.insertTagsView();
		console.log(view);
		this.set("tagsview", view)
	}.on("didInsertElement")
});