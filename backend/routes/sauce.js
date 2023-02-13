const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const stuffCtrl = require('../controllers/sauces');

router.get('/', auth,  stuffCtrl.getAllStuff);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.post('/', auth, multer, stuffCtrl.createThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);


module.exports = router;