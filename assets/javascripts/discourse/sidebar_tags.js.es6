import TagsMixin from './tags_mixin';

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
    tagsUrl: function() {
        if (this.get("is_topic_page")) {
            return this.get("topicTagsUrl");
        } else if (this.get("is_tags_page")) {
            return this.get("tagsTagsUrl");
        } else if (this.get("is_category_page")) {
            return this.get("categoryTagsTagsUrl");
        } else {
            return "/tagger/tags/cloud";
        }
    }.property('is_topic_page', 'topicTagsUrl', 'is_tags_page', 'tagsTagsUrl', 'is_category_page', 'categoryTagsTagsUrl')
});

export default {
    tagcloud: SidebarCombinedTagsView,
    taginfo: SidebarTagInfoView,
    populartags: SidebarAllTagsCloudView,
    topictags: SidebarTopicRelatedTagsView,
    tagstags: SidebarTagsRelatedTagsView,
    categorytags: SidebarCategoryRelatedTagsView
};
