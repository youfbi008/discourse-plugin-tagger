module Tagger
  class Tag < ActiveRecord::Base
  	has_and_belongs_to_many :topic, :class_name => "Topic"
  end
end
