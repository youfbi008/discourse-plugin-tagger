
(function () {
    if (!Discourse.SidebarView) return;
    // this is the sidebar only feature

    var SidebarTagCloudView = Discourse.View.extend({
        templateName: "sidebar_tag_cloud",
        refresh: function(){
            console.log("IN");
            if (this.get("tags")) return;
            Discourse.ajax("/tagger/tags/cloud").then(function(resp){
                console.log(resp);
                this.set("tags", resp.cloud);
            }.bind(this))
        }.on("didInsertElement")
    });

    Discourse.SidebarView.reopen({
        tagcloud: SidebarTagCloudView.create()
    });
})();