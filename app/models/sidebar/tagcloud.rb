module Sidebar
  class Tagcloud

    attr_accessor :tags

    def initialize(params)
      if params[:controller] == "topics"
        @tags = Tagger::Tag.cloud_for_topic(params[:topic_id])
      end
    end

    def to_partial_path
      "sidebar/tagcloud"
    end

  end
end