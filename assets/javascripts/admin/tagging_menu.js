
if (! Discourse.AdminTemplatesAdminView) Discourse.AdminTemplatesAdminView = Discourse.View.extend({});

Discourse.AdminTemplatesAdminView.reopen({
	insertTagsitemView: function() {
		$(".nav").append('<li><a href="/admin/tagging">Tags</a></li>')

	}.on("didInsertElement")
});