const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// use to upload files and folders
const multer = require('multer')
const path = require('path')
const session = require('express-session'); // Import express-session
const cookieParser = require('cookie-parser'); // Import cookie-parser
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// till yet

// here we defile all models
const UserModel = require('./models/UserModel')
const PostModel = require('./models/PostModel')
const ContactModel = require('./models/ContactModel')


const app = express();
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json());
app.use(express.static('public'))


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
}));
app.use(cookieParser());


mongoose.connect("mongodb://127.0.0.1:27017/project");


app.post("/register", (req, res) => {
    const { username, email, password } = req.body;
    
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                res.json("already have an account");
            } else {
                bcrypt.hash(password, 10)
                    .then(hash => {
                        UserModel.create({
                            username: username,
                            email: email,
                            password: hash // Store the hashed password
                        })
                        .then(result => res.json("Account created successfully"))
                        .catch(err => res.json(err));
                    })
                    .catch(err => res.json(err));
            }
        })
        .catch(err => res.json(err));
});


// here we check our deta through get 
app.get("/get_register", (req, res) => {
    UserModel.find({})
        .then(function(users) {
            res.json(users);
        })
        .catch(function(err) {
            res.json(err);
        });
});


// login portal 
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response) {
                        const token = jwt.sign(
                            { email: user.email, username: user.username },
                            "jwt-secret-key",
                            { expiresIn: "1d" }
                        );
                        res.cookie('token', token);
                        return res.json({ status: "success" });
                    } else {
                        return res.json("password is incorrect");
                    }
                });
            } else {
                res.json("this email id is not registered");
            }
        })
        .catch(err => res.json(err));
});



// get login
app.get("/get_login", (req, res) => {
    UserModel.find({})
        .then(function(users) {
            res.json(users);
        })
        .catch(function(err) {
            res.json(err);
        });
});



// Middleware to verify user before accessing protected routes
const verifyuser = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.json("The token is missing");
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) {
                return res.json("The token is invalid"); // Token verification failed
            } else {
                req.email = decoded.email;
                req.username = decoded.username;
                next();
            }
        });
    }
};



app.get('/', verifyuser, (req, res) => {
    return res.json({ email: req.email, username: req.username });
});




// Logout route
app.get('/logout', (req,res)=>{
    res.clearCookie("token", { secure: true, sameSite: 'None' }); // Corrected the usage of clearCookie
    return res.json("success");
});



// for posting or creating
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/Images');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname)); // Fixed the typo here
    }
});

const upload = multer({
    storage: storage
});



app.post("/create", upload.single('file'), (req, res) => {
    console.log({ 
         file: req.file,
         title: req.body.title,
         desc: req.body.desc,
         category: req.body.category,
          email: req.body.email        
        }); 

// BLog uploaded file info along with title and desc
    PostModel.create({
        title: req.body.title,
         desc: req.body.desc,
         file: req.file.filename,
         category: req.body.category,
         email: req.body.email,       

    })
    .then(result => res.json({status: "success", result}))
    .catch(err => res.json(err))
});



app.post("/contactus", async (req, res) => {
    // Correctly include the timestamp in the data sent to the backend
    const data = {
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      timestamp: new Date().toISOString(), // Generate timestamp here
    };
  
    try {
      const result = await ContactModel.create(data); // Pass the complete data object
      res.json({ status: "success", result });
    } catch (err) {
      res.json({ status: "error", error: err.message });
    }
  });



// this form is also correct
  /*
  app.post("/contactus", (req, res) => {
    ContactModel.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message
    })
    .then(result => res.json({ status: "success" })) // Corrected "statue" to "status"
    .catch(err => res.json(err));
});
*/


// to get the blog data
app.get('/get_blog', (req,res)=>{
    PostModel.find({})
        .then(users => res.json(users))
        .catch(err => console.log(err))
})


// to get blog data by id
// app.get("/getpostbyid/:id", (req,res)=>{
//     const id = req.params.id
//     PostModel.findById({_id: id})
//     .then(post => res.json(post))
//     .catch(err => console.log(err))
// })
app.get("/getpostbyid/:id", (req, res) => {
    const id = req.params.id;
    PostModel.findById({ _id: id })
        .then(post => res.json(post))
        .catch(err => res.json(err));
});


// eidtpost
app.put('/editpost/:id', (req, res) => {
    const id = req.params.id;
    const { title, desc } = req.body; // Extract title and desc from request body
    PostModel.findByIdAndUpdate(
        { _id: id },
        { 
            title: title,
            desc: desc,
        }
    )
    .then(result => res.json({ status: 'success', result  }))
    .catch(err => res.status(500).json({ status: 'error', message: err.message }));
});


// delete post
app.delete('/deletepost/:id', (req,res)=>{
    PostModel.findByIdAndDelete({_id: req.params.id})
    .then(result => res.json("success"))
    .catch(err => res.json(err))
})


app.listen(3001, () => {
    console.log("server is running");
});