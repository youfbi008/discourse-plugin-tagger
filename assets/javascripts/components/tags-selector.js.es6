/*global Bloodhound */

export default Ember.View.extend({
	// className: "tags-selector span4",
  attributeBindings: ['placeholder'],
  template: Ember.Handlebars.compile('<input type="text" value="{{unbound tags}}">'),
  placeholder: 'Tags',

  _startTypeahead: function(){
    var engine = new Bloodhound({
      remote: "/tagger/tags?search=%QUERY",
      datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.val); },
      queryTokenizer: Bloodhound.tokenizers.whitespace
    });

    engine.initialize();
    this.$('input').tagsinput({
      typeaheadjs: {
        name: "typeahead",
        minLength: 3,
        limit: this.get("limit") || 5,
        displayKey: function(x){ return x; }, // no transformation needed
        source: engine.ttAdapter()
      },
      trimValue: true,
      tagClass: 'tagger-tag',
      maxTags: this.get("limit") || 5,
      freeInput: Discourse.User.current().get("canAddNewTags")
    });

    this.$('input').on('itemAdded', function(evt){
      this.get("tags").pushObject(evt.item);
    }.bind(this));

    this.$('input').on('itemRemoved', function(evt){
      this.get("tags").removeObject(evt.item);
    }.bind(this));

  }.on('didInsertElement'),
});

