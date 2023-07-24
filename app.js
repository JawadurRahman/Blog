// app.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const jsonwebtoken = require("jsonwebtoken");
const config = require("./config.json"); // Assuming your config file is in the same directory

const app = express();

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Set up EJS as the view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a basic route
app.get("/", async (req, res) => {
    const posts = await BlogPost.find({});
    res.render("index", { posts });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// Define the blog post schema
const blogPostSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, required: true },
});

// Create the blog post model
const BlogPost = mongoose.model("BlogPost", blogPostSchema);

// Fetch and display an individual blog post
app.get("/posts/:id", async function (req, res) {
    const postId = req.params.id;
    const post = await BlogPost.findById(postId);
    if (!post) {
        res.status(404).send("<h1>Post not found<h1>");
    }
    return res.render("post", { post }); //res.status(200).send(post);
});

app.post("/posts", async (req, res) => {
    const { newPostId, title, content } = req.body;

    // Create the new blog post object
    const newBlogPost = {
        _id: newPostId,
        title,
        content,
        createdAt: new Date(),
    };

    try {
        // Save the new blog post to the database
        const created = await BlogPost.create(newBlogPost);

        if (created) {
            res.redirect("/");
        } else {
            res.status(404).send("<h1>Creating failed not found<h1>");
        }
    } catch (err) {
        res.status(403).send("Duplicate key Error: Use a newPostId");
    }
});

const JWT_SECRET =
    "goK!pusp6ThEdURUtRenOwUhAsWUCLheBazl!uJLPlS8EbreWLdrupIwabRAsiBu";

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`${username} is trying to login ..`);

    if (username === "admin" && password === "admin") {
        const token = jsonwebtoken.sign({ user: "admin" }, JWT_SECRET);
        res.cookie("token", token)
        res.render("new-post");
    } else {
        return res
            .status(401)
            .json({
                message:
                    "The username and password your provided are invalid",
            });
    }
});

// Route for rendering the new post creation page
app.get("/new-post", (req, res) => {
    var token;
    try {
        token = req.cookies.token;
    } catch (error) {}

    // if the cookie is not set, return an unauthorized error
    if (!token) {
        return res.status(401).json({ error: "Not Authorized" });
    }

    var payload;
    try {
        // Parse the JWT string and store the result in `payload`.
        // Note that we are passing the key in this method as well. This method will throw an error
        // if the token is invalid (if it has expired according to the expiry time we set on sign in),
        // or if the signature does not match
        payload = jsonwebtoken.verify(token, JWT_SECRET);
    } catch (e) {
        if (e instanceof jsonwebtoken.JsonWebTokenError) {
            // if the error thrown is because the JWT is unauthorized, return a 401 error
            return res.status(401).end();
        }
        // otherwise, return a bad request error
        return res.status(400).end();
    }

    res.render("new-post");
});

// app.get('/posts/:id', async (req, res) => {
//   const postId = req.params.id;

//   try {
//     const post = await BlogPost.findById(postId).exec();

//     if (!post) {
//       res.status(404).send('Post not found');
//     } else {
//       res.render('post', { post });
//     }
//   } catch (err) {
//     res.status(500).send('Internal Server Error');
//   }
// });
