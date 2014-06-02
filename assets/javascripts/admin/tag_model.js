
Discourse.Tag = Discourse.Model.extend({
  newTag: Em.computed.none('id'),

  save: function() {
    return Discourse.ajax("/tagger/admin", {
      type: this.get("newTag") ? "POST" : "PUT",
      data: {
        id: this.get("id"),
        info: this.get("info"),
        title: this.get('title')
      }
    });
  },
  merge: function(source){
    return Discourse.ajax("/tagger/admin/merge", {
      type: "POST",
      data: {
        target_id: this.get("id"),
        source_id: source.get("id")
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
