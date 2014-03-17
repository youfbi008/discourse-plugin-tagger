Tagger::Engine.routes.draw do
  resource :admin_tag, path: "/admin", constraints: AdminConstraint.new do
      collection do
        post "merge" => "admin_tags#merge"
      end
    end
  get "/tags" => "tags#index"
  get "/set_tags" => "tags#set_tags"
end
