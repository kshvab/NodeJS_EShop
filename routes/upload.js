const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const config = require('../config');
const mkdirp = require('mkdirp');
const mongoose = require('mongoose');

const models = require('../models');
const publication = models.publication;

const transliterationModule = require('transliteration');
const slugify = transliterationModule.slugify;

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
    if (err) {
      let error = '';
      if (err.code === 'LIMIT_FILE_SIZE') {
        error = 'Картинка не более 2mb';
      }
      if (err.code === 'EXTENTION') {
        error = 'Только .jpg, .jpeg, .png';
      }
      res.json({
        ok: false,
        error
      });
    } else {
      let title = req.body.newPublTitle;
      let alias;
      if (!req.body.newPublAlias) alias = slugify(title);
      else alias = req.body.newPublAlias;
      let shorttext = req.body.newPublShortText;
      let fulltext = req.body.newPublicationFullText;
      let picture = req.file.destination + '/' + req.file.filename;
      let description = req.body.newPublDescription;
      let keywords = req.body.newPublKeywords;
      let status = req.body.newPublStatus;
      if (!fulltext || fulltext == '<p><br></p>') {
        res.json({
          ok: false,
          error: 'Напишите полный текст для публикации!'
        });
      } else {
        publication.findOne({ alias }).then(publicationFromDB => {
          if (!publicationFromDB) {
            publication
              .create({
                _id: new mongoose.Types.ObjectId(),
                title,
                alias,
                shorttext,
                picture,
                description,
                keywords,
                status,
                fulltext
              })
              .then(publicationToDB => {
                res.json({
                  ok: true
                });
              })
              .catch(err => {
                console.log(
                  'K8 ERROR: Не получилось добавить публикацию в базу'
                );
                console.log(err);
                res.json({
                  ok: false,
                  error: 'Ошибка, попробуйте позже!'
                });
              });
          } else {
            res.json({
              ok: false,
              error: 'Публикация с таким алиасом уже существует!',
              alias
            });
          }
        });
      }
    }
  });
});

module.exports = router;
