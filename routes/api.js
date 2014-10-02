/*
 * Serve JSON to our AngularJS client
 * This acts as a local API that angular can call, and can wrap our actual API. We can use this
 * to implement data transformations, caching, etc. so we might not want to delete the
 * routing system out of hand.
 */

exports.name = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

exports.people = function (req, res) {
	res.json([{
		name: 'Bob Gardner',
	},
	{
		name: 'Abhi Agarwal',
	},
	{
		name: 'Ethan Resnick'
	}]);
}