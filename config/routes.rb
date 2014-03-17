Tagger::Engine.routes.draw do
  resource :admin_tag, path: "/admin", constraints: AdminConstraint.new
  get "/tags" => "tags#index"
  get "/set_tags" => "tags#set_tags"
end
