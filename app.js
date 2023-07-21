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
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Define the blog post schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// Create the blog post model
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Fetch and display an individual blog post
app.get('/posts/:id', (req, res) => {
    const postId = req.params.id;
  
    BlogPost.findById(postId, (err, post) => {
      if (err || !post) {
        res.status(404).send('Post not found');
      } else {
        res.render('post', { post });
      }
    });
  });
  