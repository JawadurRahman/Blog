// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://user:3St5jFMnxm8qGC0O@cluster0.jz7h7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Set up a basic route
app.get('/', async (req, res) => {
  const posts = await BlogPost.find({});
  res.render('index', {posts});
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
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Fetch and display an individual blog post
app.get("/posts/:id", async function(req, res) {
  const postId = req.params.id;
  const post = await BlogPost.findById(postId);
  if (!post) {
    res.status(404).send('<h1>Post not found<h1>');
  }
  return res.render('post', { post }); //res.status(200).send(post);
});

app.post('/posts', async (req, res) => {
  const { newPostId, title, content } = req.body;

  // Create the new blog post object
  const newBlogPost = {
    _id: newPostId,
    title,
    content,
    createdAt: new Date(),
  };

  // Save the new blog post to the database
  const created = await BlogPost.create(newBlogPost);

  if (created) {
    res.redirect('/')
    res.status(201).send('Blog post created successfully');
  } else {
    res.status(404).send('<h1>Creating failed not found<h1>');
  }

});

// Route for rendering the new post creation page
app.get('/new-post', (req, res) => {
  res.render('new-post');
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