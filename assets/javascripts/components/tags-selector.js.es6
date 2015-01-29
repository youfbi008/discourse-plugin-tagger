/*global Bloodhound */

export default Ember.View.extend({
	// className: "tags-selector span4",
  classNameBindings: ['hasFocus:has-focus'],
  template: Ember.Handlebars.compile('<input type="text" placeholder="{{i18n \'tagger.placeholder\'}}" value="{{unbound view.tags}}">'),

  updatePlaceholder: function() {
    var tagsinput = this.$('> input').tagsinput('input');

    if (this.get('tags.length') > 0) {
      tagsinput.removeAttr('placeholder');
    } else {
      tagsinput.attr('placeholder', I18n.t('tagger.placeholder'));
    }
  }.observes('tags.@each'),

  _startTypeahead: function(){
    var engine = new Bloodhound({
      remote: "/tagger/tags?search=%QUERY",
      datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.val); },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      limit: this.get("limit") || 5
    });

    engine.initialize();
    this.$('input').tagsinput({
      typeaheadjs: {
        name: "typeahead",
        minLength: 3,
        displayKey: function(x){ return x; }, // no transformation needed
        source: engine.ttAdapter()
      },
      trimValue: true,
      tagClass: 'tagger-tag',
      maxTags: this.get("limit") || 5,
      freeInput: Discourse.User.current().get("canAddNewTags")
    });

    this.updatePlaceholder();

    this.$('> input').tagsinput('input').focusin(function() {
      this.set('hasFocus', true);
    }.bind(this)).focusout(function() {
      this.set('hasFocus', false);
    }.bind(this));

    this.$('input').on('itemAdded', function(evt){
      this.get("tags").pushObject(evt.item);
    }.bind(this));

    this.$('input').on('itemRemoved', function(evt){
      this.get("tags").removeObject(evt.item);
    }.bind(this));

  }.on('didInsertElement'),
});

