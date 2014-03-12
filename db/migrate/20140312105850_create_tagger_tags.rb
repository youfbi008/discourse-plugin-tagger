class CreateTaggerTags < ActiveRecord::Migration
  def up
    create_table :tagger_tags do |t|
      t.string :title

      t.timestamps
    end

    create_table :tagger_tags_topics, id: false do |t|
      t.integer :topic_id
      t.integer :tag_id

      # t.timestamps
    end
  end

  def down
   	drop_table :tagger_tags
   	drop_table :tagger_tags_topics
  end

end
