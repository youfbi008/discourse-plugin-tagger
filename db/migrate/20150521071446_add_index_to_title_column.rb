class AddIndexToTitleColumn < ActiveRecord::Migration
  def up
    execute 'CREATE INDEX index_tagger_tags_on_title ON tagger_tags(LOWER(title));'
  end

  def down
    execute 'DROP INDEX index_tagger_tags_on_title;'
  end
end
