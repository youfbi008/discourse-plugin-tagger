# name: tagger
# about: simple tagging support for discourse
# version: 0.1
# authors: Benjamin Kampmann

# load the engine
load File.expand_path('../lib/tagger/engine.rb', __FILE__)

register_asset "javascripts/discourse/templates/composer_tagging.js.handlebars"
register_asset "javascripts/discourse/templates/topic_tags.js.handlebars"
register_asset "javascripts/composer_tagging.js"
register_asset "javascripts/topic_tags.js"

register_css <<CSS

/* topic view */
.tagger-tags-view span {
	display: inline-block;
	padding: 1px 7px;
	margin-top: 5px;
    font-size: 0.8em;
}

.tagger-tags-view span.tagger-tag {
	background-color: #EDEDED;
	color: #333;
}

/* editor */
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
	require_dependency File.expand_path('../integrate.rb', __FILE__)
end