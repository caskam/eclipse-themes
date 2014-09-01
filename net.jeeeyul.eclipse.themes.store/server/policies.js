Meteor.startup(function() {
	Comments.allow({
		insert : function(userId, content, fields) {
			if (userId == null) {
				return false;
			}

			EPFs.update(content.epfId, {
				$inc : {
					commentCount : 1
				}
			});

			return true;
		}
	});

	EPFs.allow({
		insert : function(userId, content) {
			return userId != null;
		},
		remove : function(userId, content) {
			return content.authorId == userId;
		},
		update : function(userId, content, fields) {
			if (userId == undefined || userId == null) {
				return false;
			}

			if (_(fields).contains("likedBy")) {
				console.log(content.likedBy);
				content.likeCount = _(content.likedBy).size() + (_(content.likedBy).contains(userId) ? 0 : 1);
				EPFs.update(content._id, content);
			}

			return true;
		}
	});
});