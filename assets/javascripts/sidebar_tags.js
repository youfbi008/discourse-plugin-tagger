
(function () {
    if (!Discourse.SidebarView) return;
    // this is the sidebar only feature

    var SidebarTagCloudView = Discourse.View.extend({
        templateName: "sidebar_tag_cloud",
        init: function () {
            this._super();
            this.__cache = {};
        },
        // refresh: function(){
        //     if (this.get("tags")) return;
        //     Discourse.ajax("/tagger/tags/cloud").then(function(resp){
        //         console.log(resp);
        //         this.set("tags", resp.cloud);
        //     }.bind(this))
        // }.on("didInsertElement"),

        urlChanged: function(){
            this.set("loading", true);
            var name = this.get("currentControllerName"),
                router = Discourse.URL.get("router").router,
                url = "/tagger/tags/cloud";
            if (name.indexOf("topic") === 0) { // one of the topic views
                url = "/tagger/tags/cloud/topic/" + router.currentParams.id;
            } else if (name === "discovery.category"){
                // inside a specific category we only want related to that cat
                if (router.currentParams.slug){
                    url = "/tagger/tags/cloud/category/" + router.currentParams.slug;
                }
            } else if (name === "tagged.tag"){
                // tag-page, load similar tags:
                var tag_name = this.get("url").split("/")[2];
                url = "/tagger/tags/cloud/tag/" + tag_name;
            }

            if (url in this.__cache){
                this.set("tags", this.__cache[url]);
                this.set("loading", false);
            } else {
                Discourse.ajax(url).then(function(resp){
                    this.__cache[url] = resp.cloud;
                    this.set("tags", resp.cloud);
                    this.set("loading", false);
                }.bind(this));
            }
        }
    });

    Discourse.SidebarView.reopen({
        tagcloud: SidebarTagCloudView.create()
    });
})();