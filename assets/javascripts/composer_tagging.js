Discourse.TagsSelectorComponent = Ember.TextField.extend({
	className: "tags-selector span4",

  keyUped: function(name, ev){
    if ([" ", ",", "."].indexOf(ev.key) > -1) {
      // separator keys make us commit
      if (Discourse.User.current().get("canAddNewTags")) this.addSelected(this.get("value"));
      ev.preventDefault();
    }
  },

  _startTypeahead: function(){
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
        customKeyed: this.keyUped.bind(this)
    },{
      displayKey: function(x){ return x; }, // no transformation needed
      source: engine.ttAdapter()
    });

    this.typeahead.on("typeahead:selected", function(ev, item) {
      _this.addSelected(item);
    });

    this.typeahead.on("typeahead:enterKeyed", function(ev){
      var val = _this.get("value");
      if (Discourse.User.current().get("canAddNewTags") && val.length > 2) _this.addSelected(val);
    });

    this.typeahead.on("typeahead:autocompleted", function(ev, item) {
      _this.addSelected(item);
    });
  }.on('didInsertElement'),

  addSelected: function(newTag) {
    if (!this.get("tags")) { this.set("tags", []); }
    var tags =  this.get("tags");
    newTag = newTag.toLowerCase();

    if (newTag.length > 2 && tags.indexOf(newTag) === -1 ){ // not found, add it
      tags.pushObject(newTag);
    }
    this.set("value", "");
    this.typeahead.val("");
    $(this.typeahead).typeahead("close");
  }
});

Discourse.ComposerTagsView = Discourse.View.extend({
	templateName: "composer_tagging",
	model: Em.computed.alias('controller.model'),

	insertTagsView: function() {
		this._insertElementLater(function() {
			this._parentView.$().append(this.$());
    }.bind(this));
	}
});

Discourse.Composer.reopen({

	// only creation of new topic and editing of first post are valid for us
	can_be_tagged: function(){
		return this.get("creatingTopic") || (this.get("editingPost") && this.get("editingFirstPost"));
	}.property("creatingTopic", "editingPost", "editingFirstPost"),

	createPost: function(opts) {
		var tags = (this.get("tags") || []).join(",");
        var dfr = this._super(opts);
		dfr.then(function(post_result){
				var tagger = Discourse.ajax('/tagger/set_tags', {
		      							data: {
	      									tags: tags,
	      									topic_id: post_result.post.topic_id
	      								}
	      							});
				tagger.then(function(tag_res){
					return post_result;
				});
				return tagger;
			});
		return dfr;
	},

	updateTags: function(){
        if (!this.get("tags")) this.set("tags", []);
        this.get("tags").setObjects((this.get("topic.tags") || []));
	}.observes("post", "topic", "draftKey"),

	editPost: function(opts) {
		var tags = (this.get("tags") || []).join(","),
        dfr = this._super(opts),

   	post = this.get("post");
		// this promise never terminates as of now. not that we care
		if (post.get('post_number') === 1){
			// we are topic post: update tags, too
			var after_tags = Discourse.ajax('/tagger/set_tags', {
		      							data: {
	      									tags: tags,
	      									topic_id: post.get("topic_id")
	      								}
	      							});
			after_tags.then(function(tag_res) {
				post.get("topic.tags").setObjects(tag_res.tags);
			}.bind(this));
		}
		return dfr;
	}
});

Discourse.ComposerController.reopen({
	actions: {
		removeTag: function(toRm){
			this.get("content.tags").removeObject(toRm.toString());
		}
	},
});

Discourse.ComposerView.reopen({
	insertTagsView: function() {
		this._super();
		if (this.get("tagsview")) return;

		var view = this.createChildView(Discourse.ComposerTagsView,
			 {controller: this.get("controller")});
		view.insertTagsView();
		this.set("tagsview", view);
	}.on("didInsertElement")
});
