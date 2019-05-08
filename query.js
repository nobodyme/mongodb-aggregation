// Question 1,
// Let's find how many movies in our movies collection have the same person in cast, directors, and writers

predicate = {
	$match: {
		writers: { $elemMatch: { $exists: true } },
		cast: { $elemMatch: { $exists: true } },
		directors: { $elemMatch: { $exists: true } }
	}
};

mapping = {
	$project: {
		_id: 0,
		cast: 1,
		directors: 1,
		writers: {
			$map: {
				input: '$writers',
				as: 'writer',
				in: {
					$arrayElemAt: [{ $split: ['$$writer', ' ('] }, 0]
				}
			}
		}
	}
};

projection = {
	$project: {
		laborOfLove: {
			$gt: [
				{ $size: { $setIntersection: ['$writers', '$cast', '$directors'] } },
				0
			]
		}
	}
};

matching = {
	$match: { laborOfLove: true }
};

counting = {
	$count: 'labors_of_love'
};

pipeline = [predicate, mapping, projection, matching, counting];

// db collection aggregate(pipeline);

// Question 2:

// Our movies dataset has a lot of different documents, some with more convoluted titles than others.
// If we'd like to analyze our collection to find movie titles that are composed of only one word, we could fetch all
// the movies in the dataset and do some processing in a client application, but the Aggregation Framework allows us to
// do this on the server!
// Ensure you explore the string expressions and the array expressions before attempting this lab.

// Using the Aggregation Framework, find a count of the number of movies that have a title composed of one word.
// To clarify, "Cinderella" and "3-25" should count, where as "Cast Away" would not.

// Don't forget to append the following counting variable to your pipeline!

shaping = {
	$project: {
		_id: 0,
		one_word_titles: {
			$eq: [{ $size: { $split: [{ $toString: '$title' }, ' '] } }, 1]
		}
	}
};

matching = {
	$match: { one_word_titles: true }
};

counting = {
	$count: 'singles'
};

pipeline = [shaping, matching, counting];

//Question 3:

// Movie Night
// Your organization has a movie night scheduled, and you've again been tasked with coming up with a selection.

// HR has polled employees and assembled the following list of preferred actresses and actors.

// favorites = [
//   "Sandra Bullock",
//   "Tom Hanks",
//   "Julia Roberts",
//   "Kevin Spacey",
//   "George Clooney"
// ]
// For movies released in the USA with a tomatoes.viewer.rating greater than or equal to 3*,
//calculate a new field called num_favs that represets how many *favorites appear in the cast field of the movie.
// Sort your results by num_favs, tomatoes.viewer.rating, and title, all in descending order.
// What is the title of the 25th film in the aggregation result?
// Hint: MongoDB has a great expression for quickly determining whether there are common elements in lists, $setIntersection

predicate = {
	$match: {
		cast: {
			$elemMatch: {
				$exists: true
			}
		},
		'tomatoes.viewer.rating': { $gte: 3 },
		countries: { $in: ['USA'] }
	}
};

projection = {
	$project: {
		num_favs: {
			$setIntersection: [
				'$cast',
				[
					'Sandra Bullock',
					'Tom Hanks',
					'Julia Roberts',
					'Kevin Spacey',
					'George Clooney'
				]
			]
		}
	}
};

sorting = {
	$sort: { num_favs: -1, 'tomatoes.viewers.rating': -1, title: -1 }
};

skipping = {
	$skip: 24
};

limiting = {
	$limit: 1
};

pipeline = [predicte, projection, sorting, skipping, limiting];

// Question 4:
// Let's use our increasing understanding of the Aggregation Framework to explore our movies collection in more detail.
//We'd like to calculate how many movies every cast member has been in, and get an average imdb.rating for each cast member.
// Which cast member has the been in the most movies with English as an available language?
// To verify that you've successfully completed this exercise please submit your answer
//as the sum of the number of films and average rating for this cast member.
// For example, if the cast member was output like so:

// { "_id": "James Dean", "numFilms": 11, "average": 7.1 }
// Then the answer would be 18.1.

predicate = {
	$match: {
		languages: { $in: ['English'] },
		cast: { $elemMatch: { $exists: true } }
	}
};

unwinding = {
	$unwind: {
		path: '$cast'
	}
};

grouping = {
	$project: {
		_id: '$cast',
		numflims: {
			$sum: 1
		},
		average: {
			$avg: '$imdb.rating'
		}
	}
};

sorting = {
	$sort: { numflims: -1 }
};

limiting = {
	$limit: 1
};

pipeline = [predicate, unwinding, grouping, sorting, limiting];

//Question: 5
// Which alliance from air_alliances flies the most routes with either a Boeing 747 or an Airbus A380
//(abbreviated 747 and 380 in air_routes)?
// Note: Begin from the air_routes collection!

// predicate is given this lab
// predicate = {
//   "$match": {
//       "airplane": {"$regex": "747|380"}
//   }
// }

predicate = {
	$match: {
		airplane: { $regex: '747|380' }
	}
};

lookup = {
	$lookup: {
		from: 'air_alliances',
		localField: 'airline.name',
		foreignField: 'airlines',
		as: 'alliances'
	}
};

grouping = {
	$group: {
		_id: '$alliances.name',
		count: {
			$sum: 1
		}
	}
};

shaping = {
	$project: {
		_id: 0,
		count: 1,
		name: 1,
		name: { $arrayElemAt: ['$_id', 0] }
	}
};

matching = {
	$match: {
		name: { $exists: true }
	}
};

sorting = {
	$sort: { count: -1 }
};

limiting = {
	$limit: 1
};

pipeline = [predicate, lookup, grouping, shaping, matching, sorting, limiting];

//db collection aggregate(pipline);
