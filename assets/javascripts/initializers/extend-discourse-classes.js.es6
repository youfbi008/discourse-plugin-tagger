import ComposerController from 'discourse/controllers/composer';
import Widgets from "discourse/plugins/tagger/discourse/sidebar_tags";

export default {
  name: "extend-discourse-classes",

  initialize: function(container, application) {
    ComposerController.reopen({
      actions: {
        removeTag: function(toRm){
          this.get("content.tags").removeObject(toRm.toString());
        }
      }
    });

    var sideBarView = container.lookupFactory('view:sidebar');

    if (sideBarView) {
        sideBarView.reopen(Widgets);
    }

  }
};
