const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const config = require('../config');
const mkdirp = require('mkdirp');

const randomStr3Symb = () =>
  Math.random()
    .toString(36)
    .slice(-1);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = '/picfolder_' + randomStr3Symb();
    //creatinng folder in folder and in cb save there a picture
    mkdirp(config.PUBLICATIONS_PICTURE_SAVE_DESTINATION + dir, err =>
      cb(err, config.PUBLICATIONS_PICTURE_SAVE_DESTINATION + dir)
    );
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext != '.jpg' && ext != '.jpeg' && ext != '.png') {
      const err = new Error('Extention');
      err.code = 'EXTENTION';
      return cb(err);
    }
    cb(null, true);
  }
}).single('file'); //Name of input in the form

// POST image
router.post('/image', (req, res) => {
  upload(req, res, err => {
    console.log(req.file);

    console.log(req.body);

    console.log(req.body.descriptiontag);
    let error = '';
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        error = 'Картинка не более 2mb';
      }
      if (err.code === 'EXTENTION') {
        error = 'Только .jpg, .jpeg, .png';
      }
    }
    res.json({
      ok: !error,
      error
    });
  });
});

module.exports = router;
