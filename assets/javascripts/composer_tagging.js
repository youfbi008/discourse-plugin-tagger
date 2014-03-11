
Discourse.ComposerTagsView = Discourse.View.extend({
	templateName: "composer_tagging",

	insertTagsView: function() {
		this._insertElementLater(function() {
			var target = this._parentView.$("#draft-status");
			if (target.length === 0) return;
      		this.$().insertAfter(target);
      	}.bind(this));
	}
});


Discourse.ComposerView.reopen({
	childDidInsertElement: function() {
		this._super();
		if (this.get("tagsview")) return;

		var view = this.createChildView(Discourse.ComposerTagsView,
			 {controller: this.get("controller")});
		view.insertTagsView();
		this.set("tagsview", view)
		console.log(view);
	}
});