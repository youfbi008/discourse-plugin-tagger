module Tagger
  class AdminTagsController < Admin::AdminController
    def show
      tags = Tag.all.order(:title)
      render json: tags.to_json
    end

    def create
      tag = Tag.new
      tag.update(tag_params)
      tag.save!
      render json: tag.to_json
    end

    def update
      tag = find_tag
      tag.update(tag_params)
      tag.save!
      render json: tag.to_json
    end

    def merge
      source_tag = Tag.find(params[:source_id])
      target_tag = Tag.find(params[:target_id])
      target_tag.topic.union(source_tag.topic)
      source_tag.topic.delete_all
      source_tag.destroy
      render json: target_tag.to_json
    end

    def destroy
      tag = find_tag
      tag.topic.delete_all()
      tag.destroy
      render nothing: true
    end

    private
      def find_tag
        params.require(:id)
        Tag.find(params[:id])
      end

      def tag_params()
        params.permit(:title, :info)
      end
  end
end
