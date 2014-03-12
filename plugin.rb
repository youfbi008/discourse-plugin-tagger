# name: tagger
# about: simple tagging support for discourse
# version: 0.1
# authors: Benjamin Kampmann


load File.expand_path('../lib/tagger/engine.rb', __FILE__)


register_asset "javascripts/discourse/templates/composer_tagging.js.handlebars"
register_asset "javascripts/composer_tagging.js"

register_css <<CSS

.tagger-tags {
    position: absolute;
    top: 17px;
    margin-top: 0px;
    left: 40%;
}

.tagger-tags label {
	display: inline;
}

.tagger-tags .ac-wrap {
	display: inline-block;
}

CSS

after_initialize do

  Discourse::Application.routes.append do
    mount Tagger::Engine, at: '/tagger'
  end

  # add our tags to the topics
  Topic.has_many(:tags, through: Tagger::Topictag)

end