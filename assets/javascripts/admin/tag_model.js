
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
    if (this.get('newTag')) return Ember.RSVP.resolve();
    return Discourse.ajax("/tagger/admin/" + this.get('id'), {
      type: "DELETE"
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
