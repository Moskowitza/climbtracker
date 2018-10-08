#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
  console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
  return
}

var async = require('async')
var Climb = require('./models/climb')
var Climber = require('./models/climber')
// var ClimbInstance = require('./models/climbInstance')
var Gym = require('./models/gym')
var Setter = require('./models/setter')
var Wall = require('./models/wall')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var climbs = []
var climbers = []
var gyms = []
var walls = []
var setters = []

// Setters need Gyms first gym[0]
function setterCreate(username, password, email, d_birth, gender, height_feet, height_inch, member, cb) {
  setterdetail = { username: username, password: password, email: email }
  if (d_birth != false) climberdetail.date_of_birth = d_birth
  if (gender != false) climberdetail.gender = gender
  if (height_feet != false) climberdetail.height_feet = height_feet
  if (height_inch != false) climberdetail.height_inch = height_inch
  if (member != false) climberdetail.member = member

  var setter = new Climber(setterdetail);

  setter.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Setter: ' + setter);
    setters.push(setter)
    cb(null, setter)
  });
}
// Climbers need Gyms first gym[0]
function climberCreate(username, password, email, d_birth, gender, height_feet, height_inch, member, cb) {
  climberdetail = { username: username, password: password, email: email }
  if (d_birth != false) climberdetail.date_of_birth = d_birth
  if (gender != false) climberdetail.gender = gender
  if (height_feet != false) climberdetail.height_feet = height_feet
  if (height_inch != false) climberdetail.height_inch = height_inch
  if (member != false) climberdetail.member = member

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

function gymCreate(gymname, address, city, state, zipcode, website) {
  var gym = new Gym({
    gymname: gymname,
    address: address,
    city: city,
    state: state,
    zipcode: zipcode,
    website: website
  });

  gym.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Gym: ' + genre);
    gyms.push(gym)
    cb(null, genre);
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
    climb_image: climb_image,
  }


  var climb = new Climb(climbdetail);
  climb.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    climbs.push(climb)
    cb(null, climb)
  });
}

function wallCreate(gym, name, attributes, wall_image){
  walldetail = {
    gym: gym,
    name: name,
    attributes: attributes,
  }
  if (wall_image != false) climberdetail.wall_image = wall_image

  var wall = new Climb(walldetail);
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


function bookInstanceCreate(book, imprint, due_back, status, cb) {
  bookinstancedetail = {
    book: book,
    imprint: imprint
  }
  if (due_back != false) bookinstancedetail.due_back = due_back
  if (status != false) bookinstancedetail.status = status

  var bookinstance = new BookInstance(bookinstancedetail);
  bookinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING BookInstance: ' + bookinstance);
      cb(err, null)
      return
    }
    console.log('New BookInstance: ' + bookinstance);
    bookinstances.push(bookinstance)
    cb(null, book)
  });
}


function createGym(cb) {
  async.parallel([
    function (callback) {
      gymCreate("Tufas Bouldering Lounge", "1614 N 5th St", "Philadelphia", "PA", 19122, "https://tufasboulderlounge.com/", callback);
    },
    function (callback) {
      gymCreate("Philadelphia Rock Gym - East Falls", "3500 Scotts Ln", "Philadelphia", "PA", 19129, "https://www.philarockgym.com/prg-east-falls/", callback);
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
      wallCreate( gyms[0], 'slab', ["slab", "easy"], false, callback);
    }
  ],
    // optional callback
    cb);
}


function createBooks(cb) {
  async.parallel([
    function (callback) {
      bookCreate('The Name of the Wind (The Kingkiller Chronicle, #1)', 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', '9781473211896', authors[0], [genres[0],], callback);
    },
    function (callback) {
      bookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)", 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', '9788401352836', authors[0], [genres[0],], callback);
    }
  ],
    // optional callback
    cb);
}


function createClimbInstances(cb) {
  async.parallel([
    function (callback) {
      bookInstanceCreate(books[0], 'London Gollancz, 2014.', false, 'Available', callback)
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
      console.log('BOOKInstances: ' + bookinstances);

    }
    // All done, disconnect from database
    mongoose.connection.close();
  });



