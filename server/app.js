const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator')
const cors = require('cors')
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/user');
const Post = require('./models/post');
const e = require('express');
const { response } = require('express');
const ObjectId = require('mongodb').ObjectID;

const app = express();


//Passport config
require('./passport')(passport);

const dbUrl = "mongodb+srv://admin:pass123@socioapp-lcfq8.mongodb.net/socio-app?retryWrites=true&w=majority";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((response) => {
        console.log("connected to db");
        app.listen(3000, () => {
            console.log('Listning at port 3000');
        });
    })
    .catch(err => console.log(err));

const corsOptions = {
    origin: 'http://localhost:3001',
    credentials: true,
};
// middleware
app.use(express.json());
app.use(cors(corsOptions));

//app.use(cookieParser());

//Express session
app.use(
    session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60*60*1000},
})
);


// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('/feed', (req, res) => {
    Post.find().sort({ createdAt: -1})
        .then(result => res.send(result))
        .catch(err => console.log(err));
})

app.post('/like', (req, res) => {
    const postId = req.body.postId;
    const userId = req.body.userId;

    Post.findById(postId)
        .then(response => {
            if(response) {
                Post.findOne( {$and: [{ '_id': ObjectId(postId)} , {'likedUserIds': {$elemMatch: { 'userId':  userId }}}]})
                    .then(post => {console.log(post);
                        if(post) {
                            Post.updateOne({ _id: postId }, { $pull: { likedUserIds:  { userId } } ,  $inc: { likes: -1 }} )    //Revome
                                .then(result => {
                                    res.status(200).send({ new: response.likes-1});
                                })
                                .catch(err => console.log(err));
                        } else {
                            Post.updateOne( { _id: postId }, { $push: { likedUserIds:  { userId } },  $inc: { likes: 1 }})    //Revome
                                .then(result => {
                                    res.status(200).send({ new: response.likes+1});
                                })
                                .catch(err => console.log(err));
                        }
                    })
                    .catch(err => console.log(err));
            } else {
                res.status(203).send("Post not available.");
            }
        })
        .catch(err => console.log(err));
})

app.get('/followpage', (req, res) => {
    if(req.session.user) {
        const userId = req.session.user._id;
        const userName = req.session.user.userName;
        User.find({ $and: [ {'followers.userId': { $ne: userId } }, {'_id': {$ne: userId } } ]}, {'_id': 1, 'userName': 1})
            .then(users => {console.log(users);
                res.status(200).send({users: users, userName: userName, userId: userId});
            })
            .catch(err => console.log(err));
        
    } else {
        res.status(203).send("User not LoggedIn!")
    }
})

app.post('/follow', (req, res) => {
    const userId = req.session.user._id;
    const userName = req.session.user.userName;
    const followUserId = req.body.followUserId;
    const followUserName = req.body.followUserName;
    User.updateOne({ '_id': followUserId }, { $push: { followers: { userId: userId, userName: userName } }, $inc: { followersCount: 1 } })
        .then(result => {
            User.updateOne({ '_id': userId }, { $push: { following: { userId: followUserId, userName: followUserName } }, $inc: { followingCount: 1 } })
                .then(response => {
                    res.status(200).send('Sussessfully following!');
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

app.post('/login', checkLoginLogStatus, (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if(err) {
            res.status(203).send(err);
        } else {
            if(user) {
                req.login(user, err => {
                    req.session.user = user;
                    res.status(200).send({userId: user._id, userName: user.userName });
                })
            } else {
                res.status(202).send(info);
            }
        }
    })(req, res, next);
});

app.get('/checkuser', (req, res) => {
    if(req.session.user) {
        res.send({ isLoggedIn: true, userId: req.session.user._id, userName: req.session.user.userName });
    } else {
        res.send({ isLoggedIn: false });
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.status(200).send('Successfully logged out!')
    });
  })



app.get('/user/:id', checkProfileLogStatus, (req, res, next) => {
    const id = req.params.id.trim();
    if(req.session.user) {
        if(req.session.user._id === id) {
            res.status(200).send({ userName: req.session.user.userName, email: req.session.user.email, 
                followersCount: req.session.user.followersCount, followingCount: req.session.user.followingCount, 
                        isThisUser: true});
        } else {
            User.findById(id, 'userName email followersCount followingCount')
                .then(user => {
                    res.status(200).send({ userName: user.userName, email: user.email, 
                        followersCount: user.followersCount, followingCount: user.followingCount, 
                                isThisUser: false, loggedInUser: req.session.user._id});
                })
                .catch(err => console.log(err));
        }
    } else {
        res.status(203).send("Not authorized");
    }
})


app.post('/addpost', (req, res) => {
    const post = req.body;
    const newPost = new Post(post);
    newPost.save()
        .then(result => {
            res.status(200).send("Post added to the feed successfully!");
        })
        .catch(err => {
            console.log(err);
            res.status(203).send("Some error occured!")
        })
})

function checkProfileLogStatus(req, res, next) {
    if(req.session.user) {
        next();
    } else {
        res.status(202).send("Not logged in!")
    }
}
function checkLoginLogStatus(req, res, next) {
    if(req.session.user) {
        res.status(200).send(req.session.user._id);
    } else {
        next();
    }
}

app.post('/signup', async (req, res) => {
    const userInfo = req.body;
    let error = [];

    if(!userInfo.email || !userInfo.userName || !userInfo.password || !userInfo.confirmPassword) {
        error.push("Fill in all the fields!")
    }
    if(userInfo.password !== userInfo.confirmPassword) {
        error.push("Passwords do not match!");
    }
    if(userInfo.password.length < 6) {
        error.push("Password length should be atleast 6.")
    }
    if(error.length > 0) {
        res.send(error);
    } else {
        // Uniqueness of email 
        User.findOne({email: userInfo.email})
            .then(response => {
                if(response) {
                    error.push("Email already exists!");
                    res.send(error);
                } else {
                    console.log("Signedup!")
                    const newUser = new User(userInfo);
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                          if (err) throw err;
                          newUser.password = hash;
                            newUser.save()
                                .then(result => {
                                    res.send("Successfull Signup!");
                                })
                                .catch(err => {
                                    console.log(err);
                                })
                            })
                    })
            }
        })
    }
})