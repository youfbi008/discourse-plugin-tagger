class CreateTaggerTopictags < ActiveRecord::Migration
  def change
    create_table :tagger_topictags do |t|
      t.integer :topic_id
      t.integer :tag_id

      t.timestamps
    end
  end
end
