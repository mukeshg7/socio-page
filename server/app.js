const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator')
const cors = require('cors')
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const User = require('./models/user');
const Post = require('./models/post')

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
    if(req.session.user._id == id) {
        res.status(200).send({ userName: req.session.user.userName, email: req.session.user.email});
    } else {
        res.status(203).send("Not authorized");
    }
})


app.post('/addpost', (req, res) => {
    const post = req.body;
    console.log(post);
    console.log(req.session.user);
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