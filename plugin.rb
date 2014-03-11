# name: tagger
# about: simple tagging support for discourse
# version: 0.1
# authors: Benjamin Kampmann


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