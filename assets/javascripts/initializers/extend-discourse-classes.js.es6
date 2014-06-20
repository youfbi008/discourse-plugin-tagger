import ComposerController from 'discourse/controllers/composer';

export default {
  name: "extend-discourse-classes",

  initialize: function() {
    ComposerController.reopen({
      actions: {
        removeTag: function(toRm){
          this.get("content.tags").removeObject(toRm.toString());
        }
      }
    });
  }
};
