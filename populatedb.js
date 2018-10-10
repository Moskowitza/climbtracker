#! /usr/bin/env node
// Populate script is run by using node
// node populatedb.js mongodb://localhost/climbtracker

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://localhost/climbtracker');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}

// we'll use async so collections referencing other fields occur correctly (ie, a climb needs a gym and wall refid)
var async = require('async')
// Our Models, we'll create a new object then save it 
//
var Climb = require('./models/climb')
var Climber = require('./models/climber')
var ClimbInstance = require('./models/climbInstance')
var Gym = require('./models/gym')
var Setter = require('./models/setter')
var Wall = require('./models/wall')


// Connect to mogoose
var mongoose = require('mongoose');
//we're passing the database location and name as a process argument after calling this script
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Create empty arrays to hold our objects
//these get passed back into the 
var climbs = []
var climbers = []
var gyms = []
var walls = []
var setters = []
var climbinstances=[]

// Setters need Gyms first gym[0]
function setterCreate(username, password, email, d_birth, gender, height_feet, height_inch, gym_memberships, cb) {
  setterdetail = {
    username: username,
    password: password,
    email: email
  }
  // if we don't have this following, we will pass "false" as the argument
  if (d_birth != false) climberdetail.date_of_birth = d_birth
  if (gender != false) climberdetail.gender = gender
  if (height_feet != false) climberdetail.height_feet = height_feet
  if (height_inch != false) climberdetail.height_inch = height_inch
  if (gym_memberships != false) climberdetail.gym_memberships = gym_memberships

  var setter = new Setter(setterdetail);

  setter.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Setter: ' + setter);
    setters.push(setter) //send this one into the global array
    cb(null, setter)
  });
}
// Climbers need Gyms first gym[0]
function climberCreate(username, password, email, d_birth, gender, height_feet, height_inch, gym_memberships, cb) {
  climberdetail = { 
    username: username, 
    password: password, 
    email: email }
  if (d_birth != false) climberdetail.date_of_birth = d_birth
  if (gender != false) climberdetail.gender = gender
  if (height_feet != false) climberdetail.height_feet = height_feet
  if (height_inch != false) climberdetail.height_inch = height_inch
  if (gym_memberships != false) climberdetail.gym_memberships = gym_memberships

  var climber = new Climber(climberdetail);

  climber.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Climber: ' + climber);
    climbers.push(climber)
    cb(null, climber)
  });
}

function gymCreate(gymname, address, city, state, zipcode, website, cb) {
  gymdetail={
    gymname: gymname,
    address: address,
    city: city,
    state: state,
    zipcode: zipcode,
    website: website
  };

  var gym = new Gym (gymdetail);

  gym.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Gym: ' + gym);
    gyms.push(gym)
    cb(null, gym);
  });
}

function climbCreate(gym, location, type, color, grade, circuit, date_of_set, date_of_removal, active, setter, climb_image, cb) {
  climbdetail = {
    gym: gym,
    location: location,
    type: type,
    color: color,
    grade: grade,
    circuit: circuit,
    date_of_set: date_of_set,
    date_of_removal: date_of_removal,
    active: active,
    setter: setter,
    climb_image: climb_image
  }
  var climb = new Climb(climbdetail);
  climb.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Climb: ' + climb);
    climbs.push(climb)
    cb(null, climb)
  });
}

function wallCreate(gym, name, attributes, wall_image, cb) {
  walldetail = {
    gym: gym,
    name: name,
    attributes: attributes,
  }
  if (wall_image != false) climberdetail.wall_image = wall_image

  var wall = new Wall(walldetail);
  wall.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Gym Wall: ' + wall);
    walls.push(wall)
    cb(null, wall)
  });

}


function climbInstanceCreate(climb, climber, status, counter, date, cb) {
  climbinstancedetail = {
    climb: climb,
    climber: climber,
    status:status,
    counter:counter,
    date:date
  }


  var climbinstance = new ClimbInstance(climbinstancedetail);
  climbinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING ClimbInstance: ' + climbinstance);
      cb(err, null)
      return
    }
    console.log('New climbinstance: ' + climbinstance);
    climbinstances.push(climbinstance)
    cb(null, climbinstance)
  });
}


function createGym(cb) {
  async.parallel([
    function (callback) {
      gymCreate("Tufas Bouldering Lounge", "1614 N 5th St", "Philadelphia", "PA",19122, "https://tufasboulderlounge.com/", callback);
    },
    function (callback) {
      gymCreate("Philadelphia Rock Gym - East Falls", "3500 Scotts Ln", "Philadelphia", "PA",19129, "https://www.philarockgym.com/prg-east-falls/", callback);
    }
  ],
    // optional callback
    cb);
}

function createClimbersSettersWalls(cb) {
  async.parallel([
    function (callback) {
      climberCreate('aaron', 'exposedpassword', "aaron@aaron.com", '1979-02-07', "male", 5, 7, [gyms[0],], callback);
    },
    function (callback) {
      setterCreate('Reiver Ketcham', 'exposedpassword', "Reiver@tufas.com", '1980-04-17', "male", 6, 0, [gyms[0],], callback);
    },
    function (callback) {
      setterCreate('Rory Coughlin', 'exposedpassword', "rory@tufas.com", '1982-12-21', "male", 5, 8, [gyms[0],], callback);
    },
    function (callback) {
      wallCreate(gyms[0], 'slab', ["slab", "easy"], false, callback);
    }
  ],
    // optional callback
    cb);
}


function createClimbs(cb) {
  async.parallel([
    function (callback) {
      climbCreate(gyms[0], walls[0], "Boulder","Black","V0","Green", "2018-10-10","2019-01-01", true,setters[0],"1.jpg", callback);
    },
    function (callback) {
      climbCreate(gyms[0], walls[0],"Boulder","Orange","V3","Yellow", "2018-10-10","2019-01-01", true ,setters[0],"1.jpg", callback);
    }
  ],
    // optional callback
    cb);
}


function createClimbInstances(cb) {
  async.parallel([
    function (callback) {
      climbInstanceCreate(climbs[0],climbers[0],'Not Tried',0,"2018-10-10", callback)
    },
  ],
    // Optional callback
    cb);
}



async.series([
  createGym,
  createClimbersSettersWalls,
  createClimbs,
  createClimbInstances
],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log('FINAL ERR: ' + err);
    }
    else {
      console.log('ClimbInstances: ' + climbinstances);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });



