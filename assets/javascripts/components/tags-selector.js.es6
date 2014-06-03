/*global Bloodhound */

export default Ember.TextField.extend({
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

    this.typeahead.on("typeahead:enterKeyed", function(){
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

