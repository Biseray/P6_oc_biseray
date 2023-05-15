const express = require('express');

const router = express.Router();

const Ctrl = require('../controllers/sauces');

const auth = require('../middleware/auth');

const multer = require('../middleware/multer-config');





router.get('/', auth,  Ctrl.getAllSauce); //afficher tout les sauces de la page daccueil 
router.get('/:id', auth, Ctrl.getOneSauce); // afficher une sauce 
router.post('/', auth, multer, Ctrl.createSauce); //cree une sauce
router.delete('/:id', auth, Ctrl.deleteSauce); // supprimer une sauce 
router.put('/:id', auth, multer, Ctrl.modifySauce); //modifier le sauce
router.post('/:id/like', auth, Ctrl.createLike);

module.exports = router;