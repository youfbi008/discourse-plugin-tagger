class AddIndexToTitleColumn < ActiveRecord::Migration
  def up
    execute 'CREATE UNIQUE INDEX index_tagger_tags_on_title ON tagger_tags USING btree (lower(title));'
  end

  def down
    execute 'DROP INDEX index_tagger_tags_on_title;'
  end
end
