class CreateTaggerTags < ActiveRecord::Migration
  def change
    create_table :tagger_tags do |t|
      t.string :title

      t.timestamps
    end
  end
end
