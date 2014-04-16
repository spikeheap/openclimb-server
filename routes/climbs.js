/**
 * RESTful API for climbs
 **/

// Datasource setup
// TODO refactor and abstract
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/openclimb');


var climbSchema = mongoose.Schema({
  name: String,
  description: String,
  grade: String,
  length: String,
  name: String,
  stars: Number,
  loc: {type: [Number], index: '2dsphere'}
});

var Climb = mongoose.model('Climb', climbSchema);

/**
 * List all climbs. Accepts some parameters:
 *  * `loc=[lon,lat]` and `maxDistance=x` finds climbs within `x` km of the location.
 *  * `within=geojson`, finds climbs within the passed GeoJSON object `geojson`.
 *  * `limit=y`, `offset=`z`, restricts to `y` results, offset by `z`. Useful for pagination.
 **/
exports.list = function(req, res){

  var response = {
    _self : req.url
  };

  if(req.query.loc !== undefined){

    // Default to 50km
    var maxDistance = parseFloat(req.query.maxDistance) || 50;
    // switch to using local variables
    // TODO check for validity
    var location = {
      type : "Point",
      coordinates : JSON.parse(req.query.loc)
    };

    var searchOptions = {
      query: {
      },
      // FIXME check for parse errors
      // Convert the maxDistance (metres) into radians.
      // This should be handled natively in metres, see
      // https://github.com/LearnBoost/mongoose/issues/1987
      maxDistance : maxDistance / 6371.0,
      distanceMultiplier: 6371, // radius of Earth in km
      spherical : true
    }
    return Climb.geoNear(location, searchOptions, function (err, results, stats) {
      //console.log(err);
      //console.log(results);
      //console.log(stats);
      response.climbs = results;
      return res.send(response);
    });
  }

  return res.send({
    error: "NOT_SUPPORTED",
    message: "This API only supports requests with `maxDistance` and `loc` parameters."
  })
};

exports.create = function(req, res){
  var newClimb = new Climb({
    // FIXME at least try to escape user input...
    name:         req.body['name'],
    description:  req.body['desc'],
    length:       req.body['length'],
    grade:        req.body['grade'],
    stars:        req.body['stars'],
    loc:          req.body['loc'],
  });

  newClimb.save(function(err,resultset) {
    if (!err) {
      res.json(resultset);
    } else {
      throw err;
    }
  });
};

// TODO !
exports.save = function(req, res){
  res.send("respond with a resource");
};

// TODO !
exports.get = function(req, res){
  // FIXME validate id is valid

};

// TODO !
exports.delete = function(req, res){
  res.send("respond with a resource");
};
