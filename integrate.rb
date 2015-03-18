Discourse::Application.routes.append do
  mount Tagger::Engine, at: '/tagger'
end
