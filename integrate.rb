
# Integrate our plugin with Discourse


# add our tags to the topics
module TopicExtender
	def self.included(klass)
		klass.has_and_belongs_to_many :tags, autosave: true, class_name: "::Tagger::Tag"
	end
end

Topic.send(:include, TopicExtender)


# add the tags to the serializer
module ExtendTopicViewSerializer
  def self.included(klass)
    klass.attributes :tags
  end

	def tags
		object.topic.tags.map {|t| t.title} || []
	end
end

TopicViewSerializer.send(:include, ExtendTopicViewSerializer)

# add searchability
class Search
	alias_method :find_grouped_results_pre_tags, :find_grouped_results

	def find_grouped_results
		puts "!!!!!!!!!!" * 20
		puts @term
		match = /\[.?\]/.match(@term)
		return tagged_search(match[1]) if match and match[1].length > 2

		find_grouped_results_pre_tags
	end

  def tagged_search(tag_name)
  	# tag based search
	  tag = Tagger::Tag.find_by(:title, tag_name)
	  posts = posts_query(@limit)
	  						.where(post_number: 1)
	              .where("topics.id in (?)", tag.topic_ids) # I bet we can make this more efficient

	  posts.each do |p|
	    @results.add_result(SearchResult.from_topic(p.topic))
	  end

  end
end


# And mount the engine
Discourse::Application.routes.append do
	mount Tagger::Engine, at: '/tagger'
end