module Tagger
  class TagsController < ApplicationController
    include CurrentUser

    before_action :check_user, only: [:set_tags]

    skip_before_filter :check_xhr

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

      query = Tagger::Tag.default_cloud
      render_cloud query
    end

    def cloud_for_category
      slug = params.require(:slug)
      discourse_expires_in 15.minutes
      query = Tagger::Tag.cloud_for_category(slug)
      render_cloud query
    end

    def cloud_for_topic
      begin
        params.require(:topic_id)
        topic_id = Integer(params[:topic_id])
      rescue ArgumentError
        return render_error "Invalid Topic Id"
      end
      discourse_expires_in 15.minutes

      query = Tagger::Tag.cloud_for_topic(topic_id)

      render_cloud query
    end

    def topic_info
      params.require(:tag)
      tag = Tag.find_by("title = ?", params[:tag])
      return render json: false unless tag
      return render json: {title: tag.title, info: tag.info}
    end

    def cloud_for_tag
      params.require(:tag)
      discourse_expires_in 15.minutes
      query = Tagger::Tag.cloud_for_tag(params[:tag])
      render_cloud query
    end

    def get_topics_per_tag
      params.require(:tag)
      @tag = Tag.find_by("title = ?", params[:tag])
      return render json: false if @tag.blank?

      list = TopicList.new(:tag, current_user, topics_query)
      respond_to do |format|
        format.html do
          @list = list
          render "sidebar/topicslist"
        end
        format.json do
          render_serialized(list, TopicListSerializer)
        end
      end
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

      def render_error(message)
        render status: :bad_request, json: {"error" => {"message" => message}}
      end

      def render_cloud(query)
        query = query.limit(20)
        highest = 0
        tags = query.map do |item|
              count = item.count_before_type_cast.to_i
              highest = count if count > highest
              { title: item.title, count: count}
            end
        respond_to do |format|
          format.html do
            render inline: "<h2>hello tagworld!</h2>"
          end
          format.json do
            render json: {max: highest, cloud: tags}
          end
        end
      end

      def topics_query(options={})
       Topic.where("deleted_at" => nil)
                    .where("visible")
                    .where("archetype <> ?", Archetype.private_message)
                    .where("id in (SELECT topic_id FROM tagger_tags_topics WHERE tag_id = ?)", @tag.id)
      end
  end
end
