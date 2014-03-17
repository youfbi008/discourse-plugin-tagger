
Discourse.Tag = Discourse.Model.extend({
  newTag: Em.computed.none('id'),

  save: function() {
    return Discourse.ajax("/tagger/admin", {
      type: this.get("newTag") ? "POST" : "PUT",
      data: {
        id: this.get("id"),
        title: this.get('title')
      }
    });
  },
  destroy: function() {
    return Discourse.ajax("/tagger/admin", {
      type: "DELETE",
      data: {
        id: this.get("id")
      }
    });
  }
});

Discourse.Tag.reopenClass({
  findAll: function() {
    return Discourse.ajax("/tagger/admin.json")
    .then(function(tags) {
      return tags.map(function(u) {
        return Discourse.Tag.create(u);
      });
    });
  }
})
