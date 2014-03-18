module Tagger
  class TagsController < ActionController::Base
    include CurrentUser

    before_action :check_user

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
  end
end
