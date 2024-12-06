const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const fs = require('fs');
const Post = require('./models/Post');
const dotenv = require('dotenv');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

dotenv.config();

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

connectDB();

const salt = bcrypt.genSaltSync(10);
const secret = process.env.JWT_SECRET;

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const uploadMiddleware = multer({ dest: 'uploads/' });

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json('User not found');
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
        if (err) throw err;
         res.cookie('token', token, {
          httpOnly: true,
          secure: true, // Set to true for production
          sameSite: 'None', 
        }).json({
          id: userDoc._id,
          username,
        });
      });
    } else {
      res.status(400).json('Wrong credentials');
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json('Internal server error');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  }).json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const ext = originalname.split('.').pop();
  const newFileName = `${uuidv4()}.${ext}`;
  
  const fileContent = fs.readFileSync(path);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: newFileName,
    Body: fileContent,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, async (err, data) => {
    fs.unlinkSync(path); 
    if (err) return res.status(500).json({ error: 'Error uploading file to S3' });

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;

      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: data.Location, 
        author: info.id,
      });
      res.json(postDoc);
    });
  });
});


app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { token } = req.cookies;

  let newFileUrl = null;

  if (req.file) {
    const { originalname, path } = req.file;
    const ext = originalname.split('.').pop();
    const newFileName = `${uuidv4()}.${ext}`;
    const fileContent = fs.readFileSync(path);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: newFileName,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };

    try {
      const uploadResult = await s3.upload(params).promise();
      fs.unlinkSync(path);
      newFileUrl = uploadResult.Location;
    } catch (err) {
      console.error('Error uploading file to S3:', err);
      return res.status(500).json({ error: 'File upload failed', details: err.message });
    }
  }

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) {
      console.error('JWT verification failed:', err);
      return res.status(401).json('Invalid token');
    }

    const { id, title, summary, content } = req.body;

    try {
      const postDoc = await Post.findById(id);
      if (!postDoc) {
        return res.status(404).json('Post not found');
      }

      if (JSON.stringify(postDoc.author) !== JSON.stringify(info.id)) {
        return res.status(403).json('Unauthorized');
      }

      postDoc.title = title;
      postDoc.summary = summary;
      postDoc.content = content;
      postDoc.cover = newFileUrl || postDoc.cover;

      await postDoc.save();
      return res.json(postDoc);
    } catch (err) {
      console.error('Error updating post:', err);
      return res.status(500).json({ error: 'Post update failed', details: err.message });
    }
  });
});


app.get('/post', async (req, res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

