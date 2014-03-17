
if (!Discourse.AdminTemplatesAdminView) Discourse.AdminTemplatesAdminView = Discourse.View.extend({});

Discourse.AdminTemplatesAdminView.reopen({
	insertTagsitemView: function() {
		$(".nav").append('<li><a href="/admin_tagging">Tags</a></li>')

	}.on("didInsertElement")
});



Discourse.AdminTagsRoute = Discourse.AdminRoute.extend({});

Discourse.AdminTagsListView = Discourse.View.extend(Discourse.ScrollTop);

Discourse.AdminTagsListRoute = Discourse.Route.extend({
	model: Discourse.Tag

});

Discourse.Route.buildRoutes(function() {
  this.resource('admin_tags', function (){
  	this.route("admin_tags_list", { path: '/' });
  });
});