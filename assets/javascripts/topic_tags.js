Discourse.TagsView = Discourse.View.extend({
    templateName: "topic_tags",
    attributeBindings: ["model", 'new_tags', "editingTopic"],

    editingTopic: Em.computed.alias('controller.editingTopic'),

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
    },
    editingChanged: function(){
      this.rerender();
    }.observes("editingTopic")
});

Discourse.TopicController.reopen({
  actions: {
    removeTag: function(toRm){
      this.get("new_tags").removeObject(toRm.toString());
    }
  },
  editTags: function(){
    if (!this.get("editingTopic")) var new_tags = null;
    else new_tags = this.get("tags").copy();
    this.set("new_tags", new_tags)
  }.observes("editingTopic"),

  saveTags: function(){
    if (!this.get("topicSaving")) return;
    // implicit is good enough for us here
    var topic = this.get("model"),
        tags = this.get("new_tags"); // we do total inline edit here
    Discourse.ajax('/tagger/set_tags', {
                        data: {
                          tags: tags.join(","),
                          topic_id: topic.get("id")
                        }
                      })
        .then(function(tag_res) {
          topic.get("tags").setObjects(tag_res.tags);
        });
  }.observes('topicSaving'),
})

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

// topics of tags views

Discourse.TaggedTagRoute = Discourse.Route.extend({
  model: function(params){
    this.set("tag", params.tag)
    return Discourse.TopicList.find("tagger/tag/" + params.tag, {})
  },
   setupController: function(controller, model) {
     this.controllerFor('discoveryTopics').setProperties({
        "model": model,
        "tagname": this.get("tag")
      });
   },
  renderTemplate: function() {
    var controller = this.controllerFor('discoveryTopics');
    this.render('tag_topic_list_head', { controller: controller, outlet: 'navigation-bar' });
    this.render('discovery/topics', { controller: controller, outlet: 'list-container'});
  }
});

Discourse.TaggedCloudRoute = Discourse.Route.extend({
  model: function(){
    return Discourse.ajax("/tagger/tags/cloud")
  },
  renderTemplate: function() {
    //this.render('tag_topic_list_head', { controller: controller, outlet: 'navigation-bar' });
    this.render('tag_cloud', { outlet: 'list-container'});
  }
});

Discourse.TaggedView = Discourse.View.extend({
  templateName: "discovery"
});

Discourse.Route.buildRoutes(function() {
  this.resource('tagged', {path: "tag"}, function() {
    this.route('tag', { path: '/:tag' });
    this.route('cloud', { path: '/' });
  });
});