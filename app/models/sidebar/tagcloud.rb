module Sidebar
  class Tagcloud

    attr_accessor :tags

    def initialize(params)

      pp "+++++++++++++++++++initializing tag sidebar++++++++++++++++++++++++++++++++++++++++++"
      if params[:controller] == "topics"
        @tags = Tagger::Tag.cloud_for_topic(params[:topic_id])
      elsif params[:controller] == "list" && params[:action] == "category_latest"
        @tags = Tagger::Tag.cloud_for_category(params[:category])
      elsif params[:controller] == "tagger/tags" && params[:action] == "get_topics_per_tag"
        pp "+++++++++++++++++++inside tag sidebar++++++++++++++++++++++++++++++++++++++++++"
        @tags = Tagger::Tag.cloud_for_tag(params[:tag])
      else
        @tags = Tagger::Tag.default_cloud
      end
    end

    def to_partial_path
      "sidebar/tagcloud"
    end

  end
end