Tagger::Engine.routes.draw do
  get "/tags" => "tags#index"
  get "/set_tags" => "tags#set_tags"
end
