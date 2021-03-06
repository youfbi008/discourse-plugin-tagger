Discourse.TagsView = Discourse.View.extend({
  templateName: "topic_tags",
  attributeBindings: ["model", 'new_tags', "editingTopic"],
  editingTopic: Em.computed.alias('controller.editingTopic'),

  editingChanged: function(){
    this.rerender();
  }.observes("editingTopic")
});


Discourse.TopicView.reopen({
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


Discourse.TopicController.reopen({
  actions: {
    removeTag: function(toRm){
      this.get("new_tags").removeObject(toRm.toString());
    }
  },

  editTags: function(){
    var newTags;
    if (!this.get("editingTopic")) {
      newTags = null;
    } else {
      newTags = this.get("tags").copy();
    }
    this.set("new_tags", newTags);
  }.observes("editingTopic"),

  saveTags: function(){
    if (!this.get("topicSaving")) return;
    // implicit is good enough for us here
    var topic = this.get("model"),
        tags = this.get("new_tags"); // we do total inline edit here
    Discourse.ajax('/tagger/set_tags', {
                        data: {
                          tags: tags.join(","),
                          initial: false,
                          topic_id: topic.get("id")
                        }
                      })
        .then(function(tag_res) {
          topic.get("tags").setObjects(tag_res.tags);
        });
  }.observes('topicSaving')
});

// topics of tags views

Discourse.TaggedController = Discourse.Controller.extend({
  needs: ['discovery/topics', 'navigation/default'],
  actions: {
    refresh: function(url) {
      this.get('controllers.discovery/topics').send('refresh', url);
    }
  }
});

Discourse.TaggedTagRoute = Discourse.Route.extend(Discourse.ScrollTop, {
  model: function(params){
    this.set("tag", params.tag);
    return Discourse.TopicList.find("tagger/tag/" + params.tag, {});
  },
  setupController: function(controller, model) {
    this.controllerFor('discovery/topics').setProperties({
       model: model,
       tagname: this.get("tag"),
       order: model.get('params.order'),
       ascending: model.get('params.ascending')
     });
    this.controllerFor('navigation/default').setProperties({
      order: model.get('params.order'),
      ascending: model.get('params.ascending')
    });
  },
  renderTemplate: function() {
    var controller = this.controllerFor('discovery/topics');
    this.render('tag_topic_list_head', { controller: controller, outlet: 'navigation-bar' });
    this.render('discovery/topics', { controller: controller, outlet: 'list-container'});
  },

  actions: {
    loadingComplete: function() {
      this.controllerFor('discovery').set('loading', false);
      this._scrollTop();
    },
    didTransition: function() {
      this.send('loadingComplete');
      return true;
    }
  }
});

Discourse.TaggedCloudRoute = Discourse.Route.extend({
  model: function(){
    return Discourse.ajax("/tagger/tags/cloud");
  },
  renderTemplate: function() {
    //this.render('tag_topic_list_head', { controller: controller, outlet: 'navigation-bar' });
    this.render('tag_cloud', { outlet: 'list-container'});
  }
});

Discourse.TaggedView = Discourse.View.extend(Discourse.ScrollTop, Discourse.UrlRefresh, {
  templateName: "discovery",
  classNames: ['tag-topic-list']
});

Discourse.Route.buildRoutes(function() {
  this.resource('tagged', {path: "tag"}, function() {
    this.route('tag', { path: '/:tag' });
    this.route('cloud', { path: '/' });
  });
});
