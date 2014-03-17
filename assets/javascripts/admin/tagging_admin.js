
if (!Discourse.AdminTemplatesAdminView) Discourse.AdminTemplatesAdminView = Discourse.View.extend({});

Discourse.AdminTemplatesAdminView.reopen({
	insertTagsitemView: function() {
		$(".nav").append('<li><a href="/tagger/admin">Tags</a></li>')

	}.on("didInsertElement")
});



Discourse.TaggerRoute = Discourse.AdminRoute.extend({
 // this is just an empty admin route so that we are shown under the menu, too
});

//Discourse.TaggerAdminView = Discourse.View.extend(Discourse.ScrollTop);

Discourse.TaggerAdminController = Discourse.Controller.extend({
	actions: {
		expandTag: function(new_model){
			if (this.currentExpand) this.currentExpand.set("expanded", false);
			new_model.set("expanded", true);
			new_model.set("new_title", new_model.get("title"));
			this.currentExpand = new_model
		},
		cancelExpand: function(cur_model){
			cur_model.set("expanded", false);
			this.currentExpand = false;
		},
		saveTag: function(tag){
			var title = tag.get("new_title").toLowerCase();
			if (!this.checkTagValid(title)) return;

			tag.set("title", title);
			tag.set("loading", true);
			this.currentExpand = false;
			tag.save().then(function(){
				tag.setProperties({
					"loading": false,
					"expanded": false
				});
			});
		},
		newTag: function(){
			var new_tag = this.get("newTagName").toLowerCase(),
				me = this;
			if (!this.checkTagValid(new_tag)) return;

			this.set("newTagName", "");

			new_tag = Discourse.Tag.create({title: new_tag});
			new_tag.save().then(function(resp) {
				new_tag.setProperties(resp);
				me.get("model").pushObject(new_tag);
			});
		}
	},

	checkTagValid: function(new_tag){
		return new_tag.length >= 3 && this.isUnique(new_tag);
	},

	isUnique: function(title) {
		return this.get("model").find(function(itm){ itm == title }) === undefined;

	}
});

Discourse.TaggerAdminRoute = Discourse.Route.extend({
	model: function() {
		return Discourse.Tag.findAll();
	},

	renderTemplate: function() {
		this.render("tags_admin");
	},

});

Discourse.Route.buildRoutes(function() {
  this.resource('tagger', function (){
  	this.route("admin");
  });
});