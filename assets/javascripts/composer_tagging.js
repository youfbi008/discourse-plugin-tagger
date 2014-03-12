Discourse.TagsSelectorComponent = Ember.Component.extend({
	tagName: "input",
	className: "tags-selector span7",
	//template: function() {return ""},

	autocompleteTemplate: Handlebars.compile("<div class='autocomplete'>" +
                                    "<ul>" +
                                    "{{#each options}}" +
                                      "<li>" +
                                          "{{this}}" +
                                      "</li>" +
                                      "{{/each}}" +
                                    "</ul>" +
                                  "</div>"),

	didInsertElement: function(){
	    var self = this;

	    this.$().autocomplete({
	      items: this.get('tags') || [],
	      single: false,
	      allowAny: true,
	      dataSource: function(term) {
	      	return Discourse.ajax('/tagger/tags', {
	      							data: {
      									search: term,
      									limit: 5
      								}
      							});
	      },
	      template: this.autocompleteTemplate,
	      onChangeItems: function(items) {
	        self.set("tags", items);
	      },
	      //template: Discourse.TagsComponent.templateFunction(),
	      transformComplete: function(item) {
	      	return item;
	      }
	    });
	    this.$().parent().width("auto");
	}
});

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

	// only creation of new topic and editing of first post are valid for us
	can_be_tagged: function(){
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