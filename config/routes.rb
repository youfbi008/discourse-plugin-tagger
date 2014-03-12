Tagger::Engine.routes.draw do
  resources :tags
  get "/set_tags" => "tags#set_tags"
end
