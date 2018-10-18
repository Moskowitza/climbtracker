var should = require("should");
var mongoose = require('mongoose');
var Climber = require("../models/climber.js");
var db;

describe('climber', function() {

    before(function(done) {
        db = mongoose.connect('mongodb://localhost/test');
            done();
    });

    after(function(done) {
        mongoose.connection.close();
        done();
    });

    beforeEach(function(done) {
        var climber = new Climber({
            username: '12345',
            password: 'testy',
            email: 'testy@test.com'
        });

        climber.save(function(error) {
            if (error) console.log('error' + error.message);
            else console.log('no error');
            done();
        });
    });

    it('find a user by username', function(done) {
        Climber.findOne({ username: '12345' }, function(err, climber) {
            climber.username.should.eql('12345');
            console.log("   username: ", climber.username);
            done();
        });
    });

    afterEach(function(done) {
        Climber.remove({}, function() {
            done();
        });
     });

});