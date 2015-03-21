module Tagger
  # add our tags to the topics
  module TopicExtender
    def self.included(klass)
      klass.has_and_belongs_to_many :tags, autosave: true, class_name: "::Tagger::Tag"
    end
  end

  module AddTagsToCategories
    # def self.included(klass)
    #     klass.attributes :listable_tags
    # end

    def listable_tags
      Tagger::Tag.where(:listable => true)
    end
  end

  # add the tags to the serializer
  module ExtendTopicViewSerializer
    def self.included(klass)
      klass.attributes :tags
    end

    def tags
      object.topic.tags.map {|t| t.title} || []
    end
  end
end
