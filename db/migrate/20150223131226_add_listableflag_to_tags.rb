class AddListableflagToTags < ActiveRecord::Migration
  def change
    add_column :tagger_tags, :listable, :boolean, :default => false
  end
end
