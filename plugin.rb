# name: tagger
# about: simple tagging support for discourse
# version: 0.1
# authors: Benjamin Kampmann

# load the engine
load File.expand_path('../lib/tagger/engine.rb', __FILE__)

register_asset "javascripts/user_tag_patches.js"
register_asset "javascripts/discourse/templates/composer_tagging.js.handlebars"
register_asset "javascripts/discourse/templates/topic_tags.js.handlebars"
register_asset "javascripts/vendor/typeahead.bundle.js"
register_asset "javascripts/composer_tagging.js"
register_asset "javascripts/topic_tags.js"

# admin UI
register_asset "javascripts/discourse/templates/tags_admin.js.handlebars"
register_asset "javascripts/admin/tag_model.js", :admin
register_asset "javascripts/admin/tagging_admin.js", :admin

register_css <<CSS

/* topic view */
.tagger-tags .tagger-tag,
.tagger-admin .tagger-tag,
.tagger-tags-view span {
	display: inline-block;
	padding: 1px 7px;
	margin-top: 5px;
    font-size: 0.8em;
}

.tagger-tags .tagger-tag,
.tagger-admin .tagger-tag,
.tagger-tags-view span.tagger-tag {
	background-color: #EDEDED;
	color: #333;
}

.tagger-admin .tagger-tag {
	font-size: 1.2em;
    line-height: 2.8em;
    cursor: pointer;
}

/* editor */
.tagger-tags {
	line-height: 2em;
    position: absolute;
    top: 17px;
    margin-top: 0px;
    left: 40%;
}

.tagger-tags .tagger-tag .fa {
	cursor: pointer
}

.tagger-tags label {
	display: inline;
}

/* Drop down menu with suggestions */
.tt-dropdown-menu {
    background-color: white;
    padding: 3px 10px;
}

CSS

after_initialize do
	require_dependency File.expand_path('../integrate.rb', __FILE__)
end