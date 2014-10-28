
// this is the sidebar only feature
var TAGS_CACHE = {};

var TagsMixin = Ember.Mixin.create({
    classNameBindings: ["shouldBeHidden:hidden"],
    templateName: "sidebar_tag_cloud",
    currentControllerName: "",
    is_topic_page: function(){
        return this.get("currentControllerName").indexOf("topic") === 0;
    }.property("currentControllerName"),

    is_category_page: function(){
        return this.get("currentControllerName") === "discovery.category";
    }.property("currentControllerName"),

    is_tags_page: function(){
        return this.get("currentControllerName") === "tagged.tag";
    }.property("currentControllerName"),

    load_tags: function(url) {
        if (!url || url.length === 0){
            // empty url: nothing to see here.
            this.set("tags", []);
            this.set("loading", false);
            return;
        }

        if (url in TAGS_CACHE){
            this.set("tags", TAGS_CACHE[url]);
            this.set("loading", false);
            return;
        }

        Discourse.ajax(url).then(function(resp){
            TAGS_CACHE[url] = resp.cloud;
            this.set("tags", resp.cloud);
            this.set("loading", false);
        }.bind(this)).catch(function(err){
            this.set("tags", []);
            this.set("loading", false);
            console.error(err);
        }.bind(this));

    },

    urlChanged: function(){
        if (this.get("shouldBeHidden")){
            return;
        }
        this.set("loading", true);
        this.load_tags(this.get("tagsUrl"));
    },

    topicTagsUrl: function(){
        return this.get("currentController").params.id ? "/tagger/tags/cloud/topic/" + this.get("currentController").params.id : null;
    }.property("currentController"),

    tagsTagsUrl: function(){
        return "/tagger/tags/cloud/tag/" + this.get("url").split("/")[2];
    }.property("currentController"),

    categoryTagsTagsUrl: function(){
        var controller = this.get("currentController");
            // inside a specific category we only want related to that cat
        if (!controller.params || !controller.params.slug){
            return;
        }
        return "/tagger/tags/cloud/category/" + controller.params.slug;
    }.property("currentController"),

    shouldBeHidden: function(){
        return !this.get("is_topic_page") &&
               !this.get("is_category_page") &&
               !this.get("is_tags_page");
    }.property("is_topic_page", "is_tags_page", "is_category_page")
});

var SidebarAllTagsCloudView = Discourse.View.extend(TagsMixin, {
    shouldBeHidden: false,
    tagsUrl: "/tagger/tags/cloud"
});

var SidebarTopicRelatedTagsView = Discourse.View.extend(TagsMixin, {
    shouldBeHidden: Ember.computed.not("is_topic_page"),
    tagsUrl: Ember.computed.alias("topicTagsUrl")
});

var SidebarTagInfoView = Discourse.View.extend(TagsMixin, {
    templateName: "sidebar_tag_info",
    shouldBeHidden: Ember.computed.not("is_tags_page"),
    urlChanged: function(){
        if (this.get("shouldBeHidden")){
            return;
        }
        this.set("loading", true);
        var url = "/tagger/tags/info/" + this.get("url").split("/")[2];
        Discourse.ajax(url).then(function(resp){
            this.set("tag", resp);
            this.set("loading", false);
        }.bind(this)).catch(function(err){
            this.set("tag", false);
            this.set("loading", false);
            console.error(err);
        }.bind(this));
    }
});

var SidebarTagsRelatedTagsView = Discourse.View.extend(TagsMixin, {
    shouldBeHidden: Ember.computed.not("is_tags_page"),
    tagsUrl: Ember.computed.alias("tagsTagsUrl")
});

var SidebarCategoryRelatedTagsView = Discourse.View.extend(TagsMixin, {
    shouldBeHidden: Ember.computed.not("is_category_page"),
    tagsUrl: Ember.computed.alias("categoryTagsTagsUrl")
});

var SidebarCombinedTagsView = Discourse.View.extend(TagsMixin, {
    shouldBeHidden: false,
    tagsUrl: function(){
        if (this.get("is_topic_page")){
            return this.get("topicTagsUrl");
        } else if (this.get("is_tags_page")) {
            return this.get("tagsTagsUrl");
        } else if (this.get("is_category_page")) {
            return this.get("categoryTagsUrl");
        } else {
            return "/tagger/tags/cloud";
        }
    }.property("currentControllerName")
});

export default {
    tagcloud: SidebarCombinedTagsView,
    taginfo: SidebarTagInfoView,
    populartags: SidebarAllTagsCloudView,
    topictags: SidebarTopicRelatedTagsView,
    tagstags: SidebarTagsRelatedTagsView,
    categorytags: SidebarCategoryRelatedTagsView
};