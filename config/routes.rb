Tagger::Engine.routes.draw do
  resource :admin_tag, path: "/admin", constraints: AdminConstraint.new do
      collection do
        post "merge" => "admin_tags#merge"
      end
    end
  get "/tags" => "tags#index"
  get "/tag/:tag" => "tags#get_topics_per_tag"
  get "/set_tags" => "tags#set_tags"
end


Rails.application.routes.draw do
  scope module: 'tagger' do
    get "/tag/:tag" => "tags#get_topics_per_tag"
  end
end
