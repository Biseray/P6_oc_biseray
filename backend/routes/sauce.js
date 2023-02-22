const express = require('express');

const router = express.Router();

const stuffCtrl = require('../controllers/sauces');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');





router.get('/', auth,  stuffCtrl.getAllSauce); //afficher tout les sauces de la page daccueil 
router.get('/:id', auth, stuffCtrl.getOneSauce); // afficher une sauce 
router.post('/', auth, multer, stuffCtrl.createSauce); //cree une sauce
router.delete('/:id', auth, stuffCtrl.deleteSauce); // supprimer une sauce 
router.put('/:id', auth, multer, stuffCtrl.modifySauce); //modifier le sauce
 router.post('/:id/like', auth, stuffCtrl.createLike);

module.exports = router;