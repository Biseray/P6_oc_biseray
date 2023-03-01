const multer = require('multer');

const MIME_TYPES = {
  'imag/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const extension = MIME_TYPES[file.mimetype];
    const finalName = `${name}-${Date.now()}.${extension}`;
    callback(null, finalName );
  }
});

module.exports = multer({storage: storage}).single('image');