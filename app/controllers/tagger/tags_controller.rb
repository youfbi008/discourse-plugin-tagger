module Tagger
  class TagsController < ApplicationController
    include CurrentUser

    before_action :check_user, only: [:set_tags]

    # GET /tags
    def index
      @tags = Tag.all
      if params[:search]
        search = "%#{params[:search]}%"
        @tags = @tags.where("title LIKE :search", search: search)
      end
      if params[:limit]
        @tags = @tags.limit(params[:limit].to_i)
      end
      render json: @tags.map{|tag| tag.title}.to_json
    end

    def cloud
      discourse_expires_in 15.minutes
      @highest = 0
      query = Tagger::Tag.select("tagger_tags.title, COUNT(tagger_tags_topics.topic_id) as count")
                    .group("tagger_tags.id")
                    .joins(:topic)
      tags = query.map do |item|
            count = item.count_before_type_cast.to_i
            @highest = count if count > @highest
            { title: item.title, count: count}
          end
      render json: {max: @highest, cloud: tags}
    end

    def get_topics_per_tag
      params.require(:tag)
      @tag = Tag.find_by("title = ?", params[:tag])
      return render json: false if @tag.blank?

      list = TopicList.new(:tag, current_user, topics_query)
      render_serialized(list, TopicListSerializer)
    end

    def set_tags
      @topic = Topic.find(params[:topic_id])
      if current_user.guardian.ensure_can_edit!(@topic)
        render status: :forbidden, json: false
        return
      end

      tag_names = params[:tags].split(",")
      tags = Tag.all().where("title in (:tag_names)", tag_names: tag_names)
      if tags.length != tag_names and current_user.has_trust_level?(:leader)
        # more tags given than currently found
        # and the user is trusted to create tags
        existing_tags = tags.map {|tag| tag.title}
        tag_names.reject {|tag_name|
          tag_name.length < 3 or existing_tags.include?(tag_name)
          }
        .each do |tag_name|
          new_tag = Tag.create({title: tag_name})
          new_tag.save!
          tags << new_tag
        end
      end

      @topic.tags = tags
      render json: @topic.tags.map{|t| t.title}
    end

    private
      # Use callbacks to share common setup or constraints between actions.
      def check_user
        if current_user.nil?
          render status: :forbidden, json: false
          return
        end
      end

      def topics_query(options={})
       topics = Topic.where("deleted_at" => nil)
                    .where("visible")
                    .where("archetype <> ?", Archetype.private_message)
                    .where("id in (SELECT topic_id FROM tagger_tags_topics WHERE tag_id = ?)", @tag.id)

        return topics
      end
  end
end
