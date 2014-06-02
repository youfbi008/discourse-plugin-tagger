class AddInfoAndColorToTag < ActiveRecord::Migration
  def change
    add_column :tagger_tags, :info, :text
  end
end
