Discourse.TagsSelectorComponent = Ember.TextField.extend({
	className: "tags-selector span4",


    didInsertElement: function() {
      this._super();
      var _this = this;
      var engine = new Bloodhound({
      	remote: "/tagger/tags?search=%QUERY",
      	datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.val); },
  		queryTokenizer: Bloodhound.tokenizers.whitespace
      });

	  engine.initialize();
      this.typeahead = this.$().typeahead({
	        name: "typeahead",
	        minLength: 3,
	        limit: this.get("limit") || 5,
   		},{
   			displayKey: function(x){ return x; }, // no transformation needed
			source: engine.ttAdapter()
      });

      this.typeahead.on("typeahead:selected", function(ev, item) {
        _this.addSelected(item);
      });

      this.typeahead.on("typeahead:autocompleted", function(ev, item) {
        _this.addSelected(item);
      });
    },

    addSelected: function(new_tag){
		var tags = this.get("tags") || [],
    		new_tag = new_tag.toLowerCase();

    	if (tags.indexOf(new_tag) === -1 ){ // not found, add it
    		tags.pushObject(new_tag);
    		// this.set("tags", tags);
	    }
	    this.typeahead.val("");
	}
});
// Discourse.TagsSelectorComponent = Ember.Component.extend({
// 	tagName: "input",
// 	className: "tags-selector span7",
// 	//template: function() {return ""},

// 	autocompleteTemplate: Handlebars.compile("<div class='autocomplete'>" +
//                                     "<ul>" +
//                                     "{{#each options}}" +
//                                       "<li>" +
//                                           "{{this}}" +
//                                       "</li>" +
//                                       "{{/each}}" +
//                                     "</ul>" +
//                                   "</div>"),

// 	didInsertElement: function(){
// 	    var self = this;

// 	    this.$().autocomplete({
// 	      items: this.get('_parentView._parentView.model.topic.tags') || [],
// 	      single: false,
// 	      allowAny: true,
// 	      dataSource: function(term) {
// 	      	return Discourse.ajax('/tagger/tags', {
// 	      							data: {
//       									search: term,
//       									limit: 5
//       								}
//       							});
// 	      },
// 	      template: this.autocompleteTemplate,
// 	      onChangeItems: function(items) {
// 	      	console.log(items);
// 	        self.set("_parentView._parentView.model.tags", items);
// 	      },
// 	      //template: Discourse.TagsComponent.templateFunction(),
// 	      transformComplete: function(item) {
// 	      	return item;
// 	      }
// 	    });
// 	    this.$().parent().width("auto");
// 	}
// });

Discourse.ComposerTagsView = Discourse.View.extend({
	templateName: "composer_tagging",

	model: Em.computed.alias('controller.model'),
	insertTagsView: function() {
		this._insertElementLater(function() {
			var target = this._parentView.$();
      		target.append(this.$());
      	}.bind(this));
	}
});

Discourse.Composer.reopen({

	// only creation of new topic and editing of first post are valid for us
	can_be_tagged: function(){
		return this.get("creatingTopic") || (
			this.get("editingPost") && this.get("editingFirstPost"))
	}.property("creatingTopic", "editingPost", "editingFirstPost"),

	createPost: function(opts) {
		var dfr = this._super(opts);
		console.log(this.get("tags"));
		dfr.then(function(result){
				var tagger = Discourse.ajax('/tagger/set_tags', {
		      							data: {
	      									tags: (this.get("tags") || []).join(","),
	      									topic_id: result.post.topic_id
	      								}
	      							});
				tagger.then(function(tag_res){
					console.log(tag_res);
					console.log(result.post);
					result.post.set("tags", tag_res.tags);
					return result;
				}.bind(this));
				return result;
			}.bind(this));
		return dfr;
	},

	updateTags: function(){
		this.set("tags", (this.get("post.topic.tags")|| []).copy())
	}.observes("post", "topic", "draftKey"),

	editPost: function(opts) {
		var dfr = this._super(opts),
			post = this.get("post");
		// this promise never terminates as of now. not that we care
		if (post.get('post_number') === 1){
			// we are topic post: update tags, too
			var after_tags = Discourse.ajax('/tagger/set_tags', {
		      							data: {
	      									tags: (this.get("tags") || []).join(","),
	      									topic_id: post.get("topic_id")
	      								}
	      							});
			after_tags.then(function(tag_res) {
				post.set("topic.tags", tag_res.tags);
			}.bind(this));
		}
		return dfr
	}

});


Discourse.ComposerView.reopen({
	insertTagsView: function() {
		this._super();
		if (this.get("tagsview")) return;

		var view = this.createChildView(Discourse.ComposerTagsView,
			 {controller: this.get("controller")});
		view.insertTagsView();
		this.set("tagsview", view)
	}.on("didInsertElement")
});