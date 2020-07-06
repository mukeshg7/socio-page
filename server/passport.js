const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load User Model
const User = require('./models/user');

module.exports = function(passport) {
    
    passport.use(
        new LocalStrategy({usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
            // Match User
            //console.log("into the local strategy")
            User.findOne({email: email}, (err, user) => {
                    if(err) {
                        return done(err);
                    }
                    if(!user) {
                        return done(null, false, { msg: 'Input data incorrect!'})
                    }
                    //console.log("ahead of if's")
                    // Match Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw error;
                        if(isMatch) {
                            //console.log("yes match", user)
                            return done(null, user);
                        } else {
                            //console.log("no match")
                            return done(null, false, { msg: "Input data incorrect!"})
                        }
                    });
                })
        }) 
    );
    
    passport.serializeUser((user, done) => {
        //console.log("into the serializer")
        done(null, user.id);
      });
      
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    }); 
}