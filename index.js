const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended : true
}))
const multer = require('multer')
const User = require('./models/user')
const path = require('path')
const fs = require('fs');
const cors = require('cors')
app.use(cors())
require('dotenv').config()


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/images/');
    },
    filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() +  '.' + file.originalname.split('.').pop());
    }
  });

const upload = multer({ storage: storage });


app.post('/user', upload.single('image'), (req, res) => {

    try{
        const user = new User({
            name: req.body.name,
            image: '/public/images/' + req.file.filename
          });
        user.save()
        res.status(201).json(user)
    }
    
    catch(err){
        res.json(err)
    }

  });
  

  app.get('/user', (req, res) => {
    User.find()
    .then(users => res.json(users))
  })


app.use('/images', express.static('public/images'));


app.get('/public/images/:filename', (req, res) => {
    const file = `public/images/${req.params.filename}`;
    res.sendFile(path.resolve(file));
  });


app.get('/images', (req, res) => {
  fs.readdir('public/images', (err, files) => {
    if (err) {
      return res.status(500).send({ error: err });
    }
    res.send({ images: files });
  });
});




mongoose.connect(process.env.MONGO_URI, {useNewUrlParser : true})

app.get('/', (req, res) => {
    res.send('Welcome to my API')
})

app.listen(8000, () => {
    console.log('Server running')
})