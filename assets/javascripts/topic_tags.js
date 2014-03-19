Discourse.TagsView = Discourse.View.extend({
	templateName: "topic_tags",
	attributeBindings: ["model"],

	model: Em.computed.alias('controller.model'),

	insertTagsView: function() {
		var view = this;
		if (view.state === "inDOM") return;

		Ember.run.schedule('afterRender', this, function(){
			var target = view._parentView.$("h1").parent();
			if (target.length) {
				if (view.state === "preRender") view.createElement();
				target.append(view.$());
			}
      	});
	}
});

Discourse.TopicController.reopen({
       actions: {
               searchTag: function(tag){
                       console.log(tag);
                       if (Discourse.TopicSearch){
                               // search plugins support
                       var topicSearch = Discourse.TopicSearch.create();
                       topicSearch.set('query', "[" + tag + "]");
                       console.log(topicSearch);
                       this.transitionToRoute('topics_search', topicSearch);
                       }
               },
       }
});

Discourse.TopicView.reopen({
	insertTagsView: function() {
		if (this.get("tagsview")) return;

		var view = this.createChildView(Discourse.TagsView,
                        {controller: this.get("controller")});
		view.insertTagsView();
		this.set("tagsview", view)
	}.on("didInsertElement"),

	ensureTags: function(){
		if (!this.get("tagsview")) return;
		this.get("tagsview").insertTagsView();
	}.observes('topic.tags', 'topic.loaded'),

	removeTags: function(){
		if (this.get("tagsview")){
			this.get("tagsview").destroy();
			this.set("tagsview", null);
		}
	}.on("willClearRender"),

	killTags: function(){
		if (this.get("tagsview")){
			this.get("tagsview").destroy();
			this.set("tagsview", null);
		}
	}.on("willDestroyElement")
});