module Tagger
  class Tag < ActiveRecord::Base
  	has_and_belongs_to_many :topic, :class_name => "Topic"

    def self.cloud_for_topic(topic_id)
      tag_ids = $redis.get("tag_cloud_for_topic_#{topic_id}")

      return Tagger::Tag.where(id: tag_ids.split(',')) unless tag_ids.nil?

      tags = Tagger::Tag.select("tagger_tags.title, COUNT(tagger_tags_topics.topic_id) as count")
                   .group("tagger_tags.id")
                   .joins(:topic)
                   .where("tagger_tags_topics.topic_id IN (SELECT tagger_tags_topics.topic_id FROM tagger_tags_topics WHERE tagger_tags_topics.tag_id in (SELECT tagger_tags_topics.tag_id FROM tagger_tags_topics WHERE tagger_tags_topics.topic_id = ? )) ", topic_id)
      $redis.setex("tag_cloud_for_topic_#{topic_id}", 15.minutes, tags.pluck(:id).join(','))

      tags
    end

  end
end
