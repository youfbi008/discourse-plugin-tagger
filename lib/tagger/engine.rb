require_dependency "#{config.root}/lib/integrate.rb"

module Tagger
  class Engine < ::Rails::Engine
    isolate_namespace Tagger

    config.after_initialize do
      Discourse::Application.routes.append do
        mount Tagger::Engine, at: '/tagger'
      end
    end

    config.to_prepare do
      # inject our dependencies
      # runs once in production, before every request in development
      Topic.send(:include, Tagger::TopicExtender)
      CategoryList.send(:include, Tagger::AddTagsToCategories)
      TopicViewSerializer.send(:include, Tagger::ExtendTopicViewSerializer)
    end
  end
end
