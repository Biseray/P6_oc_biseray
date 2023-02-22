const Sauce = require('../models/sauce');
const fs = require('fs');
// route post  /api/sauces/:id creation un produit

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  if (sauceObject.heat >= 1 && sauceObject.heat <= 10) {


    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
      .then(() => { res.status(201).json({ message: 'Objet enregistré !' }) })
      .catch(error => { res.status(400).json({ error }) })
  } else {
    return res.status(404).json({ message: 'veuillez choisir un nombre entre 1 et 10' })
  }

};



// route get /api/sauces/:id affiche toute les sauces sur la page produit
exports.getOneSauce = (req, res, next) => {

  Sauce.findOne({

    _id: req.params.id

  }).then(
    (sauces) => {
      if (sauces === null) {
        return json({ message: 'sauce non valide' });
      }
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        'message': 'produit introuvable'
      });
    }
  );
};

// route put  /api/sauces/:id modifier un produit
exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`


  }
    : { ...req.body };
  if (sauceObject.heat >= 1 && sauceObject.heat <= 10) {
    delete sauceObject._userId;
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
          res.status(401).json({ message: 'Not authorized' });

        } else {
          if (sauceObject.imageUrl !== req.params.imageUrl) {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({ imageUrl: req.params.imageUrl })
            })
          }
          
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })

            .then(() => res.status(200).json({ message: 'Objet modifié!' }))
            .catch(error => res.status(401).json({ error }));
        }
      })
      .catch((error) => {
        res.status(400).json({ message: 'produit introuvable' });
      });
  } else {
    return res.status(404).json({ message: 'veuillez choisir un nombre entre 1 et 10' })
  }

};

// route delete  /api/sauces/:id supprimer un produit
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauces => {
      if (sauces.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauces.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Objet supprimé !' }) })
            .catch(error => res.status(401).json({ mesage: 'produit introuvable' }));
        });
      }
    })
    .catch(error => {
      res.status(500).json({ mesage: 'produit introuvable' });
    });
};
// route get /api/sauces affiche toute les sauces sur le page daccueil
exports.getAllSauce = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};


exports.createLike = (req, res) => {
  //Récupération d'une seule Sauce avec 'findOne'
  Sauce.findOne({
    _id: req.params.id
  })
    .then(sauce => {
      // like
      if (req.body.likes == 1) {
        sauce.likes++;
        sauce.usersLiked.push(req.body.userId);
        sauce.save();
      }
      // dislike
      if (req.body.likes == -1) {
        sauce.dislikes++;
        sauce.userDisliked.push(req.body.userId);
        sauce.save();
      }
    });
  res.status(200).json({ message: 'like ajouter' })
    .catch(() => {
      res.status(500).json({ message: 'erreur lors de l\'ajout ' })
    })
};